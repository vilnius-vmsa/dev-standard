import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseReleaseTag, selectVersions, versionName } from './select.mjs';

const TAGS = [
  'v1.0-alpha', 'v1.1.0', 'v1.1.2', 'v1.1.10', 'v1.1.11', 'v1.1.9',
  'v1.2.1', 'v1.2.7', 'v1.2.10', 'v1.2.3.4', 'v1.3.0', 'v1.3.5', 'v1.3.6',
  'v1.4.0-rc1', 'v1.5.2', 'v2.0.0', 'v2.0.0-rc1', 'latest',
];
// Every line, no cap: the tests below set only the option they are about.
const ALL = { earliest: 'v0.0.0', maxLines: Infinity };
const names = (versions) => versions.map((v) => v.name);

test('parseReleaseTag accepts only vX.Y.Z tags', () => {
  assert.deepEqual(parseReleaseTag('v1.2.10'), { tag: 'v1.2.10', major: 1, minor: 2, patch: 10 });
  for (const tag of ['v1.0-alpha', '1.2.3', 'v1.2', 'v01.2.3', 'v1.2.3-rc1', 'v1.2.3.4', 'latest']) {
    assert.equal(parseReleaseTag(tag), null, tag);
  }
});

test('versionName drops the v of a release tag', () => {
  assert.equal(versionName('v1.2.10'), '1.2.10');
});

test('deploy: the latest patch of each older minor line, newest first', () => {
  assert.deepEqual(selectVersions(TAGS, { ...ALL, current: 'v1.3.5' }), [
    { tag: 'v1.2.10', name: '1.2.10', line: '1.2' },
    { tag: 'v1.1.11', name: '1.1.11', line: '1.1' },
  ]);
});

test('deploy: leaves out the current minor line and anything released after it', () => {
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, current: 'v2.0.0' })), ['1.5.2', '1.3.6', '1.2.10', '1.1.11']);
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, current: 'v1.2.7' })), ['1.1.11']);
  assert.deepEqual(selectVersions(TAGS, { ...ALL, current: 'v1.1.4' }), []);
});

test('deploy: keeps at most maxLines lines', () => {
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, current: 'v2.0.0', maxLines: 2 })), ['1.5.2', '1.3.6']);
});

test('lines before earliest are never listed', () => {
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, current: 'v2.0.0', earliest: 'v1.3.0' })), ['1.5.2', '1.3.6']);
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, earliest: 'v1.3.0' })), ['2.0.0', '1.5.2', '1.3.6']);
});

test('unreleased docs/: lists the latest released line too, and one line more than a deploy', () => {
  assert.deepEqual(names(selectVersions(TAGS, ALL)), ['2.0.0', '1.5.2', '1.3.6', '1.2.10', '1.1.11']);
  assert.deepEqual(names(selectVersions(TAGS, { ...ALL, maxLines: 2 })), ['2.0.0', '1.5.2', '1.3.6']);
});

test('the defaults publish from 1.3 on, at most three earlier lines', () => {
  assert.deepEqual(names(selectVersions(TAGS, { current: 'v2.1.0' })), ['2.0.0', '1.5.2', '1.3.6']);
  assert.deepEqual(names(selectVersions(TAGS, { current: 'v1.4.0' })), ['1.3.6']);
});

test('rejects a current version that is not a release tag', () => {
  assert.throws(() => selectVersions(TAGS, { current: 'main' }), /vX\.Y\.Z/);
  assert.throws(() => selectVersions(TAGS, { current: 'v1.4.0-rc1' }), /vX\.Y\.Z/);
});
