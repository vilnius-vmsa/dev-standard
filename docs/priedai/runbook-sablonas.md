# F priedas. Runbook šablonas (Operational Runbook Template)

> **Paskirtis:** standartizuotas runbook formatas pagal [§9.8 Eksploatacijos dokumentacija](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija).
> **Naudojimas:** kopijuoti šabloną į projekto `docs/runbooks/` katalogą ir pildyti kiekvienam eksploataciniam scenarijui.

---

## Šablono struktūra

```markdown
# Runbook: [Scenarijaus pavadinimas]

**Service:** [Paslaugos / sistemos pavadinimas]
**Last updated:** YYYY-MM-DD
**Owner:** [Komanda / atsakingas asmuo]
**SLO Tier:** [1 | 2 | 3] (pagal §9.5.1)
**Severity:** [P1 Critical | P2 High | P3 Medium | P4 Low]

---

## Overview

[Trumpas scenarijaus aprašymas — kada šis runbook naudojamas.]

## Prerequisites

- Prieiga prie: [cluster, dashboard, secrets manager, ...]
- Reikalingi įrankiai: [kubectl, terraform, ssh, ...]
- Reikalingos rolės / teisės: [admin, operator, ...]

## Detection

- **Alert name:** [Alerting taisyklės pavadinimas]
- **Dashboard:** [Nuoroda į monitoring dashboard]
- **Symptoms:** [Kaip problema pasireiškia — error rate, latency spike, health check fail, ...]

## Steps

### 1. Diagnozė / Diagnosis

[Žingsniai, kaip patikrinti ir patvirtinti problemą.]

```bash
# Pavyzdys: patikrinti pod būseną
kubectl get pods -n <namespace> -l app=<service>
kubectl logs -n <namespace> <pod-name> --tail=100
```

### 2. Sprendimas / Resolution

[Konkretūs veiksmai problemai išspręsti.]

```bash
# Pavyzdys: restart deployment
kubectl rollout restart deployment/<service> -n <namespace>
```

### 3. Rollback (jei taikoma)

[Grįžimo į ankstesnę versiją žingsniai.]

```bash
# Pavyzdys: rollback prie ankstesnės versijos
kubectl rollout undo deployment/<service> -n <namespace>
```

### 4. Verifikacija / Verification

[Kaip patikrinti, kad problema išspręsta.]

- [ ] Health endpoint grąžina 200
- [ ] Error rate grįžo į normalų lygį
- [ ] Alertas resolved

## Escalation

| Lygis | Kas | Kontaktas | Kada eskalatuoti |
|---|---|---|---|
| L1 | On-call inžinierius | [kontaktas] | Pirmas reagavimas |
| L2 | Komandos tech lead | [kontaktas] | Jei neišspręsta per 30 min |
| L3 | Architektūros atstovas | [kontaktas] | Jei paveiktas SLO |

## Post-Incident

- [ ] Incident report sukurtas
- [ ] Root cause identifikuotas
- [ ] Prevenciniai veiksmai suplanuoti
- [ ] Runbook atnaujintas (jei reikia)

## Related

- Architecture: [nuoroda į architektūros aprašą]
- Deployment: [nuoroda į diegimo instrukciją]
- Alerts: [nuoroda į alerting konfigūraciją]
- Other runbooks: [nuorodos į susijusius runbooks]
```

---

## Minimalūs runbook scenarijai (pagal §9.8)

Kiekvienai sistemai turi būti parengti runbook'ai bent šiems scenarijams:

| # | Scenarijus | Failo pavadinimas (pavyzdys) |
|---|---|---|
| 1 | Paslaugos perkrovimas (restart) | `01-service-restart.md` |
| 2 | Rollback / grįžimas į ankstesnę versiją | `02-rollback.md` |
| 3 | Reagavimas į incidentą (general incident response) | `03-incident-response.md` |
| 4 | Pagrindinių priklausomybių sutrikimai (DB, cache, queue) | `04-dependency-failure.md` |

---

## Patarimai

- **Testuokite runbook'us** — paleidimo žingsniai turi veikti realiai, ne tik teoriškai.
- **Laikykite šalia kodo** — `docs/runbooks/` repozitorijoje, versijuojama kartu su sistema.
- **Atnaujinkite po kiekvieno incidento** — post-mortem metu patikrinkite, ar runbook padėjo ir ką galima pagerinti.
- **Venkite prose** — runbook turi būti step-by-step, ne esė. Esant stresui, žmogus skaito tik žingsnius.

> Susiję skyriai: [9.8 Eksploatacijos dokumentacija](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [9.6 Incidentų valdymas](../09-stebesena-logai.md#96-incidentų-valdymas) · [8.3 CD](../08-devops-ci-cd.md#83-cd-continuous-delivery-deployment) · [9.5.1 SLO tiers](../09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers)
