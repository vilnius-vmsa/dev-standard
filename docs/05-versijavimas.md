# 5. Versijavimas ir priklausomybių valdymas

Šis skyrius apibrėžia versijavimo, priklausomybių ir techninės skolos valdymo taisykles, kurios būtinos sistemų stabilumui, saugumui, perimamumui ir ilgalaikiam palaikomumui užtikrinti.

Šio skyriaus reikalavimai taikomi programiniam kodui, API, bibliotekoms, diegimo artefaktams ir naudojamoms priklausomybėms.

## 5.1. Semantinis versijavimas (SemVer)

PRIVALOMA:

<!-- VER-SEM-P01 | ai-reviewable -->
*   Semantinis versijavimas MAJOR.MINOR.PATCH taikomas visoms sistemoms, bibliotekoms, API ir diegimo artefaktams.
<!-- VER-SEM-P02 | human-reviewable -->
*   MAJOR versija keičiama tada, kai atsiranda nesuderinami pokyčiai.
<!-- VER-SEM-P03 | ai-reviewable -->
*   MINOR versija keičiama tada, kai pridedamas naujas atgal suderinamas funkcionalumas.
<!-- VER-SEM-P04 | ai-reviewable -->
*   PATCH versija keičiama tada, kai atliekami klaidų taisymai be funkcinių pokyčių.
<!-- VER-SEM-P05 | ai-reviewable -->
*   Pre-release versijos, tokios kaip alpha, beta ar rc, leidžiamos tik neprodukcinėse aplinkose.
<!-- VER-SEM-P06 | ai-reviewable -->
*   Versijos šaltinis turi būti valdomas repozitorijoje, naudojant tag’us ar release’us, o ne rankiniu būdu serveryje ar vien tik CI procese.

REKOMENDUOJAMA:

<!-- VER-SEM-R01 | human-reviewable -->
*   Semantinio versijavimo taikymą išlaikyti nuoseklų visose projekto dalyse, kad būtų aiškus ryšys tarp kodo, artefaktų ir leidimų.

## 5.2. API versijavimas

PRIVALOMA:

<!-- VER-API-P01 | ai-reviewable -->
*   Visos viešos API turi būti versijuojamos
<!-- VER-API-P02 | ai-reviewable -->
*   Breaking changes (pvz., laukų šalinimas, semantikos keitimas, autentifikacijos ar autorizacijos pokyčiai) įgyvendinami tik išleidžiant naują major API versiją
<!-- VER-API-P03 | ai-reviewable -->
*   API kontraktai turi būti saugomi ir versijuojami kartu su kodu
<!-- VER-API-P04 | ai-reviewable -->
*   Turi būti apibrėžta deprecation politika, įskaitant senos versijos pažymėjimą, palaikymo terminą ir išankstinį vartotojų informavimą

REKOMENDUOJAMA:

<!-- VER-API-R01 | ai-reviewable -->
*   API versija nurodoma URL kelyje (/v1/...) arba Accept antraštėje; pasirenkamas vienas būdas ir jo laikomasi nuosekliai visos sistemos mastu
<!-- VER-API-R02 | ai-reviewable -->
*   API versijų nutraukimo (sunset) datos pateikiamos naudojant Sunset ir Deprecation HTTP antraštes
<!-- VER-API-R03 | ai-reviewable -->
*   Jei sistema turi išorinių vartotojų, vienu metu palaikyti bent dvi API versijas, kai tai pagrįsta produkto gyvavimo ciklu

> Susiję skyriai: [3.3.2 Versijavimas](03-architektura.md#332-versijavimas) · [3.9.5 Atnaujinimų valdymas](03-architektura.md#395-atnaujinimų-valdymas) · [8.4 Versijavimas ir žymėjimas (release artefaktams)](08-devops-ci-cd.md#84-versijavimas-ir-žymėjimas-release-artefaktams) · [8.9 Leidimų (release) valdymas](08-devops-ci-cd.md#89-leidimų-release-valdymas)

## 5.3. Bibliotekų ir paketų valdymas

PRIVALOMA:

<!-- VER-PKG-P01 | human-reviewable -->
*   Visos priklausomybės turi būti deklaruotos projekto valdymo failuose.
<!-- VER-PKG-P02 | ai-reviewable -->
*   Lock failai turi būti naudojami ir saugomi repozitorijoje.
<!-- VER-PKG-P03 | ai-reviewable -->
*   Produkcijoje turi būti naudojamos konkrečios priklausomybių versijos, o ne neapibrėžtos latest tipo nuorodos.
<!-- VER-PKG-P04 | ai-reviewable -->
*   Naudojami tik patvirtinti oficialūs arba organizacijos registrai.

REKOMENDUOJAMA:

<!-- VER-PKG-R01 | ai-reviewable -->
*   Priklausomybių atnaujinimus planuoti reguliariai, o ne tik reaguojant į incidentus ar pažeidžiamumus.
<!-- VER-PKG-R02 | ai-reviewable -->
*   Minor ir major atnaujinimus atlikti planuotai ir su testavimu, o ne atsitiktinai.

## 5.4. Leidžiamos ir draudžiamos priklausomybės

PRIVALOMA:

<!-- VER-ALLOW-P01 | ai-reviewable -->
*   Leidžiamos tik aktyviai palaikomos priklausomybės, turinčios aiškią licenciją ir suprantamą palaikymo modelį.
<!-- VER-ALLOW-P02 | ai-reviewable -->
*   Draudžiama naudoti EOL bibliotekas, neaiškios licencijos komponentus ar nepatikimus, neaudituotus šaltinius.
<!-- VER-ALLOW-P03 | ai-reviewable -->
*   Priklausomybės turi atitikti organizacijos licencijų politiką.
<!-- VER-ALLOW-P04 | ai-reviewable -->
*   Licencijų pažeidimai turi blokuoti leidimą, kol rizika neišspręsta arba aiškiai nepriimta.

REKOMENDUOJAMA:

<!-- VER-ALLOW-R01 | ai-reviewable -->
*   Priklausomybės vertinamos ne tik pagal funkcionalumą, bet ir pagal ilgalaikį palaikomumą, bendruomenės aktyvumą ir saugumo istoriją.

> Susiję skyriai: [3.10.5 Atviro kodo licencijos ir programinės įrangos sudėtis](03-architektura.md#3105-atviro-kodo-licencijos-ir-programinės-įrangos-sudėtis) · [8.6 DevSecOps (CI/CD kontrolė)](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė)

## 5.5. Priklausomybių saugumas ir atsekamumas

PRIVALOMA:

<!-- VER-SEC-P01 | human-reviewable -->
*   Turi būti aišku, kuri sistemos versija naudoja kurias priklausomybes.
<!-- VER-SEC-P02 | process-level -->
*   Kritiniai pažeidžiamumai priklausomybėse turi būti sprendžiami nedelsiant arba turi būti dokumentuotas sprendimo planas.
<!-- VER-SEC-P03 | human-reviewable -->
*   Turi būti naudojamos automatinės priklausomybių saugumo tikrinimo priemonės.

REKOMENDUOJAMA:

<!-- VER-SEC-R01 | ai-reviewable -->
*   SBOM generuoti kiekvienam leidimui ir saugoti kartu su release artefaktais.
<!-- VER-SEC-R02 | ai-reviewable -->
*   SBOM naudoti pažeidžiamumų valdymui, licencijų auditui ir tiekimo grandinės rizikos vertinimui.

> Susiję skyriai: [4.6 Saugumas kodo lygmeniu](04-kodo-kurimo-gaires.md#46-saugumas-kodo-lygmeniu) · [6 Saugumas (Security by Design)](06-saugumas.md) · [8.6 DevSecOps (CI/CD kontrolė)](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė)
