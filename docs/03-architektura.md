# 3. Architektūros ir dizaino principai

Šis skyrius nustato bendruosius architektūros ir sprendimų projektavimo principus, kuriais privalu vadovautis kuriant, tobulinant ir prižiūrint savivaldybės informacines sistemas (web, API, integracijas ir - jei taikoma - [mobilias](#39-mobilios-aplikacijos-jei-taikoma) aplikacijas).

## 3.1. Bendrieji architektūriniai principai

### 3.1.1. Kokybės atributai (NFR)

Sistema turi būti projektuojama, įgyvendinama ir eksploatuojama atsižvelgiant į pagrindinius kokybės atributus: veikimą, saugumą, prieinamumą (A11y), patikimumą, našumą, keičiamumą ir stebėseną. Šie reikalavimai turi būti apibrėžti ankstyvoje projektavimo stadijoje, įtraukti į priėmimo kriterijus ir sekami per visą sistemos gyvavimo ciklą.

### 3.1.2. Separation of Concerns / Single Responsibility

Kiekvienas komponentas, modulis ar servisas turi turėti aiškią ir vieną pagrindinę atsakomybę. Draudžiami komponentai, apjungiantys kelias skirtingas atsakomybes (pvz., verslo logiką, duomenų prieigą ir integracijas viename objekte). Šis principas taikomas tiek kodo lygmeniu, tiek paslaugų ir sistemos architektūros lygmeniu.

### 3.1.3. Security by Design ir Privacy by Design

Sistema PRIVALOMA projektuoti taip, kad saugumas ir asmens duomenų apsauga (BDAR / GDPR) būtų integruoti nuo pat projektavimo pradžios, o ne diegiami vėliau kaip papildomi sprendimai.

Architektūriniai sprendimai turi:

*   mažinti atakos paviršių;
*   riboti prieigas pagal mažiausių privilegijų principą;
*   užtikrinti asmens duomenų apsaugą viso gyvavimo ciklo metu;
*   sudaryti sąlygas atsekamumui, auditui ir incidentų analizei.

Konkretūs saugumo, autentifikacijos, autorizacijos, slaptųjų raktų, duomenų apsaugos, testavimo ir incidentų valdymo reikalavimai apibrėžti [#6](06-saugumas.md) skyriuje.

### 3.1.4. API-first dizainas ir integracijos principai

Sistemą privaloma projektuoti vadovaujantis API‑first principu, kai integracijos ir sąsajos laikomos pirmo lygio architektūros elementais, o ne vidine įgyvendinimo detale.

Architektūriniai sprendimai turi užtikrinti, kad:

*   būtų vengiama tiesioginių duomenų bazių prieigų tarp sistemų — sistemos tarpusavyje sąveikautų tik per aiškiai apibrėžtas ir versijuotas sąsajas;
*   integracijos būtų atsekamos, dokumentuotos ir keičiamos be tiesioginio poveikio vidinei kitų sistemų struktūrai;
*   nebūtų kuriamos paslėptos ar netiesioginės priklausomybės tarp sistemų.

Konkretūs API projektavimo, specifikavimo, versijavimo, saugumo ir integracijų reikalavimai apibrėžti [#3.3](#33-backend-ir-api-principai) ir [#3.4](#34-duomenys-ir-integracijos) skyriuose.

### 3.1.5. Architecture Decision Records (ADR)

Reikšmingi architektūriniai sprendimai (technologijų pasirinkimai, integracijų modeliai, esminiai kompromisai, nukrypimai nuo standarto) **turi būti dokumentuojami ADR įrašu** ir saugomi kartu su projektu.

**ADR rengimo, struktūros ir saugojimo reikalavimai apibrėžti [#10.4](10-dokumentacija.md#104-architecture-decision-records-adr). skyriuje.**

### 3.1.6. Diegimo parengtis ir konfigūracijos valdymas

PRIVALOMA:
Sistema turi būti projektuojama taip, kad:

<!-- ARCH-GEN-P01 | ai-reviewable -->
*   konfigūracija būtų atskirta nuo kodo;
<!-- ARCH-GEN-P02 | ai-reviewable -->
*   diegimo, paleidimo ir atnaujinimo procesai būtų aiškiai apibrėžti ir automatizuojami;
<!-- ARCH-GEN-P03 | human-reviewable -->
*   sistema galėtų būti patikimai eksploatuojama pasirinktoje infrastruktūroje be rankinio įsikišimo.

REKOMENDUOJAMA:

<!-- ARCH-GEN-R01 | human-reviewable -->
*   projektuoti servisus kaip stateless, kiek tai leidžia verslo logika;
<!-- ARCH-GEN-R02 | human-reviewable -->
*   numatyti sveikatos patikrinimo mechanizmus;
<!-- ARCH-GEN-R03 | human-reviewable -->
*   architektūrą projektuoti taip, kad būtų įmanomas horizontalus išplėtimas, jei to reikalauja NFR.

Konkrečios konfigūracijos, slaptųjų raktų, aplinkų, diegimo ir patikimumo realizavimo taisyklės apibrėžtos [#3.5](#35-konfigūracija-slaptieji-raktai-ir-aplinkos) ir [#3.6](#36-patikimumas-ir-atsparumas) skyriuose.

### 3.1.7. Observability by Default

Stebėsenos lygis privalo būti proporcingas sistemos kritiškumui ir apibrėžtas kartu su nefunkciniais reikalavimais (NFR).

PRIVALOMA:
Sistema turi būti projektuojama taip, kad:

<!-- ARCH-GEN-P04 | human-reviewable -->
*   būtų įmanoma nuosekliai stebėti sistemos būseną ir elgseną per logus, metrikas ir įvykius;
<!-- ARCH-GEN-P05 | human-reviewable -->
*   būtų užtikrintas užklausų ir veiksmų atsekamumas tarp sistemos komponentų;
<!-- ARCH-GEN-P06 | process-level -->
*   kritiniai sutrikimai būtų laiku identifikuojami ir eskaluojami pagal sutartus paslaugų lygius.

REKOMENDUOJAMA:

<!-- ARCH-GEN-R04 | human-reviewable -->
*   projektuoti sprendimus taip, kad būtų galima pagrįsti SLA / SLO laikymąsi;
<!-- ARCH-GEN-R05 | ai-reviewable -->
*   sudaryti sąlygas efektyviai diagnostikai ir incidentų analizei.

Konkretūs stebėsenos, loginimo, metrikų, alertų ir incidentų valdymo reikalavimai apibrėžti [#9](09-stebesena-logai.md) skyriuje.

### 3.1.8. SOLID, KISS, DRY, YAGNI

Projektuojant ir vystant sistemas rekomenduojama vadovautis šiais principais:

*   SOLID - aiškioms priklausomybėms, išplečiamumui ir testavimui
*   KISS _(Keep It Simple, Stupid)_ - vengti perteklinio sudėtingumo; sprendimas turi būti suprantamas kitiems kūrėjams be autoriaus pagalbos
*   DRY _(Don't Repeat Yourself)_ - vengti kodo ir logikos dubliavimo; bendrai naudojama logika iškeliama į bendras bibliotekas ar servisus
*   YAGNI _(You Aren't Gonna Need It)_ - neįgyvendinti funkcionalumo, kuris nėra pagrįstas dabartiniais reikalavimais ir neapspręstas produkto savininkų

Šių principų praktinis taikymas, kodo struktūros, keitimo ir peržiūros gairės apibrėžtos [#4](04-kodo-kurimo-gaires.md) skyriuje „Programinio kodo kūrimo ir keitimo gairės“.

## 3.2. Frontend (Web) principai

### 3.2.1. Komponentinė architektūra

UI skaidomas į smulkius, pakartotinai naudojamus komponentus su aiškia viena atsakomybe. Privaloma vadovautis centralizuota dizaino sistema (Design System), apibrėžta organizacijos arba projekto lygmeniu.

PRIVALOMA:

<!-- ARCH-FE-P01 | ai-reviewable -->
*   komponentai grupuojami pagal atsakomybę (pvz., Atomic Design principu: atomai → molekulės → organizmai)
<!-- ARCH-FE-P02 | human-reviewable -->
*   bendrai naudojami komponentai iškeliami į bendrą komponentų biblioteką (atskirą paketą, monorepo dalį ar kitą centralizuotą formą), o ne dubliuojami projektuose

REKOMENDUOJAMA:

<!-- ARCH-FE-R01 | ai-reviewable -->
*   vizualinė ir vartotojo elgsenos specifikacija dokumentuojama (pvz., Storybook ar ekvivalentas)

### 3.2.2. Būsenos (state) valdymas

PRIVALOMA:

<!-- ARCH-FE-P03 | human-reviewable -->
*   Vienas aiškus duomenų šaltinis kiekvienam būsenos tipui (single source of truth)
<!-- ARCH-FE-P04 | ai-reviewable -->
*   Būsena skirstoma pagal gyvavimo ciklą: serverio duomenys (server state), UI būsena (local state), URL būsena (router state), globalios sesijos duomenys - kiekvienas tipas valdomas atitinkamu įrankiu
<!-- ARCH-FE-P05 | ai-reviewable -->
*   Draudžiama dubliuoti serverio duomenis globalios būsenos valdyme, jei naudojamas query kešas (pvz., React Query, SWR ar ekvivalentas)

REKOMENDUOJAMA:

<!-- ARCH-FE-R02 | human-reviewable -->
*   Vengti perteklinės globalios būsenos - komponentų lygio būsena nekeliama aukštyn be aiškios priežasties
<!-- ARCH-FE-R03 | ai-reviewable -->
*   Globali būsena naudojama tik tada, kai duomenys reikalingi kelioms aplikacijos dalims

Serverio būsenos (server state) valdymas frontend dalyje turi atitikti [#3.3](#33-backend-ir-api-principai) skyriuje apibrėžtus API kontraktus ir jų semantiką.

### 3.2.3. Routing ir URL principai

*   URL struktūra semantinė, stabili ir atspindi aplikacijos būseną
*   Deep linking privalomas: bet kuri aplikacijos būsena turi būti pasiekiama tiesiogiai per URL (svarbu naršyklės „atgal“ mygtukui, dalijimuisi nuorodomis ir, kai taikoma, SEO)
*   Filtrai, rūšiavimas ir puslapiavimas atspindimi URL parametruose - ne tik vietinėje būsenoje
*   Navigacijos apsauga (route guards) naudojama autorizuotoms sekcijoms; neautorizuotas vartotojas nukreipiamas į prisijungimo puslapį, o ne paliekamas tuščiame ekrane

Route guards naudojami tik naudotojo patirčiai valdyti; tikroji prieigos kontrolė privalo būti įgyvendinta serverio pusėje pagal [6 skyriaus](06-saugumas.md) reikalavimus.

### 3.2.4. Tarptautiškumas ir lokalizacija

PRIVALOMA:

<!-- ARCH-FE-P06 | ai-reviewable -->
*   Visi UI tekstai laikomi atskiruose lokalizacijos resursuose (i18n); draudžiami „hardcoded" tekstai komponentuose
<!-- ARCH-FE-P07 | ai-reviewable -->
*   Datos, skaičiai, valiutos ir laiko juostos formatuojami pagal vartotojo lokalę naudojant standartines Intl API priemones

REKOMENDUOJAMA:

<!-- ARCH-FE-R04 | ai-reviewable -->
*   Numatytoji kalba ir lokalė apibrėžiamos konfigūracijoje; kalbų perjungimas - be puslapio perkrovimo
<!-- ARCH-FE-R05 | ai-reviewable -->
*   UI dizainas ir komponentai turėtų būti atsparūs skirtingų kalbų ilgiui ir formatams

Backend grąžinami tekstai ar reikšmės, naudojamos UI, turi būti suderintos su [#3.3](#33-backend-ir-api-principai) skyriuje apibrėžtais API kontraktais ir lokalizacijos strategija.

### 3.2.5. Prieinamumas (A11y)

Prieinamumas yra esminė sistemos kokybės savybė ir privalo būti užtikrinamas projektuojant, įgyvendinant ir testuojant naudotojo sąsają. A11y reikalavimai laikomi ne papildomu patikrinimu, o integralia funkcionalumo dalimi.

PRIVALOMA:

<!-- ARCH-FE-P08 | ai-reviewable -->
*   WCAG 2.2 AA lygio atitikimas privalomas visoms viešosioms ir vidaus paslaugoms
<!-- ARCH-FE-P09 | ai-reviewable -->
*   Techninis minimumas: semantinis HTML, ARIA atributai tik ten kur semantinio HTML nepakanka, pakankamas kontrasto santykis (4.5:1 tekstui), klaviatūros navigacija, focus management modaluose ir dinaminame turinyje

REKOMENDUOJAMA:

<!-- ARCH-FE-R06 | ai-reviewable -->
*   Automatizuotas testavimas integruojamas į CI/CD (pvz., axe-core, Lighthouse); automatizuotais įrankiais aptinkama ~30-40% A11y problemų - likusios tikrinamos rankiniu testavimu
<!-- ARCH-FE-R07 | ai-reviewable -->
*   Naujos funkcijos priimamos tik praėjusios A11y patikrinimą

### 3.2.6. Saugumas naršyklėje

Naršyklės lygmens saugumo reikalavimai (CSP, XSS, CSRF ir pan.) apibrėžti **[#6.5](06-saugumas.md#65-saugumas-naršyklėje) skyriuje „Saugumas naršyklėje“**.

### 3.2.7. API komunikacija ir klaidų valdymas

PRIVALOMA:

<!-- ARCH-FE-P10 | ai-reviewable -->
*   Visa komunikacija su backend vyksta per aiškiai apibrėžtą API sluoksnį - UI komponentai nekviečia HTTP tiesiogiai
<!-- ARCH-FE-P11 | ai-reviewable -->
*   Klaidų valdymas centralizuotas: tinklo klaidos, autentifikacijos pasibaigimas (401/403) ir serverio klaidos (5xx) apdorojamos vienoje vietoje, ne kiekviename komponente atskirai
<!-- ARCH-FE-P12 | ai-reviewable -->
*   Error boundaries naudojamos komponentų medžio sekcijoms - vieno komponento klaida nenugriaudama visos aplikacijos

REKOMENDUOJAMA:

<!-- ARCH-FE-R08 | human-reviewable -->
*   BFF (_Backend for Frontend_) modelis - atskiras backend sluoksnis, skirtas konkrečiam UI klientui; sumažina over-fetching problemą ir slepia vidinę sistemų struktūrą
<!-- ARCH-FE-R09 | human-reviewable -->
*   Užklausų kešavimas (React Query, SWR ar ekvivalentas) serverio duomenims - mažina bereikalingus tinklo kvietimus
<!-- ARCH-FE-R10 | human-reviewable -->
*   Automatiniai pakartotiniai bandymai (retries) su eksponentiniu atsitraukimu tinklo klaidoms, bet ne 4xx klaidoms

Frontend API komunikacija privalo atitikti [#3.3](#33-backend-ir-api-principai) skyriuje apibrėžtus API projektavimo, versijavimo ir klaidų standartus.

### 3.2.8. Našumas

PRIVALOMA:

<!-- ARCH-FE-P13 | human-reviewable -->
*   Core Web Vitals tikslai viešosioms sistemoms:
    *   LCP ≤ 2.5s
    *   CLS ≤ 0.1
    *   INP ≤ 200ms (Google „Good" slenkstis)
<!-- ARCH-FE-P14 | human-reviewable -->
*   Našumo rodikliai stebimi nuolat (Real User Monitoring arba sintetinis monitoringas) - ne tik kūrimo metu

REKOMENDUOJAMA:

<!-- ARCH-FE-R11 | ai-reviewable -->
*   Code splitting ir lazy loading - puslapiai ir sunkūs komponentai įkeliami tik tada, kai reikalingi
<!-- ARCH-FE-R12 | ai-reviewable -->
*   Optimizuoti statiniai resursai: paveikslėliai šiuolaikiniais formatais (WebP/AVIF), tinkamų dydžių, su srcset
<!-- ARCH-FE-R13 | ai-reviewable -->
*   Turinio kešavimas CDN lygmeniu statinam turiniui
<!-- ARCH-FE-R14 | human-reviewable -->
*   Priklausomybių dydžio auditas (bundle analysis) prieš diegiant naujas bibliotekas

Frontend našumo metrikos (pvz., Core Web Vitals) yra bendros sistemos stebėsenos dalis ir integruojamos į [#9](09-stebesena-logai.md) skyriuje apibrėžtą stebėsenos modelį.

### 3.2.9. Priklausomybių valdymas

PRIVALOMA:

<!-- ARCH-FE-P15 | ai-reviewable -->
*   Naujos priklausomybės (npm paketai) peržiūrimos prieš įtraukimą: licencija, palaikymas, saugumo istorija, dydis
<!-- ARCH-FE-P16 | process-level -->
*   Priklausomybės atnaujinamos reguliariai (rekomenduojama automatizuoti su Dependabot ar Renovate); nepalaikomos bibliotekos keičiamos

REKOMENDUOJAMA:

<!-- ARCH-FE-R15 | ai-reviewable -->
*   npm audit ar ekvivalentas vykdomas CI/CD proceso metu - kritiniai pažeidžiamumai blokuoja diegimą
<!-- ARCH-FE-R16 | human-reviewable -->
*   Vengti priklausomybių nuo bibliotekų, kurios dubliuoja naršyklės natyvias galimybes (Intl, fetch, CSS variables)

Priklausomybių saugumo patikrinimų vykdymas CI/CD pipeline’uose apibrėžtas [#8](08-devops-ci-cd.md) skyriuje.

## 3.3. Backend ir API principai

### 3.3.1. Specifikacija ir dokumentacija

PRIVALOMA:
Visos API sąsajos turi turėti mašiniškai skaitomą specifikacijos aprašą:

<!-- ARCH-API-P01 | ai-reviewable -->
*   REST API - OpenAPI 3.x specifikacija; GraphQL - SDL schema; asinchroninėms sąsajoms - AsyncAPI specifikacija
<!-- ARCH-API-P02 | ai-reviewable -->
*   Design‑first: schema apibrėžiama ir peržiūrima prieš implementaciją, ne po jos
<!-- ARCH-API-P03 | ai-reviewable -->
*   Dokumentacija generuojama automatiškai iš specifikacijos ir pasiekiama kūrėjams; išorinė dokumentacija publikuojama pagal projekto poreikius
<!-- ARCH-API-P04 | ai-reviewable -->
*   Numatytasis atsakymo tipas - application/json, jei nenurodyta kitaip; Content‑Type ir Accept antraštės privalomos

Atsakymų formatas ir antraštės turi būti suderintos su [#3.8](#38-diagramos-ir-dokumentavimas) skyriuje apibrėžtu standartizuotu klaidų ir atsakymų formatu.

API specifikacijos ir jų generuojama dokumentacija yra projekto dokumentacijos dalis ir turi būti tvarkomos pagal [#10](10-dokumentacija.md) skyriuje apibrėžtas dokumentacijos valdymo taisykles.

### 3.3.2. Versijavimas

*   API versijos valdomos pagal **5.2 „API versijavimas“** skyriuje nustatytus semantinio versijavimo principus ir nuostatas dėl suderinamumo, palaikymo (deprecation) bei vartotojų informavimo.

### 3.3.3. Resursų modeliavimas ir URL dizainas

PRIVALOMA:

<!-- ARCH-API-P05 | human-reviewable -->
*   Resursai modeliuojami kaip daiktavardžiai, ne veiksmai (/orders, ne /getOrders)
<!-- ARCH-API-P06 | ai-reviewable -->
*   URL segmentai - kebab-case, daugiskaita kolekcijai (/work-orders/123)
<!-- ARCH-API-P07 | ai-reviewable -->
*   HTTP metodų semantika turi atitikti standartą:
    *   GET - saugus ir idempotentinis
    *   PUT - pilnas resurso pakeitimas (pateikiama pilna resurso reprezentacija)
    *   PATCH - dalinis resurso pakeitimas
    *   DELETE - idempotentinis
<!-- ARCH-API-P08 | human-reviewable -->
*   Hierarchija URL struktūroje tik tada, kai resursas negali egzistuoti be tėvinio (/departments/5/employees)

### 3.3.4. Apsauga ir prieiga

PRIVALOMA:

<!-- ARCH-API-P09 | ai-reviewable -->
*   Taikomas mažiausių privilegijų principas: kiekvienas servisas ir vartotojas gauna tik būtinas teises; prieigos teisės (scope’ai / roles) apibrėžiamos API kontrakto lygmeniu
<!-- ARCH-API-P10 | ai-reviewable -->
*   Servisų tarpusavio autentifikacija (service‑to‑service) įgyvendinama saugiu mechanizmu (pvz., OAuth 2.0 client credentials arba mTLS); draudžiami bendri servisų slaptažodžiai
<!-- ARCH-API-P11 | ai-reviewable -->
*   Visi prieigos suteikimo ir atsisakymo (authorization) įvykiai registruojami audito žurnale su userId, action, resource, timestamp
<!-- ARCH-API-P12 | ai-reviewable -->
*   Slaptažodžiai, API raktai ir sertifikatai saugomi tik naudojant centralizuotą paslapčių valdymo sprendimą (ne kodo bazėje ir ne konfigūracijos failuose)

REKOMENDUOJAMA:

<!-- ARCH-API-R01 | ai-reviewable -->
*   Autentifikacija įgyvendinama naudojant OAuth 2.0 / OpenID Connect
<!-- ARCH-API-R02 | ai-reviewable -->
*   Naudojami JWT tokenai su trumpu galiojimo laiku (≤ 1 val. access token, ≤ 24 val. refresh token)

API lygmens apsaugos ir prieigos sprendimai turi atitikti [#6](06-saugumas.md) skyriuje apibrėžtą saugumo politiką.

### 3.3.5. Laiko politika

PRIVALOMA:

<!-- ARCH-API-P13 | ai-reviewable -->
*   Visi laiko žymekliai serveriuose, duomenų bazėse ir API atsakymuose pateikiami UTC laiko juostoje, naudojant ISO 8601 formatą (pvz., 2025-04-01T14:30:00Z)
<!-- ARCH-API-P14 | ai-reviewable -->
*   API užklausose gali būti priimami tiek UTC, tiek laiko zonos poslinkiai (+02:00 ir pan.), tačiau serverio logikoje visi laikai nedelsiant konvertuojami į UTC
<!-- ARCH-API-P15 | ai-reviewable -->
*   Laiko juostos (timezone) informacija, jei reikalinga verslo logikai (pvz., darbo valandų, terminų ar SLA skaičiavimui), saugoma atskirai nuo laiko žymeklio

REKOMENDUOJAMA:

<!-- ARCH-API-R03 | human-reviewable -->
*   Lokalaus laiko konvertavimas atliekamas tik naudotojo sąsajos (UI) ir ataskaitų (reporting) sluoksnyje

Laiko žymeklių naudojimas ir formatas turi būti suderinti su [#9](09-stebesena-logai.md) skyriuje apibrėžtais loginimo ir stebėsenos reikalavimais.

### 3.3.6. Input validacija ir užklausų apsauga

PRIVALOMA:

<!-- ARCH-API-P16 | ai-reviewable -->
*   Visi išoriškai gaunami duomenys validuojami pagal API kontraktą (OpenAPI / GraphQL schema) prieš apdorojimą (schema validation)
<!-- ARCH-API-P17 | human-reviewable -->
*   Užklausų dydžio limitai taikomi tiek antraštėms (headers), tiek užklausos kūnui (body); viršijus limitus užklausa atmetama
<!-- ARCH-API-P18 | ai-reviewable -->
*   SQL / NoSQL injekcijų prevencija – naudojamos tik parametrizuotos užklausos; ORM nenaudojamas kaip saugumo garantija
<!-- ARCH-API-P19 | human-reviewable -->
*   Vartotojo įvesti duomenys niekada tiesiogiai neįterpiami į logus, klaidos pranešimus ar dinaminius užklausų fragmentus

Loginimo ir klaidų pranešimų reikalavimai detalizuoti [#9](09-stebesena-logai.md) skyriuje.

### 3.3.7. Idempotentiškumas

PRIVALOMA:

<!-- ARCH-API-P20 | ai-reviewable -->
*   Visi GET, PUT, DELETE metodai turi būti idempotentiniai pagal HTTP specifikaciją.

REKOMENDUOJAMA:

Operacijos, kurios gali būti pakartotos tinklo gedimo atveju (mokėjimai, dokumentų siuntimas, būsenos keitimai):

*   POST užklausoms naudoti Idempotency-Key antraštę, galiojančią vienai loginei operacijai
*   Arba naudoti natūralius rakto laukus su unikalumo apribojimais duomenų bazės lygmeniu

### 3.3.8. Standartizuotos klaidos

PRIVALOMA:

<!-- ARCH-API-P21 | ai-reviewable -->
*   HTTP statuso kodai naudojami pagal semantiką (4xx – kliento klaida, 5xx – serverio klaida; 200 statuso kodas negrąžinamas klaidoms)
<!-- ARCH-API-P22 | ai-reviewable -->
*   API klaidos grąžinamos struktūrizuotu formatu; klaidų atsakymams naudojamas application/problem+json formatas (RFC 7807)
<!-- ARCH-API-P23 | ai-reviewable -->
*   Klaidos atsakyme privalomi bent šie laukai: type, title, status, traceId, code
<!-- ARCH-API-P24 | ai-reviewable -->
*   traceId privalomas visuose klaidų atsakymuose ir naudojamas susiejimui su logais bei incidentų analize
<!-- ARCH-API-P25 | human-reviewable -->
*   Klaidos pranešimai, skirti galutiniam naudotojui (title, detail), pateikiami lietuvių kalba; techniniai kodai ir identifikatoriai (code, type) – anglų kalba
<!-- ARCH-API-P26 | ai-reviewable -->
*   5xx klaidų atsakymuose neatskleidžiamos vidinės sistemos detalės, išimčių tekstai ar infrastruktūros informacija

REKOMENDUOJAMA:

<!-- ARCH-API-R04 | ai-reviewable -->
*   Validacijos klaidoms pateikti papildomą `errors[]` masyvą su laukų lygmens neatitikimais
<!-- ARCH-API-R05 | human-reviewable -->
*   type laukui naudoti stabilų URI / identifikatorių, kuris leidžia vienareikšmiškai identifikuoti klaidos tipą
<!-- ARCH-API-R06 | human-reviewable -->
*   Naudoti nuoseklų klaidų kodų žodyną visos sistemos mastu (pvz., `INVALID_DATE_RANGE`, `RESOURCE_NOT_FOUND`, `CONFLICT`, `ACCESS_DENIED`)

**Pavyzdys (application/problem+json):**

```json
{
  "type": "https://api.vilnius.lt/errors/validation-error",
  "title": "Validation failed",
  "status": 422,
  "traceId": "4bf92f3577b34da6",
  "code": "INVALID_DATE_RANGE",
  "detail": "Pradžios data negali būti vėlesnė už pabaigos datą",
  "errors": [
    {
      "field": "startDate",
      "message": "Invalid value"
    }
  ]
}
```

Detalesni klaidų loginimo, stebėsenos, eskalavimo ir incidentų valdymo reikalavimai apibrėžti [#9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling) skyriuje.

### 3.3.9. Greitaveika, patikimumas ir talpyklos

PRIVALOMA:

<!-- ARCH-API-P27 | ai-reviewable -->
*   Rate limiting - visi viešai pasiekiami ir tarpservisiniai API galai turi turėti apribojimus; limitai komunikuojami per RateLimit-\* antraštes (IETF draft)
<!-- ARCH-API-P28 | ai-reviewable -->
*   Timeout'ai - visi išoriniai kvietimai turi turėti apibrėžtą timeout; neleistinos užklausos be laiko apribojimo

REKOMENDUOJAMA:

<!-- ARCH-API-R07 | ai-reviewable -->
*   HTTP kešavimo antraštės (ETag, Cache-Control) resursams, kurie keičiasi retai
<!-- ARCH-API-R08 | human-reviewable -->
*   Read-through kešai DB apkrovos mažinimui
<!-- ARCH-API-R09 | ai-reviewable -->
*   Circuit breaker ir retry su eksponentiniu atsitraukimu (exponential backoff) integracijose su išorinėmis sistemomis
<!-- ARCH-API-R10 | human-reviewable -->
*   Atsakymų suspaudimas (gzip / br) dideliems atsakymams

### 3.3.10. Failų tvarkymas

PRIVALOMA:

<!-- ARCH-API-P29 | ai-reviewable -->
*   Užklausų dydžio limitai apibrėžiami ir komunikuojami (Content-Length tikrinimas; 413 klaida viršijus limitą).

REKOMENDUOJAMA:

<!-- ARCH-API-R11 | ai-reviewable -->
*   Failams, didesniems nei **10 MB** (numatytasis slenkstis, gali būti keičiamas pagal kontekstą) - presigned URL į objekto saugyklą (S3/MinIO/kt.), ne tiesioginis perdavimas per API
<!-- ARCH-API-R12 | human-reviewable -->
*   Failų įkėlimas - multipart upload dideliems failams (atsparumas ryšio pertrūkiams)
<!-- ARCH-API-R13 | ai-reviewable -->
*   Failų tipai ir dydžiai validuojami serverio pusėje (ne tik kliente)

### 3.3.11. Puslapiavimas

REKOMENDUOJAMA:

Visi API resursai, grąžinantys kolekcijas, turi palaikyti puslapiavimą:

*   **Cursor-based** puslapiavimas rekomenduojamas didelėms arba greitai kintančioms kolekcijoms (stabilus, nepriklausomai nuo įterpimų)
*   **Offset-based** (?page=2&pageSize=50) - priimtinas mažoms, stabilios tvarkos kolekcijoms
*   Maksimalus puslapio dydis apibrėžiamas serverio pusėje; užklausa su pageSize virš maksimalaus - 400 klaida, ne tylus apribojimas
*   Atsakyme pateikiamos nuorodos į kitą ir ankstesnį puslapį (next, prev pagal RFC 8288 Link antraštę arba atsakymo kūne)

### 3.3.12. Sukūrimo, atnaujinimo, ištrynimo ir asinchroninių mutacijų atsakymų standartas

PRIVALOMA:

<!-- ARCH-API-P30 | ai-reviewable -->
*   POST (sukūrimas) grąžina **201 Created** su pilna sukurto resurso reprezentacija atsakymo kūne (įskaitant sugeneruotą `id` ir kitus serverio priskirtus laukus) bei `Location` antraštę, nurodančią naujojo resurso URL
<!-- ARCH-API-P31 | ai-reviewable -->
*   PUT (pilnas pakeitimas) ir PATCH (dalinis pakeitimas) grąžina **200 OK** su pilna atnaujinto resurso reprezentacija atsakymo kūne
<!-- ARCH-API-P32 | ai-reviewable -->
*   Draudžiama grąžinti **204 No Content** sukūrimo (POST) ar atnaujinimo (PUT/PATCH) operacijoms – klientas privalo gauti atnaujintą resurso būseną be papildomų užklausų
<!-- ARCH-API-P33 | ai-reviewable -->
*   DELETE (ištrynimas) grąžina **204 No Content** be atsakymo kūno; jei ištrintą resursą reikia patvirtinti, leidžiama grąžinti **200 OK** su minimalia resurso reprezentacija (pvz., `id` ir `deletedAt`)
<!-- ARCH-API-P34 | ai-reviewable -->
*   DELETE operacija, skirta neegzistuojančiam resursui, grąžina **404 Not Found**
<!-- ARCH-API-P35 | ai-reviewable -->
*   Asinchroninė mutacija (POST/PUT/PATCH/DELETE, kurios vykdymas trunka ilgiau nei vienas HTTP užklausos ciklas) grąžina **202 Accepted** su užduoties objektu, turinčiu `id`, `status` ir `statusUrl` laukus, nurodančius užklausos sekimo URL
<!-- ARCH-API-P36 | ai-reviewable -->
*   Asinchroninės užduoties būsenos sekimo endpoint (`statusUrl`) grąžina **200 OK** su dabartine užduoties būsena; užbaigus – su galutine resurso reprezentacija arba klaidos aprašu

REKOMENDUOJAMA:

<!-- ARCH-API-R15 | ai-reviewable -->
*   Asinchroninės mutacijos atsakyme įtraukti `Location` antraštę su užduoties sekimo URL (pvz., `Location: /api/v1/jobs/456`)

**Pavyzdys (POST /orders → 201 Created):**

```json
{
  "id": "123",
  "status": "DRAFT",
  "createdAt": "2025-04-01T14:30:00Z",
  "updatedAt": "2025-04-01T14:30:00Z"
}
```

**Pavyzdys (PATCH /orders/123 → 200 OK):**

```json
{
  "id": "123",
  "status": "SUBMITTED",
  "createdAt": "2025-04-01T14:30:00Z",
  "updatedAt": "2025-04-01T15:00:00Z"
}
```

**Pavyzdys (DELETE /orders/123 → 204 No Content):**

```
(tuščias atsakymo kūnas)
```

**Pavyzdys (DELETE /orders/123 → 200 OK, jei reikalingas patvirtinimas):**

```json
{
  "id": "123",
  "deletedAt": "2025-04-01T15:30:00Z"
}
```

**Pavyzdys (asinchroninė mutacija → 202 Accepted):**

```json
{
  "id": "456",
  "status": "PENDING",
  "statusUrl": "/api/v1/jobs/456"
}
```

**Pavyzdys (GET /api/v1/jobs/456 → 200 OK, užduotis vykdoma):**

```json
{
  "id": "456",
  "status": "IN_PROGRESS",
  "statusUrl": "/api/v1/jobs/456"
}
```

**Pavyzdys (GET /api/v1/jobs/456 → 200 OK, užduotis baigta):**

```json
{
  "id": "456",
  "status": "COMPLETED",
  "result": {
    "id": "123",
    "status": "PROCESSED",
    "createdAt": "2025-04-01T14:30:00Z",
    "updatedAt": "2025-04-01T15:00:00Z"
  }
}
```

## 3.4. Duomenys ir integracijos

### 3.4.1. Duomenų modeliavimas

*   Duomenų modelis atspindi verslo domeną: vienodas žodynas visoje sistemoje (ubiquitous language), atitinkantis organizacijos procesus
*   Normalizacija taikoma pagal poreikį: trečia normalizacijos forma (3NF) kaip numatytasis standartas; denormalizacija leidžiama tik su aiškiu pagrįstimu (našumas, reportingas) ir dokumentuojama
*   Visos schemos keitimas vyksta per versijuotas, grįžtamas (_reversible_) migracijas - draudžiama keisti schemą tiesiogiai produkcijos aplinkoje
*   Migracijos turi būti _zero-downtime_ palaikančios (pvz., expand-contract šablonas stulpelių pervadinimui ar tipų keitimui)
*   Kiekviena migracija testuojama atskiroje aplinkoje prieš diegiant

### 3.4.2. Integracijų tipai ir pasirinkimo kriterijai

Integracijos tipo pasirinkimas turi būti pagrįstas ir dokumentuotas (ADR):

*   **Sinchroninės integracijos (REST / GraphQL):**
    *   Tinkamos realaus laiko skaitymui ir rašymui, kai reikalingas tiesioginis atsakymas
    *   Draudžiama naudoti sinchronines integracijas ilgai trunkančioms operacijoms (> 5s) - jos turi būti asinchronizuotos
*   **Asinchroninės / event-driven integracijos:**
    *   Tinkamos atjungtoms priklausomybėms, integraciniams pranešimams, audit log srautams ir procesams, kurie gali vykti lygiagrečiai
    *   Įvykių schemos versijuojamos ir dokumentuojamos; breaking changes - nauja versija (toks pat principas kaip API versijavime)
    *   Įvykių pavadinimai - praeitojo laiko daiktavardiniai junginiai (documentApproved, ne approveDocument)
*   **Failų ir paketinės (batch) integracijos:**
    *   Tinkamos dideliems duomenų kiekiams, periodiniams sinchronizavimams (pvz., registrų duomenys, ataskaitos)
    *   Kiekviena siunta turi unikalų identifikatorių ir apdorojimo statusą; palaikomas dalinės sėkmės apdorojimas
    *   Failų integracijos naudoja aiškų formatą (CSV su schema, XML su XSD, JSON su JSON Schema) - draudžiamas neaprašytas formatas

### 3.4.3. Patikimumas ir atsparumas gedimams

Šiame poskyryje apibrėžiami duomenų mainų ir integracijų patikimumo reikalavimai, kai duomenys perduodami tarp vidinių ar išorinių sistemų. Bendrieji timeout, retry, circuit breaker ir API atsparumo reikalavimai apibrėžti [[#3.3](#33-backend-ir-api-principai).7](#idempotentiškumas) ir [[#3.3](#33-backend-ir-api-principai).9](#greitaveika-patikimumas-ir-talpyklos) skyriuose.

PRIVALOMA:

<!-- ARCH-DATA-P01 | ai-reviewable -->
*   Visi integracijų taškai turi turėti aiškiai apibrėžtą klaidų apdorojimą; draudžiamos integracijos, kurios nesėkmės atveju palieka neapibrėžtą būseną.
<!-- ARCH-DATA-P02 | human-reviewable -->
*   Asinchroniniai vartotojai (consumers) turi būti idempotentiniai, nes tas pats pranešimas gali būti pristatytas daugiau nei vieną kartą (at-least-once delivery).
<!-- ARCH-DATA-P03 | human-reviewable -->
*   Kiekviena failų ar paketinio apdorojimo siunta turi turėti unikalų identifikatorių ir aiškų apdorojimo statusą.

REKOMENDUOJAMA:

<!-- ARCH-DATA-R01 | human-reviewable -->
*   Nepavykusių pranešimų apdorojimui naudoti Dead Letter Queue (DLQ) arba lygiavertį mechanizmą, kad klaidingi pranešimai būtų atskirti nuo sėkmingai apdorojamų.
<!-- ARCH-DATA-R02 | human-reviewable -->
*   Naudoti Outbox pattern tais atvejais, kai reikia patikimai suderinti duomenų bazės pakeitimą ir pranešimo išsiuntimą.
<!-- ARCH-DATA-R03 | ai-reviewable -->
*   Integracijose su išorinėmis sistemomis rekomenduojama taikyti aiškų degradacijos režimą (degraded mode) arba kešuotų duomenų naudojimą, jei išorinė sistema laikinai nepasiekiama.

> Susiję skyriai: [3.3.7](#337-idempotentiškumas) · [3.3.9](#339-greitaveika-patikimumas-ir-talpyklos) · [3.4.2](#342-integracijų-tipai-ir-pasirinkimo-kriterijai) · [3.4.7](#347-valstybinių-registrų-ir-išorinių-sistemų-integracijos)

### 3.4.4. Schemos valdymas ir kontraktų suderinamumas

Šiame poskyryje apibrėžiami duomenų schemų ir integracinių kontraktų suderinamumo reikalavimai, taikomi tiek sinchroninėms, tiek asinchroninėms integracijoms. Bendrieji API kontraktų, versijavimo ir breaking changes reikalavimai apibrėžti [[#3.3](#33-backend-ir-api-principai).1](#specifikacija-ir-dokumentacija) ir [[#3.3](#33-backend-ir-api-principai).2](#versijavimas) skyriuose.

PRIVALOMA:

<!-- ARCH-DATA-P04 | human-reviewable -->
*   Mažosioms versijoms turi būti užtikrinamas atgalinis suderinamumas (backward compatibility).
<!-- ARCH-DATA-P05 | ai-reviewable -->
*   Nauji neprivalomi laukai gali būti pridedami, tačiau esami laukai neturi būti šalinami ar keičiami taip, kad būtų pažeistas suderinamumas su jau veikiančiais integracijos vartotojais.
<!-- ARCH-DATA-P06 | human-reviewable -->
*   Breaking changes turi būti valdomi kaip nauja kontrakto ar schemos versija.

REKOMENDUOJAMA:

<!-- ARCH-DATA-R04 | ai-reviewable -->
*   Tarp vidinių servisų naudoti kontraktų testus (contract testing), kad būtų užtikrinta, jog provider atitinka consumer lūkesčius be pilno integracinio testavimo.
<!-- ARCH-DATA-R05 | ai-reviewable -->
*   Asinchroninėms integracijoms su dideliu įvykių srautu naudoti schemų registrą (Schema Registry), kad schemų versijos ir suderinamumas būtų valdomi centralizuotai.
<!-- ARCH-DATA-R06 | ai-reviewable -->
*   Kontraktų testai ir schemų registras neturi būti laikomi universaliai privalomais visais atvejais; jų taikymas pasirenkamas pagal integracijos tipą ir sudėtingumą.
<!-- ARCH-DATA-R07 | ai-reviewable -->
*   Kontraktų testai pirmiausia tinka vidinių servisų tarpusavio integracijoms.
<!-- ARCH-DATA-R08 | ai-reviewable -->
*   Schemų registras pirmiausia tinka didelės apimties event-driven architektūroms.

> Susiję skyriai: [3.3.1](#331-specifikacija-ir-dokumentacija) · [3.3.2](#332-versijavimas) · [3.4.2](#342-integracijų-tipai-ir-pasirinkimo-kriterijai) · [3.4.3](#343-patikimumas-ir-atsparumas-gedimams)

### 3.4.5. Asmens duomenų apsauga (BDAR / GDPR)

Šiame poskyryje apibrėžiami asmens duomenų apsaugos reikalavimai, taikomi duomenų mainams, integracijoms ir tarp sistemų judantiems duomenų srautams. Bendrieji asmens duomenų apsaugos, prieigos kontrolės, duomenų subjektų teisių ir saugojimo terminų reikalavimai apibrėžti [#6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) skyriuje.

PRIVALOMA:

<!-- ARCH-DATA-P07 | ai-reviewable -->
*   Integracijose ir duomenų mainuose perduodami tik tie asmens duomenys, kurie yra būtini aiškiai apibrėžtam tikslui pasiekti.
<!-- ARCH-DATA-P08 | ai-reviewable -->
*   Kiekvienam duomenų srautui, kuriame perduodami asmens duomenys, turi būti aiškiai apibrėžtas tvarkymo tikslas, teisinis pagrindas ir perduodamų duomenų apimtis.
<!-- ARCH-DATA-P09 | ai-reviewable -->
*   Asmens duomenų laukai, perduodami tarp sistemų, turi būti klasifikuojami pagal jautrumą ir ši klasifikacija turi būti naudojama prieigos kontrolei, logavimui ir duomenų srautų dokumentavimui.
<!-- ARCH-DATA-P10 | ai-reviewable -->
*   Integracijose turi būti numatytos techninės priemonės, leidžiančios užtikrinti duomenų subjekto teisių įgyvendinimą tais atvejais, kai asmens duomenys yra pasklidę per kelias sistemas ar duomenų mainų grandines.
<!-- ARCH-DATA-P11 | ai-reviewable -->
*   Asmens duomenų saugojimo terminai ir trynimo arba pseudonimizacijos logika turi būti apibrėžti ne tik pagrindinėje sistemoje, bet ir integracijose, tarpinėse saugyklose, eilėse bei eksportuose.
<!-- ARCH-DATA-P12 | process-level -->
*   Jei asmens duomenys perduodami į išorines sistemas ar registrus, toks perdavimas turi būti dokumentuojamas kartu su duomenų srauto aprašu, teisiniu pagrindu ir atsakomybėmis.

REKOMENDUOJAMA:

<!-- ARCH-DATA-R09 | ai-reviewable -->
*   Projektuojant integracijas vengti perteklinio asmens duomenų dubliavimo keliose sistemose, jei tą patį tikslą galima pasiekti naudojant nuorodas, identifikatorius ar agreguotus duomenis.
<!-- ARCH-DATA-R10 | ai-reviewable -->
*   Didelės rizikos duomenų srautams naudoti papildomas apsaugos priemones, pvz., pseudonimizaciją, laukų maskavimą ar atskirą jautrių duomenų perdavimo kanalą.
<!-- ARCH-DATA-R11 | ai-reviewable -->
*   Duomenų srautų dokumentacijoje aiškiai nurodyti, kur asmens duomenys yra sukuriami, kur perduodami, kur saugomi ir kur ištrinami.
<!-- ARCH-DATA-R12 | ai-reviewable -->
*   Jei integracijų grandinėje dalyvauja keli tiekėjai ar išorinės sistemos, rekomenduojama aiškiai atskirti atsakomybes už duomenų tvarkymą, saugojimą ir incidentų valdymą.

> Susiję skyriai: [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.3.4](#334-apsauga-ir-prieiga) · [3.4.7](#347-valstybinių-registrų-ir-išorinių-sistemų-integracijos) · [9.7](09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)

### 3.4.6. Duomenų kokybė

Šiame poskyryje apibrėžiami duomenų kokybės reikalavimai, taikomi tiek vidiniams duomenims, tiek duomenims, gaunamiems iš integracijų ir išorinių šaltinių.

Bendrieji įvesties validacijos reikalavimai apibrėžti [#3.6](#36-patikimumas-ir-atsparumas) skyriuje.

PRIVALOMA:

<!-- ARCH-DATA-P13 | ai-reviewable -->
*   Integruojant išorinius duomenis, jų validacija turi būti atliekama įėjimo taške prieš duomenis įtraukiant į sistemą.
<!-- ARCH-DATA-P14 | ai-reviewable -->
*   Nekorektiški, nepilni ar kontrakto neatitinkantys duomenys negali būti tyliai įleidžiami į sistemą be aiškaus apdorojimo scenarijaus.
<!-- ARCH-DATA-P15 | ai-reviewable -->
*   Jei duomenys neatitinka nustatytų kokybės taisyklių, sistema turi juos atmesti, pažymėti kaip netinkamus arba nukreipti į aiškiai apibrėžtą taisymo / peržiūros procesą.
<!-- ARCH-DATA-P16 | human-reviewable -->
*   Kritiniams verslo duomenims turi būti aiškiai nustatyti minimalūs kokybės reikalavimai, kai tai būtina sistemos veikimui ar teisiniam atsekamumui užtikrinti.

REKOMENDUOJAMA:

<!-- ARCH-DATA-R13 | ai-reviewable -->
*   Duomenų kokybės reikalavimus apibrėžti kartu su funkciniais reikalavimais, įtraukiant bent pilnumo, tikslumo, unikalumo ir aktualumo aspektus.
<!-- ARCH-DATA-R14 | ai-reviewable -->
*   Duomenų anomalijas stebėti ir naudoti įspėjimus tais atvejais, kai pastebimi netipiniai pokyčiai, pavyzdžiui, staigus įrašų skaičiaus sumažėjimas ar neįprastas klaidų kiekis po integracijos.
<!-- ARCH-DATA-R15 | ai-reviewable -->
*   Kritiniams verslo duomenims nustatyti kokybės rodiklius, kurie būtų stebimi laikui bėgant ir naudojami duomenų kokybės tendencijoms vertinti.
<!-- ARCH-DATA-R16 | ai-reviewable -->
*   Jei duomenys ateina iš kelių šaltinių, rekomenduojama aiškiai apibrėžti prioritetinį tiesos šaltinį ir taisykles, kaip sprendžiami duomenų neatitikimai.

> Susiję skyriai: [3.3.6](#336-input-validacija-ir-užklausų-apsauga) · [3.4.4](#344-schemos-valdymas-ir-kontraktų-suderinamumas) · [3.4.7](#347-valstybinių-registrų-ir-išorinių-sistemų-integracijos)

### 3.4.7. Valstybinių registrų ir išorinių sistemų integracijos

Šiame poskyryje apibrėžiami reikalavimai integracijoms su valstybiniais registrais, išorinėmis informacinėmis sistemomis ir trečiųjų šalių paslaugomis.

Šie reikalavimai taikomi tiek naujoms, tiek modifikuojamoms integracijoms.

PRIVALOMA:

<!-- ARCH-DATA-P17 | ai-reviewable -->
*   Integracijos su valstybiniais registrais ir išorinėmis sistemomis vykdomos tik per oficialius API, duomenų mainų kanalus arba kitus teisėtai patvirtintus sąveikos mechanizmus.
<!-- ARCH-DATA-P18 | ai-reviewable -->
*   Kiekviena tokia integracija turi būti dokumentuojama, nurodant bent tikslą, duomenų srautą, teisinį pagrindą, atsakingas šalis ir atnaujinimo dažnį.
<!-- ARCH-DATA-P19 | human-reviewable -->
*   Išorinių sistemų prieinamumas turi būti stebimas atskirai nuo vidinių sistemų būklės.
<!-- ARCH-DATA-P20 | ai-reviewable -->
*   Sistemos veikimas neturi visiškai priklausyti nuo išorinės sistemos prieinamumo; turi būti numatytas aiškus degradacijos režimas, kešuoti duomenys arba alternatyvus veikimo scenarijus, jei tai leidžia verslo logika.
<!-- ARCH-DATA-P21 | ai-reviewable -->
*   Testavimo aplinkose turi būti naudojami oficialūs sandbox’ai arba mock’ai; draudžiama testuoti prieš produkcines valstybinių registrų ar išorinių sistemų aplinkas.

REKOMENDUOJAMA:

<!-- ARCH-DATA-R17 | ai-reviewable -->
*   Kritinėms integracijoms apibrėžti aiškius timeout, retry ir eskalavimo principus pagal [[#3.3](#33-backend-ir-api-principai).9](#greitaveika-patikimumas-ir-talpyklos) ir [#9](09-stebesena-logai.md) skyriaus reikalavimus.
<!-- ARCH-DATA-R18 | ai-reviewable -->
*   Integracijų atsakymai ir klaidos turėtų būti stebimi per atskiras technines ir verslo metrikas, kad būtų galima laiku identifikuoti degradaciją arba netipinį elgesį.
<!-- ARCH-DATA-R19 | ai-reviewable -->
*   Jei integracija grąžina didelės apimties ar periodiškai atnaujinamus duomenis, rekomenduojama aiškiai apibrėžti kešavimo, sinchronizavimo arba atnaujinimo strategiją.
<!-- ARCH-DATA-R20 | ai-reviewable -->
*   Jei integracija naudoja jautrius ar asmens duomenis, rekomenduojama aiškiai nurodyti, kurie duomenys yra gaunami, kurie saugomi ir kurie perduodami toliau.

> Susiję skyriai: [3.4.2](#342-integracijų-tipai-ir-pasirinkimo-kriterijai) · [3.4.3](#343-patikimumas-ir-atsparumas-gedimams) · [3.4.5](#345-asmens-duomenų-apsauga-bdar-gdpr) · [3.4.6](#346-duomenų-kokybė) · [9](09-stebesena-logai.md)

## 3.5. Konfigūracija, slaptieji raktai ir aplinkos

Šiame skyriuje apibrėžiami projektinio lygmens konfigūracijos, slaptųjų raktų ir aplinkų valdymo reikalavimai; bendrieji saugumo principai slaptiesiems raktams nustatyti [#6.4](06-saugumas.md#64-secrets-management) skyriuje, o aplinkų atskyrimo ir diegimo užtikrinimo mechanizmai – [#8.1](08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai) skyriuje.

### 3.5.1. Konfigūracija

PRIVALOMA:

<!-- ARCH-CFG-P01 | ai-reviewable -->
*   Visa konfigūracija valdoma per aplinkos kintamuosius arba konfigūracijos paslaugą; draudžiamos hardcoded reikšmės kode ar versijų valdymo sistemoje.
<!-- ARCH-CFG-P02 | ai-reviewable -->
*   Sistema paleidimo metu turi validuoti visą būtiną konfigūraciją; jei trūksta privalomų reikšmių, paleidimas sustabdomas su aiškia klaida.
<!-- ARCH-CFG-P03 | ai-reviewable -->
*   Konfigūracijos keitimai turi būti atsekami ir registruojami audito žurnale.

REKOMENDUOJAMA:

<!-- ARCH-CFG-R01 | ai-reviewable -->
*   Aplinkos specifinę ir bendrą konfigūraciją aiškiai atskirti.
<!-- ARCH-CFG-R02 | ai-reviewable -->
*   Feature flags laikyti konfigūracijos dalimi ir jiems taikyti tuos pačius valdymo reikalavimus.

> Susiję skyriai: [3.1.6](#316-diegimo-parengtis-ir-konfigūracijos-valdymas) · [8.1](08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai) · [9.1](09-stebesena-logai.md#91-logging-žurnalų-standartai) · [9.7](09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)

### 3.5.2. Slaptieji raktai

Slaptų konfigūracijos reikšmių (slaptažodžių, API raktų, tokenų, sertifikatų ir pan.) valdymas turi būti vykdomas pagal **[#6.4](06-saugumas.md#64-secrets-management) skyriuje „Secrets management“** nustatytus reikalavimus (saugyklos naudojimas, rotacija, prieigos kontrolė, atsekamumas ir reagavimas į nutekėjimus).

### 3.5.3. Aplinkos

PRIVALOMA:

<!-- ARCH-CFG-P04 | human-reviewable -->
*   Turi būti palaikomos bent izoliuotos DEV, STAGING ir PROD aplinkos.
<!-- ARCH-CFG-P05 | ai-reviewable -->
*   Kiekviena aplinka turi turėti atskirus kredencialus, slaptuosius raktus ir konfigūraciją.
<!-- ARCH-CFG-P06 | ai-reviewable -->
*   Gamybos duomenys negali būti naudojami žemesnėse aplinkose, ypač jei juose yra asmens duomenų.

REKOMENDUOJAMA:

<!-- ARCH-CFG-R03 | human-reviewable -->
*   Žemesnėse aplinkose naudoti kontroliuojamus seed duomenis.
<!-- ARCH-CFG-R04 | ai-reviewable -->
*   Žemesnių aplinkų konfigūracija turėtų kuo labiau atitikti PROD, kad būtų mažiau skirtumų tarp kūrimo ir eksploatacijos.

> Susiję skyriai: [8.1](08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai) · [8.3](08-devops-ci-cd.md#83-cd-continuous-delivery-deployment) · [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [7.5](07-testavimas.md#75-testavimo-duomenys-ir-aplinkos)

## 3.6. Patikimumas ir atsparumas

Šiame skyriuje apibrėžiami minimalūs architektūriniai ir operaciniai reikalavimai, užtikrinantys sistemos patikimumą, atsparumą gedimams ir kontroliuojamą elgseną sutrikimų metu. Reikalavimai taikomi visoms sistemoms pagal jų kritiškumo lygį ir nefunkcinius reikalavimus (NFR). Detalūs diegimo ir platforminiai įgyvendinimo mechanizmai apibrėžti [8 skyriuje](08-devops-ci-cd.md), o paslaugų lygio, stebėsenos ir incidentų valdymo reikalavimai – [#9](09-stebesena-logai.md) skyriuje.

### 3.6.1. Diegimo topologija ir prieinamumas

PRIVALOMA:

<!-- ARCH-REL-P01 | ai-reviewable -->
*   Kritinėms paslaugoms turi būti užtikrintas atsparumas vieno komponento ar mazgo gedimui; draudžiamas vienas gedimo taškas (single point of failure).
<!-- ARCH-REL-P02 | human-reviewable -->
*   Kritinėms paslaugoms turi būti naudojamos ne mažiau kaip 2 replikos skirtingose gedimo zonose arba skirtinguose fiziniuose mazguose.
<!-- ARCH-REL-P03 | ai-reviewable -->
*   Load balancer paskirstymo politika turi būti apibrėžta taip, kad srautas būtų nukreipiamas tik į sveikas replikas, o nesveikos būtų automatiškai išjungiamos iš rotacijos.
<!-- ARCH-REL-P04 | process-level -->
*   Sistemos kritiškumo lygis turi būti dokumentuotas ir turi nulemti minimalų replikų skaičių bei prieinamumo tikslus.
<!-- ARCH-REL-P05 | ai-reviewable -->
*   Kritinių paslaugų RTO ir RPO tikslai turi būti apibrėžti projektavimo stadijoje ir suderinti su verslo savininku.

> Susiję skyriai: [9.5](09-stebesena-logai.md#95-sla-slo-ir-sli) · [8.1](08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai) · [8.5](08-devops-ci-cd.md#85-konteinerių-ir-kubernetes-diegimo-reikalavimai)

### 3.6.2. Sveikatos patikrinimas

PRIVALOMA:

<!-- ARCH-REL-P06 | ai-reviewable -->
*   Visi konteinerizuoti servisai turi įgyvendinti atskirus liveness, readiness ir, kai taikoma, startup patikrinimus su aiškia semantika.
<!-- ARCH-REL-P07 | ai-reviewable -->
*   Liveness patikrinimas turi vertinti, ar servisas gyvas ir gali tęsti darbą; jo nesėkmė turi lemti serviso perkrovimą.
<!-- ARCH-REL-P08 | ai-reviewable -->
*   Readiness patikrinimas turi vertinti, ar servisas pasiruošęs aptarnauti srautą; jo nesėkmė turi lemti serviso pašalinimą iš srauto, bet ne automatinį perkrovimą.
<!-- ARCH-REL-P09 | ai-reviewable -->
*   Startup patikrinimas turi būti naudojamas servisams, kurių inicializacija trunka ilgiau, kad paleidimo metu nebūtų klaidingai suveikęs liveness patikrinimas.
<!-- ARCH-REL-P10 | human-reviewable -->
*   Sveikatos patikrinimų semantika turi būti nuosekli visose sistemose ir neprieštarauti platformos elgsenai.
<!-- ARCH-REL-P11 | ai-reviewable -->
*   Jei naudojamas bendras health endpoint, jis turi grąžinti struktūrizuotą būseną, leidžiančią atskirti bendrą sistemos būklę nuo priklausomybių būsenų.

REKOMENDUOJAMA:

<!-- ARCH-REL-R01 | ai-reviewable -->
*   Liveness patikrinime nevertinti išorinių priklausomybių, jei jų laikinas nepasiekiamumas neturi lemti serviso perkrovimo.
<!-- ARCH-REL-R02 | ai-reviewable -->
*   Readiness patikrinime vertinti svarbiausias priklausomybes, nuo kurių tiesiogiai priklauso užklausų aptarnavimas.

> Susiję skyriai: [9.2](09-stebesena-logai.md#92-monitoring-ir-metrikos) · [8.5](08-devops-ci-cd.md#85-konteinerių-ir-kubernetes-diegimo-reikalavimai)

### 3.6.3. Atsparumas tarpservisinėse komunikacijose

PRIVALOMA:

<!-- ARCH-REL-P12 | ai-reviewable -->
*   Visi išoriniai ir tarpservisiniai kvietimai turi turėti aiškiai apibrėžtus timeout’us; draudžiami kvietimai be laiko ribos.
<!-- ARCH-REL-P13 | ai-reviewable -->
*   Klaidų apdorojimas privalomas visuose integracijos taškuose; nenumatyta išimtis negali sugriauti viso proceso.
<!-- ARCH-REL-P14 | human-reviewable -->
*   Servisai turi būti projektuojami taip, kad trumpalaikis vienos priklausomybės sutrikimas nesukeltų kaskadinio visos sistemos gedimo.

REKOMENDUOJAMA:

<!-- ARCH-REL-R03 | ai-reviewable -->
*   Sinchroninėms integracijoms taikyti circuit breaker mechanizmą, kad po apibrėžto klaidų skaičiaus būtų grąžinama greita klaida, o ne kaupiamas kaskadinis gedimas.
<!-- ARCH-REL-R04 | human-reviewable -->
*   Retry mechanizmuose naudoti eksponentinį atsitraukimą ir jitter, kad būtų išvengta sinchronizuotų pakartotinių bandymų audros.
<!-- ARCH-REL-R05 | human-reviewable -->
*   Asinchroniniams vartotojams taikyti retry politiką su ribotu bandymų skaičiumi ir nepavykusius pranešimus nukreipti į DLQ arba lygiavertį mechanizmą.
<!-- ARCH-REL-R06 | human-reviewable -->
*   Vartotojų concurrency turi būti ribojamas taip, kad gedimo atveju nebūtų perkraunamos priklausomybės.
<!-- ARCH-REL-R07 | ai-reviewable -->
*   Jei downstream servisas neveikia, vartotojas turi pristabdyti apdorojimą arba pereiti į aiškiai apibrėžtą degradacijos režimą, o ne kaupti nekontroliuojamą klaidų srautą.

> Susiję skyriai: [3.3.7](#337-idempotentiškumas) · [3.3.9](#339-greitaveika-patikimumas-ir-talpyklos) · [9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling)

### 3.6.4. Patikrinimas prieš sudėtingas operacijas (pre-flight validation)

REKOMENDUOJAMA:

<!-- ARCH-REL-R08 | ai-reviewable -->
*   Prieš pradedant ilgai trunkančias, daug resursų naudojančias ar sunkiai grįžtamas operacijas, rekomenduojama atlikti išankstinius patikrinimus.
<!-- ARCH-REL-R09 | ai-reviewable -->
*   Patikrinimai turėtų apimti priklausomybių prieinamumą, įvesties duomenų validumą, reikiamas teises ir svarbiausių resursų prieinamumą.
<!-- ARCH-REL-R10 | ai-reviewable -->
*   Jei operacija negali būti saugiai pradėta, sistema turėtų grąžinti aiškią klaidą iš karto, o ne po ilgo vykdymo.

> Susiję skyriai: [3.3.6](#336-input-validacija-ir-užklausų-apsauga) · [9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling)

### 3.6.5. Graceful shutdown ir ilgų operacijų valdymas

REKOMENDUOJAMA:

<!-- ARCH-REL-R11 | ai-reviewable -->
*   Servisai turėtų palaikyti graceful shutdown, kad gavus sustabdymo signalą būtų užbaigiamos vykdomos užklausos per apibrėžtą laikotarpį, nepriimant naujų.
<!-- ARCH-REL-R12 | ai-reviewable -->
*   Ilgai trunkančios operacijos, viršijančios nustatytus laiko limitus, turėtų būti nutraukiamos kontroliuotai, su aiškia būsena ir klaidos rezultatu.
<!-- ARCH-REL-R13 | ai-reviewable -->
*   Jei operacija apima kelis servisus ar kelis žingsnius, rekomenduojama apibrėžti kompensavimo logiką arba kitą atkuriamumo mechanizmą.
<!-- ARCH-REL-R14 | ai-reviewable -->
*   Jei naudojamas Saga ar kitas kompensacinis modelis, jo elgsena turi būti dokumentuota.

> Susiję skyriai: [3.8](#38-diagramos-ir-dokumentavimas) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas)

### 3.6.6. Mažiausių privilegijų principas operaciniu lygmeniu

PRIVALOMA:

<!-- ARCH-REL-P15 | ai-reviewable -->
*   Kiekvienas servisas, procesas ir automatizuota užduotis turi gauti tik minimalias teises, būtinas savo funkcijai atlikti.
<!-- ARCH-REL-P16 | ai-reviewable -->
*   Servisų paskyros negali turėti interaktyvių prisijungimo teisių, perteklinių administracinių teisių ar prieigos prie kitų servisų duomenų be aiškaus poreikio.
<!-- ARCH-REL-P17 | process-level -->
*   Privilegijos turi būti peržiūrimos kartu su sistemos pakeitimais, o nebereikalingos teisės – šalinamos.
<!-- ARCH-REL-P18 | human-reviewable -->
*   Architektūra turi būti projektuojama taip, kad gedimo ar klaidos atveju servisas negalėtų atlikti veiksmų už savo atsakomybės ribų.

> Susiję skyriai: [3.1.3](#313-security-by-design-ir-privacy-by-design) · [3.3.4](#334-apsauga-ir-prieiga) · [6](06-saugumas.md)

### 3.6.7. Duomenų atsarginės kopijos ir atkūrimas

PRIVALOMA:

<!-- ARCH-REL-P19 | human-reviewable -->
*   Duomenų bazių ir kitų kritinių duomenų atsarginės kopijos turi būti daromos ne rečiau kaip kas 24 valandas; konkretus dažnis turi atitikti nustatytus RPO tikslus.
<!-- ARCH-REL-P20 | ai-reviewable -->
*   Atkūrimo procedūra turi būti dokumentuota ir testuojama ne rečiau kaip kartą per 6 mėnesius; netestuota atsarginė kopija nelaikoma pakankama.
<!-- ARCH-REL-P21 | ai-reviewable -->
*   Atsarginės kopijos turi būti saugomos atskirai nuo pagrindinės sistemos, naudojant kitą zoną, lokaciją arba kitą logiškai atskirtą saugyklą.
<!-- ARCH-REL-P22 | process-level -->
*   Atkūrimo trukmė turi būti tikrinama pagal nustatytus RTO tikslus ne rečiau kaip kartą per 6 mėnesius.

REKOMENDUOJAMA:

<!-- ARCH-REL-R15 | ai-reviewable -->
*   Atkūrimo testų rezultatus dokumentuoti ir naudoti tikslinant RTO ir RPO prielaidas.
<!-- ARCH-REL-R16 | human-reviewable -->
*   Kritinėms sistemoms reguliariai tikrinti ne tik atsarginių kopijų sukūrimą, bet ir pilną atkūrimo scenarijų.

> Susiję skyriai: [9.5](09-stebesena-logai.md#95-sla-slo-ir-sli) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas) · [9.8](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)

## 3.7. Stebėsena ir diagnostika

Projektuojant sistemą PRIVALOMA numatyti galimybes stebėti sistemos būseną, diagnozuoti sutrikimus ir analizuoti incidentus.

Stebėsenos ir diagnostikos sprendimai turi būti proporcingi sistemos kritiškumui, suderinti su nefunkciniais reikalavimais (NFR) ir užtikrinti, kad sutrikimai būtų laiku pastebimi, atsekami ir analizuojami.

Konkretūs reikalavimai logams, metrikoms, alertams, incidentų valdymui ir audito pėdsakui apibrėžti [#9](09-stebesena-logai.md) skyriuje.

## 3.8. Diagramos ir dokumentavimas

Šiame skyriuje apibrėžiami architektūrinių diagramų ir techninio dokumentavimo reikalavimai, būtini sistemos suprantamumui, perimamumui ir palaikomumui užtikrinti.

Bendrieji dokumentacijos valdymo, saugojimo ir atnaujinimo reikalavimai apibrėžti [#10](10-dokumentacija.md) skyriuje.

### 3.8.1. Architektūros diagramos (C4 modelis)

C4 modelis naudojamas kaip standartinis architektūros vizualizavimo formatas. Skirtingi lygiai turi skirtingus privalomumo reikalavimus.

PRIVALOMA:

<!-- ARCH-DOC-P01 | human-reviewable -->
*   System Context diagrama (C4 L1) – sistema ir jos aplinka: kokie išoriniai vartotojai, sistemos ir registrai su ja sąveikauja. Privaloma bet kokiai sistemai, nepaisant dydžio.
<!-- ARCH-DOC-P02 | ai-reviewable -->
*   Container diagrama (C4 L2) – pagrindiniai aplikacijos blokai: web aplikacija, API, duomenų bazė, eilės, išorinės integracijos.
<!-- ARCH-DOC-P03 | human-reviewable -->
*   Infrastruktūros diagrama – fiziniai arba virtualūs komponentai, tinklų segmentai, ugniasienės, load balanceriai, sertifikatai. Gali būti atskira nuo C4, jei infrastruktūra valdoma kaip kodas.

REKOMENDUOJAMA:

<!-- ARCH-DOC-R01 | human-reviewable -->
*   Component diagrama (C4 L3) – vidinė konteinerio struktūra; rekomenduojama sudėtingiems servisams su daug vidinių modulių.
<!-- ARCH-DOC-R02 | human-reviewable -->
*   Code diagrama (C4 L4) – paprastai generuojama automatiškai iš kodo; rankinis palaikymas nerekomenduojamas.

### 3.8.2. Sudėtingų procesų dokumentavimas

Šie procesų tipai turi būti dokumentuoti diagramomis arba struktūrizuotu aprašu:

*   Integracijų srautai – sekų diagramos tarp sistemų; ypač svarbios asinchroninėms ir daugiažingsnėms integracijoms.
*   Duomenų srautai (DFD) – kaip asmens ir jautrūs duomenys juda tarp sistemų, kur saugomi ir kas turi prieigą; privaloma BDAR kontekste.
*   Verslo procesai – sudėtingos verslo taisyklės, būsenos mašinos, kompensaciniai srautai; BPMN arba būsenos diagramos.
*   Diegimo procesas – kaip sistema diegiama, atnaujinama ir atstatoma; runbook arba lygiavertis aprašas.

Sudėtingu laikomas procesas, kurio naujas kūrėjas negali pilnai suprasti per 30 minučių skaitydamas tik kodą.

### 3.8.3. Architektūrinės dokumentacijos palaikymas ir įrankiai

PRIVALOMA:

<!-- ARCH-DOC-P04 | ai-reviewable -->
*   Architektūros diagramos ir ADR turi būti saugomi versijų kontrolėje kartu su kodu.
<!-- ARCH-DOC-P05 | ai-reviewable -->
*   Architektūrinė dokumentacija turi būti atnaujinama kartu su ją keičiančiais techniniais sprendimais.
<!-- ARCH-DOC-P06 | ai-reviewable -->
*   Jei pakeitimas turi įtakos architektūrai, integracijoms ar sistemų sąveikai, dokumentacija negali būti laikoma aktualia be atitinkamo atnaujinimo.

REKOMENDUOJAMA:

<!-- ARCH-DOC-R03 | human-reviewable -->
*   Diagramoms naudoti diagrams-as-code įrankius, tokius kaip Mermaid, PlantUML arba Structurizr DSL.
<!-- ARCH-DOC-R04 | ai-reviewable -->
*   Grafiniai braižymo įrankiai gali būti naudojami, jei galutinis rezultatas eksportuojamas ir saugomas repozitorijoje kartu su šaltinio failu.
<!-- ARCH-DOC-R05 | ai-reviewable -->
*   Organizacijos lygmeniu rekomenduojama naudoti kuo mažesnį įrankių ir formatų rinkinį.

Išsamūs dokumentacijos saugojimo, atnaujinimo ir valdymo reikalavimai apibrėžti [#10](10-dokumentacija.md) skyriuje.

### 3.8.4. Onboarding dokumentacija

Kiekviena sistema turi turėti techninį onboarding minimumą, leidžiantį naujam programuotojui suprasti sistemos paskirtį, paleidimą ir pagrindinę struktūrą.

PRIVALOMA:

<!-- ARCH-DOC-P07 | ai-reviewable -->
*   README failas repozitorijos šaknyje turi apimti bent:
    *   sistemos paskirtį ir vietą ekosistemoje
    *   kūrimo aplinkos paleidimo instrukciją
    *   pagrindinių konfigūracijos kintamųjų aprašą
    *   nuorodas į ADR, architektūros diagramas ir API dokumentaciją
    *   kontaktus arba atsakingą komandą
<!-- ARCH-DOC-P08 | human-reviewable -->
*   README aktualumas turi būti tikrinamas kartu su sistemos pakeitimais.

## 3.9. Mobilios aplikacijos (jei taikoma)

Šis skyrius apibrėžia mobiliųjų aplikacijų architektūros, saugumo, duomenų sinchronizacijos, prieinamumo, lokalizacijos, atnaujinimų, testavimo ir platinimo reikalavimus.

Mobiliosioms aplikacijoms taikomi tie patys bendrieji architektūros, saugumo, testavimo, dokumentavimo ir eksploatacijos principai kaip ir kitoms sistemoms, papildomai atsižvelgiant į iOS ir Android platformų specifiką.

### 3.9.1. Architektūra ir kodo struktūra

PRIVALOMA:

<!-- ARCH-MOB-P01 | human-reviewable -->
*   Naudojama sluoksniuota architektūra, aiškiai atskirianti UI, verslo logiką ir duomenų sluoksnį; MVVM arba MVI laikomi rekomenduojamais įgyvendinimo šablonais.
<!-- ARCH-MOB-P02 | ai-reviewable -->
*   Priklausomybių injekcija privaloma; komponentai neturi kurti savo priklausomybių tiesiogiai.
<!-- ARCH-MOB-P03 | ai-reviewable -->
*   Navigacijos architektūra turi būti apibrėžta iš anksto; draudžiama chaotiška navigacija tarp ekranų.
<!-- ARCH-MOB-P04 | ai-reviewable -->
*   Turi būti aiškiai apibrėžta, kurie duomenys laikomi lokaliai, kurie gaunami iš tinklo, o kurie valdomi per sesiją ar aplikacijos būseną.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R01 | ai-reviewable -->
*   Offline-first taikyti tada, kai aplikacija tikėtinai bus naudojama nestabilaus ryšio sąlygomis.
<!-- ARCH-MOB-R02 | human-reviewable -->
*   Jei offline-first netaikomas, tinklo klaidų apdorojimas vis tiek turi būti aiškiai numatytas.

> Susiję skyriai: [3.1](#31-bendrieji-architektūriniai-principai) · [3.2](#32-frontend-web-principai) · [3.4](#34-duomenys-ir-integracijos)

### 3.9.2. Saugumas

Šiame poskyryje apibrėžiami mobiliosioms platformoms specifiniai saugumo įgyvendinimo reikalavimai.

Bendrieji saugumo, autentifikacijos, autorizacijos ir slaptųjų raktų valdymo reikalavimai apibrėžti [#6](06-saugumas.md) skyriuje.

PRIVALOMA:

<!-- ARCH-MOB-P05 | ai-reviewable -->
*   Jautrūs duomenys saugomi tik per OS saugyklas: Keychain iOS ir Keystore Android.
<!-- ARCH-MOB-P06 | ai-reviewable -->
*   Draudžiama saugoti slaptažodžius, tokenus ar asmens duomenis SharedPreferences, UserDefaults ar failų sistemoje be tinkamos apsaugos.
<!-- ARCH-MOB-P07 | ai-reviewable -->
*   Giliosios nuorodos jautrioms operacijoms leidžiamos tik per patvirtintus domenus, naudojant App Links arba Universal Links mechanizmus.
<!-- ARCH-MOB-P08 | ai-reviewable -->
*   Biometrinė autentifikacija gali būti naudojama tik kaip papildomas patogumo mechanizmas, bet ne kaip vienintelis autentifikacijos faktorius.
<!-- ARCH-MOB-P09 | ai-reviewable -->
*   Biometriniai duomenys negali būti iškeliami iš įrenginio ar saugomi aplikacijos lygmeniu.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R03 | ai-reviewable -->
*   Vidaus API naudojančioms aplikacijoms taikyti sertifikatų prisegimą, jei tai pagrįsta rizikos vertinimu.
<!-- ARCH-MOB-R04 | human-reviewable -->
*   Jautriems ekranams išjungti ekrano kopijas.
<!-- ARCH-MOB-R05 | human-reviewable -->
*   Jautrių duomenų nekopijuoti į clipboard be aiškaus vartotojo veiksmo.
<!-- ARCH-MOB-R06 | human-reviewable -->
*   Po atsijungimo arba perėjimo į foninį režimą jautrūs duomenys turėtų būti išvalomi iš atminties.
<!-- ARCH-MOB-R07 | ai-reviewable -->
*   Naudoti bazinius aplikacijos integralumo tikrinimo mechanizmus ir root arba jailbreak aptikimą, apie riziką informuojant vartotoją.

> Susiję skyriai: [3.1.3](#313-security-by-design-ir-privacy-by-design) · [3.3.4](#334-apsauga-ir-prieiga) · [3.5.2](#352-slaptieji-raktai) · [6](06-saugumas.md)

### 3.9.3. Duomenų sinchronizacija

PRIVALOMA:

<!-- ARCH-MOB-P10 | ai-reviewable -->
*   Prieš sinchronizacijos bandymą turi būti tikrinama tinklo būsena arba taikoma aiški retry ir eilės logika.
<!-- ARCH-MOB-P11 | ai-reviewable -->
*   Operacijos negali būti tyliai prarandamos nutrūkus ryšiui; jos turi būti pakartojamos arba aiškiai pažymimos kaip nepavykusios.
<!-- ARCH-MOB-P12 | ai-reviewable -->
*   Konfliktų sprendimo strategija turi būti pasirinkta ir dokumentuota projekto pradžioje.
<!-- ARCH-MOB-P13 | ai-reviewable -->
*   Sinchronizacijos būsena turi būti matoma vartotojui bent minimaliu lygiu, pvz. sinchronizuojama, nepavyko, paskutinį kartą sinchronizuota.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R08 | ai-reviewable -->
*   Konfliktų sprendimui naudoti aiškiai pasirinktą modelį, pvz. server wins, client wins, last write wins arba merge.
<!-- ARCH-MOB-R09 | human-reviewable -->
*   Foninius darbus Android platformoje vykdyti per WorkManager, o iOS platformoje – per BGAppRefreshTask arba BGProcessingTask, atsižvelgiant į OS apribojimus.
<!-- ARCH-MOB-R10 | ai-reviewable -->
*   Jei sinchronizacija kritinė verslo procesui, rekomenduojama turėti atskiras metrikas ir techninę stebėseną.

> Susiję skyriai: [3.3.5](#335-laiko-politika) · [3.6](#36-patikimumas-ir-atsparumas) · [9.2](09-stebesena-logai.md#92-monitoring-ir-metrikos)

### 3.9.4. Prieinamumas ir lokalizacija

Mobiliosioms aplikacijoms taikomi tie patys bendrieji prieinamumo ir lokalizacijos principai kaip ir [[#3.2](#32-frontend-web-principai).4](#tarptautiškumas-ir-lokalizacija) ir [[#3.2](#32-frontend-web-principai).5](#prieinamumas-a11y) skyriuose, papildomai atsižvelgiant į iOS ir Android platformų specifiką.

PRIVALOMA:

<!-- ARCH-MOB-P14 | human-reviewable -->
*   Laikomasi Apple Human Interface Guidelines ir Android Accessibility gairių.
<!-- ARCH-MOB-P15 | ai-reviewable -->
*   WCAG 2.2 AA principai taikomi kaip papildomas standartas mobilioms sąsajoms.
<!-- ARCH-MOB-P16 | human-reviewable -->
*   Visi interaktyvūs elementai turi būti prieinami per VoiceOver ir TalkBack.
<!-- ARCH-MOB-P17 | ai-reviewable -->
*   Dinaminis šrifto dydis turi būti palaikomas taip, kad UI išliktų funkcionalus ir prieinamas.
<!-- ARCH-MOB-P18 | ai-reviewable -->
*   Visi tekstai turi būti laikomi lokalizacijos resursuose; draudžiami hardcoded tekstai.
<!-- ARCH-MOB-P19 | ai-reviewable -->
*   Datos, laikai, skaičiai ir valiutos turi būti formatuojami naudojant OS lokalizacijos API.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R11 | ai-reviewable -->
*   Prieinamumo testavimą vykdyti tiek automatizuotai, tiek rankiniu būdu naudojant ekrano skaitytuvus.
<!-- ARCH-MOB-R12 | human-reviewable -->
*   UI projektavime numatyti, kad tekstas skirtingomis kalbomis gali būti reikšmingai ilgesnis.

> Susiję skyriai: [3.2.4](#324-tarptautiškumas-ir-lokalizacija) · [3.2.5](#325-prieinamumas-a11y) · [7.8](07-testavimas.md#78-prieinamumo-accessibility-testavimas)

### 3.9.5. Atnaujinimų valdymas

PRIVALOMA:

<!-- ARCH-MOB-P20 | ai-reviewable -->
*   Mobili aplikacija turi būti suderinama su ankstesnėmis API versijomis tol, kol reikšminga naudotojų dalis dar nėra atnaujinusi aplikacijos.
<!-- ARCH-MOB-P21 | process-level -->
*   Turi būti numatytas mechanizmas priverstiniam atnaujinimui tais atvejais, kai senoji versija nebepalaikoma arba turi kritinių saugumo spragų.
<!-- ARCH-MOB-P22 | ai-reviewable -->
*   Aplikacijos versija ir build numeris turi būti siunčiami API užklausose arba kitaip perduodami backend sistemai, kad būtų galima stebėti versijų pasiskirstymą.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R13 | ai-reviewable -->
*   API versijų palaikymo laikotarpį apibrėžti pagal naudotojų aktyvumą ir produktų platinimo statistiką, bet ne trumpesnį nei minimaliai būtina saugiam perėjimui.
<!-- ARCH-MOB-R14 | process-level -->
*   Priverstinio atnaujinimo scenarijuose naudotoją informuoti aiškiai, neapsiribojant vien blokavimu.

> Susiję skyriai: [3.3.2](#332-versijavimas) · [9.4](09-stebesena-logai.md#94-klaidos-ir-error-handling)

### 3.9.6. Testavimas

Mobiliosioms aplikacijoms taikomi bendrieji [7 skyriaus](07-testavimas.md) testavimo reikalavimai, papildomai atsižvelgiant į mobiliųjų platformų specifiką.

PRIVALOMA:

<!-- ARCH-MOB-P23 | ai-reviewable -->
*   Vienetų testais turi būti dengiama verslo logika ir būsenos valdymo sluoksnis.
<!-- ARCH-MOB-P24 | ai-reviewable -->
*   Kritiniai vartotojo keliai turi būti tikrinami automatizuotais UI testais.
<!-- ARCH-MOB-P25 | human-reviewable -->
*   Prieš leidimą kritiniai scenarijai turi būti patikrinti bent keliuose fiziniuose įrenginiuose.
<!-- ARCH-MOB-P26 | ai-reviewable -->
*   Turi būti aiškiai apibrėžtos minimaliai palaikomos OS versijos.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R15 | ai-reviewable -->
*   Testuoti bent einamojoje ir ankstesnėje major OS versijoje.
<!-- ARCH-MOB-R16 | ai-reviewable -->
*   UI testus koncentruoti į kritinius scenarijus, o ne siekti pilnos ekrano aprėpties.
<!-- ARCH-MOB-R17 | human-reviewable -->
*   Našumo ir saugumo aspektams neapsiriboti vien emuliatoriais.

> Susiję skyriai: [7](07-testavimas.md) · [7.7](07-testavimas.md#77-saugumo-testavimas-devsecops) · [7.8](07-testavimas.md#78-prieinamumo-accessibility-testavimas)

### 3.9.7. Platinimas ir diegimas

PRIVALOMA:

<!-- ARCH-MOB-P27 | ai-reviewable -->
*   Aplikacijos turi būti platinamos per oficialius kanalus, tokius kaip App Store ir Google Play, išskyrus aiškiai pagrįstus vidinius enterprise platinimo scenarijus.
<!-- ARCH-MOB-P28 | ai-reviewable -->
*   Aplikacijos ženklinimas turi būti automatizuotas CI/CD procese; draudžiamas rankinis signing iš kūrėjo kompiuterio.
<!-- ARCH-MOB-P29 | ai-reviewable -->
*   Ženklinimo sertifikatai ir raktai turi būti saugomi saugioje slaptųjų raktų saugykloje.
<!-- ARCH-MOB-P30 | human-reviewable -->
*   Naujos versijos turi būti leidžiamos taip, kad būtų galima kontroliuoti riziką ir, jei reikia, sustabdyti platinimą.

REKOMENDUOJAMA:

<!-- ARCH-MOB-R18 | human-reviewable -->
*   Naudoti palaipsnį platinimą, kad nauja versija pirmiausia pasiektų ribotą naudotojų dalį.
<!-- ARCH-MOB-R19 | human-reviewable -->
*   Stebėti versijų pasiskirstymą, crash rodiklius ir pagrindines kokybės metrikas po kiekvieno leidimo.

> Susiję skyriai: [3.5.2](#352-slaptieji-raktai) · [8](08-devops-ci-cd.md) · [9](09-stebesena-logai.md)

## 3.10. Atitiktis ir suderinamumas

Šiame skyriuje apibrėžiami aukšto lygio reikalavimai, užtikrinantys sistemos teisinę, technologinę ir organizacinę atitiktį bei suderinamumą su savivaldybės aplinka.

Šis skyrius nustato, kas turi būti užtikrinta architektūriniu ir organizaciniu lygmeniu.

Konkretūs saugumo, duomenų apsaugos, infrastruktūros, priklausomybių, CI/CD, stebėsenos ir dokumentacijos reikalavimai detalizuoti kituose šio standarto skyriuose.

### 3.10.1. Teisinė ir reguliacinė atitiktis

Architektūriniai sprendimai turi užtikrinti atitiktį taikomiems teisės aktams ir reguliaciniams reikalavimams.

Šie reikalavimai turi būti integruoti į nefunkcinius reikalavimus (NFR), projektavimo sprendimus ir priėmimo kriterijus, o ne tik dokumentuojami formaliai.

PRIVALOMA:

<!-- ARCH-COMP-P01 | ai-reviewable -->
*   Sistemoms, tvarkančioms asmens duomenis, turi būti užtikrinta atitiktis BDAR / GDPR reikalavimams.
<!-- ARCH-COMP-P02 | human-reviewable -->
*   Jei duomenų tvarkymas gali kelti didelę riziką, prieš sistemos kūrimą turi būti atliekamas Duomenų apsaugos poveikio vertinimas (DAPV / DPIA).
<!-- ARCH-COMP-P03 | ai-reviewable -->
*   Duomenų tvarkymo veiklos, teisinis pagrindas ir duomenų subjektų teisių įgyvendinimo mechanizmai turi būti apibrėžti iš anksto.
<!-- ARCH-COMP-P04 | human-reviewable -->
*   Sistemoms, reikalaujančioms elektroninės atpažinties ar parašo, turi būti naudojami eIDAS atitinkantys mechanizmai.
<!-- ARCH-COMP-P05 | ai-reviewable -->
*   Savivaldybės sistemoms turi būti užtikrinta atitiktis taikomiems kibernetinio saugumo reikalavimams, įskaitant incidentų valdymą, tiekimo grandinės rizikos valdymą ir saugumo priemonių dokumentavimą.
<!-- ARCH-COMP-P06 | ai-reviewable -->
*   Viešosioms svetainėms ir mobiliosioms aplikacijoms turi būti užtikrinta atitiktis taikomiems prieinamumo reikalavimams.

REKOMENDUOJAMA:

<!-- ARCH-COMP-R01 | ai-reviewable -->
*   Teisinės ir reguliacinės atitikties vertinimą atlikti ne tik projektavimo pradžioje, bet ir po reikšmingų architektūrinių ar teisinio reguliavimo pokyčių.
<!-- ARCH-COMP-R02 | ai-reviewable -->
*   Jei sistemai taikomi keli reguliaciniai režimai, rekomenduojama aiškiai dokumentuoti jų ryšį ir atsakomybes.

> Susiję skyriai: [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5](#345-asmens-duomenų-apsauga-bdar-gdpr) · [3.2.5](#325-prieinamumas-a11y) · [3.9.4](#394-prieinamumas-ir-lokalizacija) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas)

### 3.10.2. Suderinamumas su savivaldybės infrastruktūra

Visos sistemos turi būti suderinamos su savivaldybės centralizuotais infrastruktūros standartais ir bendrais organizaciniais IT principais.

PRIVALOMA:

<!-- ARCH-COMP-P07 | process-level -->
*   Tapatybės valdymas turi būti suderintas su savivaldybės centralizuota tapatybės valdymo sistema; atskiri vartotojų registrai leidžiami tik su aiškiu pagrindimu.
<!-- ARCH-COMP-P08 | process-level -->
*   Tinklo segmentavimas, ugniasienių taisyklės, DNS ir kiti infrastruktūriniai sprendimai turi būti derinami su atsakinga infrastruktūros komanda prieš diegimą.
<!-- ARCH-COMP-P09 | ai-reviewable -->
*   Logų formatas, eksportas ir stebėsenos integracija turi būti suderinti su organizacijos centralizuota stebėsenos platforma.
<!-- ARCH-COMP-P10 | ai-reviewable -->
*   Atsarginių kopijų ir atkūrimo sprendimai turi būti suderinti su organizacijos atsarginių kopijų politika ir procesais.

REKOMENDUOJAMA:

<!-- ARCH-COMP-R03 | human-reviewable -->
*   Ankstyvoje projektavimo stadijoje atlikti suderinamumo patikrą su esama infrastruktūra, kad reikšmingi nesuderinamumai būtų identifikuoti iki diegimo etapo.
<!-- ARCH-COMP-R04 | process-level -->
*   Jei sistema turi nestandartinių infrastruktūrinių poreikių, juos rekomenduojama dokumentuoti ADR arba architektūros apraše.

> Susiję skyriai: [3.3.4](#334-apsauga-ir-prieiga) · [3.5](#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6](#36-patikimumas-ir-atsparumas) · [9.1](09-stebesena-logai.md#91-logging-žurnalų-standartai) · [9.2](09-stebesena-logai.md#92-monitoring-ir-metrikos)

### 3.10.3. Technologijų suderinimas su organizacijos tech stack

Sistemų technologiniai pasirinkimai turi būti suderinti su organizacijos gebėjimu juos palaikyti, eksploatuoti ir perduoti kitoms komandoms ar tiekėjams.

PRIVALOMA:

<!-- ARCH-COMP-P11 | process-level -->
*   Prieš pasirenkant naujas technologijas, frameworks ar platformas, sprendimas turi būti aptartas su atsakingais architektūros ar IT atstovais ir dokumentuotas.
<!-- ARCH-COMP-P12 | ai-reviewable -->
*   Jei pasirenkama technologija, kuri reikšmingai skiriasi nuo organizacijoje naudojamo tech stack, turi būti aiškiai pagrįsta jos vertė, palaikymo modelis ir žinių perdavimo planas.

REKOMENDUOJAMA:

<!-- ARCH-COMP-R05 | ai-reviewable -->
*   Pirmenybę teikti technologijoms, jau naudojamoms organizacijoje, kai jos tenkina projekto poreikius.
<!-- ARCH-COMP-R06 | ai-reviewable -->
*   Technologinius nukrypimus vertinti ne tik pagal trumpalaikį techninį patogumą, bet ir pagal ilgalaikį palaikomumą, kompetencijų prieinamumą ir licencinę naštą.
<!-- ARCH-COMP-R07 | ai-reviewable -->
*   Tikslas nėra standartizuoti visą stack, o užtikrinti, kad pasirinkimai yra apsvarstyti ir organizacija galės juos palaikyti po projekto pabaigos.

> Susiję skyriai: [3.1.5](#315-architecture-decision-records-adr) · [10.4](10-dokumentacija.md#104-architecture-decision-records-adr) · [5](05-versijavimas.md) · [12](12-tiekeju-reikalavimai.md)

### 3.10.4. Kriptografiniai standartai ir komponentų gyvavimo ciklas

Šiame poskyryje apibrėžiami aukšto lygio reikalavimai kriptografiniams sprendimams ir naudojamų komponentų gyvavimo ciklui.

Detalūs saugumo, pažeidžiamumų valdymo ir CI/CD kontrolės reikalavimai apibrėžti [#5](05-versijavimas.md), [#6](06-saugumas.md) ir [#8](08-devops-ci-cd.md) skyriuose.

PRIVALOMA:

<!-- ARCH-COMP-P13 | ai-reviewable -->
*   Produkcijoje turi būti naudojami tik saugūs ir palaikomi kriptografiniai standartai bei protokolai.
<!-- ARCH-COMP-P14 | ai-reviewable -->
*   Draudžiama naudoti pažeidžiamas arba nebepalaikomas protokolų ir algoritmų versijas.
<!-- ARCH-COMP-P15 | process-level -->
*   Sertifikatų galiojimo terminai turi būti stebimi, o jų atnaujinimas planuojamas iš anksto.
<!-- ARCH-COMP-P16 | ai-reviewable -->
*   Produkcijoje draudžiama naudoti end-of-life (EOL) komponentus, įskaitant operacines sistemas, runtime’us, duomenų bazių versijas ir bibliotekas be palaikymo.

REKOMENDUOJAMA:

<!-- ARCH-COMP-R08 | process-level -->
*   Kriptografiniai pasirinkimai turėtų būti periodiškai peržiūrimi atsižvelgiant į naujus standartus ir grėsmių pokyčius.
<!-- ARCH-COMP-R09 | ai-reviewable -->
*   Komponentų EOL datos turėtų būti stebimos centralizuotai, o atnaujinimai planuojami iš anksto, o ne tik po incidentų ar pažeidžiamumų paskelbimo.

> Susiję skyriai: [6](06-saugumas.md) · [6.6](06-saugumas.md#66-owasp-top-10) · [6.7](06-saugumas.md#67-security-testing) · [5](05-versijavimas.md) · [8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė)

### 3.10.5. Atviro kodo licencijos ir programinės įrangos sudėtis

Sistemų sudėtis turi būti atsekama ir valdoma taip, kad organizacija galėtų įvertinti licencines, saugumo ir tiekimo grandinės rizikas.

PRIVALOMA:

<!-- ARCH-COMP-P17 | ai-reviewable -->
*   Naudojamos priklausomybės turi atitikti organizacijos leidžiamų licencijų politiką.
<!-- ARCH-COMP-P18 | human-reviewable -->
*   Programinės įrangos sudėtis turi būti atsekama, įskaitant tiesiogines ir netiesiogines priklausomybes.
<!-- ARCH-COMP-P19 | ai-reviewable -->
*   Turi būti naudojamos priemonės pažeidžiamumų ir licencijų rizikų kontrolei.

REKOMENDUOJAMA:

<!-- ARCH-COMP-R10 | ai-reviewable -->
*   SBOM generuoti automatiškai CI/CD proceso metu ir saugoti kartu su leidimu.
<!-- ARCH-COMP-R11 | ai-reviewable -->
*   SBOM naudoti pažeidžiamumų valdymui, licencijų auditui ir tiekimo grandinės rizikos vertinimui.
<!-- ARCH-COMP-R12 | ai-reviewable -->
*   Priklausomybes atnaujinti reguliariai ne tik reaguojant į pažeidžiamumus, bet ir prevenciškai.

> Susiję skyriai: [5](05-versijavimas.md) · [5.5](05-versijavimas.md#55-priklausomybių-saugumas-ir-atsekamumas) · [8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė)
