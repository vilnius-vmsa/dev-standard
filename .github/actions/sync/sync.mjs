// Installs a vilnius-vmsa/dev-standard release bundle into a consuming repository.
// Node built-ins only: the action runs without npm ci.
import { appendFile, copyFile, mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const CONFIG_FILE = '.dev-standard/config.json';
const VERSION = /^v\d+\.\d+\.\d+$/;
const INSTRUCTIONS_DIR = '.github/instructions';
const SKILL_DIR = '.agents/skills/dev-standard';
const CLAUDE_SKILL_LINK = '.claude/skills/dev-standard';
const LOCAL_INSTRUCTIONS = 'dev-standard-local.instructions.md';
const GENERATED_INSTRUCTIONS = /^dev-standard-.+\.instructions\.md$/;

export function parseStacks(input) {
  const names = (input ?? '').split(',').map((s) => s.trim().toLowerCase()).filter((s) => s && s !== 'all');
  return [...new Set(names)];
}

// `file` overrides the location, e.g. the config on an open sync pull request's branch.
export async function readConfig(repoDir, file = path.join(repoDir, CONFIG_FILE)) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  let config;
  try {
    config = JSON.parse(text);
  } catch {
    throw new Error(`${CONFIG_FILE} is not valid JSON`);
  }
  if (!VERSION.test(config?.version ?? '')) throw new Error(`${CONFIG_FILE}: "version" must look like v1.2.3`);
  if (!Array.isArray(config.stacks) || !config.stacks.every((s) => typeof s === 'string')) {
    throw new Error(`${CONFIG_FILE}: "stacks" must be a list of stack names`);
  }
  return { version: config.version, stacks: config.stacks };
}

// Scheduled runs follow the latest release; manual runs re-sync the pinned one.
// Returns null when a scheduled run finds no config yet (setup pull request not merged).
export function planRun({ config, stacksInput, event, latest }) {
  const given = (stacksInput ?? '').trim() !== '';
  if (!config && !given && event === 'schedule') return null;
  if (!config && !given) {
    throw new Error(`${CONFIG_FILE} not found. Run this workflow manually with the "stacks" input (for example laravel,frontend) to set up the repository.`);
  }
  return {
    version: !config || event === 'schedule' ? latest : config.version,
    stacks: parseStacks(given ? stacksInput : config.stacks.join(',')),
  };
}

export function resolveStacks(stacks, manifest) {
  const unknown = stacks.filter((s) => !manifest.stacks.includes(s));
  if (unknown.length) {
    const valid = manifest.stacks.filter((s) => s !== 'all');
    throw new Error(`unknown stack(s): ${unknown.join(', ')}. Valid stacks: ${valid.join(', ')}`);
  }
  const resolved = new Set(['all']);
  const add = (stack) => {
    if (resolved.has(stack)) return;
    resolved.add(stack);
    for (const implied of manifest.implies?.[stack] ?? []) add(implied);
  };
  stacks.forEach(add);
  return [...resolved];
}

// Writes the generated paths only; everything else in the repository is left alone.
export async function applyBundle({ repoDir, bundleDir, version, stacks }) {
  const manifest = JSON.parse(await readFile(path.join(bundleDir, 'manifest.json'), 'utf8'));
  if (manifest.version !== version) throw new Error(`bundle is ${manifest.version} but ${version} was requested`);
  const resolved = resolveStacks(stacks, manifest);

  const instructionsDir = path.join(repoDir, INSTRUCTIONS_DIR);
  await mkdir(instructionsDir, { recursive: true });
  const wanted = new Set(resolved.map((stack) => `dev-standard-${stack}.instructions.md`));
  for (const name of await readdir(instructionsDir)) {
    if (GENERATED_INSTRUCTIONS.test(name) && name !== LOCAL_INSTRUCTIONS && !wanted.has(name)) {
      await rm(path.join(instructionsDir, name));
    }
  }
  for (const name of wanted) await copyFile(path.join(bundleDir, 'instructions', name), path.join(instructionsDir, name));

  const skillDir = path.join(repoDir, SKILL_DIR);
  await rm(skillDir, { recursive: true, force: true });
  await mkdir(skillDir, { recursive: true });
  await copyFile(path.join(bundleDir, 'skill/SKILL.md'), path.join(skillDir, 'SKILL.md'));

  const link = path.join(repoDir, CLAUDE_SKILL_LINK);
  await rm(link, { recursive: true, force: true });
  await mkdir(path.dirname(link), { recursive: true });
  await symlink(path.relative(path.dirname(link), skillDir), link);

  await mkdir(path.join(repoDir, path.dirname(CONFIG_FILE)), { recursive: true });
  await writeFile(path.join(repoDir, CONFIG_FILE), `${JSON.stringify({ version, stacks }, null, 2)}\n`);
  return { stacks: resolved };
}

// Sync never edits AGENTS.md; it asks the team to paste the pointer section once.
export async function agentsWarning(repoDir, bundleDir) {
  let text = null;
  try {
    text = await readFile(path.join(repoDir, 'AGENTS.md'), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (text?.includes('dev-standard')) return null;
  const snippet = await readFile(path.join(bundleDir, 'agents-snippet.md'), 'utf8');
  const problem = text === null ? 'This repository has no `AGENTS.md`.' : '`AGENTS.md` does not mention the dev standard.';
  return [
    '> [!WARNING]',
    `> ${problem} Add this section to it so agents find the rules:`,
    '',
    '```markdown',
    snippet.trimEnd(),
    '```',
    '',
  ].join('\n');
}

async function setOutputs(values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}\n`).join('');
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, lines);
  else process.stdout.write(lines);
}

async function main() {
  const { positionals: [command], values } = parseArgs({
    allowPositionals: true,
    options: Object.fromEntries(['repo', 'config', 'latest', 'event', 'stacks', 'bundle', 'version', 'warning'].map((name) => [name, { type: 'string' }])),
  });
  const repoDir = values.repo ?? '.';
  if (command === 'plan') {
    const config = await readConfig(repoDir, values.config);
    const plan = planRun({ config, stacksInput: values.stacks, event: values.event, latest: values.latest });
    if (plan) {
      await setOutputs({ version: plan.version, stacks: plan.stacks.join(',') });
    } else {
      console.log(`::notice::This repository is not set up yet: ${CONFIG_FILE} is missing. Merge the setup pull request, or run this workflow manually with the "stacks" input.`);
      await setOutputs({ skip: 'true' });
    }
  } else if (command === 'apply') {
    const { stacks } = await applyBundle({ repoDir, bundleDir: values.bundle, version: values.version, stacks: parseStacks(values.stacks) });
    await writeFile(values.warning, (await agentsWarning(repoDir, values.bundle)) ?? '');
    console.log(`Installed ${values.version} for stacks: ${stacks.join(', ')}`);
  } else {
    throw new Error(`unknown command "${command}"; use plan or apply`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.log(`::error::${error.message}`);
    process.exit(1);
  });
}
