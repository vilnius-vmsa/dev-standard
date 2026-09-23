import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseTag, parseRuleFile, docRoute, loadRules } from './rules.mjs';

const SAMPLE = [
  '# 4. Kodas',
  '',
  '## 4.6. Saugumas',
  '',
  'PRIVALOMA:',
  '',
  '<!-- CODE-SEC-P01 | ai-reviewable | stacks=all | enforced-by=tool:gitleaks -->',
  '*   Kode negali būti **slaptažodžių**.',
  '<!-- CODE-SEC-R01 | human-reviewable -->',
  '*   Šakų modeliai:',
  '    *   **GitHub Flow**',
  '    *   **GitFlow**',
  '',
  '```md',
  '<!-- CODE-FAKE-P99 | ai-reviewable -->',
  '*   Ignored inside a code fence.',
  '```',
  '### 4.6.1. Kita {#custom-anchor}',
  '<!-- CODE-SEC-P02 | ai-reviewable | stacks=php, laravel | enforced-by=ai -->',
  '*   Validuoti įvestį.',
  'Paragraph after the rule.',
  '<!-- CODE-SEC-P03 | process-level -->',
  'Not a bullet.',
  '`<!-- IDENTIFIKATORIUS | tikrinimo-tipas -->`',
].join('\n');

test('parseTag splits id, check type and key=value attributes', () => {
  assert.deepEqual(parseTag('CODE-SEC-P01 | ai-reviewable | stacks=all | enforced-by=ai'), {
    id: 'CODE-SEC-P01',
    check: 'ai-reviewable',
    attrs: { stacks: 'all', 'enforced-by': 'ai' },
  });
  assert.equal(parseTag('just a comment'), null);
});

test('parseRuleFile reads rules, bodies, headings and anchors', () => {
  const { rules, errors } = parseRuleFile(SAMPLE, '04-kodo-kurimo-gaires.md');
  assert.deepEqual(rules.map((r) => r.id), ['CODE-SEC-P01', 'CODE-SEC-R01', 'CODE-SEC-P02']);
  assert.deepEqual(errors, ['04-kodo-kurimo-gaires.md:22: rule CODE-SEC-P03 is not followed by a bullet']);

  const [p01, r01, p02] = rules;
  assert.equal(p01.level, 'P');
  assert.equal(p01.check, 'ai-reviewable');
  assert.deepEqual(p01.stacks, ['all']);
  assert.equal(p01.enforcedBy, 'tool:gitleaks');
  assert.equal(p01.textLt, 'Kode negali būti **slaptažodžių**.');
  assert.equal(p01.heading, '4.6. Saugumas');
  assert.equal(p01.anchor, '46-saugumas');
  assert.equal(p01.line, 7);
  assert.equal(p01.route, '/kodo-kurimo-gaires');

  assert.equal(r01.level, 'R');
  assert.equal(r01.textLt, 'Šakų modeliai:\n*   **GitHub Flow**\n*   **GitFlow**');
  assert.deepEqual(r01.stacks, []);
  assert.equal(r01.enforcedBy, null);

  assert.deepEqual(p02.stacks, ['php', 'laravel']);
  assert.equal(p02.anchor, 'custom-anchor');
  assert.equal(p02.heading, '4.6.1. Kita');
  assert.equal(p02.textLt, 'Validuoti įvestį.');
});

test('docRoute mirrors Docusaurus routes', () => {
  assert.equal(docRoute('04-kodo-kurimo-gaires.md', '# X'), '/kodo-kurimo-gaires');
  assert.equal(docRoute('priedai/adr-sablonas.md', '# X'), '/priedai/adr-sablonas');
  assert.equal(docRoute('00-greitas-startas.md', '---\nslug: /\n---\n# X'), '/');
});

test('every rule in docs/ parses', async () => {
  const docsDir = fileURLToPath(new URL('../../../docs/', import.meta.url));
  const { rules, errors } = await loadRules(docsDir);
  assert.deepEqual(errors, []);
  assert.ok(rules.length >= 800, `only ${rules.length} rules found`);
});
