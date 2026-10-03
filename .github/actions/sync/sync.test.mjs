import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { buildBundle } from '../../../scripts/standard/lib/bundle.mjs';
import { agentsWarning, applyBundle, bundleSkills, CONFIG_FILE, parseStacks, planRun, readConfig, resolveStacks } from './sync.mjs';

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

test('planRun: a version input moves a manual run to the latest or an exact release', () => {
  const config = { version: 'v1.3.0', stacks: ['laravel'] };
  assert.deepEqual(planRun({ config, stacksInput: '', versionInput: ' Latest ', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.4.0', stacks: ['laravel'] });
  assert.deepEqual(planRun({ config, stacksInput: '', versionInput: 'v1.2.9', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.2.9', stacks: ['laravel'] });
  assert.deepEqual(planRun({ config: null, stacksInput: 'laravel', versionInput: 'v1.3.1', event: 'workflow_dispatch', latest: 'v1.4.0' }), { version: 'v1.3.1', stacks: ['laravel'] });
  assert.throws(() => planRun({ config, stacksInput: '', versionInput: '1.3', event: 'workflow_dispatch', latest: 'v1.4.0' }), /"version" input must be "latest" or look like v1\.2\.3/);
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
    skills: new Map([['dev-standard', new Map([
      ['SKILL.md', '---\nname: dev-standard\ndescription: Rules.\n---\n'],
    ])], ['dev-standard-docs', new Map([
      ['SKILL.md', '---\nname: dev-standard-docs\ndescription: Docs.\n---\n'],
      ['templates/glossary.md', '# Glossary\n'],
    ])]]),
  });
  for (const [rel, content] of files) {
    await mkdir(path.dirname(path.join(dir, rel)), { recursive: true });
    await writeFile(path.join(dir, rel), content);
  }
  return dir;
}

// The layout of v1.2.7 and earlier: one skill in skill/, no skills list in the manifest.
async function makeLegacyBundle(version = 'v1.2.7') {
  const dir = await tempDir();
  await mkdir(path.join(dir, 'instructions'), { recursive: true });
  await mkdir(path.join(dir, 'skill'), { recursive: true });
  await writeFile(path.join(dir, 'manifest.json'), JSON.stringify({ version, stacks: ['all'], implies: {} }));
  await writeFile(path.join(dir, 'instructions/dev-standard-all.instructions.md'), 'all');
  await writeFile(path.join(dir, 'skill/SKILL.md'), 'legacy skill');
  await writeFile(path.join(dir, 'agents-snippet.md'), '## Vilnius dev standard\n');
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
    await readFile(path.join(bundle, 'skills/dev-standard/SKILL.md'), 'utf8'),
  );
  assert.equal(await readlink(path.join(repo, '.claude/skills/dev-standard')), '../../.agents/skills/dev-standard');
  assert.ok(await readFile(path.join(repo, '.claude/skills/dev-standard/SKILL.md'), 'utf8'));
  assert.deepEqual(result.skills, ['dev-standard', 'dev-standard-docs']);
  assert.equal(
    await readFile(path.join(repo, '.agents/skills/dev-standard-docs/templates/glossary.md'), 'utf8'),
    await readFile(path.join(bundle, 'skills/dev-standard-docs/templates/glossary.md'), 'utf8'),
  );
  assert.equal(await readlink(path.join(repo, '.claude/skills/dev-standard-docs')), '../../.agents/skills/dev-standard-docs');
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

  assert.equal(await readFile(skill, 'utf8'), await readFile(path.join(bundle, 'skills/dev-standard/SKILL.md'), 'utf8'));
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

test('CLI plan takes the version input', async () => {
  const repo = await repoWithConfig('{ "version": "v1.3.0", "stacks": ["laravel"] }');
  const out = path.join(await tempDir(), 'output');
  await run(['plan', `--repo=${repo}`, '--latest=v1.4.0', '--event=workflow_dispatch', '--stacks=', '--version=latest'], { GITHUB_OUTPUT: out });
  assert.equal(await readFile(out, 'utf8'), 'version=v1.4.0\nstacks=laravel\n');
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

test('applyBundle installs a legacy single-skill bundle', async () => {
  const repo = await tempDir();
  const result = await applyBundle({ repoDir: repo, bundleDir: await makeLegacyBundle(), version: 'v1.2.7', stacks: [] });
  assert.deepEqual(result.skills, ['dev-standard']);
  assert.equal(await readFile(path.join(repo, '.agents/skills/dev-standard/SKILL.md'), 'utf8'), 'legacy skill');
  assert.equal(await readlink(path.join(repo, '.claude/skills/dev-standard')), '../../.agents/skills/dev-standard');
});

test('applyBundle removes dropped dev-standard skills but keeps the team\'s own skills', async () => {
  const repo = await tempDir();
  await applyBundle({ repoDir: repo, bundleDir: await makeBundle(), version: 'v1.3.0', stacks: [] });
  await mkdir(path.join(repo, '.agents/skills/team-release'), { recursive: true });
  await mkdir(path.join(repo, '.claude/skills/team-local'), { recursive: true });

  await applyBundle({ repoDir: repo, bundleDir: await makeLegacyBundle('v1.3.0'), version: 'v1.3.0', stacks: [] });

  assert.deepEqual((await readdir(path.join(repo, '.agents/skills'))).sort(), ['dev-standard', 'team-release']);
  assert.deepEqual((await readdir(path.join(repo, '.claude/skills'))).sort(), ['dev-standard', 'team-local']);
});

test('agentsWarning asks to replace a section pasted from an older release', async () => {
  const bundle = await makeBundle();
  const repo = await tempDir();
  const old = '## Vilnius dev standard\n\nThe `dev-standard` skill describes how to apply and review them.\n';
  await writeFile(path.join(repo, 'AGENTS.md'), `# Team notes\n\n${old}`);
  const warning = await agentsWarning(repo, bundle);
  assert.match(warning, /`AGENTS\.md` has an outdated dev standard section\. Replace it with this one/);
  assert.ok(warning.includes('<!-- dev-standard:agents-section 3 -->'));

  await writeFile(path.join(repo, 'AGENTS.md'), `# Team notes\n\n${old.replace('\n\n', '\n\n<!-- dev-standard:agents-section 4 -->\n')}`);
  assert.equal(await agentsWarning(repo, bundle), null, 'a newer section is not outdated');
});

test('agentsWarning accepts any pasted section when the bundle has no revision marker', async () => {
  const repo = await tempDir();
  await writeFile(path.join(repo, 'AGENTS.md'), 'See dev-standard.\n');
  assert.equal(await agentsWarning(repo, await makeLegacyBundle()), null);
});

const boostBlock = (body) => `<laravel-boost-guidelines>\n${body}\n</laravel-boost-guidelines>\n`;

test('agentsWarning flags a section that sits only inside Boost\'s generated block', async () => {
  const bundle = await makeBundle();
  const snippet = await readFile(path.join(bundle, 'agents-snippet.md'), 'utf8');
  const repo = await tempDir();
  await writeFile(path.join(repo, 'AGENTS.md'), `# Team notes\n\n${boostBlock(snippet)}`);
  const warning = await agentsWarning(repo, bundle);
  assert.match(warning, /^> \[!WARNING\]\n> `AGENTS\.md` has the dev standard section only inside Boost's generated block, where `boost:update` overwrites it\. Remove it from `\.ai\/guidelines\/` and add this section to `AGENTS\.md` outside the block \(`CODE-AI-P10`\):/);
  assert.ok(warning.includes(snippet.trimEnd()));

  await writeFile(path.join(repo, 'AGENTS.md'), `# Team notes\n\n${boostBlock('Laravel rules.')}\n${snippet}`);
  assert.equal(await agentsWarning(repo, bundle), null, 'a section outside the block passes');
});

// A repository whose AGENTS.md already carries the current section, so only the check under test can warn.
async function repoWithSection(bundle) {
  const repo = await tempDir();
  await writeFile(path.join(repo, 'AGENTS.md'), await readFile(path.join(bundle, 'agents-snippet.md'), 'utf8'));
  return repo;
}

test('agentsWarning asks to move a CLAUDE.md with its own instructions into AGENTS.md', async () => {
  const bundle = await makeBundle();
  const repo = await repoWithSection(bundle);
  await writeFile(path.join(repo, 'CLAUDE.md'), '@AGENTS.md\n\nAlways run the linter.\n');
  assert.equal(await agentsWarning(repo, bundle), [
    '> [!WARNING]',
    '> `CLAUDE.md` holds instructions of its own. Codex does not read it, and Copilot reads it on top of `AGENTS.md`. Move the repository\'s instructions into `AGENTS.md`, then delete `CLAUDE.md` or make it exactly `@AGENTS.md`. (`CODE-AI-P11`)',
    '',
  ].join('\n'));

  await writeFile(path.join(repo, 'CLAUDE.md'), '  @AGENTS.md\n\n');
  assert.equal(await agentsWarning(repo, bundle), null, 'exactly @AGENTS.md passes');
});

test('agentsWarning checks .claude/CLAUDE.md too, one callout per file', async () => {
  const bundle = await makeBundle();
  const repo = await repoWithSection(bundle);
  await writeFile(path.join(repo, 'CLAUDE.md'), 'Root notes.\n');
  await mkdir(path.join(repo, '.claude'));
  await writeFile(path.join(repo, '.claude/CLAUDE.md'), '@./AGENTS.md\n');
  const warning = await agentsWarning(repo, bundle);
  assert.equal(warning.match(/> \[!WARNING\]/g).length, 2);
  assert.match(warning, /> `CLAUDE\.md` holds instructions[\s\S]*> `\.claude\/CLAUDE\.md` holds instructions of its own\..*then delete `\.claude\/CLAUDE\.md` or make it exactly `@AGENTS\.md`/);
});

test('agentsWarning tells the team a Boost block in CLAUDE.md need not be moved', async () => {
  const bundle = await makeBundle();
  const repo = await repoWithSection(bundle);
  await writeFile(path.join(repo, 'CLAUDE.md'), boostBlock('Laravel rules.'));
  assert.match(
    await agentsWarning(repo, bundle),
    /make it exactly `@AGENTS\.md`\. Boost's generated block does not need moving: once Claude Code is pinned to `AGENTS\.md`, `boost:update` writes it there\. \(`CODE-AI-P11`\)\n$/,
  );
});

test('agentsWarning asks a Boost repository to pin Claude Code\'s guidelines to AGENTS.md', async () => {
  const bundle = await makeBundle();
  const repo = await repoWithSection(bundle);
  await writeFile(path.join(repo, 'composer.json'), JSON.stringify({ 'require-dev': { 'laravel/boost': '^2.4' } }));
  assert.equal(await agentsWarning(repo, bundle), [
    '> [!WARNING]',
    '> This repository uses Laravel Boost (`composer.json` requires `laravel/boost`), but Claude Code\'s guidelines are not pinned to `AGENTS.md`, so Boost writes them into `CLAUDE.md`. Add this to `config/boost.php` (if the file is missing, run `php artisan vendor:publish --tag=boost-config` first), then run `php artisan boost:update`. (`CODE-AI-P12`)',
    '',
    '```php',
    "'agents' => [",
    "    'claude_code' => ['guidelines_path' => 'AGENTS.md'],",
    '],',
    '```',
    '',
  ].join('\n'));

  await mkdir(path.join(repo, 'config'));
  await writeFile(path.join(repo, 'config/boost.php'), "<?php\n\nreturn [\n    'agents' => [\n        'claude_code' => [\"guidelines_path\"  =>  'AGENTS.md'],\n    ],\n];\n");
  assert.equal(await agentsWarning(repo, bundle), null, 'a pinned repository passes');
});

test('agentsWarning does not fail the run over a composer.json it cannot parse', async () => {
  const bundle = await makeBundle();
  const repo = await repoWithSection(bundle);
  await writeFile(path.join(repo, 'composer.json'), '{ "require": { "laravel/boost": "^2.4", } }');
  assert.equal(await agentsWarning(repo, bundle), null);
});

test('bundleSkills rejects skill names sync could not remove later or that leave the skills folder', () => {
  assert.deepEqual(bundleSkills({ skills: ['dev-standard', 'dev-standard-docs'] }).map((s) => s.source), ['skills/dev-standard', 'skills/dev-standard-docs']);
  assert.throws(() => bundleSkills({ skills: ['team-tools'] }), /skill name "team-tools" must start with dev-standard/);
  assert.throws(() => bundleSkills({ skills: ['dev-standard-../../x'] }), /skill name "dev-standard-\.\.\/\.\.\/x"/);
});
