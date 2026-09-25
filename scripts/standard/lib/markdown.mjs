import GithubSlugger from 'github-slugger';

const CUSTOM_ID = /\s*\{#([^}]+)\}\s*$/;

/** Inline Markdown to plain prose: drops links, code ticks, bold and backslash escapes. */
export function toPlainText(markdown) {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\\([\\`*_{}[\]()#+\-.!|<>~])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripCustomId(headingText) {
  return headingText.replace(CUSTOM_ID, '');
}

/** Same ids Docusaurus gives headings: explicit {#id}, else github-slugger with per-page de-duplication. */
export function createHeadingSlugger() {
  const slugger = new GithubSlugger();
  return (headingText) => {
    const custom = headingText.match(CUSTOM_ID);
    return custom ? custom[1] : slugger.slug(toPlainText(headingText));
  };
}
