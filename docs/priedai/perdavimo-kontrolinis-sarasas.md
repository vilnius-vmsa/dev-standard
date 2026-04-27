# C priedas. Perdavimo kontrolinis sąrašas (Handover Checklist)

> **Paskirtis:** formalus kontrolinis sąrašas, naudojamas priimant tiekėjo ar pavaldžios įstaigos atliktus darbus pagal [§12 Tiekėjų reikalavimai](../12-tiekeju-reikalavimai.md).
> **Naudojimas:** kopijuoti į darbų priėmimo dokumentą arba issue/PR ir pildyti per priėmimą.

---

## C.1. Source Code

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 1.1 | Pilnas source code perduotas (frontend, backend, IaC, integracijos) | [§12.3.1](../12-tiekeju-reikalavimai.md#1231-programinį-kodą) | ☐ |
| 1.2 | Git repozitorija su visa istorija (ne tik archyvas) | [§12.3.1](../12-tiekeju-reikalavimai.md#1231-programinį-kodą) | ☐ |
| 1.3 | CI/CD konfigūracijos ir build scenarijai perduoti | [§12.3.1](../12-tiekeju-reikalavimai.md#1231-programinį-kodą) | ☐ |
| 1.4 | Testų kodas ir testavimo ataskaitos perduoti | [§12.3.1](../12-tiekeju-reikalavimai.md#1231-programinį-kodą) | ☐ |
| 1.5 | Nėra hardcoded secrets; build procesas veikia | [§12.3.1](../12-tiekeju-reikalavimai.md#1231-programinį-kodą) | ☐ |
| 1.6 | Lock failai repozitorijoje, nėra `latest` priklausomybių | [§5.3](../05-versijavimas.md#53-bibliotekų-ir-paketų-valdymas) | ☐ |

## C.2. Documentation

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 2.1 | Architektūros aprašas | [§10.2.1](../10-dokumentacija.md#1021-architektūros-aprašas) | ☐ |
| 2.2 | API dokumentacija (OpenAPI / SDL) | [§10.2.2](../10-dokumentacija.md#1022-api-dokumentacija) | ☐ |
| 2.3 | Diegimo ir eksploatacijos instrukcijos | [§10.2.3](../10-dokumentacija.md#1023-diegimo-ir-eksploatacijos-instrukcijos) | ☐ |
| 2.4 | Naudotojo dokumentacija (jei taikoma) | [§10.2.4](../10-dokumentacija.md#1024-naudotojo-dokumentacija) | ☐ |
| 2.5 | Runbook'ai (restart, rollback, incident response) | [§9.8](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija) | ☐ |
| 2.6 | README su paleidimo instrukcija | [§3.8.4](../03-architektura.md#384-onboarding-dokumentacija) | ☐ |
| 2.7 | ADR reikšmingiems sprendimams | [§10.4](../10-dokumentacija.md#104-architecture-decision-records-adr) | ☐ |

## C.3. Access & Administration

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 3.1 | Repozitorijų prieigos perduotos savivaldybei | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |
| 3.2 | CI/CD sistemų prieigos / konfigūracijos perduotos | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |
| 3.3 | Cloud / infrastruktūros konfigūracijos (IaC) perduotos | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |
| 3.4 | Administracinės prieigos perduotos | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |
| 3.5 | Secrets rotacijos planas perduotas | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |
| 3.6 | Tiekėjas nėra vienintelis prieigų turėtojas | [§12.3.3](../12-tiekeju-reikalavimai.md#1233-prieigas-ir-administravimą) | ☐ |

## C.4. Security

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 4.1 | Nėra žinomų critical / high pažeidžiamųmų be sprendimo plano | [§12.2](../12-tiekeju-reikalavimai.md#122-minimalūs-techniniai-reikalavimai) | ☐ |
| 4.2 | SAST ir dependency scan vykdomas CI | [§8.6](../08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) | ☐ |
| 4.3 | Secret scanning įjungtas repozitorijoje | [§4.3.6](../04-kodo-kurimo-gaires.md#436-repozitorijos-higiena) | ☐ |
| 4.4 | TLS ≥ 1.2 + HSTS viešiems endpointams | [§6.5](../06-saugumas.md#65-saugumas-naršyklėje) | ☐ |
| 4.5 | Naudojamos tik palaikomos, ne EOL technologijos | [§12.2](../12-tiekeju-reikalavimai.md#122-minimalūs-techniniai-reikalavimai) | ☐ |

## C.5. Operations & Observability

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 5.1 | Struktūruoti logai siunčiami į centralizuotą platformą | [§9.1](../09-stebesena-logai.md#91-logging-žurnalų-standartai) | ☐ |
| 5.2 | Health / readiness / liveness endpointai sukonfigūruoti | [§3.6](../03-architektura.md#36-patikimumas-ir-atsparumas) | ☐ |
| 5.3 | Pagrindinės metrikos eksportuojamos | [§9.2](../09-stebesena-logai.md#92-monitoring-ir-metrikos) | ☐ |
| 5.4 | Alerting taisyklės sukonfigūruotos kritiniams scenarijams | [§9.3](../09-stebesena-logai.md#93-alerting-principai) | ☐ |
| 5.5 | SLO tier priskirtas ir stebimas | [§9.5.1](../09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers) | ☐ |
| 5.6 | Rollback mechanizmas dokumentuotas ir patikrintas | [§8.3](../08-devops-ci-cd.md#83-cd-continuous-delivery-deployment) | ☐ |

## C.6. Maturity & Compliance

| # | Tikrinimo punktas | Standarto nuoroda | ✅ |
|---|---|---|---|
| 6.1 | Tikslinis brandos lygis nustatytas | [§2.6](../02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) | ☐ |
| 6.2 | Brandos lygio kriterijai patenkinti | [§2.6](../02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) | ☐ |
| 6.3 | Nukrypimai dokumentuoti ir patvirtinti | [§12.6](../12-tiekeju-reikalavimai.md#126-nukrypimai-ir-išimtys) | ☐ |
| 6.4 | Licencijos atitinka organizacijos politiką | [§5.4](../05-versijavimas.md#54-leidžiamos-ir-draudžiamos-priklausomybės) | ☐ |
| 6.5 | Kodo ir sprendimo nuosavybė aiški | [§12.4](../12-tiekeju-reikalavimai.md#124-kodo-ir-sprendimo-nuosavybė) | ☐ |

---

## C.7. Priėmimo sprendimas

| Laukas | Reikšmė |
|---|---|
| **Sistema** | ___________________ |
| **Tiekėjas** | ___________________ |
| **Tikslinis brandos lygis** | ☐ 1 (Bazinis) ☐ 2 (Standartinis) ☐ 3 (Pavyzdinis) |
| **Pasiektas brandos lygis** | ☐ 1 ☐ 2 ☐ 3 |
| **Neišspręsti punktai** | ___________________ |
| **Sprendimas** | ☐ Priimta ☐ Priimta su sąlygomis ☐ Atmesta |
| **Data** | ___________________ |
| **Pasirašė** | ___________________ |

> Susiję skyriai: [12.7 Darbų priėmimas](../12-tiekeju-reikalavimai.md#127-darbų-priėmimas) · [2.6 Brandos lygiai](../02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) · [9.5.1 SLO tiers](../09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers)
