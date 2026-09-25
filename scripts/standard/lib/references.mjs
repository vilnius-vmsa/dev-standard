import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listMarkdownFiles } from './rules.mjs';

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
