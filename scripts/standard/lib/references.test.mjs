import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { checkReferences, loadSectionNumbers, sectionNumbers, sectionOf } from './references.mjs';
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
