import { toPlainText } from './markdown.mjs';

export function buildSiteData({ rules, english }) {
  return rules
    .filter((r) => r.check === 'ai-reviewable')
    .map((r) => ({
      id: r.id,
      anchorId: r.id.toLowerCase(),
      level: r.level === 'P' ? 'MUST' : 'SHOULD',
      stacks: r.stacks,
      en: english[r.id]?.text?.trim() || null,
      draft: english[r.id]?.status === 'machine-draft',
      lt: toPlainText(r.textLt.replace(/^[*-]\s+/gm, '')),
      route: r.route,
      anchor: r.anchor,
      heading: r.heading,
    }));
}
