import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHeadingSlugger, stripCustomId } from './markdown.mjs';

export const ID_PATTERN = /^[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-([PR])\d{2}[a-z]?$/;
export const CHECK_TYPES = ['ai-reviewable', 'human-reviewable', 'process-level'];

const TAG_LINE = /^<!--\s*(.+?)\s*-->\s*$/;
const HEADING = /^(#{1,6})\s+(.+?)\s*$/;
const FENCE = /^\s*(```|~~~)/;
const BULLET = /^(\s*)[*-]\s+(.*)$/;

/** "ID | check | key=value | ..." → { id, check, attrs }, or null when the comment is not a rule tag. */
export function parseTag(inner) {
  const parts = inner.split('|').map((part) => part.trim());
  if (parts.length < 2 || !/^[A-Z][A-Za-z0-9-]*$/.test(parts[0])) return null;
  const [id, check, ...rest] = parts;
  const attrs = {};
  for (const part of rest) {
    const eq = part.indexOf('=');
    if (eq === -1) attrs[part] = '';
    else attrs[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return { id, check, attrs };
}

/** Route Docusaurus serves a doc at: frontmatter slug, else path with number prefixes stripped. */
export function docRoute(relPath, markdown) {
  const parsed = path.posix.parse(relPath);
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  const slug = frontmatter?.match(/^slug:\s*['"]?([^'"\r\n]+?)['"]?\s*$/m)?.[1];
  if (slug) return slug.startsWith('/') ? slug : `/${path.posix.join(parsed.dir, slug)}`;
  const route = path.posix
    .join(parsed.dir, parsed.name)
    .split('/')
    .map((segment) => segment.replace(/^\d+[-_]/, ''))
    .join('/');
  return `/${route.endsWith('/index') ? route.slice(0, -'/index'.length) : route}`;
}

function readBulletBody(lines, start) {
  const first = lines[start]?.match(BULLET);
  if (!first) return null;
  const indent = first[1].length;
  const body = [first[2].trim()];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      // A blank line ends the body unless the next content is still indented under the bullet.
      const next = lines.slice(i + 1).find((l) => l.trim());
      if (next === undefined || next.match(/^\s*/)[0].length <= indent) break;
      continue;
    }
    if (line.match(/^\s*/)[0].length <= indent) break;
    body.push(line.trim());
  }
  return body.join('\n');
}

export function parseRuleFile(markdown, relPath) {
  const lines = markdown.split(/\r?\n/);
  const slug = createHeadingSlugger();
  const route = docRoute(relPath, markdown);
  const rules = [];
  const errors = [];
  let heading = { text: '', anchor: '' };
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const headingMatch = line.match(HEADING);
    if (headingMatch) {
      heading = { text: stripCustomId(headingMatch[2]), anchor: slug(headingMatch[2]) };
      continue;
    }

    const tagMatch = line.match(TAG_LINE);
    const tag = tagMatch && tagMatch[1].includes('|') ? parseTag(tagMatch[1]) : null;
    if (!tag) continue;

    const textLt = readBulletBody(lines, i + 1);
    if (textLt === null) {
      errors.push(`${relPath}:${i + 1}: rule ${tag.id} is not followed by a bullet`);
      continue;
    }

    rules.push({
      id: tag.id,
      level: tag.id.match(ID_PATTERN)?.[1] ?? null,
      check: tag.check,
      stacks: tag.attrs.stacks ? tag.attrs.stacks.split(',').map((s) => s.trim()).filter(Boolean) : [],
      enforcedBy: tag.attrs['enforced-by'] || null,
      attrs: tag.attrs,
      textLt,
      file: relPath,
      line: i + 1,
      heading: heading.text,
      anchor: heading.anchor,
      route,
    });
  }

  return { rules, errors };
}

export async function listMarkdownFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(full, base)));
    else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      files.push(path.relative(base, full).split(path.sep).join('/'));
    }
  }
  return files.sort();
}

export async function loadRules(docsDir) {
  const rules = [];
  const errors = [];
  for (const relPath of await listMarkdownFiles(docsDir)) {
    const result = parseRuleFile(await readFile(path.join(docsDir, relPath), 'utf8'), relPath);
    rules.push(...result.rules);
    errors.push(...result.errors);
  }
  return { rules, errors };
}
