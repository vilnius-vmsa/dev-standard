---
name: dev-standard
description: Vilnius City Municipality software development standard. Use when writing, changing or reviewing code in this repository, when asked to check changes against the dev standard, or when asked whether something complies with it.
---

<!-- Installed by the dev-standard sync from vilnius-vmsa/dev-standard. The next sync overwrites edits here. To change a rule, propose a change to the standard: https://github.com/vilnius-vmsa/dev-standard -->

# Vilnius dev standard

The rules live in `.github/instructions/`:

- `dev-standard-<stack>.instructions.md`: the standard's rules for each stack listed in `.dev-standard/config.json`, plus the stacks those build on (a file that builds on another says so near its top). The `applyTo` header of each file says which paths it covers.
- `dev-standard-local.instructions.md` (if present): this repository's own extra rules. They can only be stricter than the standard.

Read those files from disk. Never state a rule from memory.

## When writing or changing code

1. List the files you will touch. Read `dev-standard-all.instructions.md` and every rules file whose `applyTo` matches one of them.
2. Follow every MUST rule. If you cannot, stop and tell the user which rule ID blocks you and why.
3. Before you report the task as done, check your own changes against the same rules and fix every MUST violation.
4. If the change alters behaviour, commands, configuration or an API that the repository's documentation describes, run the `dev-standard-docs` skill in update mode before you report the task as done.

## When asked to review

1. Get the diff against the base branch (`git diff origin/main...HEAD` unless the user names another base).
2. Review it as described in [review-method.md](review-method.md).
