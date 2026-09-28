import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const CHECKER = fileURLToPath(new URL('../../../standard/skills/dev-standard-docs/check-docs.py', import.meta.url));

async function repo(files) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'check-docs-'));
  for (const [rel, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, rel)), { recursive: true });
    await writeFile(path.join(root, rel), content);
  }
  return root;
}

async function check(root, args = []) {
  try {
    const { stdout } = await promisify(execFile)('python3', [CHECKER, `--root=${root}`, ...args]);
    return { code: 0, out: stdout };
  } catch (error) {
    return { code: error.code, out: error.stdout || error.stderr };
  }
}

const BASE = {
  'src/Service/Foo.php': '<?php',
  'docs/storage.md': '# Storage\n\n## 2. Duomenų modelis\n\n## Notes\n\n## Notes\n',
};

test('clean docs pass', async () => {
  const root = await repo({
    ...BASE,
    'README.md': 'See [storage](docs/storage.md#2-duomenų-modelis), [again](docs/storage.md#notes-1), [site](https://x.test/a.md), [mail](mailto:a@b.c).\n',
    'AGENTS.md': 'Code in `src/Service/Foo.php`, `src/Service/Foo.php::handle` and `src/Service/`. Run `composer cs-fix -- path/to/File.php`.\nNew integrations go in `src/Service/<Integration>/`; deps in `vendor/acme/lib`.\n',
    'docs/README.md': '[Top](#index)\n\n# Index\n\n```md\n[dead](nowhere.md) `src/Nope.php`\n```\n',
  });
  const result = await check(root);
  assert.equal(result.code, 0, result.out);
  assert.match(result.out, /docs ok \(4 files\)/);
});

test('reports dead links, dead anchors, missing paths and line numbers with file and line', async () => {
  const root = await repo({
    ...BASE,
    'README.md': 'Intro\n[a](docs/missing.md)\n[b](docs/storage.md#no-such-heading)\n[c](src/Service/Foo.php#L10)\n`src/Service/Bar.php`\n`src/Service/Foo.php:12`\n',
  });
  const result = await check(root);
  assert.equal(result.code, 1);
  assert.deepEqual(result.out.trim().split('\n'), [
    'README.md:2: broken link docs/missing.md',
    'README.md:3: no heading for #no-such-heading in docs/storage.md',
    'README.md:4: links to a line number (src/Service/Foo.php#L10); reference the path and symbol instead',
    'README.md:5: missing path src/Service/Bar.php',
    'README.md:6: refers to a line number (src/Service/Foo.php:12); reference the path and symbol instead',
  ]);
});

test('explicit paths replace the defaults; a missing one is an error', async () => {
  const root = await repo({ ...BASE, 'README.md': '[x](nope.md)\n', 'notes/a.md': 'fine\n' });
  assert.equal((await check(root, ['notes'])).code, 0);
  const missing = await check(root, ['nope']);
  assert.equal(missing.code, 1);
  assert.match(missing.out, /nope: not found/);
});

test('a missing path that git ignores (a local key, a build output) is not reported', async () => {
  const root = await repo({
    ...BASE,
    '.gitignore': '/src/keys/\n',
    'README.md': 'Keys are generated in `src/keys/private.pem`.\n',
  });
  await promisify(execFile)('git', ['init', '-q', root]);
  const result = await check(root);
  assert.equal(result.code, 0, result.out);
});
