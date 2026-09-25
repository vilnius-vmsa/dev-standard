import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseStacks, loadStacks } from './stacks.mjs';

test('parseStacks reads description and applyTo', () => {
  const stacks = parseStacks('php:\n  description: PHP code\n  applyTo: "**/*.php"\n');
  assert.deepEqual(stacks.get('php'), { description: 'PHP code', applyTo: '**/*.php', implies: [] });
});

test('parseStacks rejects a stack without applyTo', () => {
  assert.throws(() => parseStacks('php:\n  description: PHP code\n'), /php.*applyTo/);
});

test('parseStacks reads implied stacks and rejects unknown ones', () => {
  const stacks = parseStacks('php:\n  applyTo: "**/*.php"\nlaravel:\n  applyTo: "app/**"\n  implies: [php]\n');
  assert.deepEqual(stacks.get('laravel').implies, ['php']);
  assert.throws(() => parseStacks('laravel:\n  applyTo: "app/**"\n  implies: [php]\n'), /laravel.*implies unknown stack "php"/);
});

test('the repository stacks file defines exactly the agreed stacks', async () => {
  const stacks = await loadStacks(fileURLToPath(new URL('../../../standard/stacks.yaml', import.meta.url)));
  assert.deepEqual([...stacks.keys()], ['all', 'php', 'laravel', 'symfony', 'frontend', 'mobile', 'infra', 'db']);
});

test('framework stacks build on php', async () => {
  const stacks = await loadStacks(fileURLToPath(new URL('../../../standard/stacks.yaml', import.meta.url)));
  assert.deepEqual(stacks.get('laravel').implies, ['php']);
  assert.deepEqual(stacks.get('symfony').implies, ['php']);
});
