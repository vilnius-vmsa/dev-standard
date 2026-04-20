# Greitas startas (Quick Start)

Šis puslapis padės greitai rasti reikiamą standarto dalį pagal jūsų rolę arba situaciją.

## Pagal rolę

### Programuotojas (Developer)

Kasdieniam darbui:

1. [4.1 – Bendrieji kodo rašymo principai](04-kodo-kurimo-gaires.md#41-bendrieji-kodo-rašymo-principai)
2. [4.2 – Kodo struktūra ir konvencijos](04-kodo-kurimo-gaires.md#42-kodo-struktūra-ir-konvencijos)
3. [4.3 – Versijų valdymas ir repozitorijos](04-kodo-kurimo-gaires.md#43-versijų-valdymas-ir-repozitorijos)
4. [4.4 – Code Review principai](04-kodo-kurimo-gaires.md#44-code-review-principai)
5. [4.5 – Testai](04-kodo-kurimo-gaires.md#45-testai)
6. [4.6 – Saugumas kodo lygmeniu](04-kodo-kurimo-gaires.md#46-saugumas-kodo-lygmeniu)

Prieš projektavimą / naują funkcionalumą:

- [3 – Architektūros principai](03-architektura.md) (ypač 3.1–3.4)
- [6 – Saugumas](06-saugumas.md)
- [5 – Versijavimas](05-versijavimas.md)

### DevOps / Infrastruktūros inžinierius

1. [8 – DevOps ir CI/CD reikalavimai](08-devops-ci-cd.md)
2. [9 – Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)
3. [3.5 – Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos)
4. [3.6 – Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas)
5. [6.4 – Secrets management](06-saugumas.md#64-secrets-management)

### Product Owner / Analitikas

1. [2 – Standarto paskirtis ir taikymo sritis](02-paskirtis-ir-taikymo-sritis.md)
2. [11 – Darbo organizavimas ir rolės](11-darbo-organizavimas.md)
3. [10 – Dokumentacija](10-dokumentacija.md)
4. [7.10 – Priėmimas (UAT)](07-testavimas.md#710-priėmimas-uat-ir-nefunkciniai-kriterijai)

### Išorinis tiekėjas

1. **Pradėkite čia:** [12 – Tiekėjų reikalavimai](12-tiekeju-reikalavimai.md)
2. [2 – Standarto taikymo sritis](02-paskirtis-ir-taikymo-sritis.md)
3. Peržiūrėkite skyrius 3–10 pagal jūsų sistemos pobūdį.

## Pagal situaciją

| Situacija | Kur skaityti |
|---|---|
| Kuriu naują API endpoint | [3.3](03-architektura.md#33-backend-ir-api-principai), [6.2](06-saugumas.md#62-autentifikacija-ir-autorizacija) |
| Rašau PR / MR | [4.3.5](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai), [4.4](04-kodo-kurimo-gaires.md#44-code-review-principai), [4.5](04-kodo-kurimo-gaires.md#45-testai) |
| Konfigūruoju CI/CD pipeline | [8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai), [8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) |
| Pridedu naują priklausomybę | [5.3](05-versijavimas.md#53-bibliotekų-ir-paketų-valdymas), [5.4](05-versijavimas.md#54-leidžiamos-ir-draudžiamos-priklausomybės) |
| Projektuoju integraciją | [3.4](03-architektura.md#34-duomenys-ir-integracijos), [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) |
| Tvarkau incidentą | [9.6](09-stebesena-logai.md#96-incidentų-valdymas), [9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling) |
| Priimu tiekėjo darbą | [12.7](12-tiekeju-reikalavimai.md#127-darbų-priėmimas), [12.3](12-tiekeju-reikalavimai.md#123-privalomi-perdavimo-artefaktai) |
| Priimu architektūrinį sprendimą | [3.1.5](03-architektura.md#315-architecture-decision-records-adr), [10.4](10-dokumentacija.md#104-architecture-decision-records-adr) |
| Ruošiu leidimą (release) | [8.9](08-devops-ci-cd.md#89-leidimų-release-valdymas), [8.4](08-devops-ci-cd.md#84-versijavimas-ir-žymėjimas-release-artefaktams) |
| Nukrypstu nuo standarto | [2.5](02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto) |

## Reikalavimų lygiai

Standarte naudojami du lygiai:

- **PRIVALOMA** – būtinas reikalavimas. Nesilaikymas = neatitiktis standartui.
- **REKOMENDUOJAMA** – geroji praktika. Nukrypimai galimi, bet turi būti pagrįsti.

Detaliau: [2.4 – Reikalavimų lygiai](02-paskirtis-ir-taikymo-sritis.md#24-reikalavimų-lygiai)
