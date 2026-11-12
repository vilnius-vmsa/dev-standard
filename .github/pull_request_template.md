<!--
AI agents: write the PR body in the shape below and leave out the bilingual sections that follow this comment. People filling in the template by hand can skip this comment.
Summary uses the `show-me` method of explaining a change with visuals. If the `pr` skill is installed, follow it for the visuals and keep the Verify, impact and task lines below, which the standard requires (CODE-VCS-P21 to P23, DOC-UPD-P04).
Keep prose to a sentence or two beside each visual, in the domain words from the repository's `GLOSSARY.md` when it has one.

## Summary

One sentence on why the change is needed. Then the smallest visual that makes the change clear, usually one or two:
- a `diff` of a call tree, component tree, file tree or pseudocode, when the surrounding shape already exists
- a Mermaid sequence diagram or flowchart, for data or control flow between parts
- a whole code block, when most of it is new
Keep only the calls, files, states and boundaries a reviewer needs to judge the change.

## Evidence

**Before:** and **After:** with a screenshot for a visual change, otherwise the test or command output that fails before and passes after.
**Verify:** the commands or clicks a reviewer runs to see it work.

## Merge Danger

**Door:** two-way when a revert undoes the change. One-way when it doesn't, as with data migrations, deleted data and published API contracts.
**Blast radius:** one word, then what breaks if the change is wrong.
**Breaking changes, migrations, config and env, dependencies, infrastructure, docs:** one line each, "none" or what changes.

Closes #<issue> (or the task tracker ID)
-->

## Aprašymas / Description

<!-- Trumpai aprašykite, kas keičiama ir kodėl. -->

## Pakeitimo tipas / Change type

- [ ] `feat` — naujas funkcionalumas
- [ ] `fix` — klaidos taisymas
- [ ] `refactor` — refaktoringas (nekeičia elgesio)
- [ ] `docs` — dokumentacijos pakeitimas
- [ ] `ci` — CI/CD konfigūracijos pakeitimas
- [ ] `test` — testų pridėjimas / keitimas
- [ ] `chore` — kitas techninis pakeitimas

## Susijusi užduotis / Related task

<!-- Nuoroda į užduočių valdymo sistemą (pvz., PROJ-123). -->

Closes #

## Poveikio vertinimas / Impact assessment

- [ ] Turi **breaking changes**
- [ ] Reikia **duomenų migracijos**
- [ ] Keičia **API kontraktą**
- [ ] Turi **infrastruktūrinį poveikį** (konfigūracija, aplinkos kintamieji, IaC)
- [ ] Paveikia **saugumą** (autentifikacija, autorizacija, duomenų apsauga)

## Kaip patikrinti / How to verify

<!-- Trumpai aprašykite, kaip reviewer gali patikrinti pakeitimo teisingumą. -->

1. ...
2. ...

## Kontrolinis sąrašas / Checklist

- [ ] Kodas atitinka projekto konvencijas ([4.2](docs/04-kodo-kurimo-gaires.md#42-kodo-struktūra-ir-konvencijos))
- [ ] Testai pridėti / atnaujinti ([4.5](docs/04-kodo-kurimo-gaires.md#45-testai))
- [ ] Dokumentacija atnaujinta (jei reikia) ([10.5](docs/10-dokumentacija.md#105-dokumentacijos-atnaujinimo-taisyklės))
- [ ] CI patikrinimai praeina
- [ ] Jei naudotas AI — output peržiūrėtas ir patikrintas ([4.8](docs/04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants))

## Ekrano nuotraukos / Screenshots

<!-- Jei taikoma — prieš ir po. Ištrinkite sekciją, jei nereikia. -->
