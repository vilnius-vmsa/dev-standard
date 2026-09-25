// Installs a vilnius-vmsa/dev-standard release bundle into a consuming repository.
// Node built-ins only: the action runs without npm ci.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const CONFIG_FILE = '.dev-standard/config.json';
const VERSION = /^v\d+\.\d+\.\d+$/;

export function parseStacks(input) {
  const names = (input ?? '').split(',').map((s) => s.trim().toLowerCase()).filter((s) => s && s !== 'all');
  return [...new Set(names)];
}

export async function readConfig(repoDir) {
  let text;
  try {
    text = await readFile(path.join(repoDir, CONFIG_FILE), 'utf8');
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

// Scheduled runs follow the latest release; manual runs re-sync the pinned one.
export function planRun({ config, stacksInput, event, latest }) {
  const given = (stacksInput ?? '').trim() !== '';
  if (!config && !given) {
    throw new Error(`${CONFIG_FILE} not found. Run this workflow manually with the "stacks" input (for example laravel,frontend) to set up the repository.`);
  }
  return {
    version: !config || event === 'schedule' ? latest : config.version,
    stacks: parseStacks(given ? stacksInput : config.stacks.join(',')),
  };
}
