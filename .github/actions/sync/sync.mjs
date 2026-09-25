// Installs a vilnius-vmsa/dev-standard release bundle into a consuming repository.
// Node built-ins only: the action runs without npm ci.
import { appendFile, copyFile, cp, mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const CONFIG_FILE = '.dev-standard/config.json';
const VERSION = /^v\d+\.\d+\.\d+$/;
const INSTRUCTIONS_DIR = '.github/instructions';
const SKILLS_DIR = '.agents/skills';
const CLAUDE_SKILLS_DIR = '.claude/skills';
const GENERATED_SKILL = /^dev-standard(-.+)?$/;
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

// Bundles up to v1.2.7 hold one skill in skill/ and list no skills in the manifest.
export function bundleSkills(manifest) {
  return manifest.skills
    ? manifest.skills.map((name) => ({ name, source: `skills/${name}` }))
    : [{ name: 'dev-standard', source: 'skill' }];
}

async function removeDroppedSkills(dir, wanted) {
  let names;
  try {
    names = await readdir(dir);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  for (const name of names) {
    if (GENERATED_SKILL.test(name) && !wanted.has(name)) await rm(path.join(dir, name), { recursive: true, force: true });
  }
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

  const skills = bundleSkills(manifest);
  const wantedSkills = new Set(skills.map((skill) => skill.name));
  await removeDroppedSkills(path.join(repoDir, SKILLS_DIR), wantedSkills);
  await removeDroppedSkills(path.join(repoDir, CLAUDE_SKILLS_DIR), wantedSkills);
  for (const { name, source } of skills) {
    const skillDir = path.join(repoDir, SKILLS_DIR, name);
    await rm(skillDir, { recursive: true, force: true });
    await cp(path.join(bundleDir, source), skillDir, { recursive: true });
    const link = path.join(repoDir, CLAUDE_SKILLS_DIR, name);
    await rm(link, { recursive: true, force: true });
    await mkdir(path.dirname(link), { recursive: true });
    await symlink(path.relative(path.dirname(link), skillDir), link);
  }

  await mkdir(path.join(repoDir, path.dirname(CONFIG_FILE)), { recursive: true });
  await writeFile(path.join(repoDir, CONFIG_FILE), `${JSON.stringify({ version, stacks }, null, 2)}\n`);
  return { stacks: resolved, skills: [...wantedSkills] };
}

// A pasted AGENTS.md section carries this marker; bundles up to v1.2.7 have none (revision 0).
const AGENTS_SECTION = /<!-- dev-standard:agents-section (\d+) -->/;
const revision = (text) => Number(text?.match(AGENTS_SECTION)?.[1] ?? 0);

// Sync never edits AGENTS.md; it asks the team to paste the pointer section, and to replace it when it is outdated.
export async function agentsWarning(repoDir, bundleDir) {
  let text = null;
  try {
    text = await readFile(path.join(repoDir, 'AGENTS.md'), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const snippet = await readFile(path.join(bundleDir, 'agents-snippet.md'), 'utf8');
  let problem;
  if (text === null) problem = 'This repository has no `AGENTS.md`. Add this section to it so agents find the rules:';
  else if (!text.includes('dev-standard')) problem = '`AGENTS.md` does not mention the dev standard. Add this section to it so agents find the rules:';
  else if (revision(text) < revision(snippet)) problem = '`AGENTS.md` has an outdated dev standard section. Replace it with this one:';
  else return null;
  return ['> [!WARNING]', `> ${problem}`, '', '```markdown', snippet.trimEnd(), '```', ''].join('\n');
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
    const { stacks, skills } = await applyBundle({ repoDir, bundleDir: values.bundle, version: values.version, stacks: parseStacks(values.stacks) });
    await writeFile(values.warning, (await agentsWarning(repoDir, values.bundle)) ?? '');
    console.log(`Installed ${values.version} for stacks: ${stacks.join(', ')}; skills: ${skills.join(', ')}`);
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
