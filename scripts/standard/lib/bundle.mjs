import { toPlainText } from './markdown.mjs';
import { sectionOf } from './references.mjs';

const REPO = 'vilnius-vmsa/dev-standard';

export const ruleUrl = (siteUrl, id) => `${siteUrl}/rules#${id.toLowerCase()}`;

const notice = (version) =>
  `<!-- GENERATED from ${REPO} ${version}. Do not edit: the next sync overwrites this file. ` +
  `To change a rule, propose a change to the standard: https://github.com/${REPO} -->`;

function ruleLine(rule, siteUrl) {
  const section = sectionOf(rule.heading);
  return `- **${rule.id}**${section ? ` (${section})` : ''}: ${rule.en} ([rule](${ruleUrl(siteUrl, rule.id)}))`;
}

function ruleSections(rules, siteUrl) {
  const lines = [];
  for (const [title, level] of [['MUST (IDs with -P)', 'P'], ['SHOULD (IDs with -R)', 'R']]) {
    const matching = rules.filter((r) => r.level === level);
    if (matching.length) lines.push(`## ${title}`, '', ...matching.map((r) => ruleLine(r, siteUrl)), '');
  }
  return lines;
}

function instructionsFile(stack, info, rules, version, siteUrl, reviewMethod) {
  return [
    '---',
    `applyTo: "${info.applyTo}"`,
    '---',
    '',
    notice(version),
    '',
    `# Vilnius dev standard: ${info.description} (${version})`,
    '',
    'English, non-binding summary of the Lithuanian standard; the Lithuanian text behind each link is binding.',
    '',
    ...(stack === 'all'
      ? [reviewMethod.trimEnd(), '']
      : ['Review method and severity labels: see `dev-standard-all.instructions.md`.', '']),
    ...(info.implies?.length
      ? [`This stack builds on ${info.implies.join(', ')}: also follow ${info.implies.map((s) => `\`dev-standard-${s}.instructions.md\``).join(', ')}.`, '']
      : []),
    ...(rules.length ? ruleSections(rules, siteUrl) : ['No rules are assigned to this stack in this version.', '']),
  ].join('\n');
}

function skillFile(version, reviewMethod) {
  return `---
name: dev-standard
description: Vilnius City Municipality software development standard. Use when writing, changing or reviewing code in this repository, when asked to check changes against the dev standard, or when asked whether something complies with it.
---

${notice(version)}

# Vilnius dev standard

The rules live in [\`.github/instructions/\`](../../../.github/instructions/):

- \`dev-standard-<stack>.instructions.md\`: the standard's rules for each stack listed in \`.dev-standard/config.json\`, plus the stacks those build on (a file that builds on another says so near its top). The \`applyTo\` header of each file says which paths it covers.
- \`dev-standard-local.instructions.md\` (if present): this repository's own extra rules. They can only be stricter than the standard.

Read those files from disk. Never state a rule from memory.

## When writing or changing code

1. List the files you will touch. Read \`dev-standard-all.instructions.md\` and every rules file whose \`applyTo\` matches one of them.
2. Follow every MUST rule. If you cannot, stop and tell the user which rule ID blocks you and why.
3. Before you report the task as done, check your own changes against the same rules and fix every MUST violation.

## When asked to review

1. Get the diff against the base branch (\`git diff origin/main...HEAD\` unless the user names another base).
2. Review it as described below.

${reviewMethod.trimEnd()}
`;
}

const AGENTS_SNIPPET = `## Vilnius dev standard

This repository follows the Vilnius City Municipality software development standard.
Before changing code, read the rules in \`.github/instructions/dev-standard-*.instructions.md\` whose \`applyTo\` matches the files you are changing, plus \`.github/instructions/dev-standard-local.instructions.md\` if it exists. The \`dev-standard\` skill describes how to apply and review them. Cite rule IDs (for example \`CODE-SEC-P01\`) when you report violations.
`;

export function buildBundle({ rules, english, stacks, version, siteUrl, reviewMethod }) {
  const reviewable = rules
    .filter((r) => r.check === 'ai-reviewable')
    .map((r) => {
      const en = english[r.id]?.text?.trim();
      if (!en) throw new Error(`${r.id} is ai-reviewable but has no English text in standard/rules.en.yaml`);
      return { ...r, en };
    });

  const files = new Map();
  for (const [stack, info] of stacks) {
    const stackRules = reviewable.filter((r) => r.stacks.includes(stack));
    files.set(`instructions/dev-standard-${stack}.instructions.md`, instructionsFile(stack, info, stackRules, version, siteUrl, reviewMethod));
  }
  files.set('skill/SKILL.md', skillFile(version, reviewMethod));
  files.set('agents-snippet.md', AGENTS_SNIPPET);
  files.set('rules.json', `${JSON.stringify({
    version,
    rules: reviewable.map((r) => ({
      id: r.id,
      level: r.level === 'P' ? 'MUST' : 'SHOULD',
      stacks: r.stacks,
      enforcedBy: r.enforcedBy,
      section: sectionOf(r.heading),
      en: r.en,
      lt: toPlainText(r.textLt.replace(/^[*-]\s+/gm, '')),
      url: ruleUrl(siteUrl, r.id),
      source: `${siteUrl}${r.route === '/' ? '/' : r.route}#${r.anchor}`,
    })),
  }, null, 2)}\n`);
  const implies = Object.fromEntries([...stacks].filter(([, info]) => info.implies?.length).map(([name, info]) => [name, info.implies]));
  files.set('manifest.json', `${JSON.stringify({ version, stacks: [...stacks.keys()], implies, files: [...files.keys()].sort() }, null, 2)}\n`);
  return files;
}
