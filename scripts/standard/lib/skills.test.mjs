import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSkill, loadSkills } from './skills.mjs';

const KNOWN = {
  ruleIds: new Set(['DOC-GEN-P03']), sections: new Set(['10.5']),
  pages: new Map([['/priedai/m', new Set(['g1-principai'])]]), siteUrl: 'https://x.test/ds',
};
const skill = (md, extra = {}) => new Map([['SKILL.md', md], ...Object.entries(extra)]);
const FRONT = '---\nname: dev-standard-docs\ndescription: Use when writing docs.\n---\n\n';

test('loadSkills reads every file of every skill folder', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'skills-'));
  await mkdir(path.join(dir, 'b-skill/templates'), { recursive: true });
  await mkdir(path.join(dir, 'a-skill'), { recursive: true });
  await writeFile(path.join(dir, 'b-skill/SKILL.md'), 'b');
  await writeFile(path.join(dir, 'b-skill/templates/t.md'), 't');
  await writeFile(path.join(dir, 'a-skill/SKILL.md'), 'a');
  const skills = await loadSkills(dir);
  assert.deepEqual([...skills.keys()], ['a-skill', 'b-skill']);
  assert.deepEqual([...skills.get('b-skill')], [['SKILL.md', 'b'], ['templates/t.md', 't']]);
});

test('a valid skill has no problems; template links are for the consuming repository', () => {
  const md = `${FRONT}Follow DOC-GEN-P03 (10.5). See [the template](templates/t.md) and https://x.test/ds/priedai/m#g1-principai.\n`;
  const files = skill(md, { 'templates/t.md': '# T\n\n[Architecture](architecture.md)\n' });
  assert.deepEqual(checkSkill('dev-standard-docs', files, KNOWN), []);
});

test('checkSkill reports frontmatter, links, rule IDs, sections and site links', () => {
  const md = '---\nname: other\n---\n\nSee [x](templates/missing.md), DOC-GEN-P99 (10.9) and https://x.test/ds/priedai/m#nope.\n';
  assert.deepEqual(checkSkill('dev-standard-docs', skill(md), KNOWN), [
    'dev-standard-docs/SKILL.md: frontmatter name is "other", expected "dev-standard-docs"',
    'dev-standard-docs/SKILL.md: frontmatter has no description',
    'dev-standard-docs/SKILL.md: broken link templates/missing.md',
    'dev-standard-docs/SKILL.md: cites unknown rule ID DOC-GEN-P99',
    'dev-standard-docs/SKILL.md: cites unknown section 10.9',
    'dev-standard-docs/SKILL.md: links to missing anchor /priedai/m#nope',
  ]);
  assert.deepEqual(checkSkill('dev-standard-x', new Map(), KNOWN), ['dev-standard-x: has no SKILL.md']);
});

test('a skill name must start with dev-standard so sync can remove it when dropped', () => {
  const md = '---\nname: team-tools\ndescription: Tools.\n---\n';
  assert.deepEqual(checkSkill('team-tools', skill(md), KNOWN), ['team-tools: skill name must be dev-standard or dev-standard-<lower-case-words>']);
});

test('the core skill may be called dev-standard', () => {
  const md = '---\nname: dev-standard\ndescription: Rules.\n---\n';
  assert.deepEqual(checkSkill('dev-standard', skill(md), KNOWN), []);
});

test('the dev-standard skill hands documentation work to dev-standard-docs and links its review method', async () => {
  const skills = await loadSkills(fileURLToPath(new URL('../../../standard/skills/', import.meta.url)));
  const core = skills.get('dev-standard');
  assert.ok(core.get('SKILL.md').includes('run the `dev-standard-docs` skill in update mode'));
  assert.ok(core.get('SKILL.md').includes('[review-method.md](review-method.md)'));
  assert.ok(core.get('review-method.md').startsWith('## How to review'));
});
