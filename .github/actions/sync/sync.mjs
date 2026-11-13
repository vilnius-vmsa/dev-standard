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
const GENERATED_SKILL = /^dev-standard(-[a-z0-9]+)*$/;
const LOCAL_INSTRUCTIONS = 'dev-standard-local.instructions.md';
const GENERATED_INSTRUCTIONS = /^dev-standard-.+\.instructions\.md$/;
const PR_TEMPLATE = 'pull_request_template.md';
// GitHub reads a PR template from these folders, as one file or a PULL_REQUEST_TEMPLATE folder, in any letter case.
const PR_TEMPLATE_DIRS = ['.github', '.', 'docs'];

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

// Scheduled runs follow the latest release; manual runs re-sync the pinned one unless the version input
// asks for "latest" or an exact release.
// Returns null when a scheduled run finds no config yet (setup pull request not merged).
export function planRun({ config, stacksInput, versionInput, event, latest }) {
  const given = (stacksInput ?? '').trim() !== '';
  if (!config && !given && event === 'schedule') return null;
  if (!config && !given) {
    throw new Error(`${CONFIG_FILE} not found. Run this workflow manually with the "stacks" input (for example laravel,frontend) to set up the repository.`);
  }
  return {
    version: requestedVersion(versionInput, latest) ?? (!config || event === 'schedule' ? latest : config.version),
    stacks: parseStacks(given ? stacksInput : config.stacks.join(',')),
  };
}

function requestedVersion(input, latest) {
  const version = (input ?? '').trim();
  if (version === '') return null;
  if (version.toLowerCase() === 'latest') return latest;
  if (!VERSION.test(version)) throw new Error(`the "version" input must be "latest" or look like v1.2.3, not "${version}"`);
  return version;
}

export function resolveStacks(stacks, manifest) {
  const unknown = stacks.filter((s) => !manifest.stacks.includes(s));
  if (unknown.length) {
    const valid = manifest.stacks.filter((s) => s !== 'all');
    throw new Error(`unknown stack(s): ${unknown.join(', ')}. Valid stacks in release ${manifest.version}: ${valid.join(', ')}. A stack added in a newer release needs that release: run the sync with version "latest".`);
  }
  const resolved = new Set(['all']);
  const add = (stack) => {
    if (resolved.has(stack)) return;
    resolved.add(stack);
    for (const implied of manifest.implies?.[stack] ?? []) add(implied);
  };
  stacks.forEach(add);
  for (const included of legacyStacks(stacks, manifest)) add(included);
  return [...resolved];
}

// Transitional: a stack that was split into profiles (infra) still brings all of them while the repository
// lists none of them itself. Returns the profiles added that way.
export function legacyStacks(stacks, manifest) {
  const added = [];
  for (const stack of stacks) {
    const profiles = manifest.legacyIncludes?.[stack] ?? [];
    if (profiles.length && !profiles.some((profile) => stacks.includes(profile))) added.push(...profiles);
  }
  return added;
}

export const RELEASE_MODELS = ['flow-branch', 'flow-tag'];
export const DEPLOYMENT_METHODS = ['compose', 'compose-blue-green', 'k8s'];
const profileNote = (text) => `> [!WARNING]\n> ${text}\n`;
const NOTHING_DEPLOYED = 'If the repository deploys nothing (for example a library),';
// While a sync pull request is open, sync reads the config from that pull request's branch, so an edit of
// the config on the default branch is ignored and reverted when the pull request is merged.
const HOW_TO_CHANGE = '>\n> To change the stacks, run the "Dev standard sync" workflow manually with the `stacks` input (the full list, for example `laravel,frontend,flow-branch,compose`), or edit `stacks` in `.dev-standard/config.json` on this pull request\'s branch. An edit on the default branch has no effect while this pull request is open.\n';
const withHowToChange = (notes) => (notes ? `${notes}${HOW_TO_CHANGE}` : '');

// Markdown for the pull request body; empty when the DevOps profiles in the config need no attention.
// Does not depend on legacyIncludes: once the transition is over, a repository that still lists only
// `infra` must be told why its profile files are being removed.
function profileNotes(stacks, manifest) {
  // Releases before the DevOps profiles know none of these stacks.
  if (!RELEASE_MODELS.every((model) => manifest.stacks.includes(model))) return '';
  const resolved = resolveStacks(stacks, manifest);
  if (!resolved.includes('infra')) return '';

  const legacy = legacyStacks(stacks, manifest);
  if (legacy.length) {
    return profileNote(`\`${CONFIG_FILE}\` lists \`infra\` but no DevOps profile, so this release still installs all of them: ${legacy.map((s) => `\`${s}\``).join(', ')}. Replace \`infra\` with the profiles this repository uses (one release model: \`flow-branch\` or \`flow-tag\`; one deployment: \`compose\`, \`compose-blue-green\` or \`k8s\`). A later release installs only the common rules for \`infra\`. ${NOTHING_DEPLOYED} keep \`infra\` as it is: the later release then gives it the common rules only.`);
  }
  const lines = [];
  const models = RELEASE_MODELS.filter((model) => stacks.includes(model));
  const methods = DEPLOYMENT_METHODS.filter((method) => stacks.includes(method));
  if (models.length === 0 && methods.length === 0) {
    // One note, not two: a repository that deploys nothing legitimately has neither.
    return profileNote(`\`${CONFIG_FILE}\` lists no release model and no deployment method, so the branch-based, tag-based, Compose and Kubernetes rules are not installed. Add one release model (\`flow-branch\` or \`flow-tag\`) and one deployment method (\`compose\`, \`compose-blue-green\` or \`k8s\`). If it deploys with a technology the standard does not describe, add only the release model (and \`docker\` when it builds container images). ${NOTHING_DEPLOYED} say so in its README and ignore this note (OPS-PIPE-P07).`);
  }
  if (models.length === 2) {
    lines.push(profileNote(`\`${CONFIG_FILE}\` lists both \`flow-branch\` and \`flow-tag\`. A repository follows one release model; remove the other.`));
  } else if (models.length === 0) {
    lines.push(profileNote(`\`${CONFIG_FILE}\` lists a deployment method but no release model, so the branch-based or tag-based rules are not installed. Add \`flow-branch\` or \`flow-tag\`.`));
  }
  if (methods.length === 0) {
    lines.push(profileNote(`\`${CONFIG_FILE}\` lists no deployment method, so the Compose or Kubernetes rules are not installed. Add \`compose\`, \`compose-blue-green\` or \`k8s\`. If the repository uses a technology the standard does not describe, state that in its deployment documentation (and list \`docker\` when it builds container images); then ignore this note (OPS-PIPE-P07).`));
  } else if (methods.includes('k8s') && methods.length > 1) {
    lines.push(profileNote(`\`${CONFIG_FILE}\` lists both a Compose profile and \`k8s\`. A repository normally has one deployment method; keep both only if it really deploys both ways.`));
  }
  return lines.join('\n');
}

export function stackWarnings(stacks, manifest) {
  return withHowToChange(profileNotes(stacks, manifest));
}

// Bundles up to v1.2.7 hold one skill in skill/ and list no skills in the manifest.
// Only dev-standard names: sync removes dropped skills by that prefix, and a name never leaves the skills folder.
export function bundleSkills(manifest) {
  if (!manifest.skills) return [{ name: 'dev-standard', source: 'skill' }];
  return manifest.skills.map((name) => {
    if (!GENERATED_SKILL.test(name)) throw new Error(`skill name "${name}" must start with dev-standard and use lower-case words`);
    return { name, source: `skills/${name}` };
  });
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

  const prTemplate = await installPrTemplate(repoDir, bundleDir);

  await mkdir(path.join(repoDir, path.dirname(CONFIG_FILE)), { recursive: true });
  await writeFile(path.join(repoDir, CONFIG_FILE), `${JSON.stringify({ version, stacks }, null, 2)}\n`);
  return { stacks: resolved, skills: [...wantedSkills], warning: stackWarnings(stacks, manifest), prTemplate };
}

async function hasPrTemplate(repoDir) {
  for (const dir of PR_TEMPLATE_DIRS) {
    let names;
    try {
      names = await readdir(path.join(repoDir, dir));
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') continue;
      throw error;
    }
    if (names.some((name) => [PR_TEMPLATE, 'pull_request_template'].includes(name.toLowerCase()))) return true;
  }
  return false;
}

// The template belongs to the team once it exists: sync only creates it, never updates it.
// Returns the path it created, or null. Bundles before the template shipped have none.
async function installPrTemplate(repoDir, bundleDir) {
  const source = await readIfExists(path.join(bundleDir, PR_TEMPLATE));
  if (source === null || await hasPrTemplate(repoDir)) return null;
  const target = path.posix.join('.github', PR_TEMPLATE);
  await mkdir(path.join(repoDir, '.github'), { recursive: true });
  await writeFile(path.join(repoDir, target), source);
  return target;
}

// A pasted AGENTS.md section carries this marker; bundles up to v1.2.7 have none (revision 0).
const AGENTS_SECTION = /<!-- dev-standard:agents-section (\d+) -->/;
const revision = (text) => Number(text?.match(AGENTS_SECTION)?.[1] ?? 0);
// Laravel Boost's generated block in AGENTS.md; boost:update overwrites everything inside it.
const BOOST_BLOCK = /<laravel-boost-guidelines>[\s\S]*?<\/laravel-boost-guidelines>/;

const readIfExists = async (file) => {
  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
};
const callout = (problem, ...rest) => ['> [!WARNING]', `> ${problem}`, '', ...rest].join('\n');

// Sync never edits AGENTS.md; it asks the team to paste the pointer section, and to replace it when it is outdated.
async function sectionWarning(repoDir, bundleDir) {
  const text = await readIfExists(path.join(repoDir, 'AGENTS.md'));
  const snippet = await readFile(path.join(bundleDir, 'agents-snippet.md'), 'utf8');
  const generated = text?.match(BOOST_BLOCK)?.[0] ?? '';
  const own = text?.replace(generated, '');
  let problem;
  if (text === null) problem = 'This repository has no `AGENTS.md`. Add this section to it so agents find the rules:';
  else if (!own.includes('dev-standard') && generated.includes('dev-standard')) problem = "`AGENTS.md` has the dev standard section only inside Boost's generated block, where `boost:update` overwrites it. Remove it from `.ai/guidelines/` and add this section to `AGENTS.md` outside the block (`CODE-AI-P10`):";
  else if (!own.includes('dev-standard')) problem = '`AGENTS.md` does not mention the dev standard. Add this section to it so agents find the rules:';
  else if (revision(own) < revision(snippet)) problem = '`AGENTS.md` has an outdated dev standard section. Replace it with this one:';
  else return null;
  return callout(problem, '```markdown', snippet.trimEnd(), '```', '');
}

// Sync never edits CLAUDE.md; any CLAUDE.md other than exactly `@AGENTS.md` duplicates or hides AGENTS.md.
async function claudeWarning(repoDir, file) {
  const text = await readIfExists(path.join(repoDir, file));
  if (text === null || text.trim() === '@AGENTS.md') return null;
  const boost = BOOST_BLOCK.test(text) ? " Boost's generated block does not need moving: once Claude Code is pinned to `AGENTS.md`, `boost:update` writes it there." : '';
  return callout(`\`${file}\` holds instructions of its own. Codex does not read it, and Copilot reads it on top of \`AGENTS.md\`. Move the repository's instructions into \`AGENTS.md\`, then delete \`${file}\` or make it exactly \`@AGENTS.md\`.${boost} (\`CODE-AI-P11\`)`);
}

// A repository uses Laravel Boost when composer.json requires it. Other agents may also set guidelines_path to
// AGENTS.md, so only a live (uncommented) value inside the claude_code entry counts as the pin.
const PHP_COMMENT = /('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|\/\*[\s\S]*?\*\/|(?:\/\/|#)[^\n]*/g;
const CLAUDE_CODE_ENTRY = /['"]claude_code['"]\s*=>\s*(\[|array\s*\()/;
const BOOST_PIN = /['"]guidelines_path['"]\s*=>\s*['"]AGENTS\.md['"]/;

function claudeCodePinned(php) {
  const code = php.replace(PHP_COMMENT, (_, string) => string ?? '');
  const entry = code.match(CLAUDE_CODE_ENTRY);
  if (!entry) return false;
  const start = entry.index + entry[0].length;
  let depth = 1;
  let end = start;
  // Strings are left intact, so brackets inside them can skew the count; good enough for an advisory check.
  for (; end < code.length && depth > 0; end++) {
    if ('[('.includes(code[end])) depth++;
    else if ('])'.includes(code[end])) depth--;
  }
  return BOOST_PIN.test(code.slice(start, end));
}

async function pinWarning(repoDir) {
  let composer;
  try {
    composer = JSON.parse(await readIfExists(path.join(repoDir, 'composer.json')) ?? '{}');
  } catch {
    return null; // composer itself reports a broken composer.json; the advisory check stays quiet
  }
  if (!composer.require?.['laravel/boost'] && !composer['require-dev']?.['laravel/boost']) return null;
  if (claudeCodePinned(await readIfExists(path.join(repoDir, 'config/boost.php')) ?? '')) return null;
  return callout(
    "This repository uses Laravel Boost (`composer.json` requires `laravel/boost`), but Claude Code's guidelines are not pinned to `AGENTS.md`, so Boost writes them into `CLAUDE.md`. Add this to `config/boost.php` (if the file is missing, run `php artisan vendor:publish --tag=boost-config` first), then run `php artisan boost:update`. (`CODE-AI-P12`)",
    '```php', "'agents' => [", "    'claude_code' => ['guidelines_path' => 'AGENTS.md'],", '],', '```', '',
  );
}

// Advisory only: one callout per problem, or null when the repository follows the agent instruction rules.
export async function agentsWarning(repoDir, bundleDir) {
  const callouts = [
    await sectionWarning(repoDir, bundleDir),
    await claudeWarning(repoDir, 'CLAUDE.md'),
    await claudeWarning(repoDir, '.claude/CLAUDE.md'),
    await pinWarning(repoDir),
  ].filter(Boolean);
  return callouts.length ? callouts.join('\n') : null;
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
    const plan = planRun({ config, stacksInput: values.stacks, versionInput: values.version, event: values.event, latest: values.latest });
    if (plan) {
      await setOutputs({ version: plan.version, stacks: plan.stacks.join(',') });
    } else {
      console.log(`::notice::This repository is not set up yet: ${CONFIG_FILE} is missing. Merge the setup pull request, or run this workflow manually with the "stacks" input.`);
      await setOutputs({ skip: 'true' });
    }
  } else if (command === 'apply') {
    const { stacks, skills, warning, prTemplate } = await applyBundle({ repoDir, bundleDir: values.bundle, version: values.version, stacks: parseStacks(values.stacks) });
    await writeFile(values.warning, [(await agentsWarning(repoDir, values.bundle)) ?? '', warning].filter(Boolean).join('\n'));
    console.log(`Installed ${values.version} for stacks: ${stacks.join(', ')}; skills: ${skills.join(', ')}`);
    if (prTemplate) console.log(`Created ${prTemplate}; later syncs leave it to the team.`);
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
