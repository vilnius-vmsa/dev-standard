import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sourceHash, parseEnglish, stringifyEnglish, checkEnglish, rulesNeedingDraft, applyDrafts, acceptEntries } from './english.mjs';

const rule = (id, textLt, check = 'ai-reviewable') => ({ id, textLt, check });
const RULES = [rule('CODE-SEC-P01', 'Kode nėra slaptažodžių.'), rule('CODE-SEC-P02', 'Validuoti įvestį.'), rule('ORG-X-P01', 'Procesas.', 'process-level')];
const ok = (id) => ({ text: `English for ${id}`, source_hash: sourceHash(RULES.find((r) => r.id === id).textLt) });

test('sourceHash ignores whitespace differences and is 12 hex chars', () => {
  assert.match(sourceHash('a b'), /^[0-9a-f]{12}$/);
  assert.equal(sourceHash('a   b\n'), sourceHash('a b'));
  assert.notEqual(sourceHash('a b'), sourceHash('a c'));
});

test('stringifyEnglish sorts IDs and round-trips', () => {
  const text = stringifyEnglish({ 'B-X-P01': ok('CODE-SEC-P01'), 'A-X-P01': ok('CODE-SEC-P02') });
  assert.ok(text.indexOf('A-X-P01') < text.indexOf('B-X-P01'));
  assert.deepEqual(parseEnglish(text)['A-X-P01'], ok('CODE-SEC-P02'));
  assert.deepEqual(parseEnglish(''), {});
});

test('complete, current entries pass', () => {
  assert.deepEqual(checkEnglish(RULES, { 'CODE-SEC-P01': ok('CODE-SEC-P01'), 'CODE-SEC-P02': ok('CODE-SEC-P02') }), []);
});

test('reports missing, empty, stale, orphan and unknown-status entries', () => {
  const errors = checkEnglish(RULES, {
    'CODE-SEC-P01': { ...ok('CODE-SEC-P01'), text: ' ', status: 'done' },
    'ORG-X-P01': { text: 'x', source_hash: 'x' },
    'GONE-X-P01': { text: 'x', source_hash: 'x' },
  });
  assert.ok(errors.includes('CODE-SEC-P02: missing English text in standard/rules.en.yaml'));
  assert.ok(errors.includes('CODE-SEC-P01: English text is empty'));
  assert.ok(errors.includes('CODE-SEC-P01: unknown status "done" (only machine-draft is allowed)'));
  assert.ok(errors.some((e) => e.startsWith('ORG-X-P01: English entry has no matching ai-reviewable rule')));
  assert.ok(errors.some((e) => e.startsWith('GONE-X-P01: English entry has no matching ai-reviewable rule')));
});

test('a reworded Lithuanian rule makes its English stale', () => {
  const reworded = [rule('CODE-SEC-P01', 'Kode NIEKADA nėra slaptažodžių.'), RULES[1]];
  const errors = checkEnglish(reworded, { 'CODE-SEC-P01': ok('CODE-SEC-P01'), 'CODE-SEC-P02': ok('CODE-SEC-P02') });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^CODE-SEC-P01: Lithuanian text changed since the English was written/);
  assert.deepEqual(rulesNeedingDraft(reworded, { 'CODE-SEC-P01': ok('CODE-SEC-P01'), 'CODE-SEC-P02': ok('CODE-SEC-P02') }).map((r) => r.id), ['CODE-SEC-P01']);
});

test('machine drafts pass normally and fail in strict mode', () => {
  const entries = { 'CODE-SEC-P01': { ...ok('CODE-SEC-P01'), status: 'machine-draft' }, 'CODE-SEC-P02': ok('CODE-SEC-P02') };
  assert.deepEqual(checkEnglish(RULES, entries), []);
  assert.deepEqual(checkEnglish(RULES, entries, { strict: true }), [
    'CODE-SEC-P01: English is an unreviewed machine draft; review it, then run npm run rules:accept -- CODE-SEC-P01',
  ]);
});

test('applyDrafts drafts missing and stale rules only, marked machine-draft', async () => {
  const seen = [];
  const translate = async (items) => {
    seen.push(...items);
    return Object.fromEntries(items.map((i) => [i.id, `EN ${i.id}`]));
  };
  const { entries, drafted } = await applyDrafts(RULES, { 'CODE-SEC-P01': ok('CODE-SEC-P01') }, translate);
  assert.deepEqual(drafted, ['CODE-SEC-P02']);
  assert.deepEqual(seen, [{ id: 'CODE-SEC-P02', textLt: 'Validuoti įvestį.', previousEn: undefined }]);
  assert.deepEqual(entries['CODE-SEC-P02'], { text: 'EN CODE-SEC-P02', source_hash: sourceHash('Validuoti įvestį.'), status: 'machine-draft' });
  assert.deepEqual(entries['CODE-SEC-P01'], ok('CODE-SEC-P01'));
});

test('applyDrafts fails when the translator skips a rule', async () => {
  await assert.rejects(applyDrafts(RULES, {}, async () => ({ 'CODE-SEC-P01': 'x' })), /no text for CODE-SEC-P02/);
});

test('acceptEntries refreshes the hash, removes the draft status and supports prefixes', () => {
  const entries = {
    'CODE-SEC-P01': { text: 'A', source_hash: 'old', status: 'machine-draft' },
    'CODE-SEC-P02': { text: 'B', source_hash: 'old', status: 'machine-draft' },
  };
  const result = acceptEntries(RULES, entries, ['CODE-SEC-*', 'NOPE-X-P01']);
  assert.deepEqual(result.accepted, ['CODE-SEC-P01', 'CODE-SEC-P02']);
  assert.deepEqual(result.entries['CODE-SEC-P01'], { text: 'A', source_hash: sourceHash('Kode nėra slaptažodžių.') });
  assert.deepEqual(result.errors, ['NOPE-X-P01: matches no English entry']);
});

test('acceptEntries refuses empty text', () => {
  const result = acceptEntries(RULES, { 'CODE-SEC-P01': { text: '', source_hash: 'x', status: 'machine-draft' } }, ['CODE-SEC-P01']);
  assert.deepEqual(result.accepted, []);
  assert.deepEqual(result.errors, ['CODE-SEC-P01: cannot accept empty English text']);
});
