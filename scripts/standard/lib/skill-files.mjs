import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listMarkdownFiles } from './rules.mjs';

// A standard page can hand a copyable block to a skill: the marker line names the file,
// the fenced block after it is the content. Keeps templates in the binding appendix only.
const MARKER = /^<!--\s*skill-file:\s*(\S+)\s*-->\s*$/;
const TARGET = /^([a-z0-9-]+)\/(templates\/[A-Za-z0-9._/-]+)$/;
const OPEN_FENCE = /^(`{3,})/;

/** Skill files marked in one docs page: { files: [{ skill, path, content }], errors }. */
export function extractSkillFiles(markdown, relPath) {
  const lines = markdown.split(/\r?\n/);
  const files = [];
  const errors = [];
  lines.forEach((line, index) => {
    const marker = line.match(MARKER);
    if (!marker) return;
    const where = `${relPath}:${index + 1}`;
    const target = marker[1].match(TARGET);
    if (!target) return errors.push(`${where}: skill-file path must be <skill>/templates/<file>, got ${marker[1]}`);
    let start = index + 1;
    while (start < lines.length && !lines[start].trim()) start++;
    const fence = lines[start]?.match(OPEN_FENCE)?.[1];
    if (!fence) return errors.push(`${where}: skill-file marker is not followed by a fenced code block`);
    const end = lines.findIndex((l, i) => i > start && l.trim() === fence);
    if (end === -1) return errors.push(`${where}: skill-file block is not closed`);
    files.push({ skill: target[1], path: target[2], content: `${lines.slice(start + 1, end).join('\n')}\n` });
  });
  return { files, errors };
}

/** Skill files marked anywhere under docsDir, each with its source page. */
export async function loadSkillFiles(docsDir) {
  const files = [];
  const errors = [];
  for (const relPath of await listMarkdownFiles(docsDir)) {
    const result = extractSkillFiles(await readFile(path.join(docsDir, relPath), 'utf8'), relPath);
    files.push(...result.files.map((file) => ({ ...file, source: relPath })));
    errors.push(...result.errors);
  }
  return { files, errors };
}

/** Adds extracted files to the hand-written skills (name → path → content); returns problems. */
export function mergeSkillFiles(skills, files) {
  const errors = [];
  for (const { skill, path: filePath, content, source } of files) {
    const skillFiles = skills.get(skill);
    if (!skillFiles) errors.push(`${source}: no skill ${skill} in standard/skills`);
    else if (skillFiles.has(filePath)) errors.push(`${source}: ${skill}/${filePath} already exists in standard/skills`);
    else skillFiles.set(filePath, content);
  }
  return errors;
}
