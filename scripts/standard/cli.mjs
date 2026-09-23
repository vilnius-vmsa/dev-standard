#!/usr/bin/env node
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { acceptEntries, checkEnglish, parseEnglish, stringifyEnglish } from './lib/english.mjs';
import { loadRules } from './lib/rules.mjs';
import { loadStacks } from './lib/stacks.mjs';
import { validateRules } from './lib/validate-docs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS_DIR = path.join(ROOT, 'docs');
const STACKS_FILE = path.join(ROOT, 'standard/stacks.yaml');
const EN_FILE = path.join(ROOT, 'standard/rules.en.yaml');

const [command, ...args] = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);

function fail(errors) {
  for (const error of errors) console.error(`✗ ${error}`);
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}

async function loadDocs() {
  const [{ rules, errors }, stacks] = await Promise.all([loadRules(DOCS_DIR), loadStacks(STACKS_FILE)]);
  return { rules, stacks, errors: [...errors, ...validateRules(rules, stacks)] };
}

async function loadEnglish() {
  try {
    await access(EN_FILE);
  } catch {
    return null;
  }
  return parseEnglish(await readFile(EN_FILE, 'utf8'));
}

async function saveEnglish(entries) {
  await writeFile(EN_FILE, stringifyEnglish(entries));
}

const commands = {
  async validate() {
    const { rules, errors } = await loadDocs();
    const english = flag('docs-only') ? null : await loadEnglish();
    if (english) errors.push(...checkEnglish(rules, english, { strict: flag('strict') }));
    if (errors.length) fail(errors);
    const reviewable = rules.filter((r) => r.check === 'ai-reviewable').length;
    const scope = english ? ' and their English text' : '';
    console.log(`✓ ${rules.length} rules (${reviewable} ai-reviewable)${scope} are valid.`);
  },

  async accept() {
    const patterns = args.filter((a) => !a.startsWith('--'));
    if (patterns.length === 0) fail(['accept needs at least one rule ID or prefix, e.g. CODE-SEC-P01 or CODE-SEC-*']);
    const { rules } = await loadDocs();
    const { entries, accepted, errors } = acceptEntries(rules, (await loadEnglish()) ?? {}, patterns);
    if (accepted.length) {
      await saveEnglish(entries);
      console.log(`✓ accepted ${accepted.length}: ${accepted.join(', ')}`);
    }
    if (errors.length) fail(errors);
  },
};

if (!commands[command]) {
  console.error(`Usage: cli.mjs <${Object.keys(commands).join('|')}> [options]`);
  process.exit(2);
}
await commands[command]();
