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
