# F priedas. Runbook šablonas (Operational Runbook Template)

> **Paskirtis:** standartizuotas runbook formatas pagal [9.8 Eksploatacijos dokumentacija](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija).
> **Naudojimas:** kopijuoti šabloną į projekto `docs/runbooks/` katalogą ir pildyti kiekvienam eksploataciniam scenarijui. Šablonas pateikiamas angliškai, kaip rekomenduojama repozitorijos dokumentacijai ([G.2](dokumentacijos-rengimo-metodika.md#g2-repozitorijos-dokumentacijos-struktūra)); jei projekto dokumentacija rašoma lietuviškai (DOC-GEN-P05), antraštes ir laukus galima išversti.

---

## Šablono struktūra

<!-- skill-file: dev-standard-docs/templates/runbook.md -->
````markdown
# Runbook: [Scenario name]

**Service:** [Service / system name]
**Last updated:** YYYY-MM-DD
**Owner:** [Team / responsible person]
**SLO Tier:** [1 | 2 | 3] (see 9.5.1)
**Severity:** [P1 Critical | P2 High | P3 Medium | P4 Low]

---

## Overview

[Short description of the scenario: when this runbook is used.]

## Prerequisites

- Access to: [cluster, dashboard, secrets manager, ...]
- Tools: [kubectl, terraform, ssh, ...]
- Roles / permissions: [admin, operator, ...]

## Detection

- **Alert name:** [Alerting rule name]
- **Dashboard:** [Link to the monitoring dashboard]
- **Symptoms:** [How the problem shows: error rate, latency spike, failing health check, ...]

## Steps

### 1. Diagnosis

[Steps to check and confirm the problem.]

```bash
# Example: check pod status
kubectl get pods -n <namespace> -l app=<service>
kubectl logs -n <namespace> <pod-name> --tail=100
```

### 2. Resolution

[Concrete actions that resolve the problem.]

```bash
# Example: restart the deployment
kubectl rollout restart deployment/<service> -n <namespace>
```

### 3. Rollback (if applicable)

[Steps to return to the previous version.]

```bash
# Example: roll back to the previous version
kubectl rollout undo deployment/<service> -n <namespace>
```

### 4. Verification

[How to check that the problem is resolved.]

- [ ] Health endpoint returns 200
- [ ] Error rate is back to normal
- [ ] Alert resolved

## Escalation

| Level | Who | Contact | When to escalate |
|---|---|---|---|
| L1 | On-call engineer | [contact] | First response |
| L2 | Team tech lead | [contact] | Not resolved within 30 min |
| L3 | Architecture representative | [contact] | SLO affected |

## Post-Incident

- [ ] Incident report created
- [ ] Root cause identified
- [ ] Preventive actions planned
- [ ] Runbook updated (if needed)

## Related

- Architecture: [link to the architecture description]
- Deployment: [link to the deployment instructions]
- Alerts: [link to the alerting configuration]
- Other runbooks: [links to related runbooks]
````

---

## Minimalūs runbook scenarijai (pagal 9.8)

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
