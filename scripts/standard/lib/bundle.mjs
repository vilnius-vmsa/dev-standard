import { toPlainText } from './markdown.mjs';

const REPO = 'vilnius-vmsa/dev-standard';

export const ruleUrl = (siteUrl, id) => `${siteUrl}/rules#${id.toLowerCase()}`;

const notice = (version) =>
  `<!-- GENERATED from ${REPO} ${version}. Do not edit: the next sync overwrites this file. ` +
  `To change a rule, propose a change to the standard: https://github.com/${REPO} -->`;

const ruleLine = (rule, siteUrl) => `- **${rule.id}**: ${rule.en} ([rule](${ruleUrl(siteUrl, rule.id)}))`;

function ruleSections(rules, siteUrl) {
  const lines = [];
  for (const [title, level] of [['MUST (must-fix)', 'P'], ['SHOULD (suggestion)', 'R']]) {
    const matching = rules.filter((r) => r.level === level);
    if (matching.length) lines.push(`## ${title}`, '', ...matching.map((r) => ruleLine(r, siteUrl)), '');
  }
  return lines;
}

function instructionsFile(stack, info, rules, version, siteUrl) {
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
    'MUST rules (IDs with -P) are must-fix. SHOULD rules (IDs with -R) are suggestions. Cite the rule ID whenever you flag a violation.',
    '',
    ...(rules.length ? ruleSections(rules, siteUrl) : ['No rules are assigned to this stack in this version.', '']),
  ].join('\n');
}

function skillFile(version) {
  return `---
name: dev-standard
description: Vilnius City Municipality software development standard. Use when writing, changing or reviewing code in this repository, when asked to check changes against the dev standard, or when asked whether something complies with it.
---

${notice(version)}

# Vilnius dev standard

The rules live in [\`.github/instructions/\`](../../../.github/instructions/):

- \`dev-standard-<stack>.instructions.md\`: the standard's rules for each stack listed in \`.dev-standard/config.json\`. The \`applyTo\` header of each file says which paths it covers.
- \`dev-standard-local.instructions.md\` (if present): this repository's own extra rules. They can only be stricter than the standard.

Read those files from disk. Never state a rule from memory.

## When writing or changing code

1. List the files you will touch. Read \`dev-standard-all.instructions.md\` and every rules file whose \`applyTo\` matches one of them.
2. Follow every MUST rule. If you cannot, stop and tell the user which rule ID blocks you and why.
3. Before you report the task as done, check your own changes against the same rules and fix every MUST violation.

## When asked to review

1. Get the diff against the base branch (\`git diff origin/main...HEAD\` unless the user names another base).
2. Check each changed file against the matching rules files.
3. Report MUST violations first, then SHOULD suggestions, one per line: \`RULE-ID (must-fix|suggestion) path:line: what is wrong\`, followed by the rule link from the rules file.
4. Report only what you can check from the code. Say nothing about rules that need a person's judgement.
`;
}

function orgInstructions(allStackMust, siteUrl) {
  return [
    'Repositories in this organization follow the Vilnius City Municipality software development standard.',
    '',
    'When reviewing pull requests:',
    '- If the repository has `.github/instructions/dev-standard-*.instructions.md`, those files are the detailed, version-pinned rules for that repository and take precedence over this summary.',
    '- Cite rule IDs, for example `CODE-SEC-P01 (must-fix)`. IDs with -P are must-fix; IDs with -R are suggestions.',
    `- The binding Lithuanian standard is at ${siteUrl}/ and the English rule list at ${siteUrl}/rules.`,
    '',
    'Baseline rules for every repository:',
    '',
    ...allStackMust.map((r) => ruleLine(r, siteUrl)),
    '',
  ].join('\n');
}

const AGENTS_SNIPPET = `## Vilnius dev standard

This repository follows the Vilnius City Municipality software development standard.
Before changing code, read the rules in \`.github/instructions/dev-standard-*.instructions.md\` whose \`applyTo\` matches the files you are changing, plus \`.github/instructions/dev-standard-local.instructions.md\` if it exists. The \`dev-standard\` skill describes how to apply and review them. Cite rule IDs (for example \`CODE-SEC-P01\`) when you report violations.
`;

export function buildBundle({ rules, english, stacks, version, siteUrl }) {
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
    files.set(`instructions/dev-standard-${stack}.instructions.md`, instructionsFile(stack, info, stackRules, version, siteUrl));
  }
  files.set('skill/SKILL.md', skillFile(version));
  files.set('org-instructions.md', orgInstructions(reviewable.filter((r) => r.stacks.includes('all') && r.level === 'P'), siteUrl));
  files.set('agents-snippet.md', AGENTS_SNIPPET);
  files.set('rules.json', `${JSON.stringify({
    version,
    rules: reviewable.map((r) => ({
      id: r.id,
      level: r.level === 'P' ? 'MUST' : 'SHOULD',
      stacks: r.stacks,
      enforcedBy: r.enforcedBy,
      en: r.en,
      lt: toPlainText(r.textLt.replace(/^[*-]\s+/gm, '')),
      url: ruleUrl(siteUrl, r.id),
      source: `${siteUrl}${r.route === '/' ? '/' : r.route}#${r.anchor}`,
    })),
  }, null, 2)}\n`);
  files.set('manifest.json', `${JSON.stringify({ version, stacks: [...stacks.keys()], files: [...files.keys()].sort() }, null, 2)}\n`);
  return files;
}
