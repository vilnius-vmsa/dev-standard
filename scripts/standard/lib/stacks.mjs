import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

export function parseStacks(yamlText) {
  const data = YAML.parse(yamlText) ?? {};
  return new Map(
    Object.entries(data).map(([name, value]) => {
      if (!value?.applyTo) throw new Error(`stack "${name}" has no applyTo in standard/stacks.yaml`);
      return [name, { description: value.description ?? name, applyTo: value.applyTo }];
    }),
  );
}

export async function loadStacks(file) {
  return parseStacks(await readFile(file, 'utf8'));
}
