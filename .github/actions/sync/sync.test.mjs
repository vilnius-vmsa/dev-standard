import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { CONFIG_FILE, parseStacks, planRun, readConfig } from './sync.mjs';

const tempDir = () => mkdtemp(path.join(os.tmpdir(), 'dev-standard-sync-'));

async function repoWithConfig(content) {
  const repo = await tempDir();
  await mkdir(path.join(repo, '.dev-standard'), { recursive: true });
  await writeFile(path.join(repo, CONFIG_FILE), content);
  return repo;
}

test('parseStacks normalises names and drops blanks, duplicates and all', () => {
  assert.deepEqual(parseStacks(' Laravel , frontend,,laravel'), ['laravel', 'frontend']);
  assert.deepEqual(parseStacks('all'), []);
  assert.deepEqual(parseStacks(undefined), []);
});

test('readConfig returns null when the repository has no config', async () => {
  assert.equal(await readConfig(await tempDir()), null);
});

test('readConfig returns version and stacks', async () => {
  const repo = await repoWithConfig('{ "version": "v1.3.0", "stacks": ["laravel"] }');
  assert.deepEqual(await readConfig(repo), { version: 'v1.3.0', stacks: ['laravel'] });
});

test('readConfig rejects invalid JSON, a malformed version and bad stacks', async () => {
  await assert.rejects(readConfig(await repoWithConfig('{ nope')), /not valid JSON/);
  await assert.rejects(readConfig(await repoWithConfig('{ "version": "1.3", "stacks": [] }')), /"version" must look like v1\.2\.3/);
  await assert.rejects(readConfig(await repoWithConfig('{ "version": "v1.3.0", "stacks": "php" }')), /"stacks" must be a list/);
});

test('planRun: first setup needs stacks and uses the latest release', () => {
  assert.throws(() => planRun({ config: null, stacksInput: '', event: 'schedule', latest: 'v1.4.0' }), /Run this workflow manually with the "stacks" input/);
  assert.deepEqual(planRun({ config: null, stacksInput: 'laravel', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.4.0', stacks: ['laravel'] });
  assert.deepEqual(planRun({ config: null, stacksInput: 'all', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.4.0', stacks: [] });
});

test('planRun: a scheduled run moves to the latest release, a manual run keeps the pin', () => {
  const config = { version: 'v1.3.0', stacks: ['laravel'] };
  assert.deepEqual(planRun({ config, stacksInput: '', event: 'schedule', latest: 'v1.4.0' }), { version: 'v1.4.0', stacks: ['laravel'] });
  assert.deepEqual(planRun({ config, stacksInput: '', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.3.0', stacks: ['laravel'] });
});

test('planRun: a stacks input replaces the configured stacks', () => {
  const config = { version: 'v1.3.0', stacks: ['laravel'] };
  assert.deepEqual(planRun({ config, stacksInput: 'symfony,db', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.3.0', stacks: ['symfony', 'db'] });
});
