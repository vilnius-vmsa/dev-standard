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

## 5.3. Bibliotekų ir paketų valdymas (angl. dependencies)

PRIVALOMA:

<!-- VER-PKG-P01 | human-reviewable -->
*   Visos priklausomybės turi būti deklaruotos projekto valdymo failuose.
<!-- VER-PKG-P02 | ai-reviewable -->
*   Lock failai turi būti naudojami ir saugomi repozitorijoje.
<!-- VER-PKG-P03 | ai-reviewable -->
*   Produkcijoje turi būti naudojamos konkrečios priklausomybių versijos, o ne neapibrėžtos latest tipo nuorodos.
<!-- VER-PKG-P04 | ai-reviewable -->
*   Naudojami tik patvirtinti oficialūs arba organizacijos registrai.
<!-- VER-PKG-P05 | ai-reviewable -->
*   Dependabot arba lygiavertis automatizuotas priklausomybių naujinimo įrankis turi būti sukonfigūruotas visoms projekte naudojamoms priklausomybių valdymo ekosistemoms, įskaitant Composer, npm, Yarn, pnpm, Maven, Gradle, pip, Docker ir GitHub Actions, jei jos naudojamos projekte.
<!-- VER-PKG-P06 | ai-reviewable -->
*   Dependabot konfigūracija turi apimti aplikacijos bibliotekų, konteinerių vaizdų, CI/CD darbo eigų ir kitų projekto priklausomybių atnaujinimus, jei tokios priklausomybės naudojamos.
<!-- VER-PKG-P07 | human-reviewable -->
*   Automatiniams priklausomybių atnaujinimams valdyti turi būti naudojama atskira ilgalaikė `dependencies` šaka, skirta Dependabot arba lygiaverčio įrankio siūlomiems atnaujinimams testuoti ir integruoti.
<!-- VER-PKG-P08 | ai-reviewable -->
*   `dependencies` šaka turi būti nuolat sinchronizuojama su pagrindine `main` šaka, kad priklausomybių atnaujinimai būtų vertinami pagal aktualią projekto kodo bazės ir konfigūracijos būseną.
<!-- VER-PKG-P09 | human-reviewable -->
*   Priklausomybių atnaujinimai neturi būti automatiškai suliejami į `main` šaką be atsakingo asmens peržiūros, suderinamumo įvertinimo ir testavimo.
<!-- VER-PKG-P10 | human-reviewable -->
*   Atsakingas kūrėjas, gavęs Dependabot arba lygiaverčio įrankio pasiūlytą atnaujinimą, turi lokaliai atsisiųsti `dependencies` šaką, pritaikyti siūlomą pakeitimą ir atlikti suderinamumo, testų bei veikimo patikrą.
<!-- VER-PKG-P11 | human-reviewable -->
*   Patikrinus priklausomybių atnaujinimo suderinamumą, atsakingas kūrėjas turi paruošti Pull Request į `main` šaką ir, jei projekte naudojama, į `stage` arba kitą tarpinės aplinkos šaką.
<!-- VER-PKG-P12 | ai-reviewable -->
*   Dependabot arba lygiaverčio įrankio sukurti Pull Request turi aiškiai nurodyti atnaujinamą priklausomybę, esamą ir siūlomą versiją, priklausomybių ekosistemą, pvz., npm, Composer, Docker, GitHub Actions, bei atnaujinimo tipą, pvz., patch, minor arba major.
<!-- VER-PKG-P13 | human-reviewable -->
*   Major versijų atnaujinimai turi būti vertinami atskirai nuo patch ir minor atnaujinimų, papildomai peržiūrint suderinamumą, migracijos instrukcijas ir galimus nesuderinamus pakeitimus.
<!-- VER-PKG-P14 | ai-reviewable -->
*   Saugumo atnaujinimai turi būti prioritetizuojami ir tvarkomi greičiau nei įprasti funkcinių ar techninių versijų atnaujinimai.

REKOMENDUOJAMA:

<!-- VER-PKG-R01 | ai-reviewable -->
*   Priklausomybių atnaujinimus planuoti reguliariai, o ne tik reaguojant į incidentus ar pažeidžiamumus.
<!-- VER-PKG-R02 | ai-reviewable -->
*   Minor ir major atnaujinimus atlikti planuotai ir su testavimu, o ne atsitiktinai.
<!-- VER-PKG-R03 | ai-reviewable -->
*   `dependencies` šaka turi būti automatiškai sinchronizuojama su `main` šaka po kiekvieno `main` šakos atnaujinimo, kad kūrėjams nereikėtų rankiniu būdu perkelti `main` pakeitimų į `dependencies` šaką.

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
