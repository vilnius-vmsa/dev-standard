# A priedas. Organizacijos technologijų registras

> **Statusas:** gyvas dokumentas — atnaujinamas pagal [§13 Standarto priežiūra](../13-standarto-prieziura.md).
> **Paskutinis peržiūrėjimas:** 2025-XX-XX

Šis registras apibrėžia organizacijos lygiu patvirtintas technologijas, karkasus ir įrankius. Jis yra privalomas atskaitos taškas pagal [§4.2.3](../04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) ir [§3.10.3](../03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack).

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
| Next.js | ≥ 14.x | ✅ Patvirtinta | SSR/SSG karkasas |
| TypeScript | ≥ 5.x | ✅ Patvirtinta | Privalomas naujuose frontend projektuose |
| Tailwind CSS | ≥ 3.x | ✅ Patvirtinta | Stilių sistema |
| ESLint | ≥ 9.x | ✅ Patvirtinta | Linting |
| Prettier | ≥ 3.x | ✅ Patvirtinta | Formatavimas |
| _Užpildyti pagal organizacijos poreikius_ | | | |

## A.3. Backend

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| Laravel (PHP) | ≥ 11.x | ✅ Patvirtinta | PHP karkasas |
| Symfony (PHP) | ≥ 7.x | ✅ Patvirtinta | PHP karkasas |
| PHP | ≥ 8.3 | ✅ Patvirtinta | |
| Java (Spring Boot) | ≥ 3.x (Java ≥ 21) | ✅ Patvirtinta | |
| .NET | ≥ 8.0 | ✅ Patvirtinta | |
| Node.js (runtime) | ≥ 20.x LTS | ✅ Patvirtinta | Backend servisams |
| _Užpildyti pagal organizacijos poreikius_ | | | |

## A.4. Duomenų bazės ir duomenų saugojimas

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| PostgreSQL | ≥ 15.x | ✅ Patvirtinta | Pagrindinė RDBMS |
| Redis | ≥ 7.x | ✅ Patvirtinta | Kešavimas, sesijos |
| _Užpildyti pagal organizacijos poreikius_ | | | |

## A.5. DevOps, CI/CD ir infrastruktūra

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| Docker | ≥ 24.x | ✅ Patvirtinta | Konteinerizacija |
| Kubernetes | ≥ 1.28 | ✅ Patvirtinta | Orkestravimas |
| Terraform | ≥ 1.6 | ✅ Patvirtinta | IaC |
| GitHub Actions | — | ✅ Patvirtinta | CI/CD |
| _Užpildyti pagal organizacijos poreikius_ | | | |

## A.6. Stebėsena ir saugumas

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| _Užpildyti pagal organizacijos poreikius_ | | | SIEM, APM, log sistema |

## A.7. Testavimo įrankiai

| Technologija | Versija / diapazonas | Statusas | Pastabos |
|---|---|---|---|
| PHPUnit | ≥ 11.x | ✅ Patvirtinta | PHP unit testai |
| Jest | ≥ 29.x | ✅ Patvirtinta | JS/TS unit testai |
| Playwright | ≥ 1.x | ✅ Patvirtinta | E2E testai |
| _Užpildyti pagal organizacijos poreikius_ | | | |

## A.8. DI priemonės (AI Coding Assistants)

| Priemonė | Statusas | Sąlygos |
|---|---|---|
| GitHub Copilot (Business/Enterprise) | ✅ Patvirtinta | Tik su organizacijos valdomu planu; žr. [§4.8](../04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants) |
| _Kitos DI priemonės_ | 🔍 Vertinama | Reikia VP ir DPO patvirtinimo |

## A.9. Registravo atnaujinimo procesas

1. **Pasiūlymas** — bet kuris kūrėjas arba tiekėjas pateikia technologijos pasiūlymą per Pull Request į šį dokumentą.
2. **Vertinimas** — architektūros atstovas įvertina technologiją pagal:
   - licencinį suderinamumą;
   - palaikomumo perspektyvą (LTS, bendruomenės dydis);
   - saugumo istoriją;
   - kompetencijų prieinamumą organizacijoje.
3. **Sprendimas** — patvirtina arba atmeta su pagrindimo komentaru.
4. **Atnaujinimas** — registras atnaujinamas, CHANGELOG papildomas.

> Susiję skyriai: [3.10.3 Technologijų suderinimas](../03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack) · [4.2.3 Automatinis formatavimas ir linting](../04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [7.3 Priemonės ir rekomenduojamos technologijos](../07-testavimas.md#73-priemonės-ir-rekomenduojamos-technologijos)
