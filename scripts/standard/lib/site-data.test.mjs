import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSiteData } from './site-data.mjs';

const rules = [
  { id: 'CODE-VCS-R04', level: 'R', check: 'ai-reviewable', stacks: ['all'], textLt: 'Srautas:\n*   feature/\\* → dev', route: '/kodo-kurimo-gaires', anchor: '43-vcs', heading: '4.3. VCS' },
  { id: 'CODE-SEC-P01', level: 'P', check: 'ai-reviewable', stacks: ['all'], textLt: 'Nėra **slaptažodžių**.', route: '/', anchor: 'x', heading: 'X' },
  { id: 'ORG-X-P01', level: 'P', check: 'process-level', stacks: [], textLt: 'x', route: '/', anchor: 'x', heading: 'X' },
];

test('lists ai-reviewable rules with plain Lithuanian text and English when present', () => {
  const data = buildSiteData({ rules, english: { 'CODE-SEC-P01': { text: 'No secrets.', source_hash: 'h', status: 'machine-draft' } } });
  assert.deepEqual(data.map((d) => d.id), ['CODE-VCS-R04', 'CODE-SEC-P01']);
  assert.deepEqual(data[0], {
    id: 'CODE-VCS-R04', anchorId: 'code-vcs-r04', level: 'SHOULD', stacks: ['all'], en: null, draft: false,
    lt: 'Srautas: feature/* → dev', route: '/kodo-kurimo-gaires', anchor: '43-vcs', heading: '4.3. VCS',
  });
  assert.equal(data[1].en, 'No secrets.');
  assert.equal(data[1].draft, true);
  assert.equal(data[1].lt, 'Nėra slaptažodžių.');
});
