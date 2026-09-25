import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { buildBundle } from '../../../scripts/standard/lib/bundle.mjs';
import { agentsWarning, applyBundle, CONFIG_FILE, parseStacks, planRun, readConfig, resolveStacks } from './sync.mjs';

const tempDir = () => mkdtemp(path.join(os.tmpdir(), 'dev-standard-sync-'));
const SYNC = fileURLToPath(new URL('./sync.mjs', import.meta.url));
const run = (args, env = {}) => promisify(execFile)(process.execPath, [SYNC, ...args], { env: { ...process.env, ...env } });

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
  assert.throws(() => planRun({ config: null, stacksInput: '', event: 'workflow_dispatch', latest: 'v1.4.0' }), /Run this workflow manually with the "stacks" input/);
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

const STACKS = new Map([
  ['all', { description: 'Rules for every repository', applyTo: '**' }],
  ['php', { description: 'PHP code', applyTo: '**/*.php' }],
  ['laravel', { description: 'Laravel applications', applyTo: 'app/**', implies: ['php'] }],
  ['frontend', { description: 'Frontend code', applyTo: '**/*.ts' }],
]);
const RULES = [{
  id: 'CODE-SEC-P01', level: 'P', check: 'ai-reviewable', stacks: ['all'], enforcedBy: 'ai',
  textLt: 'LT', file: 'a.md', line: 1, heading: '4.6. Saugumas', anchor: 'h', route: '/kodas',
}];

// Writes a real bundle (same generator as releases) to a temporary directory.
async function makeBundle(version = 'v1.3.0') {
  const dir = await tempDir();
  const files = buildBundle({
    rules: RULES, english: { 'CODE-SEC-P01': { text: 'EN', source_hash: 'h' } }, stacks: STACKS,
    version, siteUrl: 'https://example.test', reviewMethod: '## How to review\n',
  });
  for (const [rel, content] of files) {
    await mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
    await writeFile(path.join(dir, rel), content);
  }
  return dir;
}

const instructions = async (repo) => (await readdir(path.join(repo, '.github/instructions'))).sort();

test('resolveStacks adds all and implied stacks, and rejects unknown ones', () => {
  const manifest = { stacks: ['all', 'php', 'laravel', 'frontend'], implies: { laravel: ['php'] } };
  assert.deepEqual(resolveStacks(['laravel', 'frontend'], manifest), ['all', 'laravel', 'php', 'frontend']);
  assert.deepEqual(resolveStacks([], manifest), ['all']);
  assert.throws(() => resolveStacks(['laravl'], manifest), /unknown stack\(s\): laravl\. Valid stacks: php, laravel, frontend/);
});

test('applyBundle installs instructions, skill, symlink and config on first setup', async () => {
  const repo = await tempDir();
  const bundle = await makeBundle();
  const result = await applyBundle({ repoDir: repo, bundleDir: bundle, version: 'v1.3.0', stacks: ['laravel'] });

  assert.deepEqual(result.stacks, ['all', 'laravel', 'php']);
  assert.deepEqual(await instructions(repo), [
    'dev-standard-all.instructions.md', 'dev-standard-laravel.instructions.md', 'dev-standard-php.instructions.md',
  ]);
  assert.equal(
    await readFile(path.join(repo, '.github/instructions/dev-standard-php.instructions.md'), 'utf8'),
    await readFile(path.join(bundle, 'instructions/dev-standard-php.instructions.md'), 'utf8'),
  );
  assert.equal(
    await readFile(path.join(repo, '.agents/skills/dev-standard/SKILL.md'), 'utf8'),
    await readFile(path.join(bundle, 'skill/SKILL.md'), 'utf8'),
  );
  assert.equal(await readlink(path.join(repo, '.claude/skills/dev-standard')), '../../.agents/skills/dev-standard');
  assert.ok(await readFile(path.join(repo, '.claude/skills/dev-standard/SKILL.md'), 'utf8'));
  assert.deepEqual(JSON.parse(await readFile(path.join(repo, CONFIG_FILE), 'utf8')), { version: 'v1.3.0', stacks: ['laravel'] });
});

test('applyBundle with only the all stack stores no stacks', async () => {
  const repo = await tempDir();
  await applyBundle({ repoDir: repo, bundleDir: await makeBundle(), version: 'v1.3.0', stacks: parseStacks('all') });
  assert.deepEqual(await instructions(repo), ['dev-standard-all.instructions.md']);
  assert.deepEqual(JSON.parse(await readFile(path.join(repo, CONFIG_FILE), 'utf8')).stacks, []);
});

test('applyBundle removes files of dropped stacks but keeps local and unrelated files', async () => {
  const repo = await tempDir();
  const bundle = await makeBundle();
  await applyBundle({ repoDir: repo, bundleDir: bundle, version: 'v1.3.0', stacks: ['laravel'] });
  await writeFile(path.join(repo, '.github/instructions/dev-standard-local.instructions.md'), 'local');
  await writeFile(path.join(repo, '.github/instructions/team.instructions.md'), 'team');

  await applyBundle({ repoDir: repo, bundleDir: bundle, version: 'v1.3.0', stacks: ['frontend'] });

  assert.deepEqual(await instructions(repo), [
    'dev-standard-all.instructions.md', 'dev-standard-frontend.instructions.md',
    'dev-standard-local.instructions.md', 'team.instructions.md',
  ]);
});

test('applyBundle overwrites manual edits in generated files', async () => {
  const repo = await tempDir();
  const bundle = await makeBundle();
  await applyBundle({ repoDir: repo, bundleDir: bundle, version: 'v1.3.0', stacks: [] });
  const skill = path.join(repo, '.agents/skills/dev-standard/SKILL.md');
  await writeFile(skill, 'edited');
  await writeFile(path.join(repo, '.agents/skills/dev-standard/extra.md'), 'extra');

  await applyBundle({ repoDir: repo, bundleDir: bundle, version: 'v1.3.0', stacks: [] });

  assert.equal(await readFile(skill, 'utf8'), await readFile(path.join(bundle, 'skill/SKILL.md'), 'utf8'));
  assert.deepEqual(await readdir(path.join(repo, '.agents/skills/dev-standard')), ['SKILL.md']);
});

test('applyBundle replaces a copied directory or a wrong symlink at the Claude skill path', async () => {
  const bundle = await makeBundle();
  const link = (repo) => path.join(repo, '.claude/skills/dev-standard');

  const withDir = await tempDir();
  await mkdir(link(withDir), { recursive: true });
  await writeFile(path.join(link(withDir), 'SKILL.md'), 'old copy');
  await applyBundle({ repoDir: withDir, bundleDir: bundle, version: 'v1.3.0', stacks: [] });
  assert.ok((await lstat(link(withDir))).isSymbolicLink());

  const withLink = await tempDir();
  await mkdir(path.dirname(link(withLink)), { recursive: true });
  await symlink('../elsewhere', link(withLink));
  await applyBundle({ repoDir: withLink, bundleDir: bundle, version: 'v1.3.0', stacks: [] });
  assert.equal(await readlink(link(withLink)), '../../.agents/skills/dev-standard');
});

test('applyBundle rejects a bundle built for another version', async () => {
  await assert.rejects(
    applyBundle({ repoDir: await tempDir(), bundleDir: await makeBundle('v1.2.0'), version: 'v1.3.0', stacks: [] }),
    /bundle is v1\.2\.0 but v1\.3\.0 was requested/,
  );
});

test('agentsWarning asks for the snippet when AGENTS.md is missing or lacks the pointer', async () => {
  const bundle = await makeBundle();
  const snippet = await readFile(path.join(bundle, 'agents-snippet.md'), 'utf8');

  const missing = await agentsWarning(await tempDir(), bundle);
  assert.match(missing, /This repository has no `AGENTS\.md`/);
  assert.ok(missing.includes(snippet.trimEnd()));

  const repo = await tempDir();
  await writeFile(path.join(repo, 'AGENTS.md'), '# Team notes\n');
  assert.match(await agentsWarning(repo, bundle), /`AGENTS\.md` does not mention the dev standard/);

  await writeFile(path.join(repo, 'AGENTS.md'), `# Team notes\n\n${snippet}`);
  assert.equal(await agentsWarning(repo, bundle), null);
});

test('CLI plan writes version and stacks to GITHUB_OUTPUT', async () => {
  const out = path.join(await tempDir(), 'output');
  await run(['plan', `--repo=${await tempDir()}`, '--latest=v1.4.0', '--event=workflow_dispatch', '--stacks=Laravel,frontend'], { GITHUB_OUTPUT: out });
  assert.equal(await readFile(out, 'utf8'), 'version=v1.4.0\nstacks=laravel,frontend\n');
});

test('CLI apply installs the bundle and writes the warning file', async () => {
  const repo = await tempDir();
  const warning = path.join(await tempDir(), 'warning.md');
  const { stdout } = await run(['apply', `--repo=${repo}`, `--bundle=${await makeBundle()}`, '--version=v1.3.0', '--stacks=laravel', `--warning=${warning}`]);
  assert.match(stdout, /Installed v1\.3\.0 for stacks: all, laravel, php/);
  assert.match(await readFile(warning, 'utf8'), /no `AGENTS\.md`/);
});

test('CLI reports errors as workflow annotations', async () => {
  await assert.rejects(
    run(['plan', `--repo=${await tempDir()}`, '--latest=v1.4.0', '--event=workflow_dispatch', '--stacks=']),
    (error) => error.code === 1 && error.stdout.includes('::error::.dev-standard/config.json not found'),
  );
});

test('planRun: a scheduled run before setup is merged skips instead of failing', () => {
  assert.equal(planRun({ config: null, stacksInput: '', event: 'schedule', latest: 'v1.4.0' }), null);
});

test('CLI plan reports skip when a scheduled run finds no config', async () => {
  const out = path.join(await tempDir(), 'output');
  const { stdout } = await run(['plan', `--repo=${await tempDir()}`, '--latest=v1.4.0', '--event=schedule', '--stacks='], { GITHUB_OUTPUT: out });
  assert.match(stdout, /::notice::.*not set up yet/);
  assert.equal(await readFile(out, 'utf8'), 'skip=true\n');
});

test('CLI plan prefers the config of an open sync pull request', async () => {
  const repo = await repoWithConfig('{ "version": "v1.3.0", "stacks": ["laravel"] }');
  const pending = path.join(await tempDir(), 'pending.json');
  await writeFile(pending, '{ "version": "v1.4.0", "stacks": ["laravel", "db"] }');
  const out = path.join(await tempDir(), 'output');
  await run(['plan', `--repo=${repo}`, `--config=${pending}`, '--latest=v1.4.0', '--event=workflow_dispatch', '--stacks='], { GITHUB_OUTPUT: out });
  assert.equal(await readFile(out, 'utf8'), 'version=v1.4.0\nstacks=laravel,db\n');
});
