import { createHash } from 'node:crypto';
import YAML from 'yaml';

const DRAFT = 'machine-draft';

export function sourceHash(textLt) {
  return createHash('sha256').update(textLt.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 12);
}

export function parseEnglish(yamlText) {
  return YAML.parse(yamlText) ?? {};
}

export function stringifyEnglish(entries) {
  const sorted = Object.fromEntries(Object.keys(entries).sort().map((id) => [id, entries[id]]));
  return YAML.stringify(sorted, { lineWidth: 0 });
}

const reviewableById = (rules) => new Map(rules.filter((r) => r.check === 'ai-reviewable').map((r) => [r.id, r]));

export function checkEnglish(rules, entries, { strict = false } = {}) {
  const errors = [];
  const reviewable = reviewableById(rules);

  for (const [id, rule] of reviewable) {
    const entry = entries[id];
    if (!entry) {
      errors.push(`${id}: missing English text in standard/rules.en.yaml`);
      continue;
    }
    if (typeof entry.text !== 'string' || !entry.text.trim()) errors.push(`${id}: English text is empty`);
    const current = sourceHash(rule.textLt);
    if (entry.source_hash !== current) {
      errors.push(`${id}: Lithuanian text changed since the English was written (source_hash ${entry.source_hash} ≠ ${current}); update the English, then run npm run rules:accept -- ${id}`);
    }
    if (entry.status !== undefined && entry.status !== DRAFT) errors.push(`${id}: unknown status "${entry.status}" (only ${DRAFT} is allowed)`);
    if (strict && entry.status === DRAFT) {
      errors.push(`${id}: English is an unreviewed machine draft; review it, then run npm run rules:accept -- ${id}`);
    }
  }

  for (const id of Object.keys(entries)) {
    if (!reviewable.has(id)) errors.push(`${id}: English entry has no matching ai-reviewable rule in docs/ (removed, renamed or reclassified?)`);
  }
  return errors;
}

export function rulesNeedingDraft(rules, entries) {
  return [...reviewableById(rules).values()].filter((rule) => {
    const entry = entries[rule.id];
    return !entry || !entry.text?.trim() || entry.source_hash !== sourceHash(rule.textLt);
  });
}

export async function applyDrafts(rules, entries, translate) {
  const todo = rulesNeedingDraft(rules, entries);
  if (todo.length === 0) return { entries, drafted: [] };

  const texts = await translate(todo.map((r) => ({ id: r.id, textLt: r.textLt, previousEn: entries[r.id]?.text })));
  const next = { ...entries };
  for (const rule of todo) {
    if (typeof texts[rule.id] !== 'string') throw new Error(`translator returned no text for ${rule.id}`);
    next[rule.id] = { text: texts[rule.id].trim(), source_hash: sourceHash(rule.textLt), status: DRAFT };
  }
  return { entries: next, drafted: todo.map((r) => r.id) };
}

export function acceptEntries(rules, entries, patterns) {
  const reviewable = reviewableById(rules);
  const next = { ...entries };
  const accepted = [];
  const errors = [];

  for (const pattern of patterns) {
    const matches = Object.keys(entries).filter((id) =>
      pattern.endsWith('*') ? id.startsWith(pattern.slice(0, -1)) : id === pattern,
    );
    if (matches.length === 0) errors.push(`${pattern}: matches no English entry`);
    for (const id of matches) {
      const rule = reviewable.get(id);
      if (!rule) errors.push(`${id}: no ai-reviewable rule with this ID in docs/`);
      else if (!entries[id].text?.trim()) errors.push(`${id}: cannot accept empty English text`);
      else {
        next[id] = { text: entries[id].text, source_hash: sourceHash(rule.textLt) };
        accepted.push(id);
      }
    }
  }
  return { entries: next, accepted, errors };
}
