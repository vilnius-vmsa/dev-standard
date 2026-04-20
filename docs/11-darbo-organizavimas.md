# 11. Darbo organizavimas ir rolės

Šis skyrius apibrėžia darbo organizavimo principus, atsakomybes ir sprendimų priėmimo tvarką, kad programavimo standartas būtų taikomas ne tik programuotojams, bet ir visiems projekto dalyviams.

Šis skyrius būtinas tam, kad būtų aišku, kas už ką atsako, kaip valdomi reikalavimai ir pakeitimai, ir kaip priimami techniniai sprendimai.

Šio skyriaus nuostatos taikomos visoms komandoms, dalyvaujančioms sistemos kūrime, diegime, palaikyme ar perėmime.

## 11.1. Pagrindiniai darbo organizavimo principai

PRIVALOMA:

<!-- ORG-GEN-P01 | ai-reviewable -->
*   Atsakomybės turi būti aiškiai apibrėžtos ir suprantamos visiems projekto dalyviams.
<!-- ORG-GEN-P02 | process-level -->
*   Reikalavimai, sprendimai ir pakeitimai turi būti dokumentuoti ir atsekami.
<!-- ORG-GEN-P03 | human-reviewable -->
*   Techniniai ir verslo sprendimai turi būti priimami bendradarbiaujant, o ne perduodami tarp komandų be aiškaus konteksto.
<!-- ORG-GEN-P04 | human-reviewable -->
*   Kiekvienas reikšmingas pakeitimas turi turėti ryšį su reikalavimu, užduotimi, techniniu sprendimu ir įgyvendinimu.
<!-- ORG-GEN-P05 | ai-reviewable -->
*   Darbo organizavimas turi sudaryti sąlygas kokybiškam planavimui, peržiūrai, testavimui ir perdavimui.

REKOMENDUOJAMA:

<!-- ORG-GEN-R01 | process-level -->
*   Organizuoti darbą taip, kad sprendimų priėmimas būtų kuo skaidresnis ir mažiau priklausomas nuo vieno asmens žinių.
<!-- ORG-GEN-R02 | process-level -->
*   Komandos darbo modelį periodiškai peržiūrėti, jei praktikoje atsiranda neaiškumų dėl atsakomybių ar sprendimų priėmimo ribų.
<!-- ORG-GEN-R03 | ai-reviewable -->
*   Svarbius susitarimus fiksuoti ne tik susitikimuose, bet ir užduočių sistemoje, PR/MR ar dokumentacijoje.

> Susiję skyriai: [2.4](02-paskirtis-ir-taikymo-sritis.md#24-reikalavimų-lygiai) · [2.5](02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto) · [3.1.5](03-architektura.md#315-architecture-decision-records-adr) · [10.4](10-dokumentacija.md#104-architecture-decision-records-adr) · [10.5](10-dokumentacija.md#105-dokumentacijos-atnaujinimo-taisyklės)

## 11.2. Rolės ir atsakomybės

Šiame poskyryje apibrėžiamos pagrindinės rolės, dalyvaujančios sistemų kūrime, keitime ir palaikyme.

Konkreti rolės sudėtis projekte gali skirtis, tačiau atsakomybės turi būti aiškiai paskirstytos.

### 11.2.1. Developer (programuotojas)

PRIVALOMA:

<!-- ORG-ROLE-P01 | process-level -->
*   Programuotojas atsakingas už programinio kodo kūrimą pagal nustatytus standartus.
<!-- ORG-ROLE-P02 | ai-reviewable -->
*   Programuotojas atsakingas už testų rašymą ir palaikymą kartu su kodo pakeitimais.
<!-- ORG-ROLE-P03 | ai-reviewable -->
*   Programuotojas privalo atnaujinti dokumentaciją, jei pakeitimas ją paveikia.
<!-- ORG-ROLE-P04 | human-reviewable -->
*   Programuotojas privalo dalyvauti code review procese tiek kaip autorius, tiek kaip reviewer, kai tai taikoma.
<!-- ORG-ROLE-P05 | human-reviewable -->
*   Programuotojas gali siūlyti techninius sprendimus ir privalo juos argumentuoti pagal projekto kontekstą.

REKOMENDUOJAMA:

<!-- ORG-ROLE-R01 | human-reviewable -->
*   Programuotojas aktyviai prisideda prie techninės skolos mažinimo ir kodo kokybės gerinimo.
<!-- ORG-ROLE-R02 | human-reviewable -->
*   Programuotojas neapsiriboja vien savo pakeitimo įgyvendinimu, bet įvertina ir poveikį susijusioms sistemos dalims.

### 11.2.2. DevOps / infrastruktūros inžinierius

PRIVALOMA:

<!-- ORG-ROLE-P06 | ai-reviewable -->
*   DevOps arba infrastruktūros inžinierius atsakingas už CI/CD, aplinkų, diegimo mechanizmų ir infrastruktūros palaikymą.
<!-- ORG-ROLE-P07 | ai-reviewable -->
*   Jis atsakingas už diegimo procesų patikimumą, stebėsenos, loginimo ir alerting integraciją.
<!-- ORG-ROLE-P08 | ai-reviewable -->
*   Jis dalyvauja incidentų valdyme kartu su kitomis komandomis, kai incidentas susijęs su diegimu, infrastruktūra ar eksploatacija.
<!-- ORG-ROLE-P09 | ai-reviewable -->
*   Jis atsakingas už susijusios techninės dokumentacijos ir runbook’ų aktualumą pagal savo atsakomybės ribas.

REKOMENDUOJAMA:

<!-- ORG-ROLE-R03 | ai-reviewable -->
*   DevOps arba infrastruktūros inžinierius turėtų būti įtraukiamas anksti, jei projektas turi specifinių infrastruktūrinių, eksploatacinių ar platforminių poreikių.

### 11.2.3. Product Owner (PO)

PRIVALOMA:

<!-- ORG-ROLE-P10 | process-level -->
*   Product Owner atsakingas už produkto viziją, prioritetus ir backlog valdymą.
<!-- ORG-ROLE-P11 | ai-reviewable -->
*   Product Owner tvirtina priėmimo kriterijus ir sprendžia funkcinių pakeitimų prioritetus.
<!-- ORG-ROLE-P12 | ai-reviewable -->
*   Product Owner dalyvauja UAT ir galutinio funkcionalumo priėmime.
<!-- ORG-ROLE-P13 | process-level -->
*   Product Owner negali vienašališkai keisti techninių sprendimų neįtraukdamas atsakingų techninių rolų.

REKOMENDUOJAMA:

<!-- ORG-ROLE-R04 | process-level -->
*   Product Owner turėtų būti įtrauktas į ankstyvą rizikų, kompromisų ir techninės skolos aptarimą, jei tai gali paveikti produkto planą ar terminus.

### 11.2.4. Analitikas (veiklos / sistemų)

PRIVALOMA:

<!-- ORG-ROLE-P14 | process-level -->
*   Analitikas atsakingas už reikalavimų analizę, struktūravimą ir aiškų jų perdavimą komandai.
<!-- ORG-ROLE-P15 | ai-reviewable -->
*   Analitikas turi aprašyti procesus, naudotojų scenarijus, duomenų srautus ir integracinius poreikius tiek, kiek to reikia sprendimo sukūrimui.
<!-- ORG-ROLE-P16 | human-reviewable -->
*   Analitikas palaiko ryšį tarp verslo ir techninės komandos, kad reikalavimai būtų vienodai suprasti.
<!-- ORG-ROLE-P17 | ai-reviewable -->
*   Analitikas atsakingas už reikalavimų dokumentacijos aktualumą pagal savo rolės ribas.

REKOMENDUOJAMA:

<!-- ORG-ROLE-R05 | ai-reviewable -->
*   Sudėtingiems projektams analitikas turėtų padėti aiškiai susieti verslo reikalavimus su priėmimo kriterijais, duomenų srautais ir integraciniais scenarijais.

## 11.3. Reikalavimų valdymas

PRIVALOMA:

<!-- ORG-REQ-P01 | ai-reviewable -->
*   Reikalavimai turi būti dokumentuojami kaip user stories, use cases, funkciniai reikalavimai ar lygiaverčiai artefaktai.
<!-- ORG-REQ-P02 | ai-reviewable -->
*   Priėmimo kriterijai turi būti aiškūs, testuojami ir patvirtinti prieš pradedant įgyvendinimą.
<!-- ORG-REQ-P03 | ai-reviewable -->
*   Neaprašyti ar nepatvirtinti reikalavimai negali būti tyliai įtraukiami į įgyvendinimą.
<!-- ORG-REQ-P04 | human-reviewable -->
*   Reikalavimų pakeitimai turi būti valdomi per aiškų ir atsekamą procesą.
<!-- ORG-REQ-P05 | ai-reviewable -->
*   Reikalavimai turi būti pakankamai detalūs, kad komanda galėtų įvertinti apimtį, riziką ir priklausomybes.

REKOMENDUOJAMA:

<!-- ORG-REQ-R01 | ai-reviewable -->
*   Sudėtingiems ar integraciniams scenarijams papildomai aprašyti naudotojų srautus, duomenų srautus ar kraštinius atvejus.
<!-- ORG-REQ-R02 | ai-reviewable -->
*   Reikalavimų neapibrėžtumą identifikuoti kuo anksčiau, o ne palikti jį spręsti tik programavimo metu.

> Susiję skyriai: [3](03-architektura.md) · [7](07-testavimas.md)

## 11.4. Backlog ir pakeitimų (change) valdymas

PRIVALOMA:

<!-- ORG-BACKLOG-P01 | ai-reviewable -->
*   Kiekviena sistema turi turėti vieną aiškų oficialų backlog’ą.
<!-- ORG-BACKLOG-P02 | ai-reviewable -->
*   Pakeitimai turi būti vertinami pagal poveikį apimčiai, terminams, rizikai ir priklausomybėms.
<!-- ORG-BACKLOG-P03 | process-level -->
*   Pakeitimų prioritetai turi būti nustatomi atsakingai ir dokumentuotai.
<!-- ORG-BACKLOG-P04 | ai-reviewable -->
*   Nenumatyti pakeitimai negali būti įgyvendinami neoficialiai, apeinant backlog ar change valdymo procesą.
<!-- ORG-BACKLOG-P05 | ai-reviewable -->
*   Skubūs pakeitimai leidžiami tik tada, kai jie pagrįsti incidentu, teisiniu reikalavimu arba kitu aiškiai dokumentuotu poreikiu.

REKOMENDUOJAMA:

<!-- ORG-BACKLOG-R01 | ai-reviewable -->
*   Didelius ar rizikingus pakeitimus prieš įtraukiant į backlog rekomenduojama papildomai įvertinti techniniu požiūriu.
<!-- ORG-BACKLOG-R02 | process-level -->
*   Backlog’ą periodiškai peržiūrėti, kad jame neliktų neaktualių, dubliuojančių ar nebeprioritetinių uždavinių.

> Susiję skyriai: [4.7](04-kodo-kurimo-gaires.md#47-refaktoringas-ir-techninė-skola) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas) · [12](12-tiekeju-reikalavimai.md)

## 11.5. Techninių sprendimų priėmimas ir tvirtinimas

PRIVALOMA:

<!-- ORG-DECISION-P01 | human-reviewable -->
*   Reikšmingi techniniai sprendimai turi būti priimami aiškiai ir atsekamai.
<!-- ORG-DECISION-P02 | ai-reviewable -->
*   Prie techninių sprendimų priskiriami architektūros stiliaus, technologijų pasirinkimo, integracijų modelio, saugumo ar našumo sprendimai.
<!-- ORG-DECISION-P03 | human-reviewable -->
*   Smulkūs techniniai sprendimai gali būti priimami komandos lygiu, jei jie neturi reikšmingo poveikio kitoms sistemos dalims.
<!-- ORG-DECISION-P04 | process-level -->
*   Reikšmingi techniniai sprendimai turi būti dokumentuojami ADR arba lygiaverčiu būdu.
<!-- ORG-DECISION-P05 | process-level -->
*   Nukrypimai nuo standarto gali būti leidžiami tik su dokumentuotu pagrindimu ir patvirtinimu pagal nustatytą procesą.

REKOMENDUOJAMA:

<!-- ORG-DECISION-R01 | process-level -->
*   Aukštos rizikos, tarpkomandinius ar ilgalaikį poveikį turinčius sprendimus rekomenduojama aptarti su architektu ar kitu atsakingu techniniu atstovu dar prieš įgyvendinimą.
<!-- ORG-DECISION-R02 | human-reviewable -->
*   Techninius sprendimus vertinti ne tik pagal trumpalaikį patogumą, bet ir pagal palaikomumą, saugumą, kaštus ir perimamumą.

> Susiję skyriai: [3.1.5](03-architektura.md#315-architecture-decision-records-adr) · [10.4](10-dokumentacija.md#104-architecture-decision-records-adr) · [3.10.3](03-architektura.md#3103-technologijų-suderinimas-su-organizacijos-tech-stack) · [2.5](02-paskirtis-ir-taikymo-sritis.md#25-nukrypimai-nuo-standarto)

## 11.6. Komunikacija ir susitikimai

PRIVALOMA:

<!-- ORG-COMM-P01 | human-reviewable -->
*   Svarbūs susitarimai, sprendimai ir pokyčiai turi būti užfiksuojami raštu.
<!-- ORG-COMM-P02 | ai-reviewable -->
*   Komunikacija tarp verslo, analitikų, programuotojų, DevOps ir kitų dalyvių turi būti pakankama tam, kad nebūtų sprendimų ar reikalavimų interpretavimo spragų.
<!-- ORG-COMM-P03 | ai-reviewable -->
*   Reikšmingi techniniai ar organizaciniai sprendimai negali likti tik žodiniuose susitarimuose.
<!-- ORG-COMM-P04 | ai-reviewable -->
*   Jei susitikime priimamas sprendimas, kuris daro įtaką architektūrai, terminams, apimčiai ar rizikai, jis turi būti perkeliamas į atsekamą artefaktą.

REKOMENDUOJAMA:

<!-- ORG-COMM-R01 | process-level -->
*   Naudoti reguliarius planavimo, peržiūros ir retrospektyvos susitikimus, jei tai padeda komandai dirbti nuosekliau.
<!-- ORG-COMM-R02 | process-level -->
*   Reikšmingiems techniniams klausimams organizuoti atskiras technines peržiūras ar trumpus sprendimų aptarimus.
<!-- ORG-COMM-R03 | ai-reviewable -->
*   Komunikaciją organizuoti taip, kad svarbi informacija būtų lengvai randama ir nepasimestų pokalbių istorijoje.

> Susiję skyriai: [4.4](04-kodo-kurimo-gaires.md#44-code-review-principai) · [10](10-dokumentacija.md) · [13](13-standarto-prieziura.md)
