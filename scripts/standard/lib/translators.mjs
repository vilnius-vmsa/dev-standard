/** Leaves text empty so a person (or an agent working in the repo) can fill it in. */
export function stubTranslator() {
  return async (items) => Object.fromEntries(items.map((item) => [item.id, '']));
}
