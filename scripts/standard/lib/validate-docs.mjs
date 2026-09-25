import { CHECK_TYPES, ID_PATTERN } from './rules.mjs';

const KNOWN_ATTRS = ['stacks', 'enforced-by'];
const ENFORCED_BY = /^(ai|tool:[a-z0-9][a-z0-9-]*)$/;

export function validateRules(rules, stacks) {
  const errors = [];
  const firstSeen = new Map();

  for (const r of rules) {
    const at = `${r.file}:${r.line}`;
    if (firstSeen.has(r.id)) errors.push(`${at}: duplicate rule ID ${r.id} (first at ${firstSeen.get(r.id)})`);
    else firstSeen.set(r.id, at);

    if (!ID_PATTERN.test(r.id)) errors.push(`${at}: malformed rule ID "${r.id}"`);
    if (!CHECK_TYPES.includes(r.check)) errors.push(`${at}: ${r.id} has unknown check type "${r.check}"`);
    for (const key of Object.keys(r.attrs)) {
      if (!KNOWN_ATTRS.includes(key)) errors.push(`${at}: ${r.id} has unknown attribute "${key}"`);
    }

    if (r.check === 'ai-reviewable') {
      if (r.stacks.length === 0) errors.push(`${at}: ${r.id} is ai-reviewable but has no stacks=`);
      for (const stack of r.stacks) {
        if (!stacks.has(stack)) errors.push(`${at}: ${r.id} uses unknown stack "${stack}"`);
      }
      if (!r.enforcedBy) errors.push(`${at}: ${r.id} is ai-reviewable but has no enforced-by=`);
      else if (!ENFORCED_BY.test(r.enforcedBy)) {
        errors.push(`${at}: ${r.id} has invalid enforced-by "${r.enforcedBy}" (expected ai or tool:<name>)`);
      }
    } else if (r.stacks.length > 0 || r.enforcedBy) {
      errors.push(`${at}: ${r.id} is ${r.check}; stacks= and enforced-by= are only allowed on ai-reviewable rules`);
    }
  }

  return errors;
}
