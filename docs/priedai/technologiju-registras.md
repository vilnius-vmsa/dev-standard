# A priedas. Organizacijos technologijų registras

> **Statusas:** gyvas dokumentas — atnaujinamas pagal [13 Standarto priežiūra](../13-standarto-prieziura.md).
> **Paskutinis peržiūrėjimas:** 2025-04-29

Šis registras apibrėžia organizacijos lygiu patvirtintas technologijas, karkasus ir įrankius. Jis yra privalomas atskaitos taškas pagal [4.2.3](../04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) ir [3.10.3](../03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack).

## A.1. Technologijų statusai

| Statusas | Reikšmė |
|---|---|
| **✅ Patvirtinta** | Galima naudoti naujuose projektuose be papildomo derinimo |
| **🔍 Vertinama** | Pilotinis naudojimas leidžiamas; reikia architektūros atstovo pritarimo |
| **⚠️ Palaikoma** | Egzistuojančiuose projektuose naudojama, bet naujiems nerekomenduojama |
| **🚫 Draudžiama** | Nenaudoti — saugumo, licencinės ar palaikomumo priežastys |

## A.2. Frontend

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| React | ≥ 18.x | ✅ Patvirtinta | Pagrindinė SPA/SSR biblioteka |
| Next.js | ≥ 14.x | ✅ Patvirtinta | SSR/SSG karkasas; rekomenduojamas viešosioms sistemoms |
| TypeScript | ≥ 5.x | ✅ Patvirtinta | Privalomas visuose naujuose frontend projektuose |
| Vue.js | ≥ 3.x | ✅ Patvirtinta | Alternatyvi SPA biblioteka |
| Nuxt | ≥ 3.x | ✅ Patvirtinta | Vue SSR/SSG karkasas |
| Tailwind CSS | ≥ 3.x | ✅ Patvirtinta | Utility-first stilių sistema |
| TanStack Query | ≥ 5.x | ✅ Patvirtinta | Server state kešavimas (React, Vue) |
| ESLint | ≥ 9.x | ✅ Patvirtinta | Linting |
| Prettier | ≥ 3.x | ✅ Patvirtinta | Formatavimas |
| Storybook | ≥ 8.x | ✅ Patvirtinta | Komponentų dokumentacija ir testavimas |
| Angular | ≥ 17.x | ⚠️ Palaikoma | Esamiems projektams; naujiems — tik su ADR pagrindimu |
| jQuery | bet kuri | 🚫 Draudžiama | Nenaudoti naujuose projektuose; esamuose — migracijos planas |

## A.3. Backend

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| PHP | ≥ 8.3 | ✅ Patvirtinta | |
| Laravel | ≥ 11.x | ✅ Patvirtinta | PHP karkasas; rekomenduojamas CRUD ir vidaus sistemoms |
| Symfony | ≥ 7.x | ✅ Patvirtinta | PHP karkasas; sudėtingesnėms domenų sistemoms |
| Java (Spring Boot) | ≥ 3.x (Java ≥ 21) | ✅ Patvirtinta | Enterprise ir integracinėms sistemoms |
| .NET | ≥ 8.0 | ✅ Patvirtinta | |
| Node.js (runtime) | ≥ 20.x LTS | ✅ Patvirtinta | Backend servisams, BFF, API gateway |
| NestJS | ≥ 10.x | ✅ Patvirtinta | Node.js karkasas API servisams |
| Python | ≥ 3.12 | 🔍 Vertinama | Duomenų apdorojimui, ML, automatizacijai; ne web API |
| PHP | < 8.2 | 🚫 Draudžiama | EOL versijos |
| Java | < 17 | 🚫 Draudžiama | EOL versijos |
| .NET Framework | < 4.8 | 🚫 Draudžiama | Migravimas į .NET 8+ |

## A.4. Duomenų bazės ir duomenų saugojimas

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| PostgreSQL | ≥ 15.x | ✅ Patvirtinta | Pagrindinė RDBMS; numatytoji naujuose projektuose |
| Redis | ≥ 7.x | ✅ Patvirtinta | Kešavimas, sesijos, eilės |
| MariaDB | ≥ 11.x | ⚠️ Palaikoma | Esamiems projektams; naujiems rekomenduojama PostgreSQL |
| Elasticsearch / OpenSearch | ≥ 8.x / ≥ 2.x | ✅ Patvirtinta | Logų analizė, sudėtingos agregacijos |
| Meilisearch | ≥ 1.x | ✅ Patvirtinta | Aplikacijų full-text paieška (portalai, registrai, dokumentai) |
| MinIO | — | ✅ Patvirtinta | S3-suderinamas objektų saugojimas (on-prem) |
| MongoDB | bet kuri | 🔍 Vertinama | Tik su ADR; aiškiai pagrįstam use case |
| SQLite | bet kuri | ⚠️ Palaikoma | Tik testams, prototipams ir embedded scenarijams |

## A.5. DevOps, CI/CD ir infrastruktūra

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| Docker | ≥ 24.x | ✅ Patvirtinta | Konteinerizacija |
| Kubernetes | ≥ 1.28 | ✅ Patvirtinta | Orkestravimas |
| Helm | ≥ 3.x | ✅ Patvirtinta | K8s paketų valdymas |
| Terraform | ≥ 1.6 | ✅ Patvirtinta | IaC |
| GitHub Actions | — | ✅ Patvirtinta | CI/CD |
| Nginx | ≥ 1.25 | ✅ Patvirtinta | Reverse proxy, ingress |
| Traefik | ≥ 3.x | ✅ Patvirtinta | Ingress controller (K8s) |
| ArgoCD | ≥ 2.x | 🔍 Vertinama | GitOps diegimas; pilotinis naudojimas |
| Docker Compose | ≥ 2.x | ✅ Patvirtinta | Lokalių aplinkų ir mažų diegimų orkestravimas |

## A.5.1. Container base images

| Image | Statusas | Pastabos |
|---|---|---|
| `node:*-alpine` (LTS) | ✅ Patvirtinta | Frontend ir Node.js servisams |
| `php:*-fpm-alpine` | ✅ Patvirtinta | PHP servisams |
| `eclipse-temurin:*-jre-alpine` | ✅ Patvirtinta | Java servisams |
| `mcr.microsoft.com/dotnet/aspnet:*` | ✅ Patvirtinta | .NET servisams |
| `ubuntu:*`, `debian:*` (non-slim) | ⚠️ Palaikoma | Pirmenybė Alpine ar distroless; pilni images — tik su pagrindimu |

## A.6. Stebėsena ir saugumas

### Stebėsena, logai ir APM

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| Prometheus | ≥ 2.x | ✅ Patvirtinta | Metrikų rinkimas |
| Grafana | ≥ 10.x | ✅ Patvirtinta | Dashboardai, alertai |
| Loki | ≥ 2.x | ✅ Patvirtinta | Logų agregavimas |
| OpenTelemetry (SDK) | ≥ 1.x | ✅ Patvirtinta | Traces, metrikos ir logų standartas (vendor-neutral) |
| Sentry | — | ✅ Patvirtinta | Error tracking / APM |
| Jaeger | ≥ 1.x | 🔍 Vertinama | Distributed tracing vizualizacija |
| ELK (Elasticsearch + Logstash + Kibana) | ≥ 8.x | ⚠️ Palaikoma | Esamuose projektuose; naujiems pirmenybė Loki + Grafana |

### Saugumo įrankiai

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| Trivy | — | ✅ Patvirtinta | Container image ir priklausomybių skenavimas |
| SonarQube / SonarCloud | — | ✅ Patvirtinta | SAST, kodo kokybė |
| GitHub Advanced Security (Dependabot, CodeQL, Secret scanning) | — | ✅ Patvirtinta | Priklausomybių ir kodo saugumo tikrinimas |
| OWASP ZAP | — | 🔍 Vertinama | DAST; rekomenduojama kritinėms viešosioms sistemoms |
| Renovate | — | ✅ Patvirtinta | Automatinis priklausomybių atnaujinimo valdymas |

## A.7. Testavimo įrankiai

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| PHPUnit | ≥ 11.x | ✅ Patvirtinta | PHP unit testai |
| Pest | ≥ 2.x | ✅ Patvirtinta | PHP testai (Laravel ekosistema) |
| Jest | ≥ 29.x | ✅ Patvirtinta | JS/TS unit testai |
| Vitest | ≥ 1.x | ✅ Patvirtinta | Vite-based JS/TS unit testai |
| Playwright | ≥ 1.x | ✅ Patvirtinta | E2E testai (cross-browser) |
| JUnit | ≥ 5.x | ✅ Patvirtinta | Java unit testai |
| xUnit | ≥ 2.x | ✅ Patvirtinta | .NET unit testai |
| k6 | — | ✅ Patvirtinta | Našumo ir apkrovos testai |
| Apache JMeter | ≥ 5.x | ⚠️ Palaikoma | Esamiems projektams; naujiems pirmenybė k6 (code-first, CI-friendly) |
| axe-core | — | ✅ Patvirtinta | Prieinamumo (A11y) testavimas |
| Testing Library | — | ✅ Patvirtinta | React / Vue komponentų testai |

## A.8. Pranešimų eilės ir asinchroninis apdorojimas

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| RabbitMQ | ≥ 3.12 | ✅ Patvirtinta | Pranešimų eilės, event-driven integracijos |
| Redis (kaip eilė) | ≥ 7.x | ✅ Patvirtinta | Lengvas queue backend (Laravel Horizon, BullMQ) |
| Apache Kafka | ≥ 3.x | 🔍 Vertinama | Didelės apimties event streaming; tik su ADR |

## A.9. DI priemonės (AI Coding Assistants)

| Priemonė | Statusas | Sąlygos |
|---|---|---|
| GitHub Copilot (Business/Enterprise) | ✅ Patvirtinta | Tik su organizacijos valdomu planu; žr. [4.8](../04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants) |
| _Kitos DI priemonės_ | 🔍 Vertinama | Reikia viceprezidento (VP) ir DPO patvirtinimo |

## A.10. Registro atnaujinimo procesas

1. **Pasiūlymas** — bet kuris kūrėjas arba tiekėjas pateikia technologijos pasiūlymą per Pull Request į šį dokumentą.
2. **Vertinimas** — architektūros atstovas įvertina technologiją pagal:
   - licencinį suderinamumą;
   - palaikomumo perspektyvą (LTS, bendruomenės dydis);
   - saugumo istoriją;
   - kompetencijų prieinamumą organizacijoje.
3. **Sprendimas** — patvirtina arba atmeta su pagrindimo komentaru.
4. **Atnaujinimas** — registras atnaujinamas, CHANGELOG papildomas.

> Susiję skyriai: [3.10.3 Technologijų suderinimas](../03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack) · [4.2.3 Automatinis formatavimas ir linting](../04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [7.3 Priemonės ir rekomenduojamos technologijos](../07-testavimas.md#73-priemonės-ir-rekomenduojamos-technologijos)
