---
slug: /
---
# Greitas startas (Quick Start)

Šis puslapis padės greitai rasti reikiamą standarto dalį pagal jūsų rolę arba situaciją.

## Pagal rolę

### Programuotojas (Developer)

Kasdieniam darbui:

- [4.1 – Bendrieji kodo rašymo principai](04-kodo-kurimo-gaires.md#41-bendrieji-kodo-rašymo-principai)
- [4.2 – Kodo struktūra ir konvencijos](04-kodo-kurimo-gaires.md#42-kodo-struktūra-ir-konvencijos)
- [4.3 – Versijų valdymas ir repozitorijos](04-kodo-kurimo-gaires.md#43-versijų-valdymas-ir-repozitorijos)
- [4.4 – Code Review principai](04-kodo-kurimo-gaires.md#44-code-review-principai)
- [4.5 – Testai](04-kodo-kurimo-gaires.md#45-testai)
- [4.6 – Saugumas kodo lygmeniu](04-kodo-kurimo-gaires.md#46-saugumas-kodo-lygmeniu)

Prieš projektavimą / naują funkcionalumą:

- [3 – Architektūros principai](03-architektura.md) (ypač 3.1–3.4)
- [6 – Saugumas](06-saugumas.md)
- [5 – Versijavimas](05-versijavimas.md)

### DevOps / Infrastruktūros inžinierius

- [8 – DevOps ir CI/CD reikalavimai](08-devops-ci-cd.md)
- [9 – Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)
- [3.5 – Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos)
- [3.6 – Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas)
- [6.4 – Secrets management](06-saugumas.md#64-secrets-management)

### Product Owner / Analitikas

- [2 – Standarto paskirtis ir taikymo sritis](02-paskirtis-ir-taikymo-sritis.md)
- [11 – Darbo organizavimas ir rolės](11-darbo-organizavimas.md)
- [10 – Dokumentacija](10-dokumentacija.md)
- [7.10 – Priėmimas (UAT)](07-testavimas.md#710-priėmimas-uat-ir-nefunkciniai-kriterijai)

### Išorinis tiekėjas

- **Pradėkite čia:** [12 – Tiekėjų reikalavimai](12-tiekeju-reikalavimai.md)
- [2 – Standarto taikymo sritis](02-paskirtis-ir-taikymo-sritis.md)
- [2.6 – Brandos lygiai](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) (minimalus priimtinas lygis)
- Peržiūrėkite skyrius 3–10 pagal jūsų sistemos pobūdį.

### QA / Testuotojas

- [7 – Testavimo reikalavimai ir principai](07-testavimas.md)
- [7.4.1 – Numatytieji aprėpties slenksčiai](07-testavimas.md#741-numatytieji-aprėpties-slenksčiai)
- [7.5 – Testavimo duomenys ir aplinkos](07-testavimas.md#75-testavimo-duomenys-ir-aplinkos)
- [7.12 – Duomenų apsauga (BDAR/GDPR) testuose](07-testavimas.md#712-duomenų-apsauga-bdar-gdpr-testuose)
- [7.9 – Testų vykdymas CI/CD ir ataskaitos](07-testavimas.md#79-testų-vykdymas-ci-cd-ir-ataskaitos)
- [7.10 – Priėmimas (UAT)](07-testavimas.md#710-priėmimas-uat-ir-nefunkciniai-kriterijai)

## Pagal situaciją

| Situacija | Kur skaityti |
|---|---|
| Kuriu naują API endpoint | [3.3 Backend ir API principai](03-architektura.md#33-backend-ir-api-principai), [6.2 Autentifikacija ir autorizacija](06-saugumas.md#62-autentifikacija-ir-autorizacija) |
| Rašau PR / MR | [4.3.5 PR reikalavimai](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai), [4.4 CR principai](04-kodo-kurimo-gaires.md#44-code-review-principai), [4.5](04-kodo-kurimo-gaires.md#45-testai) |
| Konfigūruoju CI/CD pipeline | [8.2 CI minimalūs reikalavimai](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai), [8.6 DevSecOps CI/CD kontrolė](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) |
| Pridedu naują priklausomybę | [5.3 Bibliotekų ir paketų valdymas](05-versijavimas.md#53-bibliotekų-ir-paketų-valdymas), [5.4 Leidžiamos ir draudžiamos priklausomybės](05-versijavimas.md#54-leidžiamos-ir-draudžiamos-priklausomybės) |
| Projektuoju integraciją | [3.4 Duomenys ir integracijos](03-architektura.md#34-duomenys-ir-integracijos), [6.3 Duomenų apsauga (GDPR kontekstas)](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) |
| Tvarkau incidentą | [9.6 Incidentų valdymas](09-stebesena-logai.md#96-incidentų-valdymas), [9.4 Klaidos ir error handling](09-stebesena-logai.md#94-klaidos-ir-error-handling) |
| Priimu tiekėjo darbą | [12.7 Darbų priėmimas](12-tiekeju-reikalavimai.md#127-darbų-priėmimas), [12.3 Privalomi perdavimo artefaktai](12-tiekeju-reikalavimai.md#123-privalomi-perdavimo-artefaktai) |
| Priimu architektūrinį sprendimą | [3.1.5 Architecture Decision Records (ADR)](03-architektura.md#315-architecture-decision-records-adr), [10.4 Architecture Decision Records (ADR)](10-dokumentacija.md#104-architecture-decision-records-adr) |
| Ruošiu leidimą (release) | [8.9 Leidimų (release) valdymas](08-devops-ci-cd.md#89-leidimų-release-valdymas), [8.4 Versijavimas ir žymėjimas (release artefaktams)](08-devops-ci-cd.md#84-versijavimas-ir-žymėjimas-release-artefaktams) |
| Nukrypstu nuo standarto | [2.5 Nukrypimai nuo standarto](02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto) |
| Pradedu naują projektą | [Naujo projekto kontrolinis sąrašas](#naujo-projekto-kontrolinis-sąrašas) (žemiau), [2.6 Brandos lygiai](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) |
| Renkuosi technologiją | [3.10.3 Technologijų suderinimas](03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack), [A priedas — Technologijų registras](priedai/technologiju-registras.md) |
| Tvarkau asmens duomenis | [6.3 Duomenų apsauga](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas), [3.4.5 BDAR](03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr), [B priedas — BDAR šablonai](priedai/bdar-igyvendinimo-sabalonai.md) |
| Naudoju AI įrankius kodavimui | [4.8 DI priemonių naudojimas](04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants) |

## Reikalavimų lygiai

Standarte naudojami du lygiai:

- **PRIVALOMA** – būtinas reikalavimas. Nesilaikymas = neatitiktis standartui.
- **REKOMENDUOJAMA** – geroji praktika. Nukrypimai galimi, bet turi būti pagrįsti.

Detaliau: [2.4 – Reikalavimų lygiai](02-paskirtis-ir-taikymo-sritis.md#24-reikalavimų-lygiai)

---

## Naujo projekto kontrolinis sąrašas

Ką patikrinti prieš pradedant naują projektą arba perimant esamą sistemą:

- [ ] Priskirtas tikslinis **brandos lygis** ([2.6](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai))
- [ ] Priskirtas **SLO tier** ([9.5.1](09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers))
- [ ] Pasirinktos technologijos suderintos su **technologijų registru** ([A priedas](priedai/technologiju-registras.md))
- [ ] Repozitorija sukurta savivaldybės kontroliuojamoje GIT platformoje ([4.3.1](04-kodo-kurimo-gaires.md#431-versijų-kontrolė-ir-repozitorijų-valdymas))
- [ ] README su paleidimo instrukcija ([3.8.4](03-architektura.md#384-onboarding-dokumentacija))
- [ ] CI pipeline su build + lint + test + SAST ([8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai))
- [ ] Slaptieji raktai ne kode, naudojama centralizuota saugykla ([6.4](06-saugumas.md#64-secrets-management))
- [ ] API dokumentuota OpenAPI arba SDL specifikacija ([3.3.1](03-architektura.md#331-specifikacija-ir-dokumentacija))
- [ ] Linting / formatavimo taisyklės nustatytos ([4.2.3](04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting))
- [ ] Struktūruoti logai siunčiami į centralizuotą platformą ([9.1](09-stebesena-logai.md#91-logging-žurnalų-standartai))
- [ ] Jei tvarkomi asmens duomenys — peržiūrėtas [B priedas (BDAR šablonai)](priedai/bdar-igyvendinimo-sabalonai.md)

## Teminiai trumpiniai (Cheat Sheets)

### Klaidų apdorojimas (Error Handling)

| Taisyklė | Nuoroda |
|---|---|
| Backend: struktūruotas klaidos atsakymas (`type`, `title`, `status`, `detail`) — RFC 7807 | [3.3.8](03-architektura.md#338-standartizuotos-klaidos) |
| Frontend: Global Error Boundary + fallback UI | [3.2.7](03-architektura.md#327-klaidų-apdorojimas-ir-ux-atsparumas) |
| Loguoti kontekstą, ne tik stacktrace; jokių asmens duomenų | [9.1](09-stebesena-logai.md#91-logging-žurnalų-standartai) |
| Klaidų klasifikacija: `retriable`, `user_error`, `system_error`, `external_dependency` | [9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling) |
| Saugumas: klaidų pranešimai neturi atskleisti vidinės sistemos informacijos | [6.1](06-saugumas.md#61-bendrieji-saugumo-principai) |

### Saugumas — greitas patikrinimas

| Ką tikrinti | Nuoroda |
|---|---|
| Validacija **serverio pusėje** (ne tik kliente) | [6.6](06-saugumas.md#66-owasp-top-10) |
| CSP nonce-based arba strict-dynamic | [6.5](06-saugumas.md#65-saugumas-naršyklėje) |
| Slapukai: `HttpOnly`, `Secure`, `SameSite` | [6.5](06-saugumas.md#65-saugumas-naršyklėje) |
| CORS: jokio `*` wildcard autentifikuotoms API | [6.5](06-saugumas.md#65-saugumas-naršyklėje) |
| Slaptieji raktai ne kode, rotacija kas 90 d. | [6.4](06-saugumas.md#64-secrets-management) |
| SAST + dependency scan CI pipeline | [8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) |
| TLS ≥ 1.2 + HSTS visuose viešuose endpointuose | [6.5](06-saugumas.md#65-saugumas-naršyklėje) |

### API dizainas — greitas patikrinimas

| Ką tikrinti | Nuoroda |
|---|---|
| OpenAPI / GraphQL SDL specifikacija prieš kodą | [3.3.1](03-architektura.md#331-specifikacija-ir-dokumentacija) |
| REST: daiktavardžiai, kebab-case, daugiskaita | [3.3.3](03-architektura.md#333-resursų-modeliavimas-ir-url-dizainas) |
| Versijavimas URI arba antraštėje | [5.2](05-versijavimas.md#52-api-versijavimas) |
| Puslapiavimas: maksimalus page size serverio pusėje | [3.3.11](03-architektura.md#3311-puslapiavimas) |
| Autentifikacija: Bearer token arba session cookie | [6.2](06-saugumas.md#62-autentifikacija-ir-autorizacija) |
| Rate limiting viešiems endpointams | [3.3.4](03-architektura.md#334-apsauga-ir-prieiga) |
| Klaidos: RFC 7807 `application/problem+json` | [3.3.8](03-architektura.md#338-klaidų-apdorojimas-api-lygmeniu) |
