# 2. Standarto paskirtis ir taikymo sritis

## 2.1. Standarto tikslas

Šio programinės įrangos kūrimo standarto tikslas - nustatyti **vieningus ir aiškius reikalavimus** programinės įrangos (toliau - Sistemos) kūrimui, keitimui, diegimui ir priežiūrai savivaldybės administracijoje ir jai pavaldžiose įstaigose.

Standartas siekia:

*   užtikrinti **kokybišką, saugią ir palaikomą** programinę įrangą;
*   sumažinti techninę skolą ir priklausomybę nuo konkrečių tiekėjų;
*   užtikrinti sprendimų **tęstinumą, skaidrumą ir perimamumą**;
*   sudaryti sąlygas efektyviam vidinių ir išorinių komandų įsitraukimui ir bendradarbiavimui;
*   palengvinti sistemų eksploataciją, auditą ir plėtrą.

Standartas nėra konkrečios technologijos ar tiekėjo instrukcija - jis apibrėžia **principus, minimalius reikalavimus ir gerąsias praktikas**, kurių turi būti laikomasi.

## 2.2. Kam standartas taikomas

Šis standartas taikomas visiems programinės įrangos kūrimo ir keitimo darbams, atliekamiems savivaldybės interesais.

### 2.2.1. Vidinėms savivaldybės komandoms

Standartas **privalomas**:

*   savivaldybės administracijos programuotojams;
*   DevOps ir infrastruktūros inžinieriams;
*   analitikams ir product owneriams, tiek kiek tai susiję su reikalavimų, dokumentacijos ir sprendimų priėmimu.

Jis naudojamas kaip:

*   kasdienio darbo gairės;
*   bazė architektūriniams ir techniniams sprendimams;
*   atskaitos taškas vertinant kodo ir sprendimų kokybę.

### 2.2.2. Pavaldžioms įstaigoms

Standartas taikomas pavaldžioms savivaldybės įstaigoms, kurios:

*   pačios kuria informacines sistemas;
*   organizuoja sistemų kūrimą per išorinius tiekėjus;
*   eksploatuoja ar perima savivaldybės sukurtas sistemas.

Pavaldžios įstaigos **privalo užtikrinti**, kad jų kuriami ar užsakomi sprendimai atitiktų šį standartą arba jo minimalią versiją („Privaloma“ punktai).

### 2.2.3. Išoriniams tiekėjams

Standartas taikomas visiems išoriniams tiekėjams, kurie:

*   kuria individualius (custom) sprendimus savivaldybei ir jos pavaldžioms įstaigoms;
*   vykdo sistemų plėtrą ar palaikymą;
*   integruoja savo sprendimus su savivaldybės sistemomis.

Standartas turi būti:

*   įtraukiamas į technines specifikacijas ir pirkimo dokumentus;
*   naudojamas kaip atitikties vertinimo kriterijus;
*   taikomas priimant darbus (acceptance).

## 2.3. Kokioms sistemoms taikomas standartas

Standartas taikomas šioms sistemų rūšims, nepriklausomai nuo jų dydžio ar sudėtingumo.

### 2.3.1. Web aplikacijos

*   Viešosios (piliečiams skirtos) web sistemos
*   Vidinės administracinės sistemos
*   Portalai, savitarnos, valdymo sąsajos

Įtraukiami tiek frontend, tiek backend komponentai.

### 2.3.2. API ir backend paslaugos

*   API (REST, GraphQL ir kt.)
*   Backend servisai
*   Duomenų apdorojimo ir verslo logikos sluoksniai (pvz. low-code platformos, ETL, Camunda)

Standartas taikomas ir tais atvejais, kai backend neturi atskiros vartotojo sąsajos.

### 2.3.3. Mobiliosios aplikacijos

Jei kuriamos mobiliosios aplikacijos (Android, iOS ar hibridinės), standartas taikomas:

*   aplikacijos architektūrai;
*   saugumo ir duomenų apsaugos sprendimams;
*   integracijoms su backend sistemomis;
*   testavimui ir dokumentacijai.

Specifiniai mobiliųjų platformų reikalavimai gali būti aprašomi atskiruose prieduose.

### 2.3.4. Integracijos ir mikroservisai

*   Sistemų tarpusavio integracijos
*   Duomenų mainų sprendimai
*   Event-driven ar asinchroniniai komponentai

Standartas taikomas tiek naujoms, tiek modifikuojamoms integracijoms.

## 2.4. Reikalavimų lygiai

Šiame standarte naudojami du reikalavimų lygiai:

PRIVALOMA:

<!-- MISC-P01 | human-reviewable -->
*   Reikalavimai, kurių **būtina laikytis**.
<!-- MISC-P02 | human-reviewable -->
*   Jų nesilaikymas reiškia, kad sprendimas **neatitinka standarto**.
<!-- MISC-P03 | human-reviewable -->
*   **PRIVALOMA** reikalavimai taikomi visoms sistemoms, nebent aiškiai nurodyta kitaip.

REKOMENDUOJAMA:

<!-- MISC-R01 | human-reviewable -->
*   Gerosios praktikos, kurių **rekomenduojama laikytis**.
<!-- MISC-R02 | process-level -->
*   Nukrypimai galimi, bet turi būti **pagrįsti ir dokumentuoti**.

### 2.4.1. Reikalavimų klasifikacijos žymos

Kiekvienas standarto reikalavimas turi HTML komentaro žymą, nurodantčią reikalavimo identifikatorių ir tikrinimo tipą:

`<!-- IDENTIFIKATORIUS | tikrinimo-tipas -->`

**Identifikatoriaus formatas:** `<SRITIS>-<POSRITYS>-<P|R><NUMERIS>`

*   `P` – PRIVALOMAS reikalavimas
*   `R` – REKOMENDUOJAMAS reikalavimas
*   Pvz.: `ARCH-FE-P01` – Architektūra › Frontend › Privalomas reikalavimas #01

**Tikrinimo tipai:**

| Tipas | Reikšmė |
|---|---|
| `ai-reviewable` | Reikalavimas gali būti tikrinamas automatiškai: statinė analizė, linteriai, CI patikrinimai, AI kodo peržiūros įrankiai |
| `human-reviewable` | Reikalavimas reikalauja žmogaus vertinimo: architektūrinė peržiūra, kontekstinis sprendimas, kokybės vertinimas |
| `process-level` | Organizacinis ar procesinis reikalavimas, netikrinamas kodo lygmeniu (pvz., komunikacijos, tvirtinimo, planavimo procesai) |

Šios žymos naudojamos:

*   planuojant automatizuotas atitikties patikras CI/CD procese;
*   prioritetizuojant peržiūros pastangas (pvz., `ai-reviewable` reikalavimai gali būti tikrinami pirmiausia automatiškai);
*   vertinant standarto įgyvendinimo brandą pagal tikrinimo tipą.

## 2.5. Nukrypimai nuo standarto

Nukrypimas - tai sąmoningas sprendimas nesilaikyti šiame standarte apibrėžto **PRIVALOMA** arba **REKOMENDUOJAMA** reikalavimo, priimtas dėl objektyvių techninių, teisinių ar organizacinių priežasčių.

Visi nukrypimai **turi būti aiškiai pagrįsti, skaidrūs ir atsekami**.

### 2.5.1. Nukrypimai nuo PRIVALOMA reikalavimų

Nukrypimai nuo **PRIVALOMA** reikalavimų yra išimtiniai ir **privalo būti dokumentuojami centralizuotai**.

Kiekvienas nukrypimas nuo PRIVALOMA reikalavimo privalo:

1.  **Būti užregistruotas oficialiame nukrypimų registre**, kuris yra projekto dokumentacijos dalis (pvz., _Architecture Decision Record (ADR)_, „Nukrypimų registras“, ar analogiškas sprendimų dokumentas).
2.  **Būti suderintas su atsakingais asmenimis**, atsižvelgiant į nukrypimo pobūdį:
    *   techniniu vadovu ir (ar) architektu;
    *   savivaldybės IT atstovu (ypač saugumo, duomenų apsaugos ar architektūros klausimais).
3.  **Turėti aiškiai aprašytą sprendimo pagrindimą**, nurodant:
    *   priežastį, dėl kurios reikalavimo laikytis neįmanoma;
    *   siūlomą alternatyvą ar kompensuojančias priemones.
4.  **Turėti įvertintą riziką ir poveikį**, apimant:
    *   saugumo,
    *   eksploatacijos,
    *   palaikomumo,
    *   sistemos plėtros ar migracijos aspektus.
5.  **Būti susietas su techninio sprendimo kontekstu** (pvz., nurodyta susijusi Pull Request / Merge Request, užduotis ar diegimas).

### 2.5.2. Nukrypimai nuo REKOMENDUOJAMA reikalavimų

Nukrypimai nuo **REKOMENDUOJAMA** reikalavimų laikomi pagrįstomis išimtimis ir **neturi būti registruojami centralizuotai**, jei jų poveikis yra ribotas.

Kiekvienas nukrypimas nuo REKOMENDUOJAMA reikalavimo turi būti:

*   **aiškiai pagrįstas tame artefakte, kuriame sprendimas priimamas**, pavyzdžiui:
    *   Pull Request / Merge Request aprašyme;
    *   techninės užduoties ar naudotojo istorijos apraše;
    *   sprendimo komentare ar architektūriniame aprašyme.

## 2.6. Standarto įgyvendinimo brandos lygiai

Ne visos sistemos ir projektai gali pasiekti pilną standarto atitiktį nuo pirmos dienos. Šiame skyriuje apibrėžiami trys brandos lygiai, leidžiantys laipsniškai didinti atitiktį ir aiškiai vertinti esamą būklę.

### 2.6.1. 1 lygis — Bazinis (Minimum Viable)

Minimalus lygis, privalomas **visoms naujoms sistemoms ir visiems tiekėjų perdavimams** nuo pirmos dienos.

*   Visi PRIVALOMA saugumo reikalavimai ([6](06-saugumas.md)): serverio pusės validacija, autentifikacija ir autorizacija
*   Bazinis CI su build, testais ir SAST ([8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai))
*   Šaltinio kodas savivaldybės kontroliuojamoje repozitorijoje ([4.3.1](04-kodo-kurimo-gaires.md#431-versijų-kontrolė-ir-repozitorijų-valdymas))
*   README su paleidimo instrukcijomis ([3.8.4](03-architektura.md#384-onboarding-dokumentacija))
*   API dokumentuota OpenAPI / SDL specifikacija ([3.3.1](03-architektura.md#331-specifikacija-ir-dokumentacija))
*   Slaptieji raktai ne programiniame kode ([6.4](06-saugumas.md#64-secrets-management))
*   Struktūruoti logai siunčiami į centralizuotą platformą ([9.1](09-stebesena-logai.md#91-logging-žurnalų-standartai))

### 2.6.2. 2 lygis — Standartinis

Tikslinis lygis **visiems aktyviems projektams**. Rekomenduojamas pasiekti per 6 mėnesius nuo projekto pradžios.

*   Visas 1 lygis + visi likę PRIVALOMA reikalavimai
*   Pilna testavimo piramidė su apibrėžtais aprėpties slenksčiais ([7](07-testavimas.md))
*   Stebėsena: struktūruoti logai + pagrindinės metrikos + alerting ([9](09-stebesena-logai.md))
*   ADR reikšmingiems architektūriniams sprendimams ([10.4](10-dokumentacija.md#104-architecture-decision-records-adr))
*   CD pipeline su rollback mechanizmu ([8.3](08-devops-ci-cd.md#83-cd-continuous-delivery-deployment))
*   Conventional Commits ir PR šablonai ([4.3.4](04-kodo-kurimo-gaires.md#434-commitų-gairės), [4.3.5](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai))
*   Apibrėžti ir stebimi SLO ([9.5](09-stebesena-logai.md#95-sla-slo-ir-sli))

### 2.6.3. 3 lygis — Pavyzdinis

Aukštesnės brandos lygis, **rekomenduojamas kritinėms viešosioms sistemoms** (1 lygio SLO tier pagal [9.5.1](09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers)).

*   Visas 2 lygis + pagrindiniai REKOMENDUOJAMA reikalavimai
*   Kontraktų testai tarp vidinių servisų ([3.4.4](03-architektura.md#344-schemos-valdymas-ir-kontraktų-suderinamumas))
*   Atsparumo ir atkūrimo testai ([7.13](07-testavimas.md#713-atsparumo-dr-ir-atkūrimo-testai))
*   Error budget principas ir SLO-driven planavimas ([9.5](09-stebesena-logai.md#95-sla-slo-ir-sli))
*   SBOM generavimas kiekvienam leidimui ([5.5](05-versijavimas.md#55-priklausomybių-saugumas-ir-atsekamumas))
*   FinOps sąnaudų stebėsena ([8.10](08-devops-ci-cd.md#810-kainodara-ir-efektyvumas-finops))
*   Periodiniai penetraciniai testai ([6.7](06-saugumas.md#67-security-testing))

### 2.6.4. Lygio priskyrimas ir vertinimas

PRIVALOMA:

<!-- MISC-P04 | process-level -->
*   Kiekvienam projektui turi būti priskirtas tikslinis brandos lygis projekto pradžioje.
<!-- MISC-P05 | process-level -->
*   Tiekėjų perdavimuose minimalus priimtinas lygis yra 1 lygis; kritinėms sistemoms — 2 lygis.

REKOMENDUOJAMA:

<!-- MISC-R03 | process-level -->
*   Brandos lygį priskirti bendru Product Owner ir techninio vadovo sprendimu.
<!-- MISC-R04 | process-level -->
*   Lygio vertinimą atlikti periodiškai arba po reikšmingų leidimų, naudojant šiame skyriuje apibrėžtus kriterijus.

> Susiję skyriai: [12 Tiekėjų ir pavaldžių įstaigų reikalavimai](12-tiekeju-reikalavimai.md) · [2.3 Kokioms sistemoms taikomas standartas](#23-kokioms-sistemoms-taikomas-standartas) · [9.5.1 Numatytieji SLO lygiai](09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers)
