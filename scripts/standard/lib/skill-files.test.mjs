import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractSkillFiles, mergeSkillFiles } from './skill-files.mjs';

test('extracts the fenced block after a skill-file marker', () => {
  const md = '# D\n\n<!-- skill-file: dev-standard-docs/templates/adr.md -->\n\n```markdown\n# ADR-NNNN: [Title]\n\n## Context\n```\n\nAfter.\n';
  assert.deepEqual(extractSkillFiles(md, 'priedai/d.md'), {
    files: [{ skill: 'dev-standard-docs', path: 'templates/adr.md', content: '# ADR-NNNN: [Title]\n\n## Context\n' }],
    errors: [],
  });
});

test('a four-backtick fence keeps inner code blocks in the content', () => {
  const md = '<!-- skill-file: s/templates/r.md -->\n````markdown\n# Runbook\n\n```bash\nkubectl get pods\n```\n\nEnd.\n````\n';
  assert.equal(extractSkillFiles(md, 'f.md').files[0].content, '# Runbook\n\n```bash\nkubectl get pods\n```\n\nEnd.\n');
});

test('reports a marker without a fence, an unclosed fence and a path outside templates/', () => {
  assert.deepEqual(extractSkillFiles('<!-- skill-file: s/templates/a.md -->\n\nText.\n', 'x.md').errors, [
    'x.md:1: skill-file marker is not followed by a fenced code block',
  ]);
  assert.deepEqual(extractSkillFiles('<!-- skill-file: s/templates/a.md -->\n```md\nno end\n', 'x.md').errors, [
    'x.md:1: skill-file block is not closed',
  ]);
  assert.deepEqual(extractSkillFiles('<!-- skill-file: s/SKILL.md -->\n```md\nx\n```\n', 'x.md').errors, [
    'x.md:1: skill-file path must be <skill>/templates/<file>, got s/SKILL.md',
  ]);
});

test('mergeSkillFiles adds extracted files to their skill and rejects unknown skills and collisions', () => {
  const skills = new Map([['dev-standard-docs', new Map([['SKILL.md', 's'], ['templates/glossary.md', 'g']])]]);
  const errors = mergeSkillFiles(skills, [
    { skill: 'dev-standard-docs', path: 'templates/adr.md', content: 'adr', source: 'priedai/d.md' },
    { skill: 'dev-standard-docs', path: 'templates/glossary.md', content: 'x', source: 'priedai/g.md' },
    { skill: 'dev-standard-nope', path: 'templates/a.md', content: 'x', source: 'priedai/n.md' },
  ]);
  assert.equal(skills.get('dev-standard-docs').get('templates/adr.md'), 'adr');
  assert.equal(skills.get('dev-standard-docs').get('templates/glossary.md'), 'g');
  assert.deepEqual(errors, [
    'priedai/g.md: dev-standard-docs/templates/glossary.md already exists in standard/skills',
    'priedai/n.md: no skill dev-standard-nope in standard/skills',
  ]);
});
