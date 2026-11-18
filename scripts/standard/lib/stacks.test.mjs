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
  assert.deepEqual([...stacks.keys()], [
    'all', 'php', 'laravel', 'symfony', 'frontend', 'mobile',
    'infra', 'docker', 'compose', 'compose-blue-green', 'flow-branch', 'flow-tag', 'k8s', 'db',
  ]);
});

test('framework stacks build on php', async () => {
  const stacks = await loadStacks(fileURLToPath(new URL('../../../standard/stacks.yaml', import.meta.url)));
  assert.deepEqual(stacks.get('laravel').implies, ['php']);
  assert.deepEqual(stacks.get('symfony').implies, ['php']);
});

test('DevOps profiles build on the common infra rules', async () => {
  const stacks = await loadStacks(fileURLToPath(new URL('../../../standard/stacks.yaml', import.meta.url)));
  assert.deepEqual(stacks.get('compose-blue-green').implies, ['compose']);
  assert.deepEqual(stacks.get('compose').implies, ['docker']);
  assert.deepEqual(stacks.get('docker').implies, ['infra']);
  assert.deepEqual(stacks.get('flow-branch').implies, ['infra']);
  assert.deepEqual(stacks.get('flow-tag').implies, ['infra']);
  assert.deepEqual(stacks.get('k8s').implies, ['docker']);
});

test('parseStacks reads legacyIncludes and rejects unknown stacks in it', () => {
  const stacks = parseStacks('infra:\n  applyTo: "**/*.tf"\n  legacyIncludes: [docker]\ndocker:\n  applyTo: "**/Dockerfile*"\n  implies: [infra]\n');
  assert.deepEqual(stacks.get('infra').legacyIncludes, ['docker']);
  assert.equal('legacyIncludes' in stacks.get('docker'), false);
  assert.throws(() => parseStacks('infra:\n  applyTo: "**/*.tf"\n  legacyIncludes: [docker]\n'), /infra.*unknown stack "docker" in legacyIncludes/);
});
