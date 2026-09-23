#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRules } from './lib/rules.mjs';
import { loadStacks } from './lib/stacks.mjs';
import { validateRules } from './lib/validate-docs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS_DIR = path.join(ROOT, 'docs');
const STACKS_FILE = path.join(ROOT, 'standard/stacks.yaml');

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

const commands = {
  async validate() {
    const { rules, errors } = await loadDocs();
    if (errors.length) fail(errors);
    const reviewable = rules.filter((r) => r.check === 'ai-reviewable').length;
    console.log(`✓ ${rules.length} rules (${reviewable} ai-reviewable) are valid.`);
  },
};

if (!commands[command]) {
  console.error(`Usage: cli.mjs <${Object.keys(commands).join('|')}> [options]`);
  process.exit(2);
}
await commands[command]();
