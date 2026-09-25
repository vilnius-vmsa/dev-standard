import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBundle, ruleUrl } from './bundle.mjs';

const SITE = 'https://example.test/dev-standard';
const STACKS = new Map([
  ['all', { description: 'Rules for every repository', applyTo: '**' }],
  ['php', { description: 'PHP code', applyTo: '**/*.php' }],
  ['laravel', { description: 'Laravel applications', applyTo: 'app/**,routes/**', implies: ['php'] }],
  ['mobile', { description: 'Mobile applications', applyTo: '**/*.kt' }],
]);
const r = (id, stacks, check = 'ai-reviewable') => ({
  id, level: id.match(/-([PR])\d/)[1], check, stacks, enforcedBy: check === 'ai-reviewable' ? 'ai' : null,
  textLt: `LT **${id}**`, file: 'a.md', line: 1, heading: '4.6. Saugumas', anchor: 'h', route: '/kodas',
});
const RULES = [
  r('CODE-SEC-R01', ['all']),
  r('CODE-SEC-P01', ['all']),
  r('CODE-PHP-P01', ['php', 'laravel']),
  r('ORG-X-P01', [], 'process-level'),
];
const EN = Object.fromEntries(RULES.filter((x) => x.check === 'ai-reviewable').map((x) => [x.id, { text: `EN ${x.id}`, source_hash: 'h' }]));
const METHOD = '## How to review\n\nUse `[BLOCKING]` for MUST violations.\n';
const build = () => buildBundle({ rules: RULES, english: EN, stacks: STACKS, version: 'v1.5.0', siteUrl: SITE, reviewMethod: METHOD });

test('ruleUrl points at the lower-case anchor on the rules page', () => {
  assert.equal(ruleUrl(SITE, 'CODE-VCS-R05a'), `${SITE}/rules#code-vcs-r05a`);
});

test('produces one instructions file per stack plus the shared files', () => {
  assert.deepEqual([...build().keys()].sort(), [
    'agents-snippet.md',
    'instructions/dev-standard-all.instructions.md',
    'instructions/dev-standard-laravel.instructions.md',
    'instructions/dev-standard-mobile.instructions.md',
    'instructions/dev-standard-php.instructions.md',
    'manifest.json',
    'rules.json',
    'skill/SKILL.md',
  ]);
});

test('instructions files have applyTo, the generated notice, MUST before SHOULD and links', () => {
  const all = build().get('instructions/dev-standard-all.instructions.md');
  assert.ok(all.startsWith('---\napplyTo: "**"\n---\n'));
  assert.ok(all.includes('GENERATED from vilnius-vmsa/dev-standard v1.5.0. Do not edit'));
  assert.ok(all.indexOf('CODE-SEC-P01') < all.indexOf('CODE-SEC-R01'), 'MUST section comes first');
  assert.ok(all.includes(`- **CODE-SEC-P01** (4.6): EN CODE-SEC-P01 ([rule](${SITE}/rules#code-sec-p01))`));
  assert.ok(!all.includes('ORG-X-P01'));
});

test('a multi-stack rule appears in each stack; an empty stack still gets a file', () => {
  const files = build();
  assert.ok(files.get('instructions/dev-standard-php.instructions.md').includes('CODE-PHP-P01'));
  assert.ok(files.get('instructions/dev-standard-laravel.instructions.md').includes('CODE-PHP-P01'));
  assert.ok(files.get('instructions/dev-standard-mobile.instructions.md').includes('No rules are assigned to this stack in this version.'));
});

test('the review method goes into the all file and the skill; other stacks point to it', () => {
  const files = build();
  const all = files.get('instructions/dev-standard-all.instructions.md');
  assert.ok(all.includes(METHOD));
  assert.ok(all.indexOf(METHOD) < all.indexOf('## MUST'), 'method comes before the rules');
  assert.ok(files.get('skill/SKILL.md').includes(METHOD));
  const php = files.get('instructions/dev-standard-php.instructions.md');
  assert.ok(!php.includes(METHOD));
  assert.ok(php.includes('Review method and severity labels: see `dev-standard-all.instructions.md`.'));
});

test('a rule under an unnumbered heading has no section in its line', () => {
  const rules = [{ ...RULES[1], heading: 'C.6 Spragų aptikimas' }];
  const all = buildBundle({ rules, english: EN, stacks: STACKS, version: 'v1', siteUrl: SITE, reviewMethod: METHOD })
    .get('instructions/dev-standard-all.instructions.md');
  assert.ok(all.includes('- **CODE-SEC-P01**: EN CODE-SEC-P01'));
});

test('skill, snippet, rules.json and manifest', () => {
  const files = build();
  assert.ok(files.get('skill/SKILL.md').startsWith('---\nname: dev-standard\ndescription: '));
  assert.ok(files.get('agents-snippet.md').includes('.github/instructions/dev-standard-'));
  const json = JSON.parse(files.get('rules.json'));
  assert.equal(json.version, 'v1.5.0');
  assert.deepEqual(json.rules.find((x) => x.id === 'CODE-PHP-P01'), {
    id: 'CODE-PHP-P01', level: 'MUST', stacks: ['php', 'laravel'], enforcedBy: 'ai',
    section: '4.6', en: 'EN CODE-PHP-P01', lt: 'LT CODE-PHP-P01', url: `${SITE}/rules#code-php-p01`, source: `${SITE}/kodas#h`,
  });
  assert.deepEqual(JSON.parse(files.get('manifest.json')).stacks, ['all', 'php', 'laravel', 'mobile']);
});

test('output is deterministic', () => {
  assert.deepEqual([...build()], [...build()]);
});

test('missing English for an ai-reviewable rule is an error', () => {
  assert.throws(
    () => buildBundle({ rules: RULES, english: {}, stacks: STACKS, version: 'v1', siteUrl: SITE, reviewMethod: METHOD }),
    /CODE-SEC-R01.*no English text/,
  );
});

test('a stack that builds on another points to it, and the manifest lists implied stacks', () => {
  const files = build();
  assert.ok(files.get('instructions/dev-standard-laravel.instructions.md').includes('This stack builds on php: also follow `dev-standard-php.instructions.md`.'));
  assert.ok(!files.get('instructions/dev-standard-php.instructions.md').includes('This stack builds on'));
  assert.deepEqual(JSON.parse(files.get('manifest.json')).implies, { laravel: ['php'] });
});
