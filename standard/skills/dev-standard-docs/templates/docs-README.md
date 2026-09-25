# Documentation index

Start with [AGENTS.md](../AGENTS.md) for how to work here and [README.md](../README.md) for setup.

| Doc | Read it when |
|---|---|
| [architecture.md](architecture.md) | You need the big picture: components, data flow, integrations. |
| [glossary.md](glossary.md) | You meet a domain term or are about to name something. |
| [<subsystem>.md](<subsystem>.md) | You touch <what the subsystem covers>. |
| [adr/](adr/) | You wonder why something is the way it is, or are about to change it. |

## Coverage

| Area | Doc | Source paths | Status |
|---|---|---|---|
| <Subsystem> | [<subsystem>.md](<subsystem>.md) | `src/<Subsystem>/`, `config/<file>` | Documented |
| <Area without a doc> | — | `src/<Area>/` | **Not yet** — <why, or what is planned> |
| <Known quirk> | [<subsystem>.md](<subsystem>.md) | `src/<file>` | **Known quirk, unfixed** — <one line> |

Source paths list the folders and files each doc describes; agents use them to find the docs a code change affects.
Add a row when you defer something; remove it when the work lands.

## Maintaining these docs

- Change an area → update its doc in the same pull request.
- Run `python3 .agents/skills/dev-standard-docs/check-docs.py` before pushing.
- Reference code by path and symbol name.
- Record decisions as ADRs in `adr/`.
