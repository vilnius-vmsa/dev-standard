/** Keeps the previous English (or leaves it empty) so a person can update it; the entry is still marked machine-draft. */
export function stubTranslator() {
  return async (items) => Object.fromEntries(items.map((item) => [item.id, item.previousEn ?? '']));
}
