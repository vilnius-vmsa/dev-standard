#!/usr/bin/env node
// Copies the docs of earlier releases out of their git tags so the site lists them in its version dropdown.
// The copies are build inputs, not sources: they are gitignored and replaced on every run.
//
//   versions:snapshot                      docs/ is unreleased (CI, local): lists every line the next deploy could
//   versions:snapshot -- --current=v1.3.5  docs/ is that release (deploy)
//   versions:snapshot -- --clean           remove the copies; the site builds docs/ only
import { execFile } from 'node:child_process';
import { access, cp, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, promisify } from 'node:util';
import { loadFreshModule } from '@docusaurus/utils';
import { parseReleaseTag, selectVersions, versionName } from './lib/select.mjs';
import { SITE_VERSIONS_FILE } from './lib/site-versions.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const VERSIONED_DOCS_DIR = path.join(ROOT, 'versioned_docs');
const VERSIONED_SIDEBARS_DIR = path.join(ROOT, 'versioned_sidebars');
const VERSIONS_FILE = path.join(ROOT, 'versions.json');

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

let options;
try {
  ({ values: options } = parseArgs({ options: { current: { type: 'string' }, clean: { type: 'boolean' } }, strict: true }));
} catch (error) {
  fail(error.message);
}

const execFileAsync = promisify(execFile);
const git = (gitArgs) => execFileAsync('git', gitArgs, { cwd: ROOT });

await Promise.all(
  [VERSIONED_DOCS_DIR, VERSIONED_SIDEBARS_DIR, VERSIONS_FILE, SITE_VERSIONS_FILE].map((p) => rm(p, { recursive: true, force: true })),
);
if (options.clean) {
  console.log('✓ removed earlier versions; the site builds docs/ only');
  process.exit(0);
}

const tags = (await git(['tag', '--list', 'v*'])).stdout.split('\n');
if (!tags.some(parseReleaseTag)) {
  fail('No vX.Y.Z release tags found. Fetch tags (actions/checkout needs fetch-depth: 0).');
}

let versions;
try {
  versions = selectVersions(tags, { current: options.current ?? null });
} catch (error) {
  fail(error.message);
}

// Docusaurus reads versioned sidebars only as JSON, so each tag's sidebars.js is evaluated here. It is loaded from
// the tag's whole tree with Docusaurus's own loader, so anything that built at that tag (ESM, CommonJS, imports) loads.
async function loadSidebars(tag, treeDir) {
  const sidebarsPath = path.join(treeDir, 'sidebars.js');
  try {
    await access(sidebarsPath);
  } catch {
    throw new Error(`${tag} has no sidebars.js, so its sidebar cannot be built.`);
  }
  try {
    return await loadFreshModule(sidebarsPath);
  } catch (error) {
    throw new Error(`Could not load sidebars.js of ${tag}: ${error.cause?.message ?? error.message}`);
  }
}

async function snapshot(version) {
  const workDir = await mkdtemp(path.join(os.tmpdir(), `dev-standard-${version.tag}-`));
  const archivePath = path.join(workDir, 'tree.tar');
  const treeDir = path.join(workDir, 'tree');
  try {
    // git writes the archive to a file, so no output buffer limits how large a release's tree can be.
    await git(['archive', `--output=${archivePath}`, version.tag]);
    await mkdir(treeDir);
    await execFileAsync('tar', ['-x', '-f', archivePath, '-C', treeDir]);
    // Package imports in the tag's files resolve against this checkout's dependencies.
    await symlink(path.join(ROOT, 'node_modules'), path.join(treeDir, 'node_modules'), 'junction');
    await cp(path.join(treeDir, 'docs'), path.join(VERSIONED_DOCS_DIR, `version-${version.name}`), { recursive: true });
    const sidebars = await loadSidebars(version.tag, treeDir);
    await writeFile(path.join(VERSIONED_SIDEBARS_DIR, `version-${version.name}-sidebars.json`), `${JSON.stringify(sidebars, null, 2)}\n`);
  } finally {
    // Removes the node_modules link, not the dependencies it points to.
    await rm(workDir, { recursive: true, force: true });
  }
}

await mkdir(VERSIONED_SIDEBARS_DIR, { recursive: true });
for (const version of versions) {
  try {
    await snapshot(version);
  } catch (error) {
    fail(error.message);
  }
}

if (versions.length) await writeFile(VERSIONS_FILE, `${JSON.stringify(versions.map((v) => v.name), null, 2)}\n`);
await mkdir(path.dirname(SITE_VERSIONS_FILE), { recursive: true });
const siteVersions = {
  current: options.current === undefined ? null : versionName(options.current),
  versions: versions.map(({ name, line }) => ({ name, line })),
};
await writeFile(SITE_VERSIONS_FILE, `${JSON.stringify(siteVersions, null, 2)}\n`);

const added = versions.map((v) => `${v.name} (/${v.line})`).join(', ') || 'none';
console.log(`✓ current version ${siteVersions.current ?? 'unreleased'}; earlier versions: ${added}`);
