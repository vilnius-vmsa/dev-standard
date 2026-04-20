# 1. Sąvokos ir terminai

| Sąvoka / trumpinys | Reikšmė |
|---|---|
| A11y | Accessibility (prieinamumas) – reikalavimai, užtikrinantys, kad sistema būtų naudojama ir žmonių su negalia (pvz., pagal WCAG). |
| ADR | Architecture Decision Record – architektūrinio sprendimo įrašas, dokumentuojantis reikšmingus techninius pasirinkimus ir jų pagrindimą. |
| API | Application Programming Interface (programavimo sąsaja) – sąsaja, per kurią sistemos ar jų dalys keičiasi duomenimis ir funkcijomis pagal apibrėžtą specifikaciją. |
| BE | Back-End (serverinė sistemos dalis) – sistemos komponentai serverio pusėje: verslo logika, duomenų prieiga, API. |
| BFF | Backend for Frontend – backend sluoksnis, pritaikytas konkrečiam UI klientui (pvz., web), optimizuojant duomenų gavimą ir atsakymų formą. |
| CD | Continuous Delivery/Deployment (tęstinis pristatymas / diegimas) – automatizuotas artefaktų paruošimas ir (ar) diegimas į aplinkas. |
| CI | Continuous Integration (tęstinė integracija) – automatinis kodo sujungimas, build ir testų vykdymas dažnai (pvz., kiekvienam PR). |
| CI/CD | Procesų ir įrankių visuma, apimanti CI ir CD praktiką (automatizuotas build, testavimas, leidimai ir diegimas). |
| DevOps | Development + Operations – praktikų ir kultūros rinkinys, skirtas automatizuoti ir sutrumpinti programinės įrangos kūrimo, testavimo, diegimo ir priežiūros ciklą. |
| DPIA (DAPV) | Duomenų apsaugos poveikio vertinimas (Data Protection Impact Assessment) – BDAR numatytas vertinimas, kai tvarkymas gali kelti didelę riziką. |
| FE | Front-End (naudotojo sąsajos dalis) – kliento pusėje veikianti sistemos dalis (dažniausiai naršyklėje). |
| IaC | Infrastructure as Code – infrastruktūros aprašymas ir valdymas kodu (pvz., Terraform, Helm), užtikrinant pakartojamumą ir atsekamumą. |
| JWT | JSON Web Token – pasirašytas tokenas, dažnai naudojamas autentifikacijai / autorizacijai perduodant teises (claims). |
| mTLS | Mutual TLS – TLS su abipusiu autentifikavimu, kai sertifikatais identifikuojamas ir klientas, ir serveris. |
| NFR | Nefunkciniai reikalavimai (Non-Functional Requirements) – kokybės atributai, pvz., saugumas, našumas, patikimumas, prieinamumas. |
| OAuth 2.0 | Autorizacijos protokolas, skirtas deleguoti prieigą (pvz., per access tokenus) tarp kliento ir resurso serverio. |
| OIDC | OpenID Connect – autentifikacijos sluoksnis virš OAuth 2.0, apibrėžiantis tapatybės tokenus (ID token) ir prisijungimo srautą. |
| PO | Product Owner (produkto savininkas) – asmuo, atsakingas už produkto viziją, backlog prioritetus ir reikalavimų valdymą. |
| SBOM | Software Bill of Materials – programinės įrangos sudėties sąrašas (naudojamos bibliotekos, komponentai ir jų versijos). |
| SCA | Software Composition Analysis – priklausomybių (paketų/bibliotekų) analizė dėl licencijų ir žinomų pažeidžiamumų. |
| SAST | Static Application Security Testing – statinė kodo analizė, skirta aptikti saugumo spragas (pvz., CI procese). |
| SLA | Service Level Agreement – sutartinis paslaugos lygis (pvz., prieinamumas per laikotarpį). |
| SLI | Service Level Indicator – metrika, pagal kurią matuojamas SLO (pvz., p95 atsako laikas, klaidų %). |
| SLO | Service Level Objective – išmatuojamas paslaugos tikslas (pvz., 99,9% sėkmingų užklausų per 30 dienų). |
| UAT | User Acceptance Testing – naudotojų / užsakovo priėmimo testavimas prieš produkcinį leidimą. |
