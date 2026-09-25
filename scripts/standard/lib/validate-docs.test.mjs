import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRules } from './validate-docs.mjs';

const STACKS = new Map([['all', { description: 'All', applyTo: '**' }], ['php', { description: 'PHP', applyTo: '**/*.php' }]]);

function rule(overrides = {}) {
  return {
    id: 'CODE-SEC-P01', level: 'P', check: 'ai-reviewable', stacks: ['all'], enforcedBy: 'ai',
    attrs: { stacks: 'all', 'enforced-by': 'ai' }, textLt: 'x', file: 'a.md', line: 3,
    heading: 'H', anchor: 'h', route: '/a', ...overrides,
  };
}

test('a fully tagged ai-reviewable rule is valid', () => {
  assert.deepEqual(validateRules([rule(), rule({ id: 'CODE-VCS-R05a', level: 'R' })], STACKS), []);
});

test('reports duplicates, bad IDs and unknown check types', () => {
  const errors = validateRules([rule(), rule({ line: 9 }), rule({ id: 'code-x-p1' }), rule({ id: 'CODE-SEC-P02', check: 'maybe' })], STACKS);
  assert.ok(errors.some((e) => e.includes('a.md:9') && e.includes('duplicate rule ID CODE-SEC-P01')));
  assert.ok(errors.some((e) => e.includes('malformed rule ID "code-x-p1"')));
  assert.ok(errors.some((e) => e.includes('unknown check type "maybe"')));
});

test('ai-reviewable rules need known stacks and a valid enforced-by', () => {
  const errors = validateRules([
    rule({ id: 'A-B-P01', stacks: [], attrs: { 'enforced-by': 'ai' } }),
    rule({ id: 'A-B-P02', stacks: ['cobol'], attrs: { stacks: 'cobol', 'enforced-by': 'ai' } }),
    rule({ id: 'A-B-P03', enforcedBy: null, attrs: { stacks: 'all' } }),
    rule({ id: 'A-B-P04', enforcedBy: 'linter', attrs: { stacks: 'all', 'enforced-by': 'linter' } }),
  ], STACKS);
  assert.ok(errors.some((e) => e.includes('A-B-P01 is ai-reviewable but has no stacks=')));
  assert.ok(errors.some((e) => e.includes('A-B-P02 uses unknown stack "cobol"')));
  assert.ok(errors.some((e) => e.includes('A-B-P03 is ai-reviewable but has no enforced-by=')));
  assert.ok(errors.some((e) => e.includes('A-B-P04 has invalid enforced-by "linter"')));
});

test('other check types must not carry stacks or enforced-by, and unknown attributes are rejected', () => {
  const errors = validateRules([
    rule({ id: 'A-B-P05', check: 'human-reviewable' }),
    rule({ id: 'A-B-P06', attrs: { stacks: 'all', 'enforced-by': 'ai', owner: 'x' } }),
  ], STACKS);
  assert.ok(errors.some((e) => e.includes('A-B-P05 is human-reviewable; stacks= and enforced-by= are only allowed on ai-reviewable rules')));
  assert.ok(errors.some((e) => e.includes('A-B-P06 has unknown attribute "owner"')));
});
