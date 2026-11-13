# 8. DevOps ir CI/CD reikalavimai

Šis skyrius apibrėžia CI/CD, GitOps ir IaC procesinius bei techninius mechanizmus, kurie užtikrina pakartojamus, saugius ir audituojamus diegimus į visas aplinkas.

Šis skyrius nustato, kaip turi būti įgyvendinami diegimo, release, aplinkų atskyrimo, saugumo, stebėsenos ir infrastruktūros valdymo reikalavimai.

Konfigūracijos, slaptųjų raktų ir aplinkų politikos reikalavimai apibrėžti [#3.5](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) skyriuje, patikimumo ir health reikalavimai – [#3.6](03-architektura.md#36-patikimumas-ir-atsparumas) skyriuje, saugumo reikalavimai – [#6](06-saugumas.md) skyriuje, o stebėsena ir eksploatacija – [#9](09-stebesena-logai.md) skyriuje.

## 8.1. Aplinkos ir bendri principai

PRIVALOMA:

<!-- OPS-ENV-P01 | process-level -->
*   Visi diegimai į aplinkas turi būti vykdomi tik per CI/CD procesą; rankiniai pakeitimai aplinkose draudžiami, išskyrus aiškiai dokumentuotus incidentų valdymo atvejus.
<!-- OPS-ENV-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   CI/CD ir GitOps turi užtikrinti, kad aplinkos būtų izoliuotos ir atitiktų [3.5.3 skyriaus „Aplinkos“](03-architektura.md#353-aplinkos) reikalavimus.
<!-- OPS-ENV-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo pipeline negali naudoti tos pačios konfigūracijos ar tų pačių kredencialų skirtingoms aplinkoms, jei tai nėra aiškiai aprašyta ir patvirtinta.
<!-- OPS-ENV-P04 | process-level -->
*   Aplinkų būsena turi būti valdoma deklaratyviai, o ne per neversijuojamus rankinius pakeitimus.
<!-- OPS-ENV-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Slaptos reikšmės turi būti gaunamos iš saugios slaptųjų raktų saugyklos; jos negali būti laikomos repozitorijoje, build loguose ar pipeline artefaktuose.

REKOMENDUOJAMA:

<!-- OPS-ENV-R01 | human-reviewable -->
*   Pasirinkti vieningą aplinkų pavadinimų ir DNS modelį visose sistemose.
<!-- OPS-ENV-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Dokumentuoti aplinkų, branch’ų ir diegimo srautų ryšį projekto diegimo dokumentacijoje.
<!-- OPS-ENV-R03 | human-reviewable -->
*   Išskirtinius aplinkų skirtumus laikyti minimalius ir aiškiai aprašytus.

Kas laikoma saugia slaptųjų raktų saugykla (`OPS-ENV-P05` taikymas):

*   GitHub Environment secrets yra saugi slaptųjų raktų saugykla. Aplinkos ir runtime reikšmės (aplikacijos aplinka, slaptažodžiai, TLS) laikomos aplinkos lygiu, aplinkoje, apsaugotoje pagal `OPS-PIPE-P03`; jos nelaikomos repozitorijos ar organizacijos lygiu.
*   Build metu reikalingi kredencialai, kurie nesuteikia prieigos prie aplinkų (pvz., privačių paketų skaitymo ar sinchronizacijos GitHub App raktas), gali būti repozitorijos ar organizacijos secrets, nes juos naudojantys job'ai aplinkos nedeklaruoja.
*   Organizacijos slaptažodžių saugykla (DVLS) taip pat yra saugi saugykla ir naudojama papildomai – reikšmėms, kurios neperduodamos per CI/CD arba turi būti prieinamos žmonėms.
*   Compose diegime reikšmės diegimo hoste gyvena tik riboto prieinamumo runtime kataloge ir į konteinerius patenka kaip sumontuoti failai, o ne per aplinkos failą ar image (`OPS-COMPOSE-P09`).
*   Repozitorijos failai, `.env` pavyzdžiai su tikromis reikšmėmis, build argumentai, workflow kintamieji (`vars`), logai ir artefaktai saugykla nelaikomi.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [3.7 Stebėsena ir diagnostika](03-architektura.md#37-stebėsena-ir-diagnostika)

## 8.2. CI (Continuous Integration) minimalūs reikalavimai

PRIVALOMA:

<!-- OPS-CI-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   CI pipeline turi būti vykdomas kiekvienam PR arba MR ir pagrindinėms šakoms.
<!-- OPS-CI-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Build procesas turi būti pakartojamas, naudojant fiksuotas bazines versijas, lock failus ir kontroliuojamą kešavimą.
<!-- OPS-CI-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   CI turi vykdyti bent šiuos patikrinimus, kai jie taikomi projektui:
    *   build
    *   formatavimo ir linting patikras
    *   unit testus
    *   API ar kontraktų validaciją
    *   saugumo ir priklausomybių patikras
<!-- OPS-CI-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Artefaktai turi būti generuojami su aiškiu ir atsekamu identifikatoriumi.
<!-- OPS-CI-P05 | human-reviewable -->
*   Nepraėję privalomi kokybės vartai turi blokuoti merge’inimą.

REKOMENDUOJAMA:

<!-- OPS-CI-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Naudoti pipeline optimizavimą, kuris trumpina grįžtamąjį ryšį, bet nemažina kokybės kontrolės apimties.
<!-- OPS-CI-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kritiniams projektams aiškiai atskirti greitus PR patikrinimus nuo pilnų priešleidiminių patikrinimų.

> Susiję skyriai: [4.2.3 Automatinis formatavimas ir linting](04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [4.5 Testai](04-kodo-kurimo-gaires.md#45-testai) · [7.9 Testų vykdymas CI/CD ir ataskaitos](07-testavimas.md#79-testų-vykdymas-ci-cd-ir-ataskaitos)

## 8.3. CD (Continuous Delivery/Deployment) {#83-cd-continuous-delivery-deployment}

PRIVALOMA:

<!-- OPS-CD-P01 | process-level -->
*   CD procesas turi užtikrinti atsekamą ir pakartojamą leidimą į tikslinę aplinką: iš jo įrašų turi būti aišku, kuri versija, kada ir kieno paleidimu įdiegta, o tą pačią versiją turi būti įmanoma įdiegti iš naujo. Kad diegiama tik per CI/CD, nustato `OPS-ENV-P01`.
<!-- OPS-CD-P02 | human-reviewable -->
*   GitOps turi būti laikomas numatytuoju diegimo modeliu ten, kur jis taikomas.
<!-- OPS-CD-P03 | human-reviewable -->
*   Rollback mechanizmas turi būti apibrėžtas, dokumentuotas ir patikrintas.
<!-- OPS-CD-P04 | ai-reviewable | stacks=infra,db | enforced-by=ai -->
*   Duomenų bazės migracijos turi būti integruotos į leidimo procesą ir vykdomos kontroliuotai.
<!-- OPS-CD-P05 | human-reviewable -->
*   Diegimo strategija turi būti aiškiai pasirinkta ir atitikti sistemos riziką bei kritiškumą.

REKOMENDUOJAMA:

<!-- OPS-CD-R01 | human-reviewable -->
*   Kritiniams arba aukštos rizikos leidimams taikyti pažangesnes strategijas, tokias kaip canary ar blue-green.
<!-- OPS-CD-R02 | process-level -->
*   Jei organizacijoje taikomi release langai, juos rekomenduojama derinti su eksploatacijos ir verslo poreikiais.
<!-- OPS-CD-R03 | human-reviewable -->
*   Rollback scenarijus rekomenduojama tikrinti ne tik teoriškai, bet ir praktiniais bandymais.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [8.8 Leidimų (release) valdymas](#88-leidimų-release-valdymas)

## 8.4. Versijavimas ir žymėjimas (release artefaktams)

PRIVALOMA:

<!-- OPS-VER-P01 | human-reviewable -->
*   Kiekvienas leidimas turi turėti aiškią versiją ir atsekamą ryšį su kodo būsena.
<!-- OPS-VER-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Konteinerių image ir kiti artefaktai turi būti žymimi taip, kad būtų aišku, kokia kodo versija yra įdiegta.
<!-- OPS-VER-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Produkcijoje negali būti remiamasi vien latest tipo žymėjimu.
<!-- OPS-VER-P04 | human-reviewable -->
*   Versijavimo ir žymėjimo schema turi būti nuosekli visose projekto dalyse.

REKOMENDUOJAMA:

<!-- OPS-VER-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Artefaktams naudoti tiek semantinę versiją, tiek nekintamą commit ar build identifikatorių.
<!-- OPS-VER-R02 | human-reviewable -->
*   Release artefaktų ženklinimą suderinti su release notes ir diegimo dokumentacija.

> Susiję skyriai: [5.1 Semantinis versijavimas (SemVer)](05-versijavimas.md#51-semantinis-versijavimas-semver) · [5.2 API versijavimas](05-versijavimas.md#52-api-versijavimas) · [8.8 Leidimų (release) valdymas](#88-leidimų-release-valdymas)

## 8.5. DevSecOps (CI/CD kontrolė) {#85-devsecops-ci-cd-kontrolė}

PRIVALOMA:

<!-- OPS-DEVSEC-P01 | human-reviewable -->
*   CI/CD procese turi būti vykdomos saugumo patikros pagal sistemos rizikos lygį.
<!-- OPS-DEVSEC-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Turi būti tikrinamos priklausomybės, statinė analizė ir, kai taikoma, konteinerių image.
<!-- OPS-DEVSEC-P03 | ai-reviewable | stacks=infra | enforced-by=tool:gitleaks -->
*   CI procese turi būti vykdomas slaptųjų raktų aptikimas.
<!-- OPS-DEVSEC-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Saugumo radiniai, laikomi kritiniais pagal organizacijos politiką, turi sustabdyti pipeline (saugumo patikros job'as nepavyksta), kol rizika neišspręsta arba aiškiai nepriimta; kad nepavykęs vartas blokuotų merge'inimą, užtikrina šakos apsauga (`OPS-CI-P05`).
<!-- OPS-DEVSEC-P05 | human-reviewable -->
*   Repozitorijose turi būti įjungtas platformos slaptųjų raktų aptikimas (pvz., GitHub secret scanning ir push protection).

REKOMENDUOJAMA:

<!-- OPS-DEVSEC-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   SBOM generuoti automatiškai leidimo metu ir saugoti kartu su release artefaktais.
<!-- OPS-DEVSEC-R02 | process-level -->
*   DevSecOps kontrolę derinti ne tik su įrankių rezultatais, bet ir su architektūrine rizikos peržiūra.
<!-- OPS-DEVSEC-R03 | human-reviewable -->
*   Saugumo taisykles rekomenduojama vykdyti kaip policy-as-code ten, kur tai pagrįsta.

> Susiję skyriai: [6 Saugumas (Security by Design)](06-saugumas.md) · [6.6 OWASP Top 10](06-saugumas.md#66-owasp-top-10) · [5.5 Priklausomybių saugumas ir atsekamumas](05-versijavimas.md#55-priklausomybių-saugumas-ir-atsekamumas)

## 8.6. Stebėsena, logai ir įvykių valdymas (CI/CD užtikrinimas) {#86-stebėsena-logai-ir-įvykių-valdymas-ci-cd-užtikrinimas}

PRIVALOMA:

<!-- OPS-MON-P01 | human-reviewable -->
*   Diegimo ir CI/CD konfigūracija turi užtikrinti, kad sistema atitiktų [9 skyriaus](09-stebesena-logai.md) reikalavimus logams, metrikoms, alertams ir eksploatacinei parengčiai.
<!-- OPS-MON-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegiamos sistemos logų, metrikų ir, jei taikoma, tracing signalų eksportas į centralizuotą stebėsenos platformą turi būti užtikrintas; repozitorijai, kuri nieko nediegia (pvz., bibliotekai), reikalavimas netaikomas.
<!-- OPS-MON-P03 | human-reviewable -->
*   Diegimo procese turi būti aišku, kada ir kaip tikrinama observability konfigūracija.
<!-- OPS-MON-P04 | process-level -->
*   Jei release procesas apima rollback ar incidentų veiksmus, jie turi būti suderinti su eksploatacijos tvarka.

REKOMENDUOJAMA:

<!-- OPS-MON-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Prieš leidimą tikrinti bent minimalią observability parengtį, pvz., health, logų surinkimą ir pagrindines metrikas.
<!-- OPS-MON-R02 | process-level -->
*   Release peržiūroje rekomenduojama vertinti ir observability pokyčius, jei pakeitimas daro įtaką diagnostikai.

> Susiję skyriai: [3.7 Stebėsena ir diagnostika](03-architektura.md#37-stebėsena-ir-diagnostika) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 8.7. Infrastruktūra kaip kodas (IaC) {#87-infrastruktūra-kaip-kodas-iac}

PRIVALOMA:

<!-- OPS-IAC-P01 | human-reviewable -->
*   Infrastruktūros pakeitimai turi būti vykdomi per IaC ir valdomi per versijų kontrolę.
<!-- OPS-IAC-P02 | process-level -->
*   IaC pakeitimai turi būti peržiūrimi per PR arba MR procesą taip pat, kaip ir programinis kodas.
<!-- OPS-IAC-P04 | human-reviewable -->
*   Kritiniai infrastruktūros sprendimai turi būti atsekami ir audituojami.

REKOMENDUOJAMA:

<!-- OPS-IAC-R01 | human-reviewable -->
*   Naudoti policy-as-code arba lygiavertes priemones tais atvejais, kai norima automatizuotai tikrinti infrastruktūros atitiktį taisyklėms.
<!-- OPS-IAC-R02 | process-level -->
*   IaC pakeitimų planą ir taikymą rekomenduojama atskirti į aiškius, peržiūrimus etapus.
<!-- OPS-IAC-R03 | process-level -->
*   Vengti rankinių infrastruktūros pakeitimų, atliekamų ne per IaC. Jei toks pakeitimas vis dėlto atliktas (pvz., šalinant incidentą), jį po to perkelti į IaC kodą, kad kodas ir faktinė aplinkos būsena sutaptų.

> Susiję skyriai: [4.3.1 Versijų kontrolė ir repozitorijų valdymas](04-kodo-kurimo-gaires.md#431-versijų-kontrolė-ir-repozitorijų-valdymas) · [3.10.2 Suderinamumas su savivaldybės infrastruktūra](03-architektura.md#3102-suderinamumas-su-savivaldybės-infrastruktūra)

## 8.8. Leidimų (release) valdymas {#88-leidimų-release-valdymas}

PRIVALOMA:

<!-- OPS-REL-P01 | human-reviewable -->
*   Kiekvienas produkcinis leidimas turi turėti aiškų release aprašą.
<!-- OPS-REL-P02 | human-reviewable -->
*   Prieš leidimą turi būti aišku, kokie pakeitimai įtraukti, kokios rizikos žinomos, kokios migracijos reikalingos ir kaip veikia rollback.
<!-- OPS-REL-P03 | human-reviewable -->
*   Leidimo patvirtinimo procesas turi būti suderintas su organizacijos atsakomybėmis ir audito poreikiais.
<!-- OPS-REL-P04 | human-reviewable -->
*   Minimalūs leidimo priėmimo kriterijai turi būti apibrėžti iš anksto.

REKOMENDUOJAMA:

<!-- OPS-REL-R01 | human-reviewable -->
*   Produkciniams leidimams naudoti standartizuotą release notes šabloną.
<!-- OPS-REL-R02 | process-level -->
*   Leidimo peržiūroje rekomenduojama įtraukti techninius, eksploatacinius ir verslo pokyčius vienoje vietoje.
<!-- OPS-REL-R03 | human-reviewable -->
*   Kritiniams leidimams rekomenduojama aiškiai nurodyti stebėjimo periodą po diegimo.

> Susiję skyriai: [4.3.5 Pull Request / Merge Request reikalavimai](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [9.6 Incidentų valdymas](09-stebesena-logai.md#96-incidentų-valdymas)

## 8.9. Kainodara ir efektyvumas (FinOps) {#89-kainodara-ir-efektyvumas-finops}

PRIVALOMA:

<!-- OPS-FIN-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Resursai turi būti identifikuojami taip, kad būtų įmanoma matyti sąnaudas pagal sistemą, projektą ar aplinką.
<!-- OPS-FIN-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Artefaktų, image, logų ar kitų saugojimo objektų retention turi būti valdomas taip, kad nekauptų nepagrįstų sąnaudų.
<!-- OPS-FIN-P03 | human-reviewable -->
*   Sistemos ir infrastruktūros sprendimai turi būti projektuojami ne tik pagal funkcionalumą, bet ir pagal palaikymo bei eksploatacijos efektyvumą.

REKOMENDUOJAMA:

<!-- OPS-FIN-R01 | process-level -->
*   Reguliariai peržiūrėti resursų naudojimą ir identifikuoti perteklinius kaštus.
<!-- OPS-FIN-R02 | human-reviewable -->
*   Kritinėms ar brangioms sistemoms rekomenduojama turėti bazines sąnaudų stebėsenos ataskaitas.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

## 8.10. Bendri pipeline vartai ir profilio pasirinkimas {#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas}

Šio poskyrio taisyklės galioja nepriklausomai nuo pasirinkto Git leidimo modelio ir diegimo būdo. Kur reikalavimas turi prasmę tik daliai projektų, sąlyga įrašyta pačios taisyklės tekste („Compose diegime“, „kai diegiamas konteinerio image“).

PRIVALOMA:

<!-- OPS-PIPE-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Nepriklausomai nuo pasirinkto srauto, deploy gali prasidėti tik po sėkmingų lint ir testų bei smoke testų, o kai diegiamas konteinerio image – ir po image vulnerability scan, SBOM ir provenance generavimo bei attestation patikros; deployment sėkmė patvirtinama tik po faktinio tikslinės aplinkos readiness patikrinimo ([3.6.2 skyrius](03-architektura.md#362-sveikatos-patikrinimas)), kuris eina per aplikaciją, vertina jos kritines priklausomybes ir patvirtina, kad atsako įdiegta kodo versija; vien liveness ar statinis web serverio atsakymas šio varto neatitinka; kiekvienam job turi būti suteiktos tik būtinos GitHub permissions.
<!-- OPS-PIPE-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Build, testų, skenavimo ir kiti aplinkos nekeičiantys job'ai turi būti vykdomi GitHub-hosted runner'iuose ir negali naudoti deploy runner'ių ar aplinkų secrets; aplinką keičiantis job'as turi deklaruoti tos aplinkos GitHub Environment; Compose diegime jis papildomai turi būti vykdomas tik tos aplinkos self-hosted runner'yje, parenkamame pagal aplinkos label'į, o ne pagal bendrą visoms aplinkoms label'į.
<!-- OPS-PIPE-P03 | human-reviewable -->
*   Kiekviena deploy aplinka turi turėti atskirą GitHub Environment, kuriame laikomi tik tos aplinkos secrets ir kintamieji ir kuris riboja, iš kurių apsaugotų šakų ar tag'ų leidžiama diegti. Privalomas patvirtinimas yra PR peržiūra prieš sujungimą į apsaugotą šaką (žr. [4.3.3 skyrių](04-kodo-kurimo-gaires.md#433-šakų-branch-apsauga)); production Environment „Required reviewers“ yra rekomenduojama papildoma priemonė. Compose diegime kiekviena aplinka turi turėti savo self-hosted runner'į su tos aplinkos label'iu, prieinamą tik tam skirtoms repozitorijoms.
<!-- OPS-PIPE-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Trečiųjų šalių GitHub action'ai ir reusable workflow'ai turi būti nurodomi pilnu commit SHA su versijos komentaru, o ne tag'u ar šaka; organizacijos nuosavi reusable workflow'ai ir action'ai (`vilnius-vmsa/*`) kol kas gali būti nurodomi šaka `@main`.
<!-- OPS-PIPE-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Visi diegimai į tą pačią aplinką turi būti vykdomi per vieną concurrency grupę, nustatytą pačiame deploy workflow'e arba jo job'e, kad du diegimai į tą pačią aplinką nevyktų vienu metu; deploy workflow'ą kviečiantis workflow negali naudoti to paties grupės vardo, o pradėtas diegimas negali būti atšaukiamas naujo run'o (`cancel-in-progress: false`).
<!-- OPS-PIPE-P06 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Workflow, paleidžiamas per `workflow_run`, prieš naudodamas secrets, publikuodamas artefaktus ar diegdamas turi patikrinti jį sukėlusio run'o rezultatą, įvykį, šaką ir repozitoriją; build ir diegimas turi naudoti to run'o commit SHA, o ne numatytosios šakos viršūnę.
<!-- OPS-PIPE-P07 | ai-reviewable | stacks=all | enforced-by=ai -->
*   Repozitorija, turinti CI/CD ar diegimo failų (workflow'ų, Dockerfile, Compose failų, manifestų, diegimo skriptų), turi `.dev-standard/config.json` faile deklaruoti DevOps stack'us: pasirinktą Git leidimo modelį (`flow-branch` arba `flow-tag`) ir diegimo būdą (`compose`, `compose-blue-green` arba `k8s`), ir aprašyti juos diegimo dokumentacijoje. Vienu metu galioja vienas Git leidimo modelis. Jei diegimo technologijai profilio nėra ([8.15](#815-neaprašytos-technologijos)), tai nurodoma diegimo dokumentacijoje kartu su aprašymu, kaip ta technologija užtikrina nekintamus artefaktus, readiness patikrą, secrets valdymą ir rollback, o diegimo būdo stack'as nedeklaruojamas. Kitas Git leidimo modelis nei `flow-branch` ar `flow-tag` leidžiamas tik tada, kai išimtis įrašyta projekto `.github/instructions/dev-standard-local.instructions.md` faile, nurodant modelį ir priežastį; tada modelis aprašomas diegimo dokumentacijoje, o Git modelio stack'as nedeklaruojamas. Jei repozitorija nieko nediegia (pvz., biblioteka), tai nurodoma README ir vietoj Git leidimo modelio bei diegimo būdo deklaruojamas vien `infra`. Abiem atvejais konteinerių image statantis projektas deklaruoja `docker`.
<!-- OPS-FLOW-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kai diegiamas konteinerio image, rankiniam jau patikrinto image redeploy turi būti atskira operatoriaus procedūra, kuri pagal aplinkos tag'ą arba nekintamą source tag'ą išsprendžia kanoninių image repository digest'us, patikrina jų source revision bei build/release attestation, nekeičia kodo ar pasirinkto image digest'o ir nepakeičia lint, build ar saugos vartų. Į production gali būti diegiamas tik image, kurio source commit priklauso apsaugotam production šaltiniui, ir tai turi būti patikrinta prieš diegimą; staging gali naudoti staging šaltinio commit'ą.
<!-- OPS-FLOW-P07 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Jei projektas naudoja aplinkų ar diegimo secrets, jų paruošimui ir rotacijai turi būti dokumentuota saugi, audituojama procedūra su aiškia įėjimų ir išėjimų sutartimi; procedūra neprintina secret reikšmių. Compose diegime ji papildomai turi validuoti aplikacijos aplinką ir TLS porą, įdiegti failus atomiškai su runtime leidimais ir neleisti pusiau įrašytos runtime būsenos.
<!-- OPS-REPO-P02 | ai-reviewable | stacks=all | enforced-by=ai -->
*   Konteinerių, CI/CD ir infrastruktūros failai aplikacijos repozitorijoje turi būti laikomi sutartose vietose: Dockerfile, servisų konfigūracija ir diegimo skriptai – `docker/` kataloge, Compose failai – repozitorijos šaknyje, darbo eigos ir action'ai – `.github/`, Kubernetes ir Helm manifestai – `k8s/`, `kubernetes/`, `helm/` arba `charts/` kataloge. Kita vieta leidžiama tik tada, kai išimtis įrašyta projekto `.github/instructions/dev-standard-local.instructions.md` faile, nurodant kelius ir priežastį; išimtyje nurodytiems keliams taikomos tos pačios 8 skyriaus (`OPS-*`) taisyklės.

Pasirinkimas deklaruojamas `.dev-standard/config.json` stack'ais (`OPS-PIPE-P07`); nuo jo priklauso, kurias šio skyriaus taisykles projektui taiko automatinis review:

| Stack | Kada rinktis | Taisyklės |
|---|---|---|
| `infra` | Įtraukiamas automatiškai su bet kuriuo žemiau esančiu. Vienas pats deklaruojamas repozitorijos, kuri turi CI, bet nieko nediegia | Bendros: 8.1–8.10 (išskyrus `OPS-REPO-P02` ir `OPS-PIPE-P07`, kurios galioja visiems projektams) |
| `flow-branch` | Git modelis: `stage` → staging, `main` → production | 8.11.1 |
| `flow-tag` | Git modelis: production leidžiama apsaugotu `vX.Y.Z` tag'u | 8.11.2 |
| `docker` | Įtraukiamas automatiškai su `compose` ir `k8s`; deklaruojamas tiesiogiai, kai image statomi, bet diegimo būdui profilio nėra arba repozitorija nieko nediegia | 8.12 |
| `compose` | Diegimas per Docker Compose, single-slot (apima `docker`) | 8.13.1 |
| `compose-blue-green` | Compose su blue-green slotais (apima `compose`) | 8.13.2 |
| `k8s` | Diegimas į Kubernetes (apima `docker`) | 8.14 |

Projektas renkasi vieną Git modelį ir vieną diegimo būdą. Ką daryti, kai technologijai profilio nėra, aprašo [8.15](#815-neaprašytos-technologijos). Pereinamuoju laikotarpiu projektas, kurio `config.json` turi `infra` ir nė vieno profilio, gauna visų profilių taisykles ir sync įspėjimą pasirinkti profilį. Pasirinkus bent vieną profilį, įdiegiami tik pasirinktieji; jei tada trūksta Git modelio ar diegimo būdo, sync apie tai įspėja.

Abiem Git leidimo modeliams privalomi nekintami artefaktai, atsekamumas iki commit, rollback planas ir deploy sėkmė, patvirtinta faktiniu readiness patikrinimu. Šiame skyriuje ir H priede „health patikra“ po deploy visada reiškia šį readiness vartą, o ne liveness.

> Praktinė kontrolė prieš PR: [DevOps CI/CD modelių priedas](priedai/devops-ci-cd-modeliai.md) · [8.2 CI minimalūs reikalavimai](#82-ci-continuous-integration-minimalūs-reikalavimai) · [8.3 CD](#83-cd-continuous-delivery-deployment) · [8.4 Versijavimas ir žymėjimas](#84-versijavimas-ir-žymėjimas-release-artefaktams)

## 8.11. Git leidimo modeliai {#811-git-leidimo-modeliai}

Projektas renkasi vieną iš dviejų Git leidimo modelių. Abiem galioja [8.10](#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas) vartai; skiriasi tai, kas nulemia, kuri versija patenka į production.

| Kriterijus | Branch-based | Tag-based |
|---|---|---|
| Pagrindinis tikslas | Greitas, dažnas diegimas pagal aplinkos branch'ą | Formalus, versijuotas produkcijos leidimas |
| Produkcijos vartai | `main` merge ir sėkminga produkcijos patikra | Apsaugotas `vX.Y.Z` tag, nurodantis į staging įdiegtą ir patikrintą SHA |
| Privalumas | Mažiau rankinių veiksmų, tinka kasdieniam darbui | Aiški istorija, patogus auditas ir rollback |
| Rizika | `main` turi būti nuolat paruoštas produkcijai. `stage` ir `main` build'inami atskirai, todėl į production patenka image, kuris staging'e nebuvo paleistas: staging patvirtina kodą, ne artefaktą | Reikia release disciplinos ir tag apsaugos |
| Kas atsako už tai, kas pasiekia production | Komanda: kas ir kada merge'inama į `main`. Pipeline patikrina build'ą, bet nesprendžia, ar pakeitimas buvo išbandytas staging'e | Pipeline: į production keliamas tik tas digest'as, kuris įdiegtas ir patikrintas staging'e |
| Tinkamas pasirinkimas | Komandai, kuri tą pačią dieną leidžia daug suderinamų pakeitimų | Komandai, kuriai reikia aiškaus leidimo sprendimo (release tag'o sukūrimo) ir leidimo lango |

### 8.11.1. Branch-based diegimo modelis {#8111-branch-based-diegimo-modelis}

> Taikoma projektams, pasirinkusiems stack'ą `flow-branch` (`.dev-standard/config.json`).

Branch-based modelis tinka komandai, kuri dažnai leidžia patikrintus pakeitimus į dvi nuolatines aplinkas. Šiame modelyje branch'as parenka tikslinę aplinką, tačiau pats branch'o pavadinimas nepakeičia commit ir image atsekamumo.

PRIVALOMA:

<!-- OPS-FLOW-P01 | ai-reviewable | stacks=flow-branch | enforced-by=ai -->
*   Jei pasirenkamas branch-based modelis, kiekvienas protected branch turi turėti vienareikšmį aplinkos ryšį (pvz., `stage` → staging, `main` → production), o diegiamas artefaktas turi būti pastatytas iš tikslaus commit SHA, kuris praėjo `OPS-PIPE-P01` vartus.
<!-- OPS-FLOW-P02 | ai-reviewable | stacks=flow-branch | enforced-by=ai -->
*   Pasirinkus branch-based modelį, automatinė sinchronizacija gali vykti tik viena kryptimi – iš sėkmingai į produkciją įdiegto `main` commit į `stage`; `stage` negali būti automatiškai merdžinamas į `main`, o konfliktas turi sustabdyti sinchronizaciją ir pareikalauti žmogaus sprendimo.

<!-- OPS-FLOW-P03 | ai-reviewable | stacks=flow-branch | enforced-by=ai -->
*   Pasirinkus branch-based modelį, turi būti atskiras CI kokybės vartas PR ir protected branch push įvykiams; build bei promotion procesas gali prasidėti tik po sėkmingų vartų ir nustačius build-reikšmingus pakeitimus.
<!-- OPS-FLOW-P04 | ai-reviewable | stacks=flow-branch | enforced-by=ai -->
*   Pasirinkus branch-based modelį ir kai diegiamas konteinerio image, build ir promotion procesas turi sekti nuoseklią seką: build → image vulnerability scan → SBOM ir provenance generavimas → attestation ir jos patikra → smoke testai → immutable source tag'o publikavimas → deployment ir readiness patikra → environment tag'o promotion; kiekvienas etapas turi perduoti tą patį commit SHA ir immutable image digest. `staging`, `production` ir `latest` tag'ai negali būti perkeliami prieš sėkmingą deployment ir readiness patikrą.

Redeploy ir secret rotacijos taisyklės (`OPS-FLOW-P05`, `OPS-FLOW-P07`) galioja abiem Git modeliams ir yra [8.10](#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas) poskyryje, o runtime atkūrimo (`OPS-FLOW-P06`) – [8.13](#813-docker-compose-diegimas). Kubernetes runtime realizacijai taikomos `OPS-K8S` taisyklės ir projekto platformos politika, įgyvendinanti lygiaverčius CI/CD vartus.

Rekomenduojama branch-based seka (pavyzdinė realizacija; konkretūs workflow pavadinimai ir komandos nėra privalomos taisyklės):

```text
feature/* → PR → CI quality gate
merge stage → CI quality gate → build/scan/SBOM/attest/verify/smoke → immutable source tag → deploy + health staging → promote staging tag
merge main  → CI quality gate → build/scan/SBOM/attest/verify/smoke → immutable source tag → deploy + health production → promote production tag
successful production deployment → optional main-to-stage sync PR
manual redeploy → operator redeploy path (resolve promoted tag → service digests)
secret rotation or runtime maintenance → separate documented project/platform procedure
```

Šiame modelyje `stage` gali turėti dar nepatvirtintų funkcijų, o `main` yra produkcijos šaltinis. Sinchronizacijos PR turi būti kuriamas tik po realaus produkcijos health patikrinimo, ne vien po sėkmingo build job.

Šiame modelyje build ir deployment darbo eigas galima sujungti arba išskaidyti
į reusable workflows, tačiau protected branch pipeline turi kviesti build procesą
tik po kokybės vartų. Sinchronizacija į `stage` paleidžiama tik po to, kai visas
build/deploy job baigėsi sėkmingai, todėl ji negali remtis dar vykdomu nested
deployment job. Operatoriaus kelias skirtas atkūrimui ar pakartotiniam jau
paskelbto digest diegimui; jis neatlieka naujo build ir negali apeiti deployment
vartų. Runtime maintenance ir secret rotation, jei jų reikia, aprašomi atskira
projekto arba platformos procedūra.

Branch-based modelyje operatoriaus redeploy kelias (`Ops: Deploy`) priima
environment tag'ą arba `sha-<40>` ir attestation šaltiniu naudoja `ci.build.yml`.

### 8.11.2. Tag-based leidimo modelis {#8112-tag-based-leidimo-modelis}

> Taikoma projektams, pasirinkusiems stack'ą `flow-tag` (`.dev-standard/config.json`).

Tag-based modelis tinka, kai produkcija turi būti leidžiama tik aiškiai patvirtintomis, versijuotomis versijomis. Šiame standarto pavyzdyje `main` push po CI vartų candidate digest'ą įdiegia į staging, o apsaugotas `vX.Y.Z` tag tik po sėkmingos staging patikros tą patį digest'ą promote'ina į production per apsaugotą GitHub Environment. Tag yra leidimo įrašas, o ne priežastis perbuild'inti jau patikrintą image. Staging praleisti galima tik `OPS-TAG-P06` sąlygomis.

PRIVALOMA:

<!-- OPS-TAG-P01 | ai-reviewable | stacks=flow-tag | enforced-by=ai -->
*   Tag-based modelyje produkcinis tag turi būti semantinės versijos tag, kuris realiai egzistuoja kaip `refs/tags/<name>` ir nurodo į iš anksto patikrintą commit; branch'as, pavadintas kaip `v1.2.3`, negali būti laikomas release tag.
<!-- OPS-TAG-P02 | ai-reviewable | stacks=flow-tag | enforced-by=ai -->
*   Tag-based leidime diegiamas artefaktas (pvz., konteinerio image) turi būti pastatytas vieną kartą iš tikslaus commit ir praeiti `OPS-PIPE-P01` vartus, o į produkciją turi būti paaukštintas tas pats artefaktas (image – tas pats digest) be rebuild.
<!-- OPS-TAG-P03 | ai-reviewable | stacks=flow-tag | enforced-by=ai -->
*   Tag-based modelyje release turi registruoti commit SHA, diegiamų artefaktų nekintamus identifikatorius (konteinerių image – digest'us) ir migracijų bei rollback informaciją; rollback turi remtis nekintamu identifikatoriumi (image – digest) arba versijos tag, o ne perrašomu `latest`.
<!-- OPS-TAG-P04 | ai-reviewable | stacks=flow-tag | enforced-by=ai -->
*   Tag-based modelyje į production gali būti paaukštintas tik artefaktas (konteinerio image – digest'as), kuris buvo įdiegtas į staging ir praėjo jo readiness patikrą; staging praleisti galima tik tada, kai candidate pilnai patikrintas kitais vartais ir production Environment reikalauja „Required reviewers“ patvirtinimo (`OPS-TAG-P06`).
<!-- OPS-TAG-P05 | human-reviewable -->
*   Tag-based modelyje release tag'ai turi būti apsaugoti repozitorijos taisyklėmis: nustatyta, kas gali juos kurti, o perkelti ar ištrinti paskelbto tag'o negalima.
<!-- OPS-TAG-P06 | human-reviewable -->
*   Tag-based modelyje staging gali būti praleistas tik tada, kai candidate pilnai patikrintas kitais vartais ir production Environment reikalauja „Required reviewers“ patvirtinimo.

Tipinė seka:

```text
push main → lint/validate/test → candidate build → scan/SBOM/provenance → attest → verify → smoke → deploy staging
protected vX.Y.Z tag → verify tag commit == staging-tested SHA → promote the same digest → deploy production (optional Environment approval)
```

Tag push neturi iš naujo tikrinti ar perbuild'inti nepatikrinto kodo. `OPS-TAG-P04` reikalauja, kad į production patektų tik staging'e įdiegtas ir patikrintas artefaktas; šio standarto pavyzdyje tai įrodoma pasirašytu įrodymu, kad būtent šie image digest'ai buvo įdiegti į staging ir praėjo jo readiness patikrą (pavyzdyje – „staging-verified“ attestation, susieta su konkrečiu build run'u). SHA pagrindu pavadintas registry tag'as naudojamas tik digest'ui surasti ir pats savaime įrodymu nelaikomas.

Tag-based rollback arba redeploy pagal versiją naudoja atskirą `Ops: Deploy`
tag-based variantą: jis `vX.Y.Z` tag'ą susieja su image source SHA ir perduoda
`ci.release.yml` kaip `release_workflow`. Branch-based `Ops: Deploy` pavyzdys
šiam scenarijui netinka, nes jo `sha-<40>` input ir `ci.build.yml` attestation
kontraktas yra kitoks.

## 8.12. Konteinerių image {#812-konteinerių-image}

> Taikoma projektams, pasirinkusiems stack'ą `docker` (`.dev-standard/config.json`). Jis įtraukiamas automatiškai su `compose`, `compose-blue-green` ir `k8s`.

Šie reikalavimai taikomi servisams, kurie yra pakuojami į konteinerius ir leidžiami per CI/CD. Praktinis katalogų, Dockerfile ir Compose pavyzdys pateiktas [DevOps CI/CD modelių priede](priedai/devops-ci-cd-modeliai.md).

PRIVALOMA:

<!-- OPS-DOCKER-P01 | ai-reviewable | stacks=docker | enforced-by=ai -->
*   Produkciniai Dockerfile turi naudoti pavadintus multi-stage etapus, versiją ir digest turinčius bazinius image bei, kai aplikacija naudoja package manager, lock failus; build metu reikalingi įrankiai negali patekti į galutinį runtime image.
<!-- OPS-DOCKER-P02 | ai-reviewable | stacks=docker | enforced-by=ai -->
*   Slapti raktai, sertifikatai ir tokenai negali būti kopijuojami į Docker build kontekstą ar image sluoksnius; build kredencialai turi būti perduodami per BuildKit secret mount, o runtime secrets – per vykdymo platformos secrets mechanizmą (pvz., sumontuotus secret failus), ne per image.
<!-- OPS-DOCKER-P03 | ai-reviewable | stacks=docker | enforced-by=ai -->
*   Kiekvienas deployuojamas servisas turi turėti vieną kanoninį registry image pavadinimą, nekintantį tarp staging ir production; aplinka, release versija ir build identifikatorius turi būti perteikiami tag'ais, OCI label'iais ir digest'ais, o ne kuriant aplinkai skirtingus repository pavadinimus. Deploy turi naudoti digest, tag'ai yra paieškos ir promotion nuorodos, o `org.opencontainers.image.revision`, `org.opencontainers.image.source` ir `org.opencontainers.image.version` – atsekamumo metadata.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [6 Saugumas (Security by Design)](06-saugumas.md) · [8.14.1 Kubernetes diegimo reikalavimai](#8141-kubernetes-diegimo-reikalavimai)

## 8.13. Docker Compose diegimas {#813-docker-compose-diegimas}

Single-slot yra numatytasis Compose variantas; blue-green – pasirenkamas ir keičia tik rollout topologiją. Praktinis katalogų ir Compose pavyzdys pateiktas [DevOps CI/CD modelių priede](priedai/devops-ci-cd-modeliai.md).

### 8.13.1. Bendri reikalavimai (single-slot) {#8131-bendri-reikalavimai-single-slot}

> Taikoma projektams, pasirinkusiems stack'ą `compose` (`.dev-standard/config.json`). Galioja ir blue-green variantui.

PRIVALOMA:

<!-- OPS-REPO-P01 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Aplikacijos repozitorijoje turi būti aiškiai atskirtas programos kodas, `docker/` servisų konfigūracija, šaknyje esantys Compose failai ir `.github/workflows/` aktyvios darbo eigos; šablonai ir pavyzdžiai negali būti maišomi su aktyviomis darbo eigomis.
<!-- OPS-COMPOSE-P01 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Development, production ir CI testų Compose konfigūracijos turi būti atskirtos pagal paskirtį: produkcija naudoja nekintamus image bei runtime secrets ir negali build'inti iš checkout'o.
<!-- OPS-COMPOSE-P02 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Compose servisai, kai tai taikoma, turi aprašyti healthcheck, priklausomybes, resursų ribas ir saugų vykdymą; aplikacijos servisų persistent saugykla gali būti naudojama tik naudotojų duomenims – framework cache, sukompiliuoti view failai, build metu sugeneruoti failai ir logai negali būti laikomi persistent saugykloje.
<!-- OPS-FLOW-P06 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Jei projektas teikia rankinį runtime serviso atkūrimo kelią, jis turi vykti per aiškią operaciją su konkrečiu servisų allowlist'u; realizacija turi naudoti hoste jau esantį image, patikrinti atkurtą servisą ir neleisti build, pull, promotion ar image ref pakeitimo.
<!-- OPS-COMPOSE-P06 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Compose diegime secret rotacijos procedūra turi aprašyti saugią servisų restart ir rollback seką.
<!-- OPS-COMPOSE-P09 | ai-reviewable | stacks=compose | enforced-by=ai -->
*   Compose diegime į diegiamas aplinkas (staging, production) slaptos reikšmės į konteinerius turi patekti kaip sumontuoti secret failai iš riboto prieinamumo runtime katalogo diegimo hoste, o ne per aplinkos failą (`env_file`), `environment` reikšmes ar image. Lokalios kūrimo aplinkos ir CI testų Compose failams su laikinomis, tik tam paleidimui skirtomis reikšmėmis šis reikalavimas netaikomas.

### 8.13.2. Blue-green variantas {#8132-blue-green-variantas}

> Taikoma projektams, pasirinkusiems stack'ą `compose-blue-green` (`.dev-standard/config.json`).

PRIVALOMA:

<!-- OPS-COMPOSE-P03 | ai-reviewable | stacks=compose-blue-green | enforced-by=ai -->
*   Pasirinkus blue-green variantą, abu slotai turi naudoti tuos pačius image repository ir tą patį digest'ą; Nginx image gali turėti numatytąjį PHP-FPM upstream'ą, tačiau kiekvieno sloto Compose servisas turi jį pakeisti savo sloto upstream'u, kad sloto Nginx kreiptųsi tik į to paties sloto PHP-FPM.
<!-- OPS-COMPOSE-P04 | ai-reviewable | stacks=compose-blue-green | enforced-by=ai -->
*   Pasirinkus blue-green variantą, slotai gali skirtis tik slot'o specifika: single-slot hardening ir resursų ribos turi būti išlaikyti visuose slotuose, balanceryje ir stateful servisuose, tarp slotų bendrinama gali būti tik naudotojų duomenų saugykla, o build, attestation ir smoke vartai (`OPS-PIPE-P01`) lieka tie patys kaip single-slot – skiriasi tik runtime rollout.
<!-- OPS-COMPOSE-P05 | ai-reviewable | stacks=compose-blue-green | enforced-by=ai -->
*   Pasirinkus blue-green variantą ir jei projektas teikia rankinį runtime serviso atkūrimo kelią, jis turi atskirai valdyti slotus ir balancerį ir nepažeisti aktyvaus slot'o; balancerio atkūrimas po TLS pakeitimo turi būti papildytas HTTPS health patikra.
<!-- OPS-COMPOSE-P07 | ai-reviewable | stacks=compose-blue-green | enforced-by=ai -->
*   Pasirinkus blue-green variantą, secret rotacija turi išsaugoti aktyvų slot'ą iki pilnos rotacijos ir aiškaus perjungimo.
<!-- OPS-COMPOSE-P08 | ai-reviewable | stacks=compose-blue-green | enforced-by=ai -->
*   Pasirinkus blue-green variantą, aktyvus slotas turi būti nustatomas iš balancerio konfigūracijos, o ne iš atskirai saugomos būsenos; eismas perjungiamas tik po sėkmingos naujo sloto readiness patikros, o diegimui nepavykus po perjungimo eismas turi būti grąžintas į ankstesnį slotą.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [8.12 Konteinerių image](#812-konteinerių-image)

## 8.14. Kubernetes ir GitOps {#814-kubernetes-ir-gitops}

> Taikoma projektams, pasirinkusiems stack'ą `k8s` (`.dev-standard/config.json`). Pavyzdžių šiam diegimo būdui standarte kol kas nėra.

### 8.14.1. Kubernetes diegimo reikalavimai {#8141-kubernetes-diegimo-reikalavimai}

PRIVALOMA:

<!-- OPS-K8S-P01 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Diegimo manifestai turi apimti resursų limits ir requests, health patikrinimus ir saugaus vykdymo nustatymus.
<!-- OPS-K8S-P02 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Diegimo konfigūracija turi įgyvendinti [3.6 skyriaus](03-architektura.md#36-patikimumas-ir-atsparumas) reikalavimus dėl replikų, health semantikos ir atsparumo.
<!-- OPS-K8S-P03 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Įėjimas į sistemą turi būti valdomas saugiai, naudojant TLS ir organizacijos reikalavimus atitinkančią ingress konfigūraciją.
<!-- OPS-K8S-P04 | human-reviewable -->
*   Konteinerių ir Kubernetes konfigūracija negali prieštarauti saugumo, patikimumo ir eksploatacijos reikalavimams.

REKOMENDUOJAMA:

<!-- OPS-K8S-R01 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Kritinėms sistemoms naudoti papildomas patikimumo priemones, tokias kaip pod disruption budget ar horizontalus scaling, kai to reikalauja NFR.
<!-- OPS-K8S-R02 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Manifestų kokybę tikrinti dar prieš diegimą, o ne tik klasteryje.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [6 Saugumas (Security by Design)](06-saugumas.md) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

### 8.14.2. GitOps repo struktūros gairės {#8142-gitops-repo-struktūros-gairės}

PRIVALOMA:

<!-- OPS-GITOPS-P01 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   GitOps repozitorijų struktūra turi aiškiai atskirti aplikacijų šablonus, aplinkų parametrus ir, jei taikoma, klasterių deklaracijas.
<!-- OPS-GITOPS-P02 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Repo struktūra turi būti nuosekli, kad būtų aišku, kur saugomi bendri šablonai ir kur aplinkų specifiniai parametrai.
<!-- OPS-GITOPS-P03 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Jei naudojamas Helm ar lygiavertės priemonės, jų versijavimas ir validacija turi būti aiškiai apibrėžti.

REKOMENDUOJAMA:

<!-- OPS-GITOPS-R01 | human-reviewable -->
*   Naudoti kuo paprastesnę ir vienodą GitOps repo struktūrą visose sistemose.
<!-- OPS-GITOPS-R02 | ai-reviewable | stacks=k8s | enforced-by=ai -->
*   Aplinkų parametrus rekomenduojama laikyti atskirtus nuo bendrų chart ar template dalių.
<!-- OPS-GITOPS-R03 | process-level -->
*   GitOps struktūrą rekomenduojama dokumentuoti taip, kad ją suprastų ne tik pradinė komanda, bet ir nauji perėmėjai.

> Susiję skyriai: [4.3 Versijų valdymas ir repozitorijos](04-kodo-kurimo-gaires.md#43-versijų-valdymas-ir-repozitorijos) · [8.7 Infrastruktūra kaip kodas (IaC)](#87-infrastruktūra-kaip-kodas-iac) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)

## 8.15. Neaprašytos technologijos {#815-neaprašytos-technologijos}

Standartas diegimo profilius aprašo tik tiems būdams, kuriems yra parengtos taisyklės ir pavyzdžiai: Docker Compose (single-slot ir blue-green) ir Kubernetes. Jei projektas diegiamas kitaip (pavyzdžiui, į virtualias mašinas be konteinerių, serverless platformą ar kitą orkestratorių):

*   projektui galioja visos bendros taisyklės ([8.1](#81-aplinkos-ir-bendri-principai)–[8.10](#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas)) ir pasirinkto Git leidimo modelio taisyklės ([8.11](#811-git-leidimo-modeliai));
*   konteinerių image taisyklės ([8.12](#812-konteinerių-image)) galioja kiekvienam projektui, kuris stato konteinerių image, nepriklausomai nuo diegimo būdo – toks projektas deklaruoja stack'ą `docker`;
*   Compose ir Kubernetes taisyklės (8.13–8.14) netaikomos, o automatinis review ataskaitoje aiškiai nurodo, kad profilis nepasirinktas arba standarte neaprašytas ir specifinės taisyklės nevertintos – tai nėra tylus praleidimas;
*   projektas diegimo dokumentacijoje aprašo, kaip pasirinkta technologija įgyvendina lygiaverčius reikalavimus: nekintamus artefaktus, readiness patikrą, secrets valdymą ir rollback (`OPS-PIPE-P07`); rekomenduojama aprašyti ir resursų ribas;
*   Git leidimo modeliui tokios bendros išeities nėra: projektas renkasi `flow-branch` arba `flow-tag`. Kitas modelis (pvz., production diegiama tik rankiniu paleidimu) leidžiamas tik kaip išimtis, įrašyta projekto `.github/instructions/dev-standard-local.instructions.md` faile su modelio aprašymu ir priežastimi (`OPS-PIPE-P07`); tada Git modelio stack'as nedeklaruojamas, diegimo dokumentacija aprašo, kaip leidimas pasiekia aplinkas, o 8.11 taisyklės netaikomos. Be įrašytos išimties tai yra `OPS-PIPE-P07` pažeidimas;
*   jei technologiją naudoja daugiau nei vienas projektas, standartui siūlomas naujas profilis (žr. [13 skyrių](13-standarto-prieziura.md)).
