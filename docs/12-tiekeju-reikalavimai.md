# 12. Tiekėjų ir pavaldžių įstaigų reikalavimai

Šis skyrius apibrėžia privalomus reikalavimus išoriniams tiekėjams ir pavaldžioms įstaigoms, kurios kuria, vysto, diegia, palaiko ar perduoda informacines sistemas savivaldybės interesais.

Šis skyrius yra svarbus standarto taikymui viešuosiuose pirkimuose, sistemų perimamumui, eksploatacijos tęstinumui ir aiškiam darbų priėmimui.

Šio skyriaus nesilaikymas reiškia, kad sprendimas negali būti laikomas pilnai perduotu, priimtu ar tinkamu savivaldybės savarankiškai eksploatacijai.

## 12.1. Taikymo sritis

PRIVALOMA:

<!-- VENDOR-SCOPE-P01 | process-level -->
*   Šio skyriaus reikalavimai taikomi išoriniams tiekėjams, dirbantiems pagal viešuosius pirkimus, sutartis ar kitus savivaldybės užsakymus.
<!-- VENDOR-SCOPE-P02 | ai-reviewable -->
*   Šio skyriaus reikalavimai taikomi pavaldžioms savivaldybės įstaigoms, kurios pačios kuria informacines sistemas, samdo trečiąsias šalis arba perduoda sistemas savivaldybei eksploatacijai.
<!-- VENDOR-SCOPE-P03 | ai-reviewable -->
*   Reikalavimai taikomi visam sistemos gyvavimo ciklui – nuo projektavimo ir kūrimo iki perdavimo, palaikymo ir eksploatacijos.

REKOMENDUOJAMA:

<!-- VENDOR-SCOPE-R01 | ai-reviewable -->
*   Jei tiekėjas ar pavaldžioji įstaiga dalyvauja tik dalyje gyvavimo ciklo, rekomenduojama sutartyje ar techninėje specifikacijoje aiškiai apibrėžti, kuri šio standarto dalis taikoma jų atsakomybei.

## 12.2. Minimalūs techniniai reikalavimai

PRIVALOMA:

<!-- VENDOR-TECH-P01 | process-level -->
*   Tiekėjo ar pavaldžios įstaigos kuriama sistema turi atitikti šio standarto esminius skyrius, kurie taikomi konkrečiam sprendimui.
<!-- VENDOR-TECH-P02 | human-reviewable -->
*   Minimaliai turi būti užtikrinta atitiktis:
    *   architektūros ir dizaino principams – 3 skyriui
    *   programinio kodo kūrimo ir keitimo gairėms – 4 skyriui
    *   versijavimui ir priklausomybių valdymui – 5 skyriui
    *   saugumui – 6 skyriui
    *   testavimo reikalavimams – 7 skyriui
    *   DevOps ir CI/CD reikalavimams – 8 skyriui
    *   stebėsenai, logams ir eksploatacijai – 9 skyriui
    *   dokumentacijai – 10 skyriui
<!-- VENDOR-TECH-P03 | human-reviewable -->
*   Naudojamos tik palaikomos ir ne end-of-life technologijos.
<!-- VENDOR-TECH-P04 | ai-reviewable -->
*   Sistemoje negali būti kritinių saugumo pažeidžiamumų be aiškaus sprendimo plano arba dokumentuoto rizikos priėmimo.
<!-- VENDOR-TECH-P05 | ai-reviewable -->
*   Sprendimas turi būti diegiamas ir eksploatuojamas be tiekėjo unikalių licencijų, uždarų priklausomybių ar neperduodamų prieigų, išskyrus atvejus, kai tai aiškiai suderinta pirkimo ar sutarties etape.

REKOMENDUOJAMA:

<!-- VENDOR-TECH-R01 | ai-reviewable -->
*   Jei sprendimui taikomi ne visi šio standarto skyriai, rekomenduojama techninėje specifikacijoje aiškiai nurodyti, kurie skyriai yra privalomi konkrečiam tiekimui ar projektui.
<!-- VENDOR-TECH-R02 | process-level -->
*   Tikslinis [brandos lygis](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) rekomenduojama nurodyti techninėje specifikacijoje arba sutartyje; minimaliai – 1 lygis (Bazinis), kritinėms viešosioms sistemoms – 2 lygis (Standartinis).

## 12.3. Privalomi perdavimo artefaktai

Prieš darbų priėmimą tiekėjas ar pavaldžioji įstaiga privalo perduoti savivaldybei visus artefaktus, reikalingus sistemos perėmimui, savarankiškam diegimui, eksploatavimui ir tolesnei plėtrai.

### 12.3.1. Programinį kodą

PRIVALOMA:

<!-- VENDOR-HAND-P01 | ai-reviewable -->
*   Turi būti perduotas pilnas šaltinio kodas, apimantis frontend, backend, integracijas, infrastruktūrą kaip kodą ir kitus susijusius komponentus, jei jie yra sprendimo dalis.
<!-- VENDOR-HAND-P02 | ai-reviewable -->
*   Turi būti perduota visa Git repozitorija su istorija, o ne tik archyvuota galutinė versija.
<!-- VENDOR-HAND-P03 | ai-reviewable -->
*   Turi būti perduotos naudojamos CI/CD konfigūracijos, build ar diegimo scenarijai.
<!-- VENDOR-HAND-P04 | ai-reviewable -->
*   Turi būti perduotas testų kodas ir testavimo rezultatai arba ataskaitos, jei jos generuojamos atskirai.
<!-- VENDOR-HAND-P05 | ai-reviewable -->
*   Kodas turi būti be hardcoded paslapčių, su veikiančiu build procesu ir atitikti šio standarto reikalavimus.

REKOMENDUOJAMA:

<!-- VENDOR-HAND-R01 | ai-reviewable -->
*   Perdavimo metu rekomenduojama pateikti ir trumpą repozitorijos struktūros paaiškinimą, jei sprendimas yra sudėtingas arba susideda iš kelių repozitorijų.

### 12.3.2. Dokumentacija

PRIVALOMA:

<!-- VENDOR-HAND-P06 | ai-reviewable -->
*   Turi būti perduota visa privaloma techninė dokumentacija, nustatyta [10 skyriuje](10-dokumentacija.md), tiek, kiek ji taikoma konkrečiai sistemai.
<!-- VENDOR-HAND-P07 | ai-reviewable -->
*   Minimaliai tai apima:
    *   architektūros aprašą
    *   API dokumentaciją
    *   diegimo ir eksploatacijos instrukcijas
    *   naudotojo dokumentaciją, jei taikoma
    *   su eksploatacija susijusius runbook’us ir kitus būtinus veiklos tęstinumui reikalingus artefaktus
<!-- VENDOR-HAND-P08 | ai-reviewable -->
*   Dokumentacija turi būti aktuali, versijuota ir pakankama savarankiškai sistemos eksploatacijai bei tolesniam vystymui.

REKOMENDUOJAMA:

<!-- VENDOR-HAND-R02 | ai-reviewable -->
*   Jei sistema sudėtinga, rekomenduojama perduoti ir papildomą žinių perdavimo medžiagą, pavyzdžiui, svarbiausių sprendimų santrauką, sistemų priklausomybių aprašą ar perėmimo kontrolinį sąrašą.

### 12.3.3. Prieigas ir administravimą

PRIVALOMA:

<!-- VENDOR-HAND-P09 | ai-reviewable -->
*   Turi būti perduotos prieigos prie kodo repozitorijų, jei jos vis dar reikalingos savivaldybei po darbų priėmimo.
<!-- VENDOR-HAND-P10 | ai-reviewable -->
*   Turi būti perduotos CI/CD sistemų prieigos arba jų konfigūracijos, jei savivaldybė perima jų valdymą.
<!-- VENDOR-HAND-P11 | ai-reviewable -->
*   Turi būti perduotos debesijos ir infrastruktūros konfigūracijos, įskaitant IaC artefaktus, jei jie naudojami.
<!-- VENDOR-HAND-P12 | ai-reviewable -->
*   Turi būti perduotos administracinės prieigos arba aiški jų perdavimo procedūra.
<!-- VENDOR-HAND-P13 | ai-reviewable -->
*   Turi būti perduotas slaptažodžių, sertifikatų ar kitų paslapčių rotacijos planas, jei toks taikomas.
<!-- VENDOR-HAND-P14 | process-level -->
*   Po perdavimo tiekėjas negali likti vieninteliu administratoriumi ar vieninteliu techninių prieigų turėtoju.

REKOMENDUOJAMA:

<!-- VENDOR-HAND-R03 | human-reviewable -->
*   Perdavimo metu rekomenduojama aiškiai atskirti, kurios prieigos yra laikinos pereinamuoju laikotarpiu, o kurios turi būti galutinai perimtos savivaldybės.

## 12.4. Kodo ir sprendimo nuosavybė

PRIVALOMA:

<!-- VENDOR-OWN-P01 | ai-reviewable -->
*   Visa pagal sutartį sukurta programinė įranga, jos šaltinio kodas, infrastruktūros konfigūracijos ir susiję artefaktai laikomi savivaldybės nuosavybe, jei sutartyje aiškiai nenumatyta kitaip.
<!-- VENDOR-OWN-P02 | process-level -->
*   Savivaldybė turi teisę naudoti, keisti, perduoti palaikymą kitam tiekėjui ir, jei tai neprieštarauja teisės aktams ar sutartims, viešinti kodą ar jo dalis.
<!-- VENDOR-OWN-P03 | ai-reviewable -->
*   Tiekėjas negali riboti savivaldybės teisių per licencijas, techninius sprendimus ar neperduodamas priklausomybes, išskyrus atvejus, kai tai aiškiai suderinta pirkimo ar sutarties etape.

REKOMENDUOJAMA:

<!-- VENDOR-OWN-R01 | ai-reviewable -->
*   Jei naudojami trečiųjų šalių komponentai ar licencinės priklausomybės, rekomenduojama iš anksto aiškiai dokumentuoti, kokias teises savivaldybė įgyja ir kokie ribojimai galioja.

## 12.5. Atitikimas šiam standartui (Compliance)

PRIVALOMA:

<!-- VENDOR-COMPL-P01 | process-level -->
*   Tiekėjas ar pavaldžioji įstaiga turi patvirtinti, kad sprendimas atitinka šį standartą arba turi aiškiai dokumentuotas bei patvirtintas išimtis.
<!-- VENDOR-COMPL-P02 | ai-reviewable -->
*   Atitiktis gali būti vertinama techninių peržiūrų, testavimo ir saugumo ataskaitų, dokumentacijos patikros bei bandomojo diegimo metu.
<!-- VENDOR-COMPL-P03 | process-level -->
*   Savivaldybė turi teisę atlikti auditą, reikalauti nustatytų neatitikimų ištaisymo ir sustabdyti darbų priėmimą iki atitikties užtikrinimo.

REKOMENDUOJAMA:

<!-- VENDOR-COMPL-R01 | human-reviewable -->
*   Atitikties vertinimą rekomenduojama numatyti ne tik perdavimo pabaigoje, bet ir tarpiniuose projekto etapuose, kad kritiniai neatitikimai būtų nustatyti anksčiau.

## 12.6. Nukrypimai ir išimtys

PRIVALOMA:

<!-- VENDOR-DEV-P01 | process-level -->
*   Nukrypimai nuo šio standarto leidžiami tik išimtiniais atvejais.
<!-- VENDOR-DEV-P02 | process-level -->
*   Kiekvienas nukrypimas turi būti dokumentuotas.
<!-- VENDOR-DEV-P03 | process-level -->
*   Kiekvienas nukrypimas turi turėti aiškų pagrindimą, rizikos įvertinimą ir kompensuojančias priemones, jei jos reikalingos.
<!-- VENDOR-DEV-P04 | process-level -->
*   Kiekvienas nukrypimas turi būti patvirtintas pagal šiame standarte nustatytą nukrypimų valdymo tvarką.

REKOMENDUOJAMA:

<!-- VENDOR-DEV-R01 | process-level -->
*   Nukrypimus rekomenduojama registruoti taip, kad jie būtų lengvai susiejami su konkrečiu projektu, tiekėju, sistema ir priėmimo sprendimu.

## 12.7. Darbų priėmimas

PRIVALOMA:

<!-- VENDOR-ACC-P01 | human-reviewable -->
*   Darbai laikomi priimtais tik tada, kai perduoti visi privalomi artefaktai.
<!-- VENDOR-ACC-P02 | process-level -->
*   Darbai laikomi priimtais tik tada, kai sistema atitinka šį standartą arba turi patvirtintas išimtis.
<!-- VENDOR-ACC-P03 | human-reviewable -->
*   Darbai laikomi priimtais tik tada, kai savivaldybė gali savarankiškai diegti, paleisti, prižiūrėti ir eksploatuoti sistemą pagal perduotus artefaktus.
<!-- VENDOR-ACC-P04 | ai-reviewable -->
*   Darbai negali būti laikomi galutinai priimtais, jei yra kritinių techninių ar saugumo skolų be aiškaus sprendimo plano.

REKOMENDUOJAMA:

<!-- VENDOR-ACC-R01 | ai-reviewable -->
*   Darbų priėmimo metu rekomenduojama naudoti formalų perdavimo kontrolinį sąrašą, apimantį kodą, dokumentaciją, prieigas, diegimą ir eksploatacijos parengtį.
<!-- VENDOR-ACC-R02 | process-level -->
*   Priėmimo metu rekomenduojama įvertinti sistemos atitiktį tiksliniam [brandos lygiui](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) pagal [§2.6](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) kriterijus.

> Susiję skyriai: [2.6 Standarto įgyvendinimo brandos lygiai](02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) · [12.3 Privalomi perdavimo artefaktai](#123-privalomi-perdavimo-artefaktai) · [9.5.1 Numatytieji SLO lygiai](09-stebesena-logai.md#951-numatytieji-slo-lygiai-tiers)
