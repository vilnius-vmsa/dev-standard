# AGENTS.md — <repository>

How to work in this repository: commands, conventions, verification and gotchas.

- **Setup** (environment, first run): [README.md](README.md).
- **Architecture, data flow, integrations:** [docs/architecture.md](docs/architecture.md).
- **Everything else** (glossary, subsystem docs, ADRs, API spec): [docs/README.md](docs/README.md).

This file links to those docs and keeps its own content to how to work here.

## Day-to-day commands

| Task | Command |
|---|---|
| Start the app | `<command>` |
| Run tests | `<command>` |
| Static analysis | `<command>` |
| Regenerate the API spec | `<command>` → `docs/openapi.json` |

## Code conventions

<!-- Conventions linters do not enforce: where new code goes, naming, patterns to follow. One line each. -->

- <convention>

### Documentation rules

- Read [docs/glossary.md](docs/glossary.md) before naming a new entity, field, endpoint or message.
- When you change an area listed in the coverage table of [docs/README.md](docs/README.md), update its doc in the same pull request.
- Record a non-obvious decision, or a deliberate deferral, as an ADR in `docs/adr/`.
- Reference code in docs by path and symbol name.
- After changing the API, regenerate the spec and commit it.

## Verification

Before you report a task as done:

1. `<test command>`
2. `<static analysis command>`
3. `python3 .agents/skills/dev-standard-docs/check-docs.py` — fails on dead links, dead anchors and missing paths in the docs.

## Gotchas

<!-- Things that are not obvious and have already cost someone time. Each: symptom, cause, fix. -->

- <gotcha>

<!-- Paste the "Vilnius dev standard" section from the dev standard sync pull request below. Keep everything in this file outside any block a tool generates (for example Laravel Boost's <laravel-boost-guidelines>). -->
