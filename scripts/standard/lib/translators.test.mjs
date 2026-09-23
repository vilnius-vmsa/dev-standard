import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stubTranslator } from './translators.mjs';

test('stubTranslator returns empty text for every item', async () => {
  assert.deepEqual(await stubTranslator()([{ id: 'A-B-P01' }, { id: 'A-B-P02' }]), { 'A-B-P01': '', 'A-B-P02': '' });
});
