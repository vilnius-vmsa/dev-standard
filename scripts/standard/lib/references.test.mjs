import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkReferences, loadPages, loadSectionNumbers, sectionNumbers, sectionOf, siteLinkErrors } from './references.mjs';
import { loadRules } from './rules.mjs';

const KNOWN = { ruleIds: new Set(['CODE-SEC-P01']), sections: new Set(['4', '4.2.3', '4.6', '5.4', '5.5', '6.3']) };

test('sectionNumbers lists numbered headings of a chapter', () => {
  assert.deepEqual(
    [...sectionNumbers('# 4. Kodas\n\n## 4.6. Saugumas\n\n### 4.6.1. Kita {#x}\n\nText 5.5. not a heading\n')],
    ['4', '4.6', '4.6.1'],
  );
});

test('sectionOf reads the number from a rule heading', () => {
  assert.equal(sectionOf('4.6. Saugumas kodo lygmeniu'), '4.6');
  assert.equal(sectionOf('C.6 Spragų aptikimas'), null);
  assert.equal(sectionOf(''), null);
});

test('text that cites existing rules and sections passes', () => {
  assert.deepEqual(checkReferences('Cite `CODE-SEC-P01 (4.6)`. Linters (4.2.3). Deps (5.4–5.5), data (6.3, Annex C). TLS 1.2+ is fine.', KNOWN), []);
});

test('reports unknown rule IDs and section numbers', () => {
  assert.deepEqual(checkReferences('Use CODE-SEC-P99 (see 4.7, 9.9) and §8.8.', KNOWN), [
    'cites unknown rule ID CODE-SEC-P99',
    'cites unknown section 4.7',
    'cites unknown section 9.9',
    'cites unknown section 8.8',
  ]);
});

test('the repository review method cites only existing rules and sections', async () => {
  const root = new URL('../../../', import.meta.url);
  const docsDir = fileURLToPath(new URL('docs/', root));
  const method = await readFile(new URL('standard/review-method.md', root), 'utf8');
  const { rules } = await loadRules(docsDir);
  assert.deepEqual(checkReferences(method, { ruleIds: new Set(rules.map((r) => r.id)), sections: await loadSectionNumbers(docsDir) }), []);
});

test('siteLinkErrors checks routes and anchors of links into the published site', () => {
  const pages = new Map([['/priedai/metodika', new Set(['g1-principai'])], ['/rules', null]]);
  const text = [
    'https://example.test/dev-standard/priedai/metodika',
    '[G.1](https://example.test/dev-standard/priedai/metodika#g1-principai)',
    '(https://example.test/dev-standard/rules#code-sec-p01)',
    '(https://example.test/dev-standard/priedai/metodika#g9-nera)',
    '<https://example.test/dev-standard/priedai/nera>',
    'https://other.test/priedai/nera',
    'See https://example.test/dev-standard/priedai/metodika#g1-principai. Or https://example.test/dev-standard/priedai/metodika, too.',
  ].join('\n');
  assert.deepEqual(siteLinkErrors(text, 'https://example.test/dev-standard', pages), [
    'links to missing anchor /priedai/metodika#g9-nera',
    'links to missing page /priedai/nera',
  ]);
});

test('loadPages maps each docs route to its heading ids, plus /rules', async () => {
  const docs = await mkdtemp(path.join(os.tmpdir(), 'pages-'));
  await mkdir(path.join(docs, 'priedai'), { recursive: true });
  await writeFile(path.join(docs, 'priedai/x.md'), '# X\n\n## G.1. Principai\n\n```md\n## Not a heading\n```\n\n## Duomenų modelis\n');
  assert.deepEqual(await loadPages(docs), new Map([
    ['/priedai/x', new Set(['x', 'g1-principai', 'duomenų-modelis'])],
    ['/rules', null],
  ]));
});
