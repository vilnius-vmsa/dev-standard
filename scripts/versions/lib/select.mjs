// A release tag: v and three numbers without leading zeros. RELEASE_TAG_PATTERN in ci.create-tag.yml is the same.
const RELEASE_TAG = /^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

// Releases before 1.3 contain broken anchors, so they fail the site's onBrokenAnchors check (docusaurus.config.js).
export const EARLIEST_PUBLISHED = 'v1.3.0';
// Earlier minor lines the dropdown keeps; each one adds a full copy of the docs to every build.
export const MAX_EARLIER_LINES = 3;

export function parseReleaseTag(tag) {
  const match = RELEASE_TAG.exec(tag);
  if (!match) return null;
  const [major, minor, patch] = match.slice(1).map(Number);
  return { tag, major, minor, patch };
}

/** The docs version name of a release tag: v1.3.5 is version 1.3.5. */
export const versionName = (tag) => tag.slice(1);

const compare = (a, b) => a.major - b.major || a.minor - b.minor || a.patch - b.patch;
const compareLines = (a, b) => a.major - b.major || a.minor - b.minor;

function parseRequired(tag, role) {
  const release = parseReleaseTag(tag);
  if (!release) throw new Error(`${role} must be a vX.Y.Z release tag, got "${tag}".`);
  return release;
}

/**
 * Earlier versions listed in the site's version dropdown: the latest patch of each minor line from `earliest` on,
 * newest first. `name` is the docs version name and `line` its minor line (`major.minor`), which is also its URL
 * segment and stays the same when a new patch of that line is released.
 *
 * With `current` (a deploy), docs/ is that release: lines from its own on are left out and `maxLines` are kept.
 * Without it, docs/ is unreleased and becomes either a patch of the latest line or a new line, so the latest
 * released line is listed too and one more line is kept: every line either deploy would list.
 */
export function selectVersions(tags, { current = null, earliest = EARLIEST_PUBLISHED, maxLines = MAX_EARLIER_LINES } = {}) {
  const currentRelease = current === null ? null : parseRequired(current, 'Current version');
  const earliestRelease = parseRequired(earliest, 'Earliest published version');

  const latestByLine = new Map();
  for (const release of tags.map(parseReleaseTag).filter(Boolean)) {
    if (compareLines(release, earliestRelease) < 0) continue;
    if (currentRelease && compareLines(release, currentRelease) >= 0) continue;
    const line = `${release.major}.${release.minor}`;
    if (!latestByLine.has(line) || compare(release, latestByLine.get(line)) > 0) latestByLine.set(line, release);
  }

  return [...latestByLine.entries()]
    .sort(([, a], [, b]) => compare(b, a))
    .slice(0, currentRelease ? maxLines : maxLines + 1)
    .map(([line, release]) => ({ tag: release.tag, name: versionName(release.tag), line }));
}
