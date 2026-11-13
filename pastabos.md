# DevOps skyriaus peržiūros pastabos

Būsena po penktos peržiūros. Ankstesnių keturių peržiūrų radiniai sutvarkyti; čia tik **atviros** pastabos. Kas pakeista – [changelog.md](changelog.md).

Apimtis: [8 skyrius](docs/08-devops-ci-cd.md), [H priedas](docs/priedai/devops-ci-cd-modeliai.md), [pavyzdžiai](docs/priedai/examples/README.md), `OPS-*` taisyklės [rules.en.yaml](standard/rules.en.yaml), [stacks.yaml](standard/stacks.yaml), review metodas, sync ir bundle įrankiai. Pavyzdžiai lyginti su `login` ir `shared-workflows`.

## 0. Penktos peržiūros radiniai

Peržiūrėta jau commit'inta būsena (`3e83a86`). Šį kartą pavyzdžiai ne tik skaityti, bet ir paleisti: abu Dockerfile subuild'inti su bandomąja Laravel formos aplikacija, pilnas smoke vartas praėjo abiem topologijoms, deploy žingsniai paleisti lokaliai (pirmas diegimas, redeploy, blue-green perjungimas ir abu rollback scenarijai). Būtent paleidimas atskleidė du rimtus defektus, kurių skaitant nesimatė.

Kas patvirtinta: visų `OPS-*` porų LT ir EN tekstai sutampa; visi cituojami ID ir anchor'ai egzistuoja; taisyklių skirstymas teisingas šešiems projektų tipams; sync teisingas 16 config derinių; H.1 medis atitinka pavyzdžių kelius; visi fiksuoti action SHA atitinka komentaruose nurodytas versijas.

### 0.1. Rimti

Abu sutvarkyti standarto pavyzdžiuose ir `login` (atkurti ir pataisymai patikrinti lokaliai):

- **P1 – logų eksportas nesiuntė logų.** Socket proxy be `ALLOW_LOGS=1` į logų užklausą atsako `403`. Su tiksliu `login` proxy image ir nustatymais: prieš – `403`, po – `200` ir logo turinys; rašymo užklausos lieka draudžiamos.
- **P2 – PHP negalėjo įrašyti pirmo naudotojo failo.** Nginx servisai įkėlimų volume dabar montuoja su `nocopy`. Per Compose su `login` naudotojais ir kūrimo tvarka: prieš – savininkas `101`, rašymas draudžiamas; po – savininkas PHP naudotojas, PHP rašo, Nginx skaito.

**Socket proxy image.** Kol kas visur naudojamas saugiausias iš išbandytų – `linuxserver/socket-proxy` su `ALLOW_LOGS=1` (0 aukštų ir kritinių Trivy radinių; `tecnativa` v0.4.2 turėjo 3 kritinius ir 26 aukštus). Kadangi proxy bus naudojamas 100+ projektų, paruošta nuosavo image bazė ant oficialaus HAProxy: `/Volumes/CaseSensitive/Projects/docker-socket-proxy` (Dockerfile, `haproxy.cfg`, README su bandymų rezultatais ir darbų sąrašu). Ji neišleista ir niekur nenaudojama – tai atskira užduotis.

**Ką dar reikia padaryti `login` serveriuose** (pataisymas veikia tik naujiems konteineriams ir tuštiems volume):

- patikrinti, ar logai pasiekia Loki: `docker logs <alloy konteineris> 2>&1 | grep -c 403`; po diegimo su pataisymu skaičius turi nebeaugti;
- patikrinti įkėlimų volume savininką: `docker run --rm -v vilnius-login_public_uploads:/x:ro busybox stat -c '%u:%g' /x` – turi būti `1000:1000`. Jei `101:101`, vieną kartą pataisyti ranka (`chown 1000:1000`), nes `nocopy` jau pakeisto savininko neatstato.

### 0.2. Vidutiniai

Visi uždaryti (P3–P10). Du – ne taisymu, o sąmoningu sprendimu: P6 (`docker` šablonai Kubernetes manifestams) paliktas kaip pastaba iki pirmo Kubernetes projekto; P9 (`ci.validate` Composer raktas) – pataisytas tik komentaras, nes rakto perdavimo būdą projektai renkasi patys.

`login` turi tą patį, ką taisė P10: secrets helperis neatmeta viengubos kabutės ir atvirkštinio brūkšnio DB slaptažodžiuose, o MySQL healthcheck naudoja `mysqladmin ping`, kuris grąžina 0 ir su atmestu slaptažodžiu. `login` nekeista.

### 0.3. Smulkūs

Visi uždaryti.

### 0.4. Patikrinti prieš leidimą tikrame GitHub'e

- **Pirmas paleidimas naujoje repozitorijoje.** Branch-based `detect-build-changes` „dar niekada nediegta“ atpažįsta tik iš atsakymo „not found“. GHCR neegzistuojančiam paketui anonimiškai atsako `403`; jei taip atsako ir su `GITHUB_TOKEN`, pirmas build'as niekada neprasidės.
- **Anotuoti release tag'ai.** Nepatikrinta, ar `github.sha` `ci.release` faile yra commit'as, ne tag'o objektas.

## 1. Reikia sprendimo

Šiuo metu nėra. `promote-environment` job'as gavo savo concurrency grupę `promote-<env>` (variantas (a)); `OPS-PIPE-P05` nekeista.

## 2. Sąmoningai palikta

1. **`OPS-REPO-P01` iš dalies kartoja `P02`**; unikali jos dalis (šablonai nemaišomi su aktyviomis darbo eigomis) nėra Compose specifika. `OPS-REPO-P02` nenurodo vietos Terraform failams.
2. **`OPS-COMPOSE-P03` įvardija Nginx ir PHP-FPM**, nors profilis technologiškai neutralus – pavyzdžiai skirti Laravel.
3. **ID nebeatitinka vietos.** `OPS-FLOW-P05`–`P07` galioja abiem Git modeliams ir yra 8.10 bei 8.13.1; `OPS-REPO-P02` yra 8.10. ID nekeisti, kad nelūžtų ankstesnių review nuorodos.
4. **Sudėtinės taisyklės** `OPS-FLOW-P04` (seka ir tag'ų perkėlimo draudimas) ir `OPS-PIPE-P01` (vartai, readiness ir permissions): cituojant ID neaišku, kuri dalis pažeista.
5. **H priedo poskyriai nepernumeruoti**; priedo pradžioje yra lentelė, kuri H dalis kurį 8 skyriaus poskyrį ir stack'ą atitinka.
6. **`OPS-PIPE-P06`** (`workflow_run` patikra) palikta `infra`, ne `flow-tag`: sąlyga yra pačiame tekste.
7. **Kubernetes ir GitOps atidėta iki pirmo Kubernetes projekto.** Standartas jo kol kas neprimeta: GitOps repozitorijos katalogai (`apps/`, `clusters/`, `environments/`) `k8s` stack'o neįjungia; `OPS-PIPE-P02` savo runner'io reikalavimas apribotas Compose diegimu; pavyzdžių 8.14 skyriui nėra. Taip pat `docker` stack'o šablonai neapima Kubernetes manifestų (ir Compose failų), kur image nuoroda naudojama: pakeitus digest'ą į tag'ą manifeste, `OPS-DOCKER-P03` neįsijungia. Compose atveju tai dengia `OPS-COMPOSE-P01` (nekintami image); Kubernetes atveju – kol kas niekas.

Po leidimo:

- **`login` `config.json`** keisti į `flow-branch`, `compose-blue-green` – tik išleidus standarto versiją su naujais stack'ais.
- **`legacyIncludes`** [stacks.yaml](standard/stacks.yaml) pašalinti kitame leidime, kad `infra` reikštų tik bendras taisykles.
- Išorinės nuorodos į senus 8 skyriaus anchor'us nebeveiks – paminėti leidimo aprašyme.

## 3. `login` projektas: kas skiriasi nuo standarto

Šie dalykai standarto pavyzdžiuose sutvarkyti, o `login` – ne. Nė vienas nekeistas be atskiro sprendimo.

| Kas | Dabar `login` | Standarte |
|---|---|---|
| Smoke | Sava realizacija workflow žingsniais (`docker run`); privalomus punktus įrodo, bet Compose topologija CI nepaleidžiama – tai tik rekomendacija | Pavyzdinis skriptas per secrets helperį ir production Compose |
| Rollback žingsnio sąlyga | `failure()` – atšaukus run'ą nesuveikia. Palikta sąmoningai: atšaukimo mechanizmas `login` kol kas nediegiamas | `failure() \|\| cancelled()` |
| Statinė analizė ir frontend lint | Nėra (tik Pint) – neatitinka `OPS-DEVSEC-P02`. Palikta dev komandai pridėti vėliau | PHPStan ir ESLint žingsniai |
| Laiko juosta | Visur `Europe/Vilnius` (`php.ini`, `config/app.php`, Dockerfile `TZ`) – nuoseklu, bet neatitinka `ARCH-API-P13` (UTC serveriuose ir DB). Keisti veikiančioje sistemoje reikštų esamų DB laikų migraciją | `TZ: UTC` visiems konteineriams ir `date.timezone = UTC` |
| Deploy concurrency (`OPS-PIPE-P05`) | Viena grupė `deploy-<env>` yra (`cd.deploy` workflow lygiu) – atitinka. Bet `ci.build` turi `cancel-in-progress: true` šakai `stage`: naujas push atšaukia visą run'ą, taigi ir jau vykstantį staging diegimą, o rollback žingsnis atšaukus nesuveikia | Build grupė neatšaukiama; deploy grupė `cd-deploy-<env>` |
| `ops.housekeeping` image valymas | Paruoštas, užkomentuotas | Įjungiamas parametru |

Kas `login` jau pakeista šios peržiūros metu (necommit'inta): readiness grąžina `release`, deploy jį lygina su `source_sha`; smoke paleidžia tikrą PHP-FPM ir tikrina readiness; queue job'o patikra nebėra tuščia (anksčiau `tinker` išimtis vis tiek baigdavosi kodu 0); `ci.pipeline` nebeatšaukia push run'ų ir build'o poreikį nustato lygindamas su aplinkoje įdiegta versija, o ne su ankstesniu push'u; `docs-check` fiksuotas commit SHA; po perjungimo tikrinamas atviras `/health` per publikuotą HTTPS portą su tikru host vardu.

`shared-workflows` pakeitimai (necommit'inti, šaka `main`): `housekeeping.yml` – pasirenkamas `prune-images`; `sync.main-to-stage.yml` – įvestis `deployment_skipped`. `login` jų naudoti negali, kol jie nėra `main` ir kol `login` nuorodos nerodo į naują commit'ą.

## 4. Smulkios pastabos

Rollback (H.7 „Dar neaprašyta“ – palikta sąmoningai):

- single-slot nepavykęs diegimas neturi automatinio grįžimo;
- neapibrėžta, ką reiškia aplinkos tag'as po rankinio rollback;
- nėra patogaus būdo rasti ankstesnę gerą versiją;
- prieš migraciją nedaroma DB kopija;
- neaprašyta, kaip bandomas rollback.

Pavyzdžiai:

- **Trivy išimtys.** `login` turi `.trivyignore` su galiojimo datomis ir patikros skriptą; standarto pavyzdyje išimčių mechanizmo nėra, nors `OPS-DEVSEC-P04` leidžia „aiškiai priimtą“ riziką.
- **`docker login` per shell** penkiose vietose (`ci.build` abu variantai, `ci.release`), o deploy ir ops workflow'uose – per `docker/login-action`. Suvienodinti.
- **Tag'ų promotion yra atskiras job'as po deploy.** Tarp jų deploy grupė atlaisvinama, todėl įsiterpęs redeploy gali palikti aplinkos tag'ą ne ant įdiegtos versijos.
- **Pakeistas montuojamas konfigūracijos failas be image pakeitimo.** `edge-tls.conf` ar `upstream.*.conf` yra bind mount'ai; jei pasikeičia tik jie, Compose konteinerio neperkuria. TLS sertifikatui ir Alloy tai jau aprašyta ir išspręsta, šiems failams – ne.
- **Helperis** ištrina ankstesnį secrets katalogą iškart po sukeitimo (nepavykus rollout nebėra prie ko grįžti) ir daro `chmod 0700` visam tėviniam katalogui (`/srv/<application>`).
- **`SECRETS_DIR` nepriklauso nuo aplinkos** (`/srv/<application>/secrets`); `login` naudoja `login-<env>`. Aktualu tik jei dvi aplinkos atsidurtų viename hoste.
- **Dev Compose secrets** pagal nutylėjimą `docker/secrets/` – build konteksto viduje; reikia `.gitignore` ir `.dockerignore` įrašų (`OPS-DOCKER-P02`).
- **Branch-based `ci.build` job'as** vadinasi `build-test-promote`, nors nieko nepromote'ina; 20 min timeout dviem build'ams, scan ir smoke gali būti per mažai.
- **`ops.scheduled-scan` nesėkmė** niekam nepriskiriama (nėra issue ar pranešimo).
- **Image valymas** neliečia netag'intų versijų – paliktas antram etapui.
- **Dockerfile**, kaip ir `login`: autoloader optimizuojamas prieš kopijuojant aplikacijos kodą; failai priklauso runtime naudotojui (saugo read-only failų sistema); `# syntax=` nefiksuotas digest'u.
- **Redis slaptažodis** perduodamas `redis-server` argumentu (matomas procesų sąraše konteineryje).
- **Pavyzdinės versijos** (`nginx:1.27`, `redis:7.4`, `mysql:8.4`) iliustracinės ir sensta.

## 5. Kas liko nepatikrinta

- Nė vienas workflow nepaleistas GitHub'e. Patikrinta YAML ir bash sintaksė, o atskiri žingsniai paleisti lokaliai (smoke per Compose, blue-green deploy penkiais scenarijais, helperio apsaugos, image valymo atranka, sinchronizacijos patikra).
- Attestation grandinė (build, release, „staging-verified“) ir `gh attestation verify` – tik iš kodo.
- Image valymas su tikra GHCR ir jo teisės (`packages: write`, admin prieiga prie paketų).
- Secret failų teisės (`0444` kataloge `0700`) Linux hoste: macOS Docker jų neatkartoja; modelis perimtas iš `login`, kur jis veikia.
- Lokalūs bandymai daryti su bandomaisiais PHP ir Nginx image, ne su tikra Laravel aplikacija; pilnas PHP Dockerfile nebuild'intas (subuild'intas tik `php_base` etapas).

## 6. Copilot review (PR, 6 radiniai)

Visi šeši išnagrinėti pagal dabartinį kodą ir uždaryti:

- **C1** (secrets helperio atsarginė kopija) – radinys klaidingas: Copilot nepastebėjo `rmdir` tarp `mktemp -d` ir `mv`. Kodas nekeistas, pridėtas komentaras.
- **C2** (logų eksporto nesėkmė) – logų eksporto žingsnis abiejuose `cd.deploy` variantuose ir `login` turi `continue-on-error` ir klaidos anotaciją; jo nesėkmė diegimo rezultato nekeičia.
- **C3** (planinis skenavimas) – standarte ir `login` praleidžiamas tik neegzistuojantis tag'as, kitos paieškos klaidos sustabdo job'ą.
- **C4** (migracijos release įraše) – įrašas rodo ir pakeistas, ištrintas bei pervadintas migracijas su įspėjimu.
- **C5** (sync ir `docker`) – įspėjimas nenutildytas, bet `docker` be Git modelio ir diegimo būdo paaiškinamas kaip teisingas pasirinkimas nieko nediegiančiai repozitorijai.
- **C6** (3 skyriaus nuorodos) – šalia 8.14.1 pridėta nuoroda į 8.13.
