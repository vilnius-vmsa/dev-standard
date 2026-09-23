#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBundle } from './lib/bundle.mjs';
import { acceptEntries, applyDrafts, checkEnglish, parseEnglish, stringifyEnglish } from './lib/english.mjs';
import { loadRules } from './lib/rules.mjs';
import { buildSiteData } from './lib/site-data.mjs';
import { loadStacks } from './lib/stacks.mjs';
import { stubTranslator } from './lib/translators.mjs';
import { validateRules } from './lib/validate-docs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS_DIR = path.join(ROOT, 'docs');
const STACKS_FILE = path.join(ROOT, 'standard/stacks.yaml');
const EN_FILE = path.join(ROOT, 'standard/rules.en.yaml');
const SITE_DATA_FILE = path.join(ROOT, 'src/data/rules.generated.json');
// Keep in sync with url + baseUrl in docusaurus.config.js.
const SITE_URL = (process.env.DEV_STANDARD_SITE_URL ?? 'https://vilnius-vmsa.github.io/dev-standard').replace(/\/+$/, '');

const [command, ...args] = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;

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

function translatorFromArgs() {
  const name = option('translator', 'stub');
  if (name === 'stub') return stubTranslator();
  fail([`unknown translator "${name}"`]);
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

  async draft() {
    const { rules, errors } = await loadDocs();
    if (errors.length) fail(errors);
    const { entries, drafted } = await applyDrafts(rules, (await loadEnglish()) ?? {}, translatorFromArgs());
    if (drafted.length === 0) return console.log('✓ nothing to draft.');
    await saveEnglish(entries);
    console.log(`✓ drafted ${drafted.length} rule(s) as machine-draft: ${drafted.join(', ')}`);
  },

  async bundle() {
    const out = option('out');
    const version = option('version');
    if (!out || !version) fail(['bundle needs --out=<dir> and --version=<tag>']);
    const { rules, stacks, errors } = await loadDocs();
    const english = (await loadEnglish()) ?? {};
    // --allow-drafts is for local previews only; releases must use reviewed English.
    errors.push(...checkEnglish(rules, english, { strict: !flag('allow-drafts') }));
    if (errors.length) fail(errors);

    const files = buildBundle({ rules, english, stacks, version, siteUrl: SITE_URL });
    for (const [relPath, content] of files) {
      const target = path.resolve(ROOT, out, relPath);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    const orgChars = files.get('org-instructions.md').length;
    console.log(`✓ wrote ${files.size} files to ${out} (org-instructions.md: ${orgChars} characters)`);
  },

  // Does not fail on validation errors, so a local `npm start` works mid-edit; CI validates separately.
  async 'site-data'() {
    const { rules } = await loadRules(DOCS_DIR);
    const data = buildSiteData({ rules, english: (await loadEnglish()) ?? {} });
    await mkdir(path.dirname(SITE_DATA_FILE), { recursive: true });
    await writeFile(SITE_DATA_FILE, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`✓ wrote ${data.length} rules to ${path.relative(ROOT, SITE_DATA_FILE)}`);
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
