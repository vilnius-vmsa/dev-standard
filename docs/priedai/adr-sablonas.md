# D priedas. ADR šablonas (Architecture Decision Record Template)

> **Paskirtis:** vieningas ADR formatas pagal [10.4](../10-dokumentacija.md#104-architecture-decision-records-adr) ir [3.1.5](../03-architektura.md#315-architecture-decision-records-adr).
> **Formatas:** [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) klasikinis stilius.
> **Naudojimas:** kopijuoti šabloną į projekto `docs/adr/` katalogą ir pildyti pagal sprendimą. Šablonas pateikiamas angliškai, kaip rekomenduojama repozitorijos dokumentacijai ([G.2](dokumentacijos-rengimo-metodika.md#g2-repozitorijos-dokumentacijos-struktūra)); jei projekto dokumentacija rašoma lietuviškai (DOC-GEN-P05), antraštes ir laukus galima išversti.

---

## Šablono struktūra

<!-- skill-file: dev-standard-docs/templates/adr.md -->
```markdown
# ADR-NNNN: [Decision title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-XXXX

## Context

[Describe the situation, problem or opportunity that led to this decision.
What forces are at play? What constraints apply? What business or technical needs drive it?]

## Decision

[State the decision clearly. Start with "We will...".
Be specific: not "we will use a cache", but "we will use Redis 7.x as a distributed L2 cache".]

## Consequences

### Positive
- [Positive consequence 1]
- [Positive consequence 2]

### Negative
- [Negative consequence / trade-off 1]
- [Negative consequence / trade-off 2]

### Risks
- [Risk, if identified, and the planned mitigation]

## Alternatives Considered

| Alternative | Why it was rejected |
|---|---|
| [Alternative A] | [Short justification] |
| [Alternative B] | [Short justification] |

## Related

- PR/MR: [#NNN](link)
- Task: [PROJ-NNN](link)
- Supersedes: ADR-XXXX (if any)
- Related ADRs: ADR-YYYY (if any)
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
# ADR-0003: PostgreSQL as the primary RDBMS

**Date:** 2026-03-15
**Status:** Accepted

## Context

We need to choose the primary relational database for a new citizen
service portal. The system will have ~50k active users and needs
full-text search and GIS data support. The organization's technology
register approves PostgreSQL ≥ 15.x.

## Decision

We will use PostgreSQL 16 with the PostGIS extension for GIS data
and tsvector / tsquery for Lithuanian full-text search.

## Consequences

### Positive
- Matches the organization's tech stack (appendix A)
- PostGIS and tsvector remove the need for separate search and GIS services
- Strong community, long-term LTS support

### Negative
- Full-text search quality for Lithuanian is limited without extra
  lexicon configuration
- Large GIS queries may need specialised indexes

### Risks
- If full-text needs grow, we may have to add Elasticsearch
  (low risk; mitigation: monitor the search latency SLI)

## Alternatives Considered

| Alternative | Why it was rejected |
|---|---|
| MySQL 8 | Weaker GIS support, not in the technology register |
| PostgreSQL + Elasticsearch | Too complex for the initial phase |

## Related

- PR/MR: #42
- Task: PORTAL-156
```

> Susiję skyriai: [10.4 Architecture Decision Records (ADR)](../10-dokumentacija.md#104-architecture-decision-records-adr) · [3.1.5 Architecture Decision Records (ADR)](../03-architektura.md#315-architecture-decision-records-adr) · [2.5 Nukrypimai nuo standarto](../02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto)
