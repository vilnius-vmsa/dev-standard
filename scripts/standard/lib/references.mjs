import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHeadingSlugger } from './markdown.mjs';
import { docRoute, listMarkdownFiles } from './rules.mjs';

const RULE_ID = /\b[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-[PR]\d{2}[a-z]?\b/g;
// Section numbers a text cites: "(4.6", ", 4.4", "–5.5", "see 4.6", "§7.4.1" — but not "TLS 1.2+".
const SECTION_REF = /(?:§|\bsee |\(|, |–)(\d+(?:\.\d+)+)/g;
const NUMBERED_HEADING = /^#{1,6}\s+(\d+(?:\.\d+)*)\.\s/gm;

export function sectionNumbers(markdown) {
  return new Set([...markdown.matchAll(NUMBERED_HEADING)].map((m) => m[1]));
}

export async function loadSectionNumbers(docsDir) {
  const sections = new Set();
  for (const relPath of await listMarkdownFiles(docsDir)) {
    for (const number of sectionNumbers(await readFile(path.join(docsDir, relPath), 'utf8'))) sections.add(number);
  }
  return sections;
}

/** "4.6. Saugumas kodo lygmeniu" → "4.6"; null for unnumbered headings. */
export function sectionOf(heading) {
  return heading.match(/^(\d+(?:\.\d+)*)\.\s/)?.[1] ?? null;
}

/** Problems with the rule IDs and section numbers a hand-written text cites. */
export function checkReferences(text, { ruleIds, sections }) {
  const errors = [];
  for (const id of new Set(text.match(RULE_ID) ?? [])) {
    if (!ruleIds.has(id)) errors.push(`cites unknown rule ID ${id}`);
  }
  for (const number of new Set([...text.matchAll(SECTION_REF)].map((m) => m[1]))) {
    if (!sections.has(number)) errors.push(`cites unknown section ${number}`);
  }
  return errors;
}

const HEADING = /^#{1,6}\s+(.+?)\s*$/;
const FENCE = /^\s*(```|~~~)/;

/** Route → heading ids of every docs page, plus the generated /rules page (its anchors are not checked). */
export async function loadPages(docsDir) {
  const pages = new Map();
  for (const relPath of await listMarkdownFiles(docsDir)) {
    const markdown = await readFile(path.join(docsDir, relPath), 'utf8');
    const slug = createHeadingSlugger();
    const anchors = new Set();
    let inFence = false;
    for (const line of markdown.split(/\r?\n/)) {
      if (FENCE.test(line)) inFence = !inFence;
      const heading = !inFence && line.match(HEADING);
      if (heading) anchors.add(slug(heading[1]));
    }
    pages.set(docRoute(relPath, markdown), anchors);
  }
  pages.set('/rules', null);
  return pages;
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Problems with links from a hand-written text into the published site. */
export function siteLinkErrors(text, siteUrl, pages) {
  const errors = [];
  const link = new RegExp(`${escapeRegExp(siteUrl)}(/[^\\s)>#"'\`]*)?(?:#([^\\s)>"'\`]+))?`, 'g');
  // Sentence punctuation right after a URL is not part of it.
  const trim = (part) => part?.replace(/[.,;:!?]+$/, '');
  for (const match of text.matchAll(link)) {
    const [rawRoute, rawAnchor] = [trim(match[1] ?? '/'), trim(match[2])];
    const route = rawRoute.length > 1 ? rawRoute.replace(/\/+$/, '') : '/';
    const anchors = pages.get(route);
    if (!pages.has(route)) errors.push(`links to missing page ${route}`);
    else if (rawAnchor && anchors && !anchors.has(decodeURIComponent(rawAnchor))) errors.push(`links to missing anchor ${route}#${rawAnchor}`);
  }
  return errors;
}
