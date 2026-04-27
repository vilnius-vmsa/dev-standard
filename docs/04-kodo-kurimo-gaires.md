# 4. Programinio kodo kūrimo ir keitimo gairės

Šis skyrius apibrėžia kasdienes praktines taisykles, kurių privalu laikytis kuriant, keičiant ir peržiūrint programinį kodą. Jo tikslas — užtikrinti kodo kokybę, skaitomumą, palaikomumą, saugumą ir sprendimų perimamumą tiek vidinėse komandose, tiek dirbant su išoriniais tiekėjais.

Šis skyrius taikomas visiems projekto repozitorijams. Išoriniams tiekėjams šios taisyklės turi būti įtrauktos į sutartis ir technines specifikacijas.

## 4.1. Bendrieji kodo rašymo principai

Šiame poskyryje apibrėžiami bendrieji principai, kurių privaloma laikytis rašant, keičiant ir refaktorizuojant programinį kodą. Principų tikslas – užtikrinti kodo skaitomumą, aiškumą, palaikomumą ir saugų elgesį per visą sistemos gyvavimo ciklą.

### 4.1.1. Skaitomumas ir aiškumas

PRIVALOMA:

<!-- CODE-GEN-P01 | human-reviewable -->
*   Kodas pirmiausia skirtas žmonėms skaityti, tik po to – kompiuteriui vykdyti; trumpumas neturi būti aukojamas skaitomumo sąskaita.
<!-- CODE-GEN-P02 | human-reviewable -->
*   Kintamųjų, metodų, klasių, modulių ir paketų pavadinimai turi aiškiai atspindėti paskirtį ir kontekstą.
<!-- CODE-GEN-P03 | human-reviewable -->
*   Vengiamos santrumpos be aiškaus konteksto, išskyrus visuotinai priimtas santrumpas, tokias kaip id, url, dto.
<!-- CODE-GEN-P04 | ai-reviewable -->
*   Metodai ir funkcijos turi turėti vieną aiškią atsakomybę; jei metodą sunku apibūdinti trumpu pavadinimu, tai signalas, kad jis daro per daug.

REKOMENDUOJAMA:

<!-- CODE-GEN-R01 | human-reviewable -->
*   Tarpiniai kintamieji nekuriami be aiškios priežasties; jei reikšmė naudojama tik vieną kartą ir tarpinis pavadinimas neprideda aiškumo, grąžinama tiesiogiai.

### 4.1.2. Komentarų politika

Komentarai kode yra išimtis, ne norma. Gerai parašytas kodas turėtų būti kiek įmanoma savidokumentuojantis.

PRIVALOMA:

<!-- CODE-GEN-P05 | ai-reviewable -->
*   Komentarai paliekami tik tada, kai jie paaiškina neakivaizdžią verslo taisyklę, išorinės sistemos nestandartinį elgesį, sąmoningą kompromisą ar sudėtingo algoritmo sprendimo motyvaciją.
<!-- CODE-GEN-P06 | ai-reviewable -->
*   Komentarai, susiję su technine skola ar laikinais sprendimais, turi turėti nuorodą į uždavinį.
<!-- CODE-GEN-P07 | ai-reviewable -->
*   Pasenę ar realaus kodo neatitinkantys komentarai turi būti atnaujinami arba šalinami nedelsiant.
<!-- CODE-GEN-P08 | ai-reviewable -->
*   Draudžiama laikyti užkomentuotą kodą.
<!-- CODE-GEN-P09 | ai-reviewable -->
*   Draudžiama palikti komentarus, kurie dubliuoja akivaizdžią kodo logiką.

REKOMENDUOJAMA:

<!-- CODE-GEN-R02 | ai-reviewable -->
*   Jei komentaras aiškina, ką daro kodas, tai laikoma signalu refaktorizuoti kodą, o ne plėsti komentarus.

### 4.1.3. Dead code draudimas

PRIVALOMA:

<!-- CODE-GEN-P10 | ai-reviewable -->
*   Repozitorijoje negali būti nepasiekiamo kodo, nenaudojamų importų, kintamųjų, metodų ar klasių.
<!-- CODE-GEN-P11 | ai-reviewable -->
*   Laikinas debug kodas negali likti produkciniame ar į pagrindines šakas jungiamame kode.
<!-- CODE-GEN-P12 | ai-reviewable -->
*   Dead code turi būti šalinamas nedelsiant.

REKOMENDUOJAMA:

<!-- CODE-GEN-R03 | ai-reviewable -->
*   Linter ir IDE inspekcijos naudojamos automatiškai aptikti dead code, o CI proceso metu tokie pažeidimai blokuoja merge’inimą.

### 4.1.4. Magiškų reikšmių draudimas

PRIVALOMA:

<!-- CODE-GEN-P13 | human-reviewable -->
*   Skaičiai, eilutės ir kitos reikšmės, turinčios verslo prasmę arba naudojamos daugiau nei vienoje vietoje, turi būti išskiriamos į pavadintas konstantas arba enum tipus.
<!-- CODE-GEN-P14 | ai-reviewable -->
*   Draudžiamos magiškos reikšmės be konteksto.
<!-- CODE-GEN-P15 | ai-reviewable -->
*   Konstantos turi būti grupuojamos pagal domeną ar funkcionalumą, o ne išbarstomos po visą kodą.

### 4.1.5. Konfigūracija ≠ kodas

PRIVALOMA:

<!-- CODE-GEN-P16 | ai-reviewable -->
*   Aplinkos specifinės reikšmės, tokios kaip URL, limitai, feature flag’ai ar laiko intervalai, negali būti hardcoded programiniame kode.
<!-- CODE-GEN-P17 | ai-reviewable -->
*   Tokios reikšmės valdomos per aplinkos kintamuosius arba konfigūracijos paslaugas.

REKOMENDUOJAMA:

<!-- CODE-GEN-R04 | ai-reviewable -->
*   Konfigūracijos reikšmes grupuoti ir dokumentuoti taip, kad būtų aišku, kurios jų yra bendros, o kurios priklauso nuo aplinkos.
<!-- CODE-GEN-R05 | ai-reviewable -->
*   Taikoma kartu su [#3.5](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) skyriaus konfigūracijos, slaptųjų raktų ir aplinkų valdymo reikalavimais.

### 4.1.6. Klaidų valdymas

PRIVALOMA:

<!-- CODE-GEN-P18 | ai-reviewable -->
*   Klaidos turi būti valdomos eksplicitiškai; draudžiama tyliai ignoruoti išimtis.
<!-- CODE-GEN-P19 | human-reviewable -->
*   Žemesnio lygio išimtys turi būti apvyniojamos į domeno lygmens išimtis, pridedant kontekstą, kai tai pagrįsta.
<!-- CODE-GEN-P20 | ai-reviewable -->
*   Klaidų pranešimai vartotojui turi būti informatyvūs, bet neatskleisti vidinės sistemos detalių.
<!-- CODE-GEN-P21 | human-reviewable -->
*   Techninės klaidų detalės pateikiamos tik loguose.

REKOMENDUOJAMA:

<!-- CODE-GEN-R06 | human-reviewable -->
*   Null reikšmių grąžinimo vengti; vietoje to naudoti aiškius rezultatų tipus arba išimtis.

### 4.1.7. Asinchroninis kodas

PRIVALOMA:

<!-- CODE-GEN-P22 | ai-reviewable -->
*   Asinchroninis programavimas turi būti naudojamas nuosekliai; draudžiami blokuojantys kvietimai asinchroniniame kontekste.
<!-- CODE-GEN-P23 | ai-reviewable -->
*   Bendrai naudojami ištekliai turi būti apsaugoti tinkamais sinchronizacijos mechanizmais.
<!-- CODE-GEN-P24 | ai-reviewable -->
*   Atšaukimo mechanizmai turi būti perduodami per visą asinchroninių kvietimų grandinę, kad operacijos galėtų būti nutrauktos korektiškai.

REKOMENDUOJAMA:

<!-- CODE-GEN-R07 | human-reviewable -->
*   Bendros kintamos būsenos naudojimą minimizuoti.
<!-- CODE-GEN-R08 | ai-reviewable -->
*   Asinchroninį kodą projektuoti taip, kad jis būtų lengvai testuojamas ir nuspėjamas.

## 4.2. Kodo struktūra ir konvencijos

Šiame poskyryje apibrėžiami reikalavimai projekto struktūrai, pavadinimų konvencijoms, automatiniam formatavimui ir linting, taip pat failų ir modulių dydžio kontrolei.

Tikslas – užtikrinti vienodą, lengvai perimamą ir nuoseklų kodą visose komandose ir repozitorijose.

### 4.2.1. Projekto struktūra

PRIVALOMA:

<!-- CODE-CONV-P01 | human-reviewable -->
*   Katalogų ir paketų struktūra turi būti vieninga visame projekte ir atspindėti domeno arba architektūros sluoksnių suskirstymą.
<!-- CODE-CONV-P02 | human-reviewable -->
*   Nauji failai ir moduliai kuriami pagal nusistovėjusią projekto struktūrą, o ne pagal individualų patogumą.
<!-- CODE-CONV-P03 | process-level -->
*   Struktūros pakeitimai, kurie daro įtaką projekto organizavimui, turi būti aptarti komandoje ir, jei reikšmingi, dokumentuoti.

REKOMENDUOJAMA:

<!-- CODE-CONV-R01 | ai-reviewable -->
*   Projekto struktūrą išlaikyti kuo stabilesnę per visą projekto gyvavimo ciklą.
<!-- CODE-CONV-R02 | human-reviewable -->
*   Jei projekte taikoma kelių sluoksnių ar modulių architektūra, struktūrą rekomenduojama aiškiai atskirti pagal atsakomybes, o ne pagal techninius atsitiktinumus.

### 4.2.2. Pavadinimų konvencijos

PRIVALOMA:

<!-- CODE-CONV-P04 | ai-reviewable -->
*   Pavadinimų konvencijos turi būti taikomos nuosekliai visame projekte.
<!-- CODE-CONV-P05 | ai-reviewable -->
*   Klasės, tipai ir komponentai – PascalCase
<!-- CODE-CONV-P06 | ai-reviewable -->
*   Metodai, funkcijos ir kintamieji – camelCase
<!-- CODE-CONV-P07 | human-reviewable -->
*   Konstantos ir enum reikšmės – UPPER\_SNAKE\_CASE
<!-- CODE-CONV-P08 | human-reviewable -->
*   Duomenų bazės lentelės ir stulpeliai – snake\_case
<!-- CODE-CONV-P09 | ai-reviewable -->
*   URL segmentai – kebab-case
<!-- CODE-CONV-P10 | human-reviewable -->
*   Failai – pagal kalbos ar technologijos plačiausiai priimtą praktiką
<!-- CODE-CONV-P11 | ai-reviewable -->
*   Kalboms ar technologijoms, neaptartoms šiame dokumente, taikoma oficiali arba plačiausiai priimta bendruomenės konvencija.
<!-- CODE-CONV-P12 | ai-reviewable -->
*   Nukrypimai turi būti aiškiai apibrėžti projekto README arba kituose projekto lygmens susitarimuose.

REKOMENDUOJAMA:

<!-- CODE-CONV-R03 | ai-reviewable -->
*   Jei technologijų rinkinyje naudojamos skirtingos kalbos, konvencijas rekomenduojama suderinti taip, kad jos būtų kuo lengviau suprantamos visos komandos mastu.
<!-- CODE-CONV-R04 | ai-reviewable -->
*   URL, DB ir failų pavadinimų konvencijas derinti su atitinkamais architektūros ir API reikalavimais.

> Susiję skyriai: [3.3.3 Resursų modeliavimas ir URL dizainas](03-architektura.md#333-resursų-modeliavimas-ir-url-dizainas)

### 4.2.3. Automatinis formatavimas ir linting

PRIVALOMA:

<!-- CODE-CONV-P13 | ai-reviewable -->
*   Kiekvienas projektas turi naudoti organizacijos pateiktą arba organizacijos lygiu patvirtintą formatavimo ir linting taisyklių rinkinį.
<!-- CODE-CONV-P14 | process-level -->
*   Bazinių taisyklių rinkinys neturi būti savavališkai keičiamas projekto ar komandos lygiu be suderinto peržiūros proceso.
<!-- CODE-CONV-P15 | ai-reviewable -->
*   Konkretūs įrankiai ir jų versijos turi būti aiškiai nurodyti organizacijos technologijų registre arba projekto techniniame apraše.
<!-- CODE-CONV-P16 | ai-reviewable -->
*   Formatavimas ir linting turi būti vykdomi tiek lokaliai prieš commit, tiek CI/CD procese.
<!-- CODE-CONV-P17 | ai-reviewable -->
*   Nepraėję automatiniai formatavimo ar linting patikrinimai turi blokuoti commit arba merge, priklausomai nuo taikomo proceso.
<!-- CODE-CONV-P18 | ai-reviewable -->
*   Taisyklių išimtys konkrečiai eilutei ar blokui leidžiamos tik su aiškiu paaiškinimu kode.

REKOMENDUOJAMA:

<!-- CODE-CONV-R05 | ai-reviewable -->
*   Naudoti pre-commit hooks kaip pirmąją gynybos liniją prieš nekokybišką kodą patenkant į repozitoriją.
<!-- CODE-CONV-R06 | ai-reviewable -->
*   Projekto specifinius papildymus prie bazinio taisyklių rinkinio taikyti tik tais atvejais, kai jie neprieštarauja bendroms organizacijos taisyklėms.
<!-- CODE-CONV-R07 | process-level -->
*   Globalus taisyklės išjungimas turėtų būti leidžiamas tik per formalų taisyklių rinkinio peržiūros procesą.

> Susiję skyriai: [8.2 CI (Continuous Integration) minimalūs reikalavimai](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai)

### 4.2.4. Failų ir modulių dydis

PRIVALOMA:

<!-- CODE-CONV-P19 | process-level -->
*   Labai dideli failai, moduliai ar metodai turi būti laikomi signalu peržiūrėti atsakomybių paskirstymą.
<!-- CODE-CONV-P20 | ai-reviewable -->
*   Sprendimas refaktorizuoti turi būti grindžiamas ne vien eilučių skaičiumi, bet pirmiausia Single Responsibility principu ir kodo suprantamumu.

REKOMENDUOJAMA:

<!-- CODE-CONV-R08 | process-level -->
*   Failai, viršijantys maždaug 300–500 eilučių, turėtų būti peržiūrimi kaip galimas per didelės atsakomybės požymis.
<!-- CODE-CONV-R09 | human-reviewable -->
*   Metodai, viršijantys maždaug 30–50 eilučių, turėtų būti vertinami kaip kandidatai išskaidymui į pagalbinius metodus ar mažesnes atsakomybes.
<!-- CODE-CONV-R10 | process-level -->
*   Dydžio ribos turėtų būti taikomos kaip peržiūros signalas, o ne mechaniškas draudimas.

## 4.3. Versijų valdymas ir repozitorijos

Šiame poskyryje apibrėžiami reikalavimai versijų kontrolei, repozitorijų valdymui, šakų strategijai, commit’ams, PR/MR procesui ir repozitorijų higienai.

Tikslas – užtikrinti atsekamą, saugų ir perimamą programinio kodo, konfigūracijos ir automatizavimo artefaktų valdymą.

### 4.3.1. Versijų kontrolė ir repozitorijų valdymas

PRIVALOMA:

<!-- CODE-VCS-P01 | ai-reviewable -->
*   Visas programinis kodas, infrastruktūros kodas, konfigūracijos šablonai ir automatizavimo skriptai turi būti saugomi Git versijų valdymo sistemoje.
<!-- CODE-VCS-P02 | ai-reviewable -->
*   Repozitorijos turi būti laikomos savivaldybės arba jos kontroliuojamoje platformoje; draudžiama naudoti tiekėjo privačią repozitoriją kaip vienintelį kodo šaltinį.
<!-- CODE-VCS-P03 | ai-reviewable -->
*   Išoriniai tiekėjai turi dirbti savivaldybės platformos repozitorijose arba naudoti automatizuotą mirror’inimą su atsekama sinchronizacija.
<!-- CODE-VCS-P04 | ai-reviewable -->
*   Prieigos prie repozitorijų turi būti suteikiamos ir atimamos pagal atsakomybes ir sutarties galiojimą.
<!-- CODE-VCS-P05 | ai-reviewable -->
*   Tiesioginiai pakeitimai serveriuose, failų sistemose ar per administravimo sąsajas be repozitorijos yra draudžiami.

REKOMENDUOJAMA:

<!-- CODE-VCS-R01 | ai-reviewable -->
*   Repozitorijų struktūrą, pavadinimus ir atsakomybes išlaikyti nuoseklias visos organizacijos mastu.
<!-- CODE-VCS-R02 | ai-reviewable -->
*   Repozitorijų valdymo modelį dokumentuoti taip, kad būtų aišku, kur laikomas programinis kodas, kur infrastruktūros kodas ir kur bendros bibliotekos.

> Susiję skyriai: [12 Tiekėjų ir pavaldžių įstaigų reikalavimai](12-tiekeju-reikalavimai.md) · [8 DevOps ir CI/CD reikalavimai](08-devops-ci-cd.md)

### 4.3.2. Šakų (Branch) strategija

PRIVALOMA:

<!-- CODE-VCS-P06 | ai-reviewable -->
*   Projektuose turi būti naudojama aiški ir visai komandai vienodai taikoma šakų strategija.
<!-- CODE-VCS-P07 | ai-reviewable -->
*   Šakų pavadinimai turi atitikti sutartą formatą:

`<type>/ticket-<ticket id>-<short description>`

Pavyzdys:

feature/ticket-123456-add-2fa

*   Turi būti aiškiai apibrėžtos bent šios šakų paskirtys:
    *   main – stabilus, išleistas kodas
    *   staging – priešprodukcinei aplinkai ir UAT
    *   dev – integracinei plėtrai
    *   feature/\* – atskiroms funkcijoms ar uždaviniams
    *   hotfix/\* – kritiniams pataisymams
    *   release/\* – leidimo paruošimui, jei projektas tokį etapą taiko
*   Tiesioginiai push’ai į main, staging ir dev šakas turi būti draudžiami.
*   Feature ir hotfix šakos turi būti trumpalaikės ir šalinamos po sujungimo.

REKOMENDUOJAMA:

<!-- CODE-VCS-R03 | human-reviewable -->
*   Naudoti nuoseklų srautą:
    *   feature/\* → dev → staging → main
    *   hotfix/\* → main ir atgal į dev arba staging, jei taikoma
<!-- CODE-VCS-R04 | ai-reviewable -->
*   Pasenusias neaktyvias šakas periodiškai archyvuoti arba šalinti.

> Susiję skyriai: [8.3 CD (Continuous Delivery/Deployment)](08-devops-ci-cd.md#83-cd-continuous-delivery-deployment) · [8.9 Leidimų (release) valdymas](08-devops-ci-cd.md#89-leidimų-release-valdymas)

### 4.3.3. Šakų (Branch) apsauga

PRIVALOMA:

<!-- CODE-VCS-P08 | human-reviewable -->
*   Main, staging ir dev šakoms turi būti įjungta apsauga nuo tiesioginių push’ų.
<!-- CODE-VCS-P09 | ai-reviewable -->
*   Šių šakų pakeitimai gali būti atliekami tik per PR arba MR procesą.
<!-- CODE-VCS-P10 | human-reviewable -->
*   Prieš sujungimą turi būti sėkmingai įvykdyti visi privalomi automatiniai patikrinimai.
<!-- CODE-VCS-P11 | ai-reviewable -->
*   Jei po peržiūros PR yra papildomai pakeičiamas, ankstesni patvirtinimai turi būti peržiūrimi iš naujo arba automatiškai anuliuojami pagal platformos galimybes.

REKOMENDUOJAMA:

<!-- CODE-VCS-R05 | process-level -->
*   Main ir staging šakoms naudoti griežtesnius peržiūros reikalavimus negu feature šakoms.
<!-- CODE-VCS-R06 | ai-reviewable -->
*   Aukštos rizikos arba architektūrinio poveikio pakeitimams reikalauti papildomos tech lead ar architekto peržiūros.

> Susiję skyriai: [4.4 Code Review principai](#44-code-review-principai) · [8.2 CI (Continuous Integration) minimalūs reikalavimai](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai)

### 4.3.4. Commit'ų gairės

PRIVALOMA:

<!-- CODE-VCS-P12 | ai-reviewable -->
*   Vienas commit’as turi atitikti vieną aiškią loginę idėją arba pataisą.
<!-- CODE-VCS-P13 | ai-reviewable -->
*   Commit žinutės turi būti aiškios, atsekamos ir rašomos anglų kalba.
<!-- CODE-VCS-P14 | ai-reviewable -->
*   Automatiniai formatavimo ar linting commit’ai neturi maskuoti funkcinių pakeitimų.
<!-- CODE-VCS-P15 | ai-reviewable -->
*   Commit žinutėse turi būti aiškiai nurodomas pakeitimo tipas ir susietas uždavinys.
<!-- CODE-VCS-P16 | ai-reviewable -->
*   Naudojamas [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) formatas:
    *   `<tipas>(<apimtis>): <trumpas aprašas> (ticket-<užduoties_id>)`
    *   Pvz.: `feat(auth): add 2FA (ticket-45678)`
<!-- CODE-VCS-P17 | human-reviewable -->
*   Leidžiami tipai:
    *   **feat:** Įdiegta nauja funkcija
    *   **fix:** Ištaisoma klaida
    *   **chore:** Įprastos priežiūros užduotys, pvz., priklausomybių atnaujinimas ar build skriptų pakeitimai
    *   **docs:** Dokumentacijos pakeitimai
    *   **style:** Formatavimo arba kodo stiliaus pakeitimai, kurie nekeičia funkcionalumo
    *   **refactor:** Kodo pakeitimai, kurie nei taiso klaidos, nei prideda naujos funkcijos
    *   **perf:** Našumo patobulinimai
    *   **test:** Testų pridėjimas arba atnaujinimas
    *   **build:** Pakeitimai, susiję su build įrankiais arba priklausomybėmis
    *   **ci:** Nuolatinės integracijos (CI) ir operaciniai pakeitimai, pvz., diegimo skriptai ar infrastruktūros konfigūracijos pakeitimai
<!-- CODE-VCS-P18 | ai-reviewable -->
*   Apimtis turi nurodyti kontekstą arba paliestą sritį, pvz. auth, api, ui, config, docker.
<!-- CODE-VCS-P19 | human-reviewable -->
*   Trumpas aprašas turi būti imperatyvus, rašomas mažosiomis raidėmis ir be taško sakinio gale.

REKOMENDUOJAMA:

<!-- CODE-VCS-R07 | ai-reviewable -->
*   Didelius pakeitimus skaidyti į kelis logiškai nuoseklius commit’us, kad būtų paprasčiau peržiūrėti istoriją ir atlikti rollback.
<!-- CODE-VCS-R08 | ai-reviewable -->
*   Commit istoriją išlaikyti švarią ir informatyvią, vengiant perteklinių tarpinių commit’ų pagrindinėse šakose.

### 4.3.5. Pull Request / Merge Request reikalavimai {#435-pull-request-merge-request-reikalavimai}

PRIVALOMA:

<!-- CODE-VCS-P20 | ai-reviewable -->
*   Kiekvienas PR arba MR turi turėti aprašą pagal organizacijos šabloną.
<!-- CODE-VCS-P21 | human-reviewable -->
*   Apraše turi būti nurodyta:
    *   kas keičiama
    *   kodėl keičiama
    *   kaip patikrinti pakeitimą
    *   ar reikia atnaujinti dokumentaciją
    *   ar reikia keisti konfigūraciją
    *   ar yra duomenų migracijų
<!-- CODE-VCS-P22 | ai-reviewable -->
*   Kiekvienas PR arba MR turi būti susietas su uždaviniu užduočių valdymo sistemoje.
<!-- CODE-VCS-P23 | ai-reviewable -->
*   Turi būti aiškiai nurodyta, ar pakeitimas turi breaking changes, migracijų, priklausomybių ar infrastruktūrinį poveikį.
<!-- CODE-VCS-P24 | ai-reviewable -->
*   PR arba MR negali būti sujungtas, jei automatiniai patikrinimai nesėkmingi.

REKOMENDUOJAMA:

<!-- CODE-VCS-R09 | ai-reviewable -->
*   Mažesni ir dažnesni PR yra laikomi geresne praktika negu reti ir labai dideli pakeitimai.
<!-- CODE-VCS-R10 | ai-reviewable -->
*   Labai didelės apimties PR turėtų būti skaidomos, kai tai įmanoma.
<!-- CODE-VCS-R11 | ai-reviewable -->
*   Draft PR arba MR rekomenduojama naudoti ankstyvam grįžtamajam ryšiui, jei implementacija dar nebaigta.

> Susiję skyriai: [4.4 Code Review principai](#44-code-review-principai) · [4.5 Testai](#45-testai) · [8.2 CI (Continuous Integration) minimalūs reikalavimai](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai) · [10 Dokumentacija](10-dokumentacija.md) · [E priedas. PR / MR šablonas](priedai/pr-mr-sablonas.md)

### 4.3.6. Repozitorijos higiena

PRIVALOMA:

<!-- CODE-VCS-P25 | ai-reviewable -->
*   Repozitorijoje turi būti tinkamai sukonfigūruotas .gitignore.
<!-- CODE-VCS-P26 | ai-reviewable -->
*   Slaptieji raktai, IDE failai, kompiliavimo artefaktai ir kiti nereikalingi failai negali patekti į repozitoriją.
<!-- CODE-VCS-P27 | ai-reviewable -->
*   Slaptųjų raktų skenavimas turi būti įjungtas; aptiktas secret turi būti laikomas incidentu, reikalaujančiu neatidėliotinos reakcijos.
<!-- CODE-VCS-P28 | ai-reviewable -->
*   Repozitorijoje neturi būti laikomi dideli dvejetainiai failai, jei tam nėra aiškaus pagrindimo ir tinkamo valdymo mechanizmo.

REKOMENDUOJAMA:

<!-- CODE-VCS-R12 | human-reviewable -->
*   Didelius dvejetainius failus valdyti per git-lfs arba lygiavertį mechanizmą.
<!-- CODE-VCS-R13 | ai-reviewable -->
*   Repozitorijos aprašą, temas ir nuorodas į dokumentaciją laikyti aktualias.
<!-- CODE-VCS-R14 | ai-reviewable -->
*   Repozitorijos šaknyje turėti minimalų README su paskirtimi ir pagrindinėmis nuorodomis.

> Susiję skyriai: [3.5.2 Slaptieji raktai](03-architektura.md#352-slaptieji-raktai) · [6.4 Secrets management](06-saugumas.md#64-secrets-management) · [10 Dokumentacija](10-dokumentacija.md) · [12 Tiekėjų ir pavaldžių įstaigų reikalavimai](12-tiekeju-reikalavimai.md)

## 4.4. Code Review principai

Šiame poskyryje apibrėžiami kodo peržiūros reikalavimai, taikomi visiems programinio kodo pakeitimams prieš jų sujungimą į bendras šakas.

Code review tikslas – užtikrinti kodo kokybę, saugumą, architektūros principų laikymąsi ir žinių pasidalijimą komandoje.

PRIVALOMA:

<!-- CODE-REV-P01 | ai-reviewable -->
*   Kiekvieną PR arba MR turi peržiūrėti bent vienas kitas komandos narys.
<!-- CODE-REV-P02 | ai-reviewable -->
*   Sudėtingiems, aukštos rizikos arba architektūrinį poveikį turintiems pakeitimams turi būti atliekama papildoma tech lead arba architekto peržiūra.
<!-- CODE-REV-P03 | process-level -->
*   Kodo peržiūros metu privaloma įvertinti bent šiuos aspektus:
    *   kodo kokybę ir skaitomumą
    *   saugumo aspektus
    *   architektūros principų laikymąsi
    *   testų pakankamumą ir kokybę
<!-- CODE-REV-P04 | ai-reviewable -->
*   Autorius yra atsakingas už pateikto kodo kokybę ir visų peržiūros komentarų adresavimą.
<!-- CODE-REV-P05 | ai-reviewable -->
*   Reviewer yra atsakingas už pastebėtų rizikų, neatitikimų ir tobulintinų vietų aiškų užfiksavimą.
<!-- CODE-REV-P06 | ai-reviewable -->
*   Neišspręstos peržiūros diskusijos blokuoja merge’inimą.

REKOMENDUOJAMA:

<!-- CODE-REV-R01 | process-level -->
*   Code review laikyti ne tik kontrolės, bet ir žinių pasidalijimo priemone.
<!-- CODE-REV-R02 | ai-reviewable -->
*   Komentarus formuluoti orientuojantis į sprendimą, o ne į asmenį; kritikuojamas kodas, ne autorius.
<!-- CODE-REV-R03 | ai-reviewable -->
*   Jei pakeitimas apima kelias temas, rekomenduojama review metu aiškiai atskirti kritines pastabas nuo siūlomų patobulinimų.
<!-- CODE-REV-R04 | ai-reviewable -->
*   Dideliems arba sudėtingiems pakeitimams rekomenduojama review metu nurodyti, kurios vietos yra didžiausios rizikos ar reikalauja papildomo dėmesio.

> Susiję skyriai: [4.3.5 Pull Request / Merge Request reikalavimai](#435-pull-request-merge-request-reikalavimai) · [4.5 Testai](#45-testai)

## 4.5. Testai

Šiame poskyryje apibrėžiami testavimo reikalavimai, taikomi kodo pakeitimo lygmeniu prieš merge’inimą.

Bendrieji testavimo principai, testų tipai, kokybės vartai ir testų vykdymo CI/CD procese reikalavimai apibrėžti [#7](07-testavimas.md) skyriuje.

PRIVALOMA:

<!-- CODE-TEST-P01 | ai-reviewable -->
*   Testai yra programinio kodo dalis, o ne priedas; jie turi būti saugomi toje pačioje repozitorijoje ir palaikomi kartu su kodu.
<!-- CODE-TEST-P02 | ai-reviewable -->
*   Naujas funkcionalumas turi turėti atitinkamus testus prieš merge’inimą.
<!-- CODE-TEST-P03 | ai-reviewable -->
*   Kiekvienas bug fix turi turėti testą, kuris atkartoja klaidą ir patvirtina pataisymą.
<!-- CODE-TEST-P04 | ai-reviewable -->
*   Testavimo apimtis turi būti parenkama pagal pakeitimo pobūdį ir riziką.
<!-- CODE-TEST-P05 | ai-reviewable -->
*   Minimaliai turi būti taikomi šie testų tipai:
    *   unit testai – verslo logikai ir izoliuotiems komponentams
    *   integration arba API testai – servisų tarpusavio specifikacijų laikymuisi
    *   E2E testai – kritiniams vartotojo srautams, kurių apimtis apibrėžiama projekto pradžioje
<!-- CODE-TEST-P06 | ai-reviewable -->
*   PR arba MR negali būti laikomas paruoštu merge’inimui, jei būtini testai nepridėti arba neatnaujinti.

REKOMENDUOJAMA:

<!-- CODE-TEST-R01 | ai-reviewable -->
*   Testų skaitomumas turi būti laikomas tokios pačios svarbos kaip ir produkcinio kodo skaitomumas.
<!-- CODE-TEST-R02 | ai-reviewable -->
*   Testuose rekomenduojama naudoti aiškius pavadinimus, nuoseklią struktūrą ir vengti perteklinės logikos.
<!-- CODE-TEST-R03 | ai-reviewable -->
*   Kai tai pagrįsta, rekomenduojama laikytis AAA principo – Arrange, Act, Assert.
<!-- CODE-TEST-R04 | ai-reviewable -->
*   Testų aprėptis turi būti stebima, o minimalūs slenksčiai nustatomi projekto pradžioje.
<!-- CODE-TEST-R05 | ai-reviewable -->
*   Kritinių modulių testavimo lygis turėtų būti griežtesnis negu pagalbinių ar mažos rizikos komponentų.

> Susiję skyriai: [4.4 Code Review principai](#44-code-review-principai) · [7 Testavimo reikalavimai ir principai](07-testavimas.md) · [7.8 Prieinamumo (Accessibility) testavimas](07-testavimas.md#78-prieinamumo-accessibility-testavimas) · [7.9 Testų vykdymas CI/CD ir ataskaitos](07-testavimas.md#79-testų-vykdymas-ci-cd-ir-ataskaitos) · [8.2 CI (Continuous Integration) minimalūs reikalavimai](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai)

## 4.6. Saugumas kodo lygmeniu

Šiame poskyryje apibrėžiami saugaus programavimo reikalavimai, taikomi tiesiogiai programinio kodo kūrimui ir keitimui.

Bendrieji saugumo, autentifikacijos, autorizacijos, slaptųjų raktų, priklausomybių ir saugumo tikrinimo reikalavimai apibrėžti [#3.3](03-architektura.md#33-backend-ir-api-principai), 3.5, 5, 6 ir 8.6 skyriuose.

PRIVALOMA:

<!-- CODE-SEC-P01 | ai-reviewable -->
*   Programiniame kode negali būti slaptažodžių, raktų, tokenų ar kitos jautrios informacijos.
<!-- CODE-SEC-P02 | ai-reviewable -->
*   Išorinis įvedimas visada laikomas nepatikimu ir turi būti validuojamas serverio pusėje, nepriklausomai nuo kliento validacijos.
<!-- CODE-SEC-P03 | ai-reviewable -->
*   Draudžiama formuoti užklausas, komandas ar kitus vykdomus fragmentus tiesiogiai iš nevaliduoto įvedimo.
<!-- CODE-SEC-P04 | ai-reviewable -->
*   Klaidų pranešimai vartotojui negali atskleisti vidinės sistemos detalių, tokių kaip stack trace, SQL struktūra, failų keliai ar infrastruktūros informacija.
<!-- CODE-SEC-P05 | human-reviewable -->
*   Techninės klaidų detalės gali būti pateikiamos tik loguose, laikantis logavimo ir jautrių duomenų apsaugos reikalavimų.
<!-- CODE-SEC-P06 | ai-reviewable -->
*   Naujos priklausomybės negali būti įtraukiamos neįvertinus jų palaikymo būklės, licencijos ir žinomų saugumo rizikų.

REKOMENDUOJAMA:

<!-- CODE-SEC-R01 | human-reviewable -->
*   Naudoti standartinių bibliotekų ir framework’ų saugius mechanizmus vietoje savarankiškai kuriamų kriptografinių ar saugumo sprendimų.
<!-- CODE-SEC-R02 | ai-reviewable -->
*   Validacijos, autorizacijos ir klaidų apdorojimo logiką centralizuoti, kai tai leidžia architektūra.
<!-- CODE-SEC-R03 | ai-reviewable -->
*   Taikyti statinę analizę ir kitas automatinio secure coding tikrinimo priemones dar prieš merge’inimą.
<!-- CODE-SEC-R04 | ai-reviewable -->
*   Kodo peržiūros metu papildomai vertinti, ar pakeitimas nepadidina atakos paviršiaus ir neįveda naujų jautrių duomenų nutekėjimo rizikų.

> Susiję skyriai: [3.3.6 Input validacija ir užklausų apsauga](03-architektura.md#336-input-validacija-ir-užklausų-apsauga) · [3.3.8 Standartizuotos klaidos](03-architektura.md#338-standartizuotos-klaidos) · [3.5.2 Slaptieji raktai](03-architektura.md#352-slaptieji-raktai) · [5 Versijavimas ir priklausomybių valdymas](05-versijavimas.md) · [6 Saugumas (Security by Design)](06-saugumas.md) · [8.6 DevSecOps (CI/CD kontrolė)](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė)

## 4.7. Refaktoringas ir techninė skola

Šiame poskyryje apibrėžiami reikalavimai refaktoringui ir techninės skolos valdymui.

Tikslas – užtikrinti, kad sistemos kokybė būtų gerinama nuosekliai, o techninė skola būtų matoma, valdoma ir nepaliekama be sprendimo plano.

PRIVALOMA:

<!-- CODE-DEBT-P01 | ai-reviewable -->
*   Didelis refaktoringas turi būti planuojamas atskirai ir suderinamas su product owner, jei jis daro reikšmingą poveikį darbų apimčiai, terminams ar rizikai.
<!-- CODE-DEBT-P02 | ai-reviewable -->
*   Jei refaktoringas keičia architektūrą, integracijų modelį ar esminius techninius šablonus, sprendimas turi būti dokumentuojamas ADR.
<!-- CODE-DEBT-P03 | process-level -->
*   Techninė skola turi būti matoma ir valdoma; žinomi kompromisai, laikini sprendimai ir neatidėti techniniai darbai turi būti registruojami kaip atskiri uždaviniai backlog’e.
<!-- CODE-DEBT-P04 | ai-reviewable -->
*   Techninė skola negali būti ignoruojama neribotą laiką; jos būklė turi būti periodiškai peržiūrima kartu su planavimo ir prioritetizavimo procesu.
<!-- CODE-DEBT-P05 | ai-reviewable -->
*   TODO ir FIXME komentarai kode leidžiami tik su aiškia nuoroda į uždavinį; komentarai be nuorodos nelaikomi priimtinais.
<!-- CODE-DEBT-P06 | ai-reviewable -->
*   Techninė skola turi būti vertinama ne tik kodo lygmeniu, bet ir priklausomybių, architektūrinių kompromisų, neautomatizuotų procesų, pasenusios konfigūracijos ir eksploatacinių spragų požiūriu.

REKOMENDUOJAMA:

<!-- CODE-DEBT-R01 | ai-reviewable -->
*   Mažas refaktoringas, toks kaip pervadinimai, metodų išskyrimas ar dubliavimo mažinimas, rekomenduojamas atlikti kartu su funkcinių pakeitimų įgyvendinimu.
<!-- CODE-DEBT-R02 | ai-reviewable -->
*   Taikyti principą „palik kodą švaresnį nei radai“, jei tai nekelia neproporcingos rizikos ar nepakeičia užduoties apimties.
<!-- CODE-DEBT-R03 | ai-reviewable -->
*   Refaktoringo ir techninės skolos prioritetus rekomenduojama vertinti pagal poveikį palaikomumui, saugumui, testuojamumui, našumui ir būsimiems pokyčiams.
<!-- CODE-DEBT-R04 | process-level -->
*   Jei techninės skolos sprendimas atidedamas, rekomenduojama aiškiai nurodyti riziką, poveikį ir planuojamą sprendimo laikotarpį.
<!-- CODE-DEBT-R05 | human-reviewable -->
*   Kritinė techninė skola, daranti poveikį saugumui, patikimumui ar palaikomumui, rekomenduojama vertinti kaip prioritetinį darbą, o ne atidėti neribotam laikui.

> Susiję skyriai: [3.1.5 Architecture Decision Records (ADR)](03-architektura.md#315-architecture-decision-records-adr) · [10.4 Architecture Decision Records (ADR)](10-dokumentacija.md#104-architecture-decision-records-adr) · [4.2 Kodo struktūra ir konvencijos](#42-kodo-struktūra-ir-konvencijos) · [5 Versijavimas ir priklausomybių valdymas](05-versijavimas.md) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 4.8. DI priemonių naudojimas (AI Coding Assistants)

Šiame poskyryje apibrėžiami reikalavimai dirbtinio intelekto (DI) priemonių, tokių kaip kodo generavimo asistentai, pokalbių modeliai ir kiti DI įrankiai, naudojimui programinio kodo kūrime ir keitime.

DI priemonės gali padidinti produktyvumą, tačiau kelia papildomų rizikų, susijusių su kodo kokybe, intelektine nuosavybe, duomenų apsauga ir saugumu.

### 4.8.1. Bendrieji principai

PRIVALOMA:

<!-- CODE-AI-P01 | ai-reviewable -->
*   DI sugeneruotas kodas traktuojamas lygiai taip pat kaip žmogaus parašytas kodas — jam taikomi visi šio standarto kokybės, saugumo, testavimo ir peržiūros reikalavimai.
<!-- CODE-AI-P02 | ai-reviewable -->
*   DI sugeneruotas kodas turi praeiti visas standartines CI patikras (linting, SAST, testai) be išimčių.
<!-- CODE-AI-P03 | human-reviewable -->
*   Code review metu peržiūrėtojas privalo vertinti DI sugeneruoto kodo logiką ir teisingumą; formalus patvirtinimas neskaitant kodo yra draudžiamas.
<!-- CODE-AI-P04 | process-level -->
*   DI priemonių naudojimas neatleidžia kūrėjo nuo atsakomybės už pateikto kodo kokybę ir saugumą.

### 4.8.2. Duomenų apsauga ir konfidencialumas

PRIVALOMA:

<!-- CODE-AI-P05 | process-level -->
*   Draudžiama į išorines (ne organizacijos kontroliuojamas) DI paslaugas perduoti:
    *   asmens duomenis ar kitą jautrią informaciją;
    *   slaptuosius raktus, slaptažodžius ar tokenus;
    *   vidinę architektūros, infrastruktūros ar verslo logikos informaciją, kurios atskleidimas kelia riziką.
<!-- CODE-AI-P06 | process-level -->
*   Savivaldybės programinis kodas negali būti naudojamas DI modelių mokymui ar viešinamas per DI paslaugas be aiškaus organizacijos leidimo.
<!-- CODE-AI-P07 | ai-reviewable -->
*   DI priemonės turi būti naudojamos tik per organizacijos patvirtintus kanalus ir konfigūracijas.

### 4.8.3. Kokybės užtikrinimas

PRIVALOMA:

<!-- CODE-AI-P08 | human-reviewable -->
*   DI sugeneruoti testai turi būti peržiūrimi dėl prasmingų tikrinimų (assertions); testai, kurie tik didina aprėptį be realaus tikrinimo, yra draudžiami.
<!-- CODE-AI-P09 | ai-reviewable -->
*   DI sugeneruotos priklausomybės ir importai turi būti tikrinami dėl egzistavimo, palaikymo būklės ir saugumo — DI modeliai gali siūlyti neegzistuojančius paketus.

REKOMENDUOJAMA:

<!-- CODE-AI-R01 | process-level -->
*   Naudoti organizacijos patvirtintas DI priemones, nurodytas technologijų registre.
<!-- CODE-AI-R02 | human-reviewable -->
*   Pirmenybę teikti IDE integruotoms DI priemonėms (pvz., GitHub Copilot) vietoje tiesioginio teksto kopijavimo iš išorinių pokalbių sąsajų, nes tai mažina duomenų nutekėjimo riziką.
<!-- CODE-AI-R03 | human-reviewable -->
*   Jautriems ar sudėtingiems scenarijams svarstyti organizacijos kontroliuojamus (self-hosted) DI sprendimus.
<!-- CODE-AI-R04 | human-reviewable -->
*   DI priemones naudoti kaip pagalbinį, o ne pagrindinį kūrimo įrankį — kūrėjas turi suprasti ir galėti paaiškinti kiekvieną kodo eilutę.

> Susiję skyriai: [4.4 Code Review principai](#44-code-review-principai) · [4.6 Saugumas kodo lygmeniu](#46-saugumas-kodo-lygmeniu) · [6.3 Duomenų apsauga (GDPR kontekstas)](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [6.4 Secrets management](06-saugumas.md#64-secrets-management) · [12 Tiekėjų ir pavaldžių įstaigų reikalavimai](12-tiekeju-reikalavimai.md)
