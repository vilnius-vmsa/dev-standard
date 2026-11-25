// The version list `npm run versions:snapshot` writes for docusaurus.config.js and build-pdf.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SITE_VERSIONS_FILE = fileURLToPath(new URL('../../../src/data/versions.generated.json', import.meta.url));

/**
 * `current` is the release docs/ is built as (null when unreleased); `versions` are the earlier versions copied
 * from tags, each with its minor line. Returns null when no snapshot was taken: the site then builds docs/ only.
 * Synchronous because Docusaurus evaluates docusaurus.config.js synchronously.
 * @returns {{current: string | null, versions: {name: string, line: string}[]} | null}
 */
export function readSiteVersions() {
  return existsSync(SITE_VERSIONS_FILE) ? JSON.parse(readFileSync(SITE_VERSIONS_FILE, 'utf8')) : null;
}
