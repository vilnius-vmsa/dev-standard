import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

export function parseStacks(yamlText) {
  const data = YAML.parse(yamlText) ?? {};
  const stacks = new Map(
    Object.entries(data).map(([name, value]) => {
      if (!value?.applyTo) throw new Error(`stack "${name}" has no applyTo in standard/stacks.yaml`);
      return [name, { description: value.description ?? name, applyTo: value.applyTo, implies: value.implies ?? [] }];
    }),
  );
  for (const [name, { implies }] of stacks) {
    for (const implied of implies) {
      if (!stacks.has(implied)) throw new Error(`stack "${name}" implies unknown stack "${implied}" in standard/stacks.yaml`);
    }
  }
  return stacks;
}

export async function loadStacks(file) {
  return parseStacks(await readFile(file, 'utf8'));
}
