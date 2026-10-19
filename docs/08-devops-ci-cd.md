# 8. DevOps ir CI/CD reikalavimai

Šis skyrius apibrėžia CI/CD, GitOps ir IaC procesinius bei techninius mechanizmus, kurie užtikrina pakartojamus, saugius ir audituojamus diegimus į visas aplinkas.

Šis skyrius nustato, kaip turi būti įgyvendinami diegimo, release, aplinkų atskyrimo, saugumo, stebėsenos ir infrastruktūros valdymo reikalavimai.

Konfigūracijos, slaptųjų raktų ir aplinkų politikos reikalavimai apibrėžti [#3.5](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) skyriuje, patikimumo ir health reikalavimai – [#3.6](03-architektura.md#36-patikimumas-ir-atsparumas) skyriuje, saugumo reikalavimai – [#6](06-saugumas.md) skyriuje, o stebėsena ir eksploatacija – [#9](09-stebesena-logai.md) skyriuje.

## 8.1. Aplinkos ir bendri principai

PRIVALOMA:

<!-- OPS-ENV-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Visi diegimai į aplinkas turi būti vykdomi tik per CI/CD procesą; rankiniai pakeitimai aplinkose draudžiami, išskyrus aiškiai dokumentuotus incidentų valdymo atvejus.
<!-- OPS-ENV-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   CI/CD ir GitOps turi užtikrinti, kad aplinkos būtų izoliuotos ir atitiktų 3.[5.3 skyriaus](05-versijavimas.md#53-bibliotekų-ir-paketų-valdymas-angl-dependencies) reikalavimus.
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
<!-- OPS-CI-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Nepraėję privalomi kokybės vartai turi blokuoti merge’inimą.

REKOMENDUOJAMA:

<!-- OPS-CI-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Naudoti pipeline optimizavimą, kuris trumpina grįžtamąjį ryšį, bet nemažina kokybės kontrolės apimties.
<!-- OPS-CI-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kritiniams projektams aiškiai atskirti greitus PR patikrinimus nuo pilnų priešleidiminių patikrinimų.

> Susiję skyriai: [4.2.3 Automatinis formatavimas ir linting](04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [4.5 Testai](04-kodo-kurimo-gaires.md#45-testai) · [7.9 Testų vykdymas CI/CD ir ataskaitos](07-testavimas.md#79-testų-vykdymas-ci-cd-ir-ataskaitos)

## 8.3. CD (Continuous Delivery/Deployment) {#83-cd-continuous-delivery-deployment}

PRIVALOMA:

<!-- OPS-CD-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimai turi būti atliekami per automatizuotą CD procesą, kuris užtikrina atsekamą ir pakartojamą leidimą į tikslinę aplinką.
<!-- OPS-CD-P02 | human-reviewable -->
*   GitOps turi būti laikomas numatytuoju diegimo modeliu ten, kur jis taikomas.
<!-- OPS-CD-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Rollback mechanizmas turi būti apibrėžtas, dokumentuotas ir patikrintas.
<!-- OPS-CD-P04 | ai-reviewable | stacks=infra,db | enforced-by=ai -->
*   Duomenų bazės migracijos turi būti integruotos į leidimo procesą ir vykdomos kontroliuotai.
<!-- OPS-CD-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo strategija turi būti aiškiai pasirinkta ir atitikti sistemos riziką bei kritiškumą.

REKOMENDUOJAMA:

<!-- OPS-CD-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kritiniams arba aukštos rizikos leidimams taikyti pažangesnes strategijas, tokias kaip canary ar blue-green.
<!-- OPS-CD-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Jei organizacijoje taikomi release langai, juos rekomenduojama derinti su eksploatacijos ir verslo poreikiais.
<!-- OPS-CD-R03 | human-reviewable -->
*   Rollback scenarijus rekomenduojama tikrinti ne tik teoriškai, bet ir praktiniais bandymais.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [8.9 Leidimų (release) valdymas](#89-leidimų-release-valdymas)

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
<!-- OPS-VER-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Release artefaktų ženklinimą suderinti su release notes ir diegimo dokumentacija.

> Susiję skyriai: [5.1 Semantinis versijavimas (SemVer)](05-versijavimas.md#51-semantinis-versijavimas-semver) · [5.2 API versijavimas](05-versijavimas.md#52-api-versijavimas) · [8.9 Leidimų (release) valdymas](#89-leidimų-release-valdymas)

## 8.5. Konteinerių ir Kubernetes diegimo reikalavimai

PRIVALOMA:

<!-- OPS-K8S-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo manifestai turi apimti resursų limits ir requests, health patikrinimus ir saugaus vykdymo nustatymus.
<!-- OPS-K8S-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo konfigūracija turi įgyvendinti [3.6 skyriaus](03-architektura.md#36-patikimumas-ir-atsparumas) reikalavimus dėl replikų, health semantikos ir atsparumo.
<!-- OPS-K8S-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Įėjimas į sistemą turi būti valdomas saugiai, naudojant TLS ir organizacijos reikalavimus atitinkančią ingress konfigūraciją.
<!-- OPS-K8S-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Konteinerių ir Kubernetes konfigūracija negali prieštarauti saugumo, patikimumo ir eksploatacijos reikalavimams.

REKOMENDUOJAMA:

<!-- OPS-K8S-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kritinėms sistemoms naudoti papildomas patikimumo priemones, tokias kaip pod disruption budget ar horizontalus scaling, kai to reikalauja NFR.
<!-- OPS-K8S-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Manifestų kokybę tikrinti dar prieš diegimą, o ne tik klasteryje.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [6 Saugumas (Security by Design)](06-saugumas.md) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

## 8.6. DevSecOps (CI/CD kontrolė) {#86-devsecops-ci-cd-kontrolė}

PRIVALOMA:

<!-- OPS-DEVSEC-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   CI/CD procese turi būti vykdomos saugumo patikros pagal sistemos rizikos lygį.
<!-- OPS-DEVSEC-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Turi būti tikrinamos priklausomybės, statinė analizė ir, kai taikoma, konteinerių image.
<!-- OPS-DEVSEC-P03 | ai-reviewable | stacks=infra | enforced-by=tool:gitleaks -->
*   Repozitorijose ir CI procese turi būti įjungtas slaptųjų raktų aptikimas.
<!-- OPS-DEVSEC-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Saugumo radiniai, laikomi kritiniais pagal organizacijos politiką, turi blokuoti merge’inimą arba leidimą, kol rizika neišspręsta arba aiškiai nepriimta.

REKOMENDUOJAMA:

<!-- OPS-DEVSEC-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   SBOM generuoti automatiškai leidimo metu ir saugoti kartu su release artefaktais.
<!-- OPS-DEVSEC-R02 | process-level -->
*   DevSecOps kontrolę derinti ne tik su įrankių rezultatais, bet ir su architektūrine rizikos peržiūra.
<!-- OPS-DEVSEC-R03 | human-reviewable -->
*   Saugumo taisykles rekomenduojama vykdyti kaip policy-as-code ten, kur tai pagrįsta.

> Susiję skyriai: [6 Saugumas (Security by Design)](06-saugumas.md) · [6.6 OWASP Top 10](06-saugumas.md#66-owasp-top-10) · [5.5 Priklausomybių saugumas ir atsekamumas](05-versijavimas.md#55-priklausomybių-saugumas-ir-atsekamumas)

## 8.7. Stebėsena, logai ir įvykių valdymas (CI/CD užtikrinimas) {#87-stebėsena-logai-ir-įvykių-valdymas-ci-cd-užtikrinimas}

PRIVALOMA:

<!-- OPS-MON-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo ir CI/CD konfigūracija turi užtikrinti, kad sistema atitiktų [9 skyriaus](09-stebesena-logai.md) reikalavimus logams, metrikoms, alertams ir eksploatacinei parengčiai.
<!-- OPS-MON-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Turi būti užtikrintas logų, metrikų ir, jei taikoma, tracing signalų eksportas į centralizuotą stebėsenos platformą.
<!-- OPS-MON-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Diegimo procese turi būti aišku, kada ir kaip tikrinama observability konfigūracija.
<!-- OPS-MON-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Jei release procesas apima rollback ar incidentų veiksmus, jie turi būti suderinti su eksploatacijos tvarka.

REKOMENDUOJAMA:

<!-- OPS-MON-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Prieš leidimą tikrinti bent minimalią observability parengtį, pvz., health, logų surinkimą ir pagrindines metrikas.
<!-- OPS-MON-R02 | process-level -->
*   Release peržiūroje rekomenduojama vertinti ir observability pokyčius, jei pakeitimas daro įtaką diagnostikai.

> Susiję skyriai: [3.7 Stebėsena ir diagnostika](03-architektura.md#37-stebėsena-ir-diagnostika) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 8.8. Infrastruktūra kaip kodas (IaC)

PRIVALOMA:

<!-- OPS-IAC-P01 | human-reviewable -->
*   Infrastruktūros pakeitimai turi būti vykdomi per IaC ir valdomi per versijų kontrolę.
<!-- OPS-IAC-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   IaC pakeitimai turi būti peržiūrimi per PR arba MR procesą taip pat, kaip ir programinis kodas.
<!-- OPS-IAC-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
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

<!-- OPS-REL-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Kiekvienas produkcinis leidimas turi turėti aiškų release aprašą.
<!-- OPS-REL-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Prieš leidimą turi būti aišku, kokie pakeitimai įtraukti, kokios rizikos žinomos, kokios migracijos reikalingos ir kaip veikia rollback.
<!-- OPS-REL-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Leidimo patvirtinimo procesas turi būti suderintas su organizacijos atsakomybėmis ir audito poreikiais.
<!-- OPS-REL-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Minimalūs leidimo priėmimo kriterijai turi būti apibrėžti iš anksto.

REKOMENDUOJAMA:

<!-- OPS-REL-R01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Produkciniams leidimams naudoti standartizuotą release notes šabloną.
<!-- OPS-REL-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Leidimo peržiūroje rekomenduojama įtraukti techninius, eksploatacinius ir verslo pokyčius vienoje vietoje.
<!-- OPS-REL-R03 | human-reviewable -->
*   Kritiniams leidimams rekomenduojama aiškiai nurodyti stebėjimo periodą po diegimo.

> Susiję skyriai: [4.3.5 Pull Request / Merge Request reikalavimai](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [9.6 Incidentų valdymas](09-stebesena-logai.md#96-incidentų-valdymas)

## 8.10. Kainodara ir efektyvumas (FinOps)

PRIVALOMA:

<!-- OPS-FIN-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Resursai turi būti identifikuojami taip, kad būtų įmanoma matyti sąnaudas pagal sistemą, projektą ar aplinką.
<!-- OPS-FIN-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Artefaktų, image, logų ar kitų saugojimo objektų retention turi būti valdomas taip, kad nekauptų nepagrįstų sąnaudų.
<!-- OPS-FIN-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Sistemos ir infrastruktūros sprendimai turi būti projektuojami ne tik pagal funkcionalumą, bet ir pagal palaikymo bei eksploatacijos efektyvumą.

REKOMENDUOJAMA:

<!-- OPS-FIN-R01 | process-level -->
*   Reguliariai peržiūrėti resursų naudojimą ir identifikuoti perteklinius kaštus.
<!-- OPS-FIN-R02 | human-reviewable -->
*   Kritinėms ar brangioms sistemoms rekomenduojama turėti bazines sąnaudų stebėsenos ataskaitas.

> Susiję skyriai: [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.2 Monitoring ir metrikos](09-stebesena-logai.md#92-monitoring-ir-metrikos)

## 8.11. GitOps repo struktūros gairės

PRIVALOMA:

<!-- OPS-GITOPS-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   GitOps repozitorijų struktūra turi aiškiai atskirti aplikacijų šablonus, aplinkų parametrus ir, jei taikoma, klasterių deklaracijas.
<!-- OPS-GITOPS-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Repo struktūra turi būti nuosekli, kad būtų aišku, kur saugomi bendri šablonai ir kur aplinkų specifiniai parametrai.
<!-- OPS-GITOPS-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Jei naudojamas Helm ar lygiavertės priemonės, jų versijavimas ir validacija turi būti aiškiai apibrėžti.

REKOMENDUOJAMA:

<!-- OPS-GITOPS-R01 | human-reviewable -->
*   Naudoti kuo paprastesnę ir vienodą GitOps repo struktūrą visose sistemose.
<!-- OPS-GITOPS-R02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Aplinkų parametrus rekomenduojama laikyti atskirtus nuo bendrų chart ar template dalių.
<!-- OPS-GITOPS-R03 | process-level -->
*   GitOps struktūrą rekomenduojama dokumentuoti taip, kad ją suprastų ne tik pradinė komanda, bet ir nauji perėmėjai.

> Susiję skyriai: [4.3 Versijų valdymas ir repozitorijos](04-kodo-kurimo-gaires.md#43-versijų-valdymas-ir-repozitorijos) · [8.8 Infrastruktūra kaip kodas (IaC)](#88-infrastruktūra-kaip-kodas-iac) · [9.8 Eksploatacijos dokumentacija](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)

## 8.12. Aplikacijos repozitorijos, Docker ir Compose struktūra {#812-aplikacijos-repozitorijos-docker-ir-compose-struktūra}

Šie reikalavimai taikomi servisams, kurie yra pakuojami į konteinerius ir leidžiami per CI/CD. Praktinis katalogų, Dockerfile ir Compose pavyzdys pateiktas [DevOps CI/CD modelių priede](priedai/devops-ci-cd-modeliai.md).

PRIVALOMA:

<!-- OPS-REPO-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Aplikacijos repozitorijoje turi būti aiškiai atskirtas programos kodas, `docker/` servisų konfigūracija, šaknyje esantys Compose failai ir `.github/workflows/` aktyvios darbo eigos; šablonai ir pavyzdžiai negali būti maišomi su aktyviomis darbo eigomis.
<!-- OPS-DOCKER-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Produkciniai Dockerfile turi naudoti pavadintus multi-stage etapus, versiją ir digest turinčius bazinius image bei, kai aplikacija naudoja package manager, lock failus; build metu reikalingi įrankiai negali patekti į galutinį runtime image.
<!-- OPS-DOCKER-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Slapti raktai, sertifikatai ir tokenai negali būti kopijuojami į Docker build kontekstą ar image sluoksnius; build kredencialai turi būti perduodami per BuildKit secret mount, o runtime secrets – per saugią aplinkos mechanizmą.
<!-- OPS-COMPOSE-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Development, production ir CI testų Compose konfigūracijos turi būti atskirtos pagal paskirtį: produkcija naudoja nekintamus image bei runtime secrets ir negali build'inti iš checkout'o.
<!-- OPS-COMPOSE-P02 | ai-reviewable | stacks=infra,db | enforced-by=ai -->
*   Compose servisai, kai tai taikoma, turi aprašyti healthcheck, priklausomybes, resursų ribas ir saugų vykdymą; bendri servisų numatytieji nustatymai rekomenduojami anchor'uose. Blue-green yra pasirenkamas variantas: jis gali keisti tik slot'o skirtumus ir turi naudoti bendrą persistent state saugyklą, kai to reikalauja aplikacija.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [6 Saugumas (Security by Design)](06-saugumas.md) · [8.5 Konteinerių ir Kubernetes diegimo reikalavimai](#85-konteinerių-ir-kubernetes-diegimo-reikalavimai)

## 8.13. Branch-based diegimo modelis {#813-branch-based-diegimo-modelis}

Branch-based modelis tinka komandai, kuri dažnai leidžia patikrintus pakeitimus į dvi nuolatines aplinkas. Šiame modelyje branch'as parenka tikslinę aplinką, tačiau pats branch'o pavadinimas nepakeičia commit ir image atsekamumo.

PRIVALOMA:

<!-- OPS-FLOW-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Jei pasirenkamas branch-based modelis, kiekvienas protected branch turi turėti vienareikšmį aplinkos ryšį (pvz., `stage` → staging, `main` → production), o diegiamas artefaktas turi būti pastatytas iš tikslaus workflow `head_sha` ir praeiti lint, test, security, SBOM/provenance, attestation bei smoke vartus.
<!-- OPS-FLOW-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Automatinė sinchronizacija gali vykti tik viena kryptimi – iš sėkmingai į produkciją įdiegto `main` commit į `stage`; `stage` negali būti automatiškai merdžinamas į `main`, o konfliktas turi sustabdyti sinchronizaciją ir pareikalauti žmogaus sprendimo.
<!-- OPS-FLOW-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   `CI: Lint` turi vykdyti PR ir protected branch push vartus; tik po sėkmingo vartų rezultato ir build-reikšmingų pakeitimų nustatymo gali būti kviečiamas bendras `CI: Build` workflow.
<!-- OPS-FLOW-P04 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Bendras `CI: Build` pipeline turi sekti nuoseklią seką: build → vulnerability scan → SBOM/provenance → attestation → verification → image smoke test → promotion → `CD: Deploy`; kiekvienas etapas turi perduoti tą patį commit SHA ir immutable image digest.
<!-- OPS-FLOW-P05 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Rankiniam jau patikrinto image redeploy turi būti atskiras `Ops: Deploy` workflow, kuris priima tik digest pagrįstas image nuorodas, nekeičia kodo ir nepakeičia lint, build ar saugos vartų.

Tipinė seka:

```text
feature/* → PR → CI: Lint
merge stage → CI: Lint → CI: Build (build/scan/SBOM/attest/verify/smoke/promote) → CD: Deploy staging
merge main  → CI: Lint → CI: Build (build/scan/SBOM/attest/verify/smoke/promote) → CD: Deploy production
successful completed production pipeline → optional main-to-stage sync PR
manual redeploy → Ops: Deploy (existing PHP/Nginx digests only)
```

`login` repozitorijos pavyzdyje `stage` leidžia laikyti dar nepatvirtintas funkcijas, o `main` yra produkcijos šaltinis. Sinchronizacijos PR turi būti kuriamas tik po realaus produkcijos health patikrinimo, ne vien po sėkmingo build job.

Šiame modelyje `CI: Build` yra reusable workflow, kurį po `CI: Lint` vartų
kviečia protected branch pipeline. Sinchronizacija į `stage` paleidžiama tik
po to, kai visas reusable build/deploy job baigėsi sėkmingai, todėl ji negali
remtis dar vykdomu nested deployment job. `Ops: Deploy` skirtas atkūrimui ar
pakartotiniam jau paskelbto digest diegimui; jis neatlieka naujo build.

`CD: Deploy` gali naudoti numatytą single-slot Compose arba pasirenkamą
blue-green variantą. Blue-green keičia tik rollout topologiją: CI image build,
testai, digest handoff ir deployment vartai išlieka tie patys.

## 8.14. Tag-based leidimo modelis {#814-tag-based-leidimo-modelis}

Tag-based modelis tinka, kai produkcija turi būti leidžiama tik aiškiai patvirtintomis, versijuotomis versijomis. Tag yra leidimo įrašas, o ne priežastis perbuild'inti jau patikrintą image.

PRIVALOMA:

<!-- OPS-TAG-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Produkcinis tag turi būti apsaugotas semantinės versijos tag, kuris realiai egzistuoja kaip `refs/tags/<name>` ir nurodo į iš anksto patikrintą commit; branch'as, pavadintas kaip `v1.2.3`, negali būti laikomas release tag.
<!-- OPS-TAG-P02 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Tag-based leidime image turi būti pastatytas vieną kartą iš tikslaus commit, patikrintas pažeidžiamumų skenavimu, SBOM, provenance, attestation ir smoke testais, o į produkciją turi būti promotion'intas tas pats digest be rebuild.
<!-- OPS-TAG-P03 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Release turi registruoti commit SHA, image digest'us ir migracijų bei rollback informaciją; rollback turi remtis nekintamu digest arba versijos tag, o ne perrašomu `latest`.

Tipinė seka:

```text
PR/main → lint/validate/test → candidate build → scan/SBOM/provenance → attest → smoke
protected vX.Y.Z tag → verify tag commit == tested SHA → promote the same digest → production deploy
```

Tag push neturi iš naujo tikrinti ar perbuild'inti nepatikrinto kodo. Jei release ir staging image yra skirtingi, promotion vartai turi saugoti ryšį su konkretaus sėkmingo smoke testo run'u, ne tik su SHA pagrindu pavadintu tag'u.

## 8.15. Bendri pipeline vartai ir modelio pasirinkimas {#815-bendri-pipeline-vartai-ir-modelio-pasirinkimas}

PRIVALOMA:

<!-- OPS-PIPE-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->
*   Nepriklausomai nuo pasirinkto srauto, deploy gali prasidėti tik po sėkmingo testavimo, image vulnerability scan, SBOM ir provenance generavimo, attestation patikros bei smoke testų; deployment sėkmė patvirtinama tik po faktinio tikslinės aplinkos health patikrinimo; kiekvienam job turi būti suteiktos tik būtinos GitHub permissions.

| Kriterijus | Branch-based | Tag-based |
|---|---|---|
| Pagrindinis tikslas | Greitas, dažnas diegimas pagal aplinkos branch'ą | Formalus, versijuotas produkcijos leidimas |
| Produkcijos vartai | `main` merge ir sėkminga produkcijos patikra | Apsaugotas `vX.Y.Z` tag, nurodantis į patikrintą SHA |
| Privalumas | Mažiau rankinių veiksmų, tinka kasdieniam darbui | Aiški istorija, patogus auditas ir rollback |
| Rizika | `main` turi būti nuolat paruoštas produkcijai | Reikia release disciplinos ir tag apsaugos |
| Tinkamas pasirinkimas | Komandai, kuri tą pačią dieną leidžia daug suderinamų pakeitimų | Komandai, kuriai reikia atskiro approval ir leidimo lango |

Modelis turi būti pasirinktas ir aprašytas projekto diegimo dokumentacijoje. Abiem atvejais privalomi nekintami artefaktai, atsekamumas iki commit, rollback planas ir deploy po faktinio health patikrinimo.

> Praktinė kontrolė prieš PR: [DevOps CI/CD modelių priedas](priedai/devops-ci-cd-modeliai.md) · [8.2 CI minimalūs reikalavimai](#82-ci-continuous-integration-minimalūs-reikalavimai) · [8.3 CD](#83-cd-continuous-delivery-deployment) · [8.4 Versijavimas ir žymėjimas](#84-versijavimas-ir-žymėjimas-release-artefaktams)
