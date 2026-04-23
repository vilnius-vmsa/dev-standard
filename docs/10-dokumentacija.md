# 10. Dokumentacija

Šis skyrius apibrėžia privalomą techninę dokumentaciją, jos formatus, saugojimo, atnaujinimo ir valdymo taisykles.

Dokumentacija laikoma ne papildomu darbu po kūrimo, o neatsiejama sistemos dalimi, būtina ilgalaikiam palaikomumui, auditui, tiekėjų keičiamumui ir žinių perimamumui.

Šiame skyriuje reglamentuojamas dokumentacijos gyvavimo ciklas ir valdymas.

Konkretūs turinio reikalavimai atskiriems dokumentų tipams apibrėžiami atitinkamuose teminiuose skyriuose, pavyzdžiui, architektūros, API, saugumo, testavimo, DevOps ir eksploatacijos dalyse.

## 10.1. Bendrieji dokumentacijos principai

PRIVALOMA:

<!-- DOC-GEN-P01 | ai-reviewable -->
*   Dokumentacija turi būti kuriama, saugoma ir versijuojama kartu su kodu.
<!-- DOC-GEN-P02 | ai-reviewable -->
*   Turi būti vienas aiškus tiesos šaltinis; draudžiama laikyti lygiagrečias, neversijuojamas ar nekontroliuojamas dokumentacijos kopijas.
<!-- DOC-GEN-P03 | ai-reviewable -->
*   Kodo, architektūros, API, diegimo ar eksploatacijos pakeitimai turi būti lydimi atitinkamo dokumentacijos atnaujinimo tame pačiame PR arba MR.
<!-- DOC-GEN-P04 | ai-reviewable -->
*   Dokumentacija turi būti pakankama, kad trečioji šalis galėtų suprasti sistemą, ją diegti, eksploatuoti ir toliau vystyti be autoriaus dalyvavimo.
<!-- DOC-GEN-P05 | ai-reviewable -->
*   Dokumentacijos kalba turi būti pasirinkta projekto pradžioje ir taikoma nuosekliai.

REKOMENDUOJAMA:

<!-- DOC-GEN-R01 | ai-reviewable -->
*   Techninę dokumentaciją rengti taip, kad ji būtų lengvai peržiūrima per diff, review ir versijų istoriją.
<!-- DOC-GEN-R02 | ai-reviewable -->
*   Jei sistema turi išorinį tiekėją ar numatomą perdavimą kitai komandai, dokumentacijos detalumo lygį rekomenduojama vertinti pagal realų perėmimo scenarijų.
<!-- DOC-GEN-R03 | ai-reviewable -->
*   Vengti dokumentacijos dubliavimo tarp skyrių; vietoje to naudoti nuorodas į pagrindinį reikalavimo šaltinį.

> Susiję skyriai: [3 Architektūros ir dizaino principai](03-architektura.md) · [4 Programinio kodo kūrimo ir keitimo gairės](04-kodo-kurimo-gaires.md) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 10.2. Privaloma dokumentacija

Šiame poskyryje apibrėžiami minimalūs dokumentacijos artefaktai, kurie turi egzistuoti kiekvienai sistemai pagal jos pobūdį ir taikymo sritį.

PRIVALOMA:

<!-- DOC-REQ-P01 | ai-reviewable -->
*   Kiekviena sistema turi turėti bent tokią dokumentaciją, kuri leidžia suprasti jos paskirtį, architektūrą, API ar integracijas, diegimą ir eksploataciją.
<!-- DOC-REQ-P02 | ai-reviewable -->
*   Dokumentacijos rinkinys turi būti proporcingas sistemos sudėtingumui, tačiau negali būti mažesnis už šiame skyriuje nurodytą minimumą.

### 10.2.1. Architektūros aprašas

PRIVALOMA:

<!-- DOC-REQ-P03 | human-reviewable -->
*   Kiekviena sistema turi turėti architektūros aprašą.
<!-- DOC-REQ-P04 | ai-reviewable -->
*   Architektūros aprašas turi aiškiai nurodyti sistemos paskirtį, ribas, pagrindinius komponentus, svarbiausias integracijas ir reikšmingus architektūrinius sprendimus.
<!-- DOC-REQ-P05 | ai-reviewable -->
*   Architektūros aprašas turi būti pakankamas tam, kad kita techninė komanda galėtų suprasti sistemos loginę struktūrą ir pagrindinius sprendimo principus.
<!-- DOC-REQ-P06 | ai-reviewable -->
*   Konkretūs architektūrinių diagramų, sudėtingų procesų dokumentavimo ir techninio onboarding reikalavimai apibrėžti [#3.8](03-architektura.md#38-diagramos-ir-dokumentavimas) skyriuje.

REKOMENDUOJAMA:

<!-- DOC-REQ-R01 | ai-reviewable -->
*   Jei sistema sudėtinga, architektūros aprašą rekomenduojama struktūruoti taip, kad būtų aiškiai atskirta loginė architektūra, integracijos, diegimo vaizdas ir svarbiausi kompromisai.
<!-- DOC-REQ-R02 | ai-reviewable -->
*   Jei sistema turi reikšmingų nefunkcinių reikalavimų, rekomenduojama aiškiai parodyti, kaip architektūriniai sprendimai padeda juos užtikrinti.

> Susiję skyriai: [3.8 Diagramos ir dokumentavimas](03-architektura.md#38-diagramos-ir-dokumentavimas) · [10.4 Architecture Decision Records (ADR)](#104-architecture-decision-records-adr)

### 10.2.2. API dokumentacija

PRIVALOMA:

<!-- DOC-REQ-P07 | ai-reviewable -->
*   Visoms API ir integracijoms turi būti prieinama aktuali ir mašiniškai skaitoma dokumentacija.
<!-- DOC-REQ-P08 | ai-reviewable -->
*   API dokumentacijoje turi būti apibrėžta specifikacija, autentifikacijos būdas, versijavimo principas ir pagrindiniai atsakymų bei klaidų scenarijai.
<!-- DOC-REQ-P09 | ai-reviewable -->
*   API dokumentacija turi būti versijuojama kartu su kodu ir atnaujinama kartu su kontrakto pakeitimais.

REKOMENDUOJAMA:

<!-- DOC-REQ-R03 | ai-reviewable -->
*   Prie specifikacijos pateikti aiškius naudojimo pavyzdžius ir tipinius scenarijus, kai tai padeda integruojančioms komandoms.
<!-- DOC-REQ-R04 | ai-reviewable -->
*   Išorinėms ar tarporganizacinėms integracijoms rekomenduojama aiškiai nurodyti deprecation politiką ir suderinamumo ribas.

> Susiję skyriai: [3.3 Backend ir API principai](03-architektura.md#33-backend-ir-api-principai) · [3.4 Duomenys ir integracijos](03-architektura.md#34-duomenys-ir-integracijos)

### 10.2.3. Diegimo ir eksploatacijos instrukcijos

PRIVALOMA:

<!-- DOC-REQ-P10 | ai-reviewable -->
*   Kiekvienai sistemai turi būti parengtos diegimo ir eksploatacijos instrukcijos.
<!-- DOC-REQ-P11 | ai-reviewable -->
*   Instrukcijose turi būti aiškiai aprašyta diegimo tvarka, būtina konfigūracija, migracijos, rollback principai ir pagrindiniai eksploataciniai veiksmai.
<!-- DOC-REQ-P12 | ai-reviewable -->
*   Instrukcijos turi būti pakankamos tam, kad kita techninė komanda galėtų atlikti diegimą ir pagrindinius eksploatacinius veiksmus be papildomo žodinio paaiškinimo.

REKOMENDUOJAMA:

<!-- DOC-REQ-R05 | ai-reviewable -->
*   Instrukcijose pateikti nuorodas į runbook’us, stebėsenos dashboardus, alerting taisykles ir kitus eksploatacijos artefaktus.
<!-- DOC-REQ-R06 | ai-reviewable -->
*   Jei dalis veiksmų yra automatizuoti, instrukcijose rekomenduojama aiškiai atskirti, kas vykdoma per CI/CD, o kas yra rankiniai žingsniai.

> Susiję skyriai: [8 DevOps ir CI/CD reikalavimai](08-devops-ci-cd.md) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)

### 10.2.4. Naudotojo dokumentacija

PRIVALOMA:

<!-- DOC-REQ-P13 | ai-reviewable -->
*   Jei sistema turi galutinius naudotojus, turi būti parengta naudotojo dokumentacija arba lygiavertis pagalbos turinys.
<!-- DOC-REQ-P14 | ai-reviewable -->
*   Naudotojo dokumentacija turi paaiškinti pagrindinius sistemos naudojimo scenarijus, svarbiausius veiksmus ir reikšmingus apribojimus.
<!-- DOC-REQ-P15 | human-reviewable -->
*   Klaidų ir pranešimų logika turi būti aprašyta tiek, kiek to reikia naudotojo supratimui ir savarankiškam naudojimui.

REKOMENDUOJAMA:

<!-- DOC-REQ-R07 | ai-reviewable -->
*   Naudotojo dokumentaciją rengti atsižvelgiant į tikslinę auditoriją ir jos skaitmeninį pasirengimą.
<!-- DOC-REQ-R08 | human-reviewable -->
*   Jei sistema skirta viešiesiems naudotojams, rekomenduojama įtraukti ir prieinamumo bei pagalbos scenarijus.

> Susiję skyriai: [3.2 Frontend (Web) principai](03-architektura.md#32-frontend-web-principai) · [3.9 Mobilios aplikacijos (jei taikoma)](03-architektura.md#39-mobilios-aplikacijos-jei-taikoma) · [3.2.5 Prieinamumas (A11y)](03-architektura.md#325-prieinamumas-a11y) · [7.8 Prieinamumo (Accessibility) testavimas](07-testavimas.md#78-prieinamumo-accessibility-testavimas)

## 10.3. Dokumentacijos formatai ir struktūra

PRIVALOMA:

<!-- DOC-FMT-P01 | ai-reviewable -->
*   Techninė dokumentacija turi būti saugoma formatu, kuris yra tinkamas versijų kontrolei, peržiūrai ir ilgalaikiam palaikymui.
<!-- DOC-FMT-P02 | ai-reviewable -->
*   Markdown turi būti laikomas numatytuoju formatu techninei dokumentacijai, jei tam nėra pagrįstos išimties.
<!-- DOC-FMT-P03 | ai-reviewable -->
*   API specifikacijos turi būti saugomos jų technologijai tinkamu mašiniškai skaitomu formatu.
<!-- DOC-FMT-P04 | ai-reviewable -->
*   Architektūriniai sprendimai turi būti dokumentuojami struktūrizuotu formatu.
<!-- DOC-FMT-P05 | ai-reviewable -->
*   Dokumentacijos struktūra turi būti nuosekli visame projekte ir aiškiai suprantama naujam komandos nariui ar perėmėjui.

REKOMENDUOJAMA:

<!-- DOC-FMT-R01 | ai-reviewable -->
*   Diagramoms naudoti tekstinius arba diagrams-as-code formatus, kai tai įmanoma.
<!-- DOC-FMT-R02 | ai-reviewable -->
*   Grafiniai failai gali būti naudojami, jei kartu saugomas ir jų šaltinis.
<!-- DOC-FMT-R03 | ai-reviewable -->
*   Dokumentų struktūrą rekomenduojama organizuoti taip, kad būtų aiškiai atskirti architektūros, API, eksploatacijos ir naudotojo dokumentacijos artefaktai.

> Susiję skyriai: [3.8 Diagramos ir dokumentavimas](03-architektura.md#38-diagramos-ir-dokumentavimas) · [10.4 Architecture Decision Records (ADR)](#104-architecture-decision-records-adr)

## 10.4. Architecture Decision Records (ADR)

Architecture Decision Record yra trumpas ir struktūrizuotas dokumentas, kuriame fiksuojami reikšmingi architektūriniai sprendimai, jų kontekstas, svarstytos alternatyvos ir pasirinkimo pagrindimas.

Šis skyrius yra pagrindinis ADR rengimo, saugojimo, versijavimo ir susiejimo su kitais artefaktais reikalavimų šaltinis.

PRIVALOMA:

<!-- DOC-ADR-P01 | ai-reviewable -->
*   ADR turi būti rengiamas, kai pasirenkama ar keičiama esminė technologija, architektūros stilius, integracijų modelis, reikšmingas kompromisas arba nukrypimas nuo standarto.
<!-- DOC-ADR-P02 | ai-reviewable -->
*   ADR turi būti saugomas versijų valdymo sistemoje kartu su projektu.
<!-- DOC-ADR-P03 | process-level -->
*   ADR turi būti numeruojamas nuosekliai.
<!-- DOC-ADR-P04 | process-level -->
*   Pasikeitus sprendimui, turi būti kuriamas naujas ADR, susietas su ankstesniu, o ne perrašomas senasis.
<!-- DOC-ADR-P05 | ai-reviewable -->
*   ADR turi būti susietas su atitinkamu PR arba MR, užduotimi ir, jei taikoma, leidimu ar diegimu.

REKOMENDUOJAMA:

<!-- DOC-ADR-R01 | ai-reviewable -->
*   Naudoti vieningą ADR šabloną visos organizacijos mastu.
<!-- DOC-ADR-R02 | process-level -->
*   ADR turinį laikyti trumpą, aiškų ir orientuotą į sprendimo esmę, o ne perteklinį aprašymą.
<!-- DOC-ADR-R03 | human-reviewable -->
*   Jei sprendimas turi ilgalaikį poveikį saugumui, palaikomumui, kaštams ar perimamumui, rekomenduojama aiškiai aprašyti jo pasekmes ir rizikas.

> Susiję skyriai: [3.1.5 Architecture Decision Records (ADR)](03-architektura.md#315-architecture-decision-records-adr) · [3.8 Diagramos ir dokumentavimas](03-architektura.md#38-diagramos-ir-dokumentavimas)

## 10.5. Dokumentacijos atnaujinimo taisyklės

Šis skyrius apibrėžia bendrąsias dokumentacijos atnaujinimo taisykles visiems dokumentacijos artefaktams.

[#3.8](03-architektura.md#38-diagramos-ir-dokumentavimas) skyriuje nustatyti tik architektūrinės dokumentacijos aktualumo reikalavimai.

PRIVALOMA:

<!-- DOC-UPD-P01 | ai-reviewable -->
*   Jei keičiasi funkcionalumas, architektūra, API, diegimas ar eksploatacijos elgsena, dokumentacija turi būti atnaujinta tame pačiame pakeitime.
<!-- DOC-UPD-P02 | ai-reviewable -->
*   Dokumentacijos atnaujinimas turi būti peržiūrimas kartu su kodu.
<!-- DOC-UPD-P03 | ai-reviewable -->
*   Pasenusi arba faktinės sistemos būklės neatitinkanti dokumentacija laikoma defektu ir turi būti taisoma prioritetine tvarka.
<!-- DOC-UPD-P04 | ai-reviewable -->
*   Jei projekte naudojami PR arba MR šablonai, juose turi būti aiškus klausimas dėl dokumentacijos atnaujinimo poreikio.

REKOMENDUOJAMA:

<!-- DOC-UPD-R01 | ai-reviewable -->
*   Dokumentacijos tikslumą peržiūrėti ne tik per kodo pakeitimus, bet ir po reikšmingų leidimų, architektūrinių pokyčių ar perdavimo kitai komandai.
<!-- DOC-UPD-R02 | ai-reviewable -->
*   Kai tai įmanoma, naudoti automatines dokumentacijos validavimo patikras, pavyzdžiui, broken links, specifikacijos validaciją ar diagramų generavimo patikrą.
<!-- DOC-UPD-R03 | ai-reviewable -->
*   Dokumentacijos pasenimą vertinti kaip kokybės signalą, o ne tik kaip redakcinę problemą.

> Susiję skyriai: [4.3.5 Pull Request / Merge Request reikalavimai](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [4.4 Code Review principai](04-kodo-kurimo-gaires.md#44-code-review-principai) · [3.8 Diagramos ir dokumentavimas](03-architektura.md#38-diagramos-ir-dokumentavimas) · [8 DevOps ir CI/CD reikalavimai](08-devops-ci-cd.md)
