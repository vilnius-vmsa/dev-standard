# D priedas. ADR šablonas (Architecture Decision Record Template)

> **Paskirtis:** vieningas ADR formatas pagal [10.4](../10-dokumentacija.md#104-architecture-decision-records-adr) ir [3.1.5](../03-architektura.md#315-architecture-decision-records-adr).
> **Formatas:** [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) klasikinis stilius.
> **Naudojimas:** kopijuoti šabloną į projekto `docs/adr/` katalogą ir pildyti pagal sprendimą.

---

## Šablono struktūra

```markdown
# ADR-NNNN: [Sprendimo pavadinimas]

**Data:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX
**Autoriai:** [Vardas Pavardė, rolė]

## Context

[Aprašykite situaciją, problemą ar galimybę, kuri paskatino šį sprendimą.
Kokios jėgos (forces) veikia? Kokie apribojimai? Kokie verslo ar techniniai poreikiai?]

## Decision

[Aiškiai suformuluokite sprendimą. Pradėkite nuo "We will..." arba "Nuspręsta...".
Būkite konkretūs — ne "naudosime cache", o "naudosime Redis 7.x kaip distribuotą cache L2 lygmeniu".]

## Consequences

### Positive
- [Teigiama pasekmė 1]
- [Teigiama pasekmė 2]

### Negative
- [Neigiama pasekmė / trade-off 1]
- [Neigiama pasekmė / trade-off 2]

### Risks
- [Rizika, jei ji identifikuota, ir planuojama mitigacija]

## Alternatives Considered

| Alternatyva | Priežastis, kodėl atmesta |
|---|---|
| [Alternatyva A] | [Trumpas pagrindimas] |
| [Alternatyva B] | [Trumpas pagrindimas] |

## Related

- PR/MR: [#NNN](link)
- Task: [PROJ-NNN](link)
- Supersedes: ADR-XXXX (jei taikoma)
- Susiję ADR: ADR-YYYY (jei taikoma)
```

---

## Naudojimo gairės

1. **Kada rašyti ADR?**
   - Pasirenkama ar keičiama esminė technologija, framework ar platforma.
   - Pasirenkamas architektūros stilius (monolitas, mikroservisai, BFF ir pan.).
   - Keičiamas integracijos modelis, duomenų srauto kryptis ar autentifikacijos schema.
   - Priimamas reikšmingas kompromisas tarp NFR (pvz., našumas vs. paprastumas).
   - Nukrypstama nuo standarto (susieti su [2.5](../02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto) nukrypimo dokumentavimu).

2. **Kur saugoti?**
   - `docs/adr/` kataloge projekto repozitorijoje.
   - Failų pavadinimų formatas: `NNNN-trumpas-pavadinimas.md` (pvz., `0001-redis-distributed-cache.md`).

3. **Numeracija:** nuosekli nuo `0001`, neperrašant senų ADR.

4. **Pakeitimas:** jei sprendimas keičiasi — kurkite naują ADR su nuoroda `Supersedes: ADR-NNNN` ir pakeiskite senojo statusą į `Superseded by ADR-XXXX`.

---

## Pavyzdys

```markdown
# ADR-0003: PostgreSQL kaip pagrindinė RDBMS

**Data:** 2026-03-15
**Status:** Accepted
**Autoriai:** Jonas Jonaitis, tech lead

## Context

Reikia pasirinkti pagrindinę reliacinę duomenų bazę naujai kuriamam
piliečių aptarnavimo portalui. Sistema turės ~50k aktyvių naudotojų,
reikės pilno teksto paieškos ir GIS duomenų palaikymo. Organizacijos
technologijų registre patvirtintas PostgreSQL ≥ 15.x.

## Decision

Nuspręsta naudoti PostgreSQL 16 su PostGIS plėtiniu GIS duomenims
ir tsvector / tsquery pilno teksto paieškai lietuvių kalbai.

## Consequences

### Positive
- Atitinka organizacijos tech stack (A priedas)
- PostGIS + tsvector eliminuoja papildomų search/GIS paslaugų poreikį
- Stipri bendruomenė, ilgalaikis LTS palaikymas

### Negative
- Pilno teksto paieškos kokybė lietuvių kalbai ribota be papildomo
  leksikos konfigūravimo
- Didelės apimties GIS užklausos gali reikalauti specializuotų indeksų

### Risks
- Jei pilno teksto poreikiai augs, gali tekti integruoti Elasticsearch
  (rizika žema, mitigacija: stebėti paieškos latency SLI)

## Alternatives Considered

| Alternatyva | Priežastis, kodėl atmesta |
|---|---|
| MySQL 8 | Silpnesnis GIS palaikymas, nėra tech registre |
| PostgreSQL + Elasticsearch | Per didelis sudėtingumas pradiniam etapui |

## Related

- PR/MR: #42
- Task: PORTAL-156
```

> Susiję skyriai: [10.4 Architecture Decision Records (ADR)](../10-dokumentacija.md#104-architecture-decision-records-adr) · [3.1.5 Architecture Decision Records (ADR)](../03-architektura.md#315-architecture-decision-records-adr) · [2.5 Nukrypimai nuo standarto](../02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto)
