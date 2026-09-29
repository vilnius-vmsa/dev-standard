import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { checkReferences, siteLinkErrors } from './references.mjs';

async function listFiles(dir, prefix = '') {
  const files = [];
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await listFiles(path.join(dir, entry.name), rel)));
    else files.push(rel);
  }
  return files;
}

/** Skills in standard/skills: name → (path inside the skill → content). */
export async function loadSkills(skillsDir) {
  const skills = new Map();
  const names = (await readdir(skillsDir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).sort();
  for (const name of names) {
    const files = new Map();
    for (const rel of await listFiles(path.join(skillsDir, name))) files.set(rel, await readFile(path.join(skillsDir, name, rel), 'utf8'));
    skills.set(name, files);
  }
  return skills;
}

const LINK = /\]\(([^)\s#]+)(?:#[^)]*)?\)/g;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Problems in one hand-written skill; `known` = { ruleIds, sections, pages, siteUrl }. */
export function checkSkill(name, files, known) {
  // Sync removes dropped skills by this prefix (.github/actions/sync/sync.mjs, GENERATED_SKILL).
  if (!/^dev-standard(-[a-z0-9]+)*$/.test(name)) return [`${name}: skill name must be dev-standard or dev-standard-<lower-case-words>`];
  const skillMd = files.get('SKILL.md');
  if (skillMd === undefined) return [`${name}: has no SKILL.md`];
  const errors = [];
  const frontmatter = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const declared = frontmatter.match(/^name:\s*(.+)$/m)?.[1].trim();
  if (declared !== name) errors.push(`${name}/SKILL.md: frontmatter name is "${declared}", expected "${name}"`);
  if (!/^description:\s*\S/m.test(frontmatter)) errors.push(`${name}/SKILL.md: frontmatter has no description`);
  for (const [rel, text] of files) {
    if (!rel.endsWith('.md')) continue;
    const where = `${name}/${rel}`;
    // Templates link to files of the repository they are copied into, not to the skill.
    if (!rel.startsWith('templates/')) {
      for (const [, target] of text.matchAll(LINK)) {
        if (SCHEME.test(target)) continue;
        if (!files.has(path.posix.normalize(path.posix.join(path.posix.dirname(rel), target)))) errors.push(`${where}: broken link ${target}`);
      }
    }
    errors.push(...checkReferences(text, known).map((e) => `${where}: ${e}`));
    errors.push(...siteLinkErrors(text, known.siteUrl, known.pages).map((e) => `${where}: ${e}`));
  }
  return errors;
}
