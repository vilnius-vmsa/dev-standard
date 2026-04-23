# 8. DevOps ir CI/CD reikalavimai

Šis skyrius apibrėžia CI/CD, GitOps ir IaC procesinius bei techninius mechanizmus, kurie užtikrina pakartojamus, saugius ir audituojamus diegimus į visas aplinkas.

Šis skyrius nustato, kaip turi būti įgyvendinami diegimo, release, aplinkų atskyrimo, saugumo, stebėsenos ir infrastruktūros valdymo reikalavimai.

Konfigūracijos, slaptųjų raktų ir aplinkų politikos reikalavimai apibrėžti [#3.5](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) skyriuje, patikimumo ir health reikalavimai – [#3.6](03-architektura.md#36-patikimumas-ir-atsparumas) skyriuje, saugumo reikalavimai – [#6](06-saugumas.md) skyriuje, o stebėsena ir eksploatacija – [#9](09-stebesena-logai.md) skyriuje.

## 8.1. Aplinkos ir bendri principai

PRIVALOMA:

<!-- OPS-ENV-P01 | ai-reviewable -->
*   Visi diegimai į aplinkas turi būti vykdomi tik per CI/CD procesą; rankiniai pakeitimai aplinkose draudžiami, išskyrus aiškiai dokumentuotus incidentų valdymo atvejus.
<!-- OPS-ENV-P02 | ai-reviewable -->
*   CI/CD ir GitOps turi užtikrinti, kad aplinkos būtų izoliuotos ir atitiktų 3.[5.3 skyriaus](05-versijavimas.md#53-bibliotekų-ir-paketų-valdymas) reikalavimus.
<!-- OPS-ENV-P03 | ai-reviewable -->
*   Diegimo pipeline negali naudoti tos pačios konfigūracijos ar tų pačių kredencialų skirtingoms aplinkoms, jei tai nėra aiškiai aprašyta ir patvirtinta.
<!-- OPS-ENV-P04 | process-level -->
*   Aplinkų būsena turi būti valdoma deklaratyviai, o ne per neversijuojamus rankinius pakeitimus.
<!-- OPS-ENV-P05 | ai-reviewable -->
*   Slaptos reikšmės turi būti gaunamos iš saugios slaptųjų raktų saugyklos; jos negali būti laikomos repozitorijoje, build loguose ar pipeline artefaktuose.

REKOMENDUOJAMA:

<!-- OPS-ENV-R01 | human-reviewable -->
*   Pasirinkti vieningą aplinkų pavadinimų ir DNS modelį visose sistemose.
<!-- OPS-ENV-R02 | ai-reviewable -->
*   Dokumentuoti aplinkų, branch’ų ir diegimo srautų ryšį projekto diegimo dokumentacijoje.
<!-- OPS-ENV-R03 | human-reviewable -->
*   Išskirtinius aplinkų skirtumus laikyti minimalius ir aiškiai aprašytus.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [3.7 Stebėsena ir diagnostika](03-architektura.md#37-stebėsena-ir-diagnostika)

## 8.2. CI (Continuous Integration) minimalūs reikalavimai

PRIVALOMA:

<!-- OPS-CI-P01 | ai-reviewable -->
*   CI pipeline turi būti vykdomas kiekvienam PR arba MR ir pagrindinėms šakoms.
<!-- OPS-CI-P02 | ai-reviewable -->
*   Build procesas turi būti pakartojamas, naudojant fiksuotas bazines versijas, lock failus ir kontroliuojamą kešavimą.
<!-- OPS-CI-P03 | ai-reviewable -->
*   CI turi vykdyti bent šiuos patikrinimus, kai jie taikomi projektui:
    *   build
    *   formatavimo ir linting patikras
    *   unit testus
    *   API ar kontraktų validaciją
    *   saugumo ir priklausomybių patikras
<!-- OPS-CI-P04 | human-reviewable -->
*   Artefaktai turi būti generuojami su aiškiu ir atsekamu identifikatoriumi.
<!-- OPS-CI-P05 | ai-reviewable -->
*   Nepraėję privalomi kokybės vartai turi blokuoti merge’inimą.

REKOMENDUOJAMA:

<!-- OPS-CI-R01 | ai-reviewable -->
*   Naudoti pipeline optimizavimą, kuris trumpina grįžtamąjį ryšį, bet nemažina kokybės kontrolės apimties.
<!-- OPS-CI-R02 | ai-reviewable -->
*   Kritiniams projektams aiškiai atskirti greitus PR patikrinimus nuo pilnų priešleidiminių patikrinimų.

> Susiję skyriai: [4.2.3 Automatinis formatavimas ir linting](04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [4.5 Testai](04-kodo-kurimo-gaires.md#45-testai) · [7.9 Testų vykdymas CI/CD ir ataskaitos](07-testavimas.md#79-testų-vykdymas-ci-cd-ir-ataskaitos)

## 8.3. CD (Continuous Delivery/Deployment) {#83-cd-continuous-delivery-deployment}

PRIVALOMA:

<!-- OPS-CD-P01 | ai-reviewable -->
*   Diegimai turi būti atliekami per automatizuotą CD procesą, kuris užtikrina atsekamą ir pakartojamą leidimą į tikslinę aplinką.
<!-- OPS-CD-P02 | human-reviewable -->
*   GitOps turi būti laikomas numatytuoju diegimo modeliu ten, kur jis taikomas.
<!-- OPS-CD-P03 | ai-reviewable -->
*   Rollback mechanizmas turi būti apibrėžtas, dokumentuotas ir patikrintas.
<!-- OPS-CD-P04 | ai-reviewable -->
*   Duomenų bazės migracijos turi būti integruotos į leidimo procesą ir vykdomos kontroliuotai.
<!-- OPS-CD-P05 | ai-reviewable -->
*   Diegimo strategija turi būti aiškiai pasirinkta ir atitikti sistemos riziką bei kritiškumą.

REKOMENDUOJAMA:

<!-- OPS-CD-R01 | ai-reviewable -->
*   Kritiniams arba aukštos rizikos leidimams taikyti pažangesnes strategijas, tokias kaip canary ar blue-green.
<!-- OPS-CD-R02 | ai-reviewable -->
*   Jei organizacijoje taikomi release langai, juos rekomenduojama derinti su eksploatacijos ir verslo poreikiais.
<!-- OPS-CD-R03 | human-reviewable -->
*   Rollback scenarijus rekomenduojama tikrinti ne tik teoriškai, bet ir praktiniais bandymais.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [8.9 Leidimų (release) valdymas](#89-leidimų-release-valdymas)

## 8.4. Versijavimas ir žymėjimas (release artefaktams)

PRIVALOMA:

<!-- OPS-VER-P01 | human-reviewable -->
*   Kiekvienas leidimas turi turėti aiškią versiją ir atsekamą ryšį su kodo būsena.
<!-- OPS-VER-P02 | human-reviewable -->
*   Konteinerių image ir kiti artefaktai turi būti žymimi taip, kad būtų aišku, kokia kodo versija yra įdiegta.
<!-- OPS-VER-P03 | ai-reviewable -->
*   Produkcijoje negali būti remiamasi vien latest tipo žymėjimu.
<!-- OPS-VER-P04 | human-reviewable -->
*   Versijavimo ir žymėjimo schema turi būti nuosekli visose projekto dalyse.

REKOMENDUOJAMA:

<!-- OPS-VER-R01 | ai-reviewable -->
*   Artefaktams naudoti tiek semantinę versiją, tiek nekintamą commit ar build identifikatorių.
<!-- OPS-VER-R02 | ai-reviewable -->
*   Release artefaktų ženklinimą suderinti su release notes ir diegimo dokumentacija.

> Susiję skyriai: [5.1 Semantinis versijavimas (SemVer)](05-versijavimas.md#51-semantinis-versijavimas-semver) · [5.2 API versijavimas](05-versijavimas.md#52-api-versijavimas) · [8.9 Leidimų (release) valdymas](#89-leidimų-release-valdymas)

## 8.5. Konteinerių ir Kubernetes diegimo reikalavimai

PRIVALOMA:

<!-- OPS-K8S-P01 | ai-reviewable -->
*   Diegimo manifestai turi apimti resursų limits ir requests, health patikrinimus ir saugaus vykdymo nustatymus.
<!-- OPS-K8S-P02 | ai-reviewable -->
*   Diegimo konfigūracija turi įgyvendinti [3.6 skyriaus](03-architektura.md#36-patikimumas-ir-atsparumas) reikalavimus dėl replikų, health semantikos ir atsparumo.
<!-- OPS-K8S-P03 | ai-reviewable -->
*   Įėjimas į sistemą turi būti valdomas saugiai, naudojant TLS ir organizacijos reikalavimus atitinkančią ingress konfigūraciją.
<!-- OPS-K8S-P04 | ai-reviewable -->
*   Konteinerių ir Kubernetes konfigūracija negali prieštarauti saugumo, patikimumo ir eksploatacijos reikalavimams.

REKOMENDUOJAMA:

<!-- OPS-K8S-R01 | ai-reviewable -->
*   Kritinėms sistemoms naudoti papildomas patikimumo priemones, tokias kaip pod disruption budget ar horizontalus scaling, kai to reikalauja NFR.
<!-- OPS-K8S-R02 | human-reviewable -->
*   Manifestų kokybę tikrinti dar prieš diegimą, o ne tik klasteryje.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [6 Saugumas (Security by Design)](06-saugumas.md) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

## 8.6. DevSecOps (CI/CD kontrolė) {#86-devsecops-ci-cd-kontrolė}

PRIVALOMA:

<!-- OPS-DEVSEC-P01 | ai-reviewable -->
*   CI/CD procese turi būti vykdomos saugumo patikros pagal sistemos rizikos lygį.
<!-- OPS-DEVSEC-P02 | human-reviewable -->
*   Turi būti tikrinamos priklausomybės, statinė analizė ir, kai taikoma, konteinerių image.
<!-- OPS-DEVSEC-P03 | ai-reviewable -->
*   Repozitorijose ir CI procese turi būti įjungtas slaptųjų raktų aptikimas.
<!-- OPS-DEVSEC-P04 | ai-reviewable -->
*   Saugumo radiniai, laikomi kritiniais pagal organizacijos politiką, turi blokuoti merge’inimą arba leidimą, kol rizika neišspręsta arba aiškiai nepriimta.

REKOMENDUOJAMA:

<!-- OPS-DEVSEC-R01 | ai-reviewable -->
*   SBOM generuoti automatiškai leidimo metu ir saugoti kartu su release artefaktais.
<!-- OPS-DEVSEC-R02 | process-level -->
*   DevSecOps kontrolę derinti ne tik su įrankių rezultatais, bet ir su architektūrine rizikos peržiūra.
<!-- OPS-DEVSEC-R03 | human-reviewable -->
*   Saugumo taisykles rekomenduojama vykdyti kaip policy-as-code ten, kur tai pagrįsta.

> Susiję skyriai: [6 Saugumas (Security by Design)](06-saugumas.md) · [6.6 OWASP Top 10](06-saugumas.md#66-owasp-top-10) · [5.5 Priklausomybių saugumas ir atsekamumas](05-versijavimas.md#55-priklausomybių-saugumas-ir-atsekamumas)

## 8.7. Stebėsena, logai ir įvykių valdymas (CI/CD užtikrinimas) {#87-stebėsena-logai-ir-įvykių-valdymas-ci-cd-užtikrinimas}

PRIVALOMA:

<!-- OPS-MON-P01 | ai-reviewable -->
*   Diegimo ir CI/CD konfigūracija turi užtikrinti, kad sistema atitiktų [9 skyriaus](09-stebesena-logai.md) reikalavimus logams, metrikoms, alertams ir eksploatacinei parengčiai.
<!-- OPS-MON-P02 | ai-reviewable -->
*   Turi būti užtikrintas logų, metrikų ir, jei taikoma, tracing signalų eksportas į centralizuotą stebėsenos platformą.
<!-- OPS-MON-P03 | ai-reviewable -->
*   Diegimo procese turi būti aišku, kada ir kaip tikrinama observability konfigūracija.
<!-- OPS-MON-P04 | ai-reviewable -->
*   Jei release procesas apima rollback ar incidentų veiksmus, jie turi būti suderinti su eksploatacijos tvarka.

REKOMENDUOJAMA:

<!-- OPS-MON-R01 | ai-reviewable -->
*   Prieš leidimą tikrinti bent minimalią observability parengtį, pvz., health, logų surinkimą ir pagrindines metrikas.
<!-- OPS-MON-R02 | process-level -->
*   Release peržiūroje rekomenduojama vertinti ir observability pokyčius, jei pakeitimas daro įtaką diagnostikai.

> Susiję skyriai: [3.7 Stebėsena ir diagnostika](03-architektura.md#37-stebėsena-ir-diagnostika) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 8.8. Infrastruktūra kaip kodas (IaC)

PRIVALOMA:

<!-- OPS-IAC-P01 | human-reviewable -->
*   Infrastruktūros pakeitimai turi būti vykdomi per IaC ir valdomi per versijų kontrolę.
<!-- OPS-IAC-P02 | ai-reviewable -->
*   IaC pakeitimai turi būti peržiūrimi per PR arba MR procesą taip pat, kaip ir programinis kodas.
<!-- OPS-IAC-P03 | ai-reviewable -->
*   Infrastruktūros būsena negali būti valdoma per neversijuojamus rankinius pakeitimus kaip įprastą praktiką.
<!-- OPS-IAC-P04 | human-reviewable -->
*   Kritiniai infrastruktūros sprendimai turi būti atsekami ir audituojami.

REKOMENDUOJAMA:

<!-- OPS-IAC-R01 | human-reviewable -->
*   Naudoti policy-as-code arba lygiavertes priemones tais atvejais, kai norima automatizuotai tikrinti infrastruktūros atitiktį taisyklėms.
<!-- OPS-IAC-R02 | process-level -->
*   IaC pakeitimų planą ir taikymą rekomenduojama atskirti į aiškius, peržiūrimus etapus.

> Susiję skyriai: [4.3.1 Versijų kontrolė ir repozitorijų valdymas](04-kodo-kurimo-gaires.md#431-versijų-kontrolė-ir-repozitorijų-valdymas) · [3.10.2 Suderinamumas su savivaldybės infrastruktūra](03-architektura.md#3102-suderinamumas-su-savivaldybės-infrastruktūra)

## 8.9. Leidimų (release) valdymas

PRIVALOMA:

<!-- OPS-REL-P01 | ai-reviewable -->
*   Kiekvienas produkcinis leidimas turi turėti aiškų release aprašą.
<!-- OPS-REL-P02 | ai-reviewable -->
*   Prieš leidimą turi būti aišku, kokie pakeitimai įtraukti, kokios rizikos žinomos, kokios migracijos reikalingos ir kaip veikia rollback.
<!-- OPS-REL-P03 | ai-reviewable -->
*   Leidimo patvirtinimo procesas turi būti suderintas su organizacijos atsakomybėmis ir audito poreikiais.
<!-- OPS-REL-P04 | ai-reviewable -->
*   Minimalūs leidimo priėmimo kriterijai turi būti apibrėžti iš anksto.

REKOMENDUOJAMA:

<!-- OPS-REL-R01 | ai-reviewable -->
*   Produkciniams leidimams naudoti standartizuotą release notes šabloną.
<!-- OPS-REL-R02 | ai-reviewable -->
*   Leidimo peržiūroje rekomenduojama įtraukti techninius, eksploatacinius ir verslo pokyčius vienoje vietoje.
<!-- OPS-REL-R03 | human-reviewable -->
*   Kritiniams leidimams rekomenduojama aiškiai nurodyti stebėjimo periodą po diegimo.

> Susiję skyriai: [4.3.5 Pull Request / Merge Request reikalavimai](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [9.6 Incidentų valdymas](09-stebesena-logai.md#96-incidentų-valdymas)

## 8.10. Kainodara ir efektyvumas (FinOps)

PRIVALOMA:

<!-- OPS-FIN-P01 | human-reviewable -->
*   Resursai turi būti identifikuojami taip, kad būtų įmanoma matyti sąnaudas pagal sistemą, projektą ar aplinką.
<!-- OPS-FIN-P02 | human-reviewable -->
*   Artefaktų, image, logų ar kitų saugojimo objektų retention turi būti valdomas taip, kad nekauptų nepagrįstų sąnaudų.
<!-- OPS-FIN-P03 | ai-reviewable -->
*   Sistemos ir infrastruktūros sprendimai turi būti projektuojami ne tik pagal funkcionalumą, bet ir pagal palaikymo bei eksploatacijos efektyvumą.

REKOMENDUOJAMA:

<!-- OPS-FIN-R01 | process-level -->
*   Reguliariai peržiūrėti resursų naudojimą ir identifikuoti perteklinius kaštus.
<!-- OPS-FIN-R02 | human-reviewable -->
*   Kritinėms ar brangioms sistemoms rekomenduojama turėti bazines sąnaudų stebėsenos ataskaitas.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

## 8.11. GitOps repo struktūros gairės

PRIVALOMA:

<!-- OPS-GITOPS-P01 | ai-reviewable -->
*   GitOps repozitorijų struktūra turi aiškiai atskirti aplikacijų šablonus, aplinkų parametrus ir, jei taikoma, klasterių deklaracijas.
<!-- OPS-GITOPS-P02 | ai-reviewable -->
*   Repo struktūra turi būti nuosekli, kad būtų aišku, kur saugomi bendri šablonai ir kur aplinkų specifiniai parametrai.
<!-- OPS-GITOPS-P03 | ai-reviewable -->
*   Jei naudojamas Helm ar lygiavertės priemonės, jų versijavimas ir validacija turi būti aiškiai apibrėžti.

REKOMENDUOJAMA:

<!-- OPS-GITOPS-R01 | human-reviewable -->
*   Naudoti kuo paprastesnę ir vienodą GitOps repo struktūrą visose sistemose.
<!-- OPS-GITOPS-R02 | human-reviewable -->
*   Aplinkų parametrus rekomenduojama laikyti atskirtus nuo bendrų chart ar template dalių.
<!-- OPS-GITOPS-R03 | process-level -->
*   GitOps struktūrą rekomenduojama dokumentuoti taip, kad ją suprastų ne tik pradinė komanda, bet ir nauji perėmėjai.

> Susiję skyriai: [4.3 Versijų valdymas ir repozitorijos](04-kodo-kurimo-gaires.md#43-versijų-valdymas-ir-repozitorijos) · [8.8 Infrastruktūra kaip kodas (IaC)](#88-infrastruktūra-kaip-kodas-iac) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)
