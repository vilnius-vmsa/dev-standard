import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseStacks, loadStacks } from './stacks.mjs';

test('parseStacks reads description and applyTo', () => {
  const stacks = parseStacks('php:\n  description: PHP code\n  applyTo: "**/*.php"\n');
  assert.deepEqual(stacks.get('php'), { description: 'PHP code', applyTo: '**/*.php' });
});

test('parseStacks rejects a stack without applyTo', () => {
  assert.throws(() => parseStacks('php:\n  description: PHP code\n'), /php.*applyTo/);
});

test('the repository stacks file defines exactly the agreed stacks', async () => {
  const stacks = await loadStacks(fileURLToPath(new URL('../../../standard/stacks.yaml', import.meta.url)));
  assert.deepEqual([...stacks.keys()], ['all', 'php', 'laravel', 'symfony', 'frontend', 'mobile', 'infra', 'db']);
});
