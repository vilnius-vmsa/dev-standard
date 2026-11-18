import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

export function parseStacks(yamlText) {
  const data = YAML.parse(yamlText) ?? {};
  const stacks = new Map(
    Object.entries(data).map(([name, value]) => {
      if (!value?.applyTo) throw new Error(`stack "${name}" has no applyTo in standard/stacks.yaml`);
      const stack = { description: value.description ?? name, applyTo: value.applyTo, implies: value.implies ?? [] };
      if (value.legacyIncludes) stack.legacyIncludes = value.legacyIncludes;
      return [name, stack];
    }),
  );
  for (const [name, { implies, legacyIncludes = [] }] of stacks) {
    for (const implied of implies) {
      if (!stacks.has(implied)) throw new Error(`stack "${name}" implies unknown stack "${implied}" in standard/stacks.yaml`);
    }
    for (const included of legacyIncludes) {
      if (!stacks.has(included)) throw new Error(`stack "${name}" has unknown stack "${included}" in legacyIncludes in standard/stacks.yaml`);
    }
  }
  return stacks;
}

export async function loadStacks(file) {
  return parseStacks(await readFile(file, 'utf8'));
}
