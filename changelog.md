# Pakeitimų žurnalas (Changelog)

Visi reikšmingi standarto pakeitimai dokumentuojami šiame faile.

Formatas paremtas [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versijavimas – [SemVer](https://semver.org/).

## [Unreleased]

### Pridėta

- Automatiškai tikrinamų reikalavimų žymose nurodomos technologijų sritys (`stacks`) ir tikrinimo priemonė (`enforced-by`) (2.4.1 poskyris).
- Reikalavimų vertimas į anglų kalbą DI agentams (`standard/rules.en.yaml`), neprivalomas angliškas reikalavimų sąrašas svetainėje (`/rules`) ir DI agentų paketas prie kiekvieno leidimo.
- G priedas „Dokumentacijos rengimo metodika“: kaip rengti, tikrinti ir palaikyti sistemų dokumentaciją, kad ja galėtų naudotis DI agentai, vidinės ir išorinės komandos (10 skyrius).
- DI agentų pakete – `dev-standard-docs` įgūdis dokumentacijai kurti, atnaujinti ir tikrinti, su šablonais ir nuorodų tikrintuvu `check-docs.py`; sinchronizavimas diegia visus paketo įgūdžius ir įspėja apie pasenusią `AGENTS.md` skiltį.

### DevOps (8 skyrius, H priedas, pavyzdžiai)

Visa ši dalis yra nauja šiame leidime; žemiau aprašyta galutinė būsena.

**Taisyklės ir struktūra**

- **DevOps taisyklės suskirstytos pagal metodus.** Nauji stack'ai: Git leidimo modelis `flow-branch` arba `flow-tag`; konteinerių image `docker`; diegimo būdas `compose`, `compose-blue-green` arba `k8s`. `infra` lieka bendros taisyklės ir įtraukiamas automatiškai. Projektas renkasi vieną Git modelį ir vieną diegimo būdą (`OPS-PIPE-P07`); nieko nediegianti repozitorija naudoja vien `infra`, o image statantis projektas be aprašyto diegimo būdo – `docker`. `OPS-PIPE-P07` galioja visiems projektams (`stacks=all`), kad ją gautų ir repozitorija, dar nedeklaravusi jokio DevOps stack'o.
- **8 skyrius pernumeruotas pagal metodus.** 8.1–8.9 – bendri reikalavimai, 8.10 – bendri pipeline vartai ir profilio pasirinkimas, 8.11 – Git leidimo modeliai (8.11.1 branch-based, 8.11.2 tag-based), 8.12 – konteinerių image, 8.13 – Docker Compose diegimas (8.13.1 bendri, 8.13.2 blue-green), 8.14 – Kubernetes ir GitOps, 8.15 – neaprašytos technologijos. Pasikeitę numeriai ir anchor'ai: DevSecOps 8.6 → 8.5, stebėsena 8.7 → 8.6, IaC 8.8 → 8.7, leidimai 8.9 → 8.8, FinOps 8.10 → 8.9, Kubernetes 8.5 → 8.14.1, GitOps 8.11 → 8.14.2. Nuorodos iš kitų skyrių atnaujintos; taisyklių ID nepasikeitė.
- **Naujos taisyklės:** `OPS-PIPE-P01`–`P07` (bendri vartai: lint, testai, smoke ir readiness; GitHub-hosted runner'iai build'ui ir GitHub Environment diegimui; trečiųjų šalių action'ai commit SHA, organizacijos nuosavi – `@main`; viena deploy concurrency grupė aplinkai; `workflow_run` sukėlusio run'o patikra; profilio deklaravimas), `OPS-REPO-P01`–`P02` (failų išdėstymas; kita vieta – tik su išimtimi projekto `dev-standard-local.instructions.md`), `OPS-DOCKER-P01`–`P03`, `OPS-COMPOSE-P01`–`P09` (iš jų `P03`–`P05`, `P07`, `P08` – blue-green; `P09` – slaptos reikšmės į konteinerius tik kaip sumontuoti secret failai), `OPS-FLOW-P01`–`P07`, `OPS-TAG-P01`–`P06`, `OPS-DEVSEC-P05`. Repozitorijos nustatymų dalys atskirtos į `human-reviewable` taisykles: platformos secret scanning (`OPS-DEVSEC-P05`), release tag'ų apsauga (`OPS-TAG-P05`), staging praleidimo sąlyga (`OPS-TAG-P06`); `OPS-DEVSEC-P03`, `P04`, `OPS-TAG-P01`, `P04` liko tik tai, kas matoma workflow'e.
- **Sąlygos taisyklių tekstuose.** Branch-based ir tag-based taisyklės prasideda savo modelio sąlyga. Reikalavimai, kurie turi prasmę tik Compose hostui (secrets failų diegimas, savas self-hosted runner'is aplinkai) arba tik konteinerių image (skenavimas, SBOM, attestation, digest'ai), turi sąlygą „Compose diegime“ arba „kai diegiamas konteinerio image“.
- **Patvirtinimai:** privalomas yra PR patvirtinimas prieš sujungimą į apsaugotą šaką (4.3.3); GitHub Environment „Required reviewers“ production aplinkai – rekomendacija.
- **Laiko juosta:** pavyzdžiai visur naudoja UTC (`ARCH-API-P13`).
- **Nebe `ai-reviewable`** (iš PR pakeitimų nepatikrinamos; tekstai nepakito): `process-level` – `OPS-ENV-P01`, `OPS-CI-P05`, `OPS-CD-P01`, `OPS-CD-R02`, `OPS-IAC-P02`, `OPS-IAC-P03`, `OPS-MON-P04`, `OPS-REL-R02`; `human-reviewable` – `OPS-CD-P03`, `OPS-CD-P05`, `OPS-CD-R01`, `OPS-DEVSEC-P01`, `OPS-MON-P01`, `OPS-MON-P03`, `OPS-VER-R02`, `OPS-K8S-P04`, `OPS-REL-P01`–`P04`, `OPS-REL-R01`, `OPS-FIN-P03`.
- `OPS-CD-P01` ir `OPS-IAC-P03` nebekartoja `OPS-ENV-P01` ir `OPS-ENV-P04`: pirmoji dabar nusako CD atsekamumą ir pakartojamumą, antroji – kad infrastruktūros pakeitimai daromi per versijuojamą IaC kodą. ID nepakito.
- 8.1 skyriuje paaiškinta, kas laikoma saugia slaptųjų raktų saugykla: GitHub Environment secrets ir papildomai organizacijos slaptažodžių saugykla (DVLS). Pataisyta `OPS-ENV-P02` nuoroda (į 3.5.3 „Aplinkos“). 2.4.1 skyriaus `stacks` reikšmių sąrašas papildytas DevOps profiliais.

**Įrankiai ir review**

- **Migracija projektams.** `.dev-standard/config.json` vietoj `infra` įrašyti vieną Git modelį ir vieną diegimo būdą, pvz. `flow-branch` ir `compose-blue-green`. Keisti per sync workflow'o `stacks` įvestį (pilnas sąrašas) arba atidaryto sync pull request'o šakoje: kol sync PR atidarytas, pakeitimas numatytoje šakoje ignoruojamas ir sumerge'inus PR grąžinamas atgal. Kol to nepadaryta, šis leidimas projektui su `infra` įdiegia visų profilių taisykles ir sync pull request'e rodo įspėjimą; kitame leidime `infra` reikš tik bendras taisykles. Naujus stack'us pažįsta tik šis ir vėlesni leidimai – juos įrašyti galima tik atnaujinus versiją.
- Sync įspėja, kai `config.json` trūksta Git modelio arba diegimo būdo, kai nurodyti abu Git modeliai ir kai kartu nurodyti Compose ir `k8s`.
- `infra` `applyTo` nebeapima visų `**/*.yml`: apima workflow'us ir action'us, `.dev-standard/config.json`, `docker/`, Dockerfile, Compose failus, Terraform (`*.tf`, `*.tf.json`, `*.tfvars`, `*.hcl`) ir Kubernetes katalogus (`k8s/`, `kubernetes/`, `helm/`, `charts/` bet kuriame gylyje, `Chart.yaml`, `kustomization.yaml|yml`). Kiekvienas profilis turi savo `applyTo`; Git modelio profiliai apima ir visą `docker/`. Šablonai sąmoningai platūs: klaidingai įsijungusi taisyklė kainuoja vieną uždarytą pastabą, o neįsijungusi – praleistą patikrą.
- Review metodas: aktyvius profilius nulemia `.dev-standard/config.json`; taikomos tik pasirinktų profilių taisyklės, o ataskaitoje nurodoma, kurie profiliai vertinti ir kurie ne. Jei `infra` neįdiegtas, DevOps taisyklės netikrinamos. `OPS-REPO-P02` išdėstymo išimtis vietinių taisyklių faile laikoma galiojančia.

**H priedas ir pavyzdžiai**

- Pridėtas H priedas „DevOps CI/CD modeliai“: prielaidos, repozitorijos struktūra, Dockerfile ir Compose kontrolė, health kontraktas, runtime secrets kontraktas, GitHub Actions atsakomybės, smoke vartas, logų eksportas, image retention, runner'iai ir Environment, branch-based ir tag-based srautai, rollback (įgyvendinta ir dar neaprašyta), kontrolinis sąrašas.
- **Pavyzdžių katalogai pagal metodus:** `github-actions/common/`, `branch-based/`, `tag-based/`, `single-slot/`, `blue-green/`; `docker/common/`, `single-slot/`, `blue-green/`. Single-slot ir blue-green variantai turi tuos pačius failų vardus (`cd.deploy.yml`, `ops.start-database.yml`, `docker-compose.production.yml`): projektas ima vieną variantą, todėl `ci.build` ir `ci.release` abiem vienodi. Blue-green projektui lieka pridėti `force_recreate_balancer` įvestį `ops.deploy`.
- **Health:** `/health` yra Nginx liveness, `/health/ready` – readiness per PHP-FPM, pasiekiamas tik privačiu `18080` listeneriu ir grąžinantis `release`; deploy ir smoke lygina jį su `source_sha`. Po perjungimo tikrinamas ir viešas HTTPS kraštas.
- **Kokybės vartas** `ci.validate` (formatavimas, statinė analizė, testai, auditas, Compose patikra, secrets helperio apsaugų testas, secret scan su pinned gitleaks CLI); `CI: Pipeline` turi branch-based ir tag-based variantus.
- **Branch-based:** build'o poreikis nustatomas lyginant commit'ą su aplinkoje įdiegta versija (ne su ankstesniu push'u); praleidžiami tik tikrai į image nepatenkantys failai (`docs/`, Markdown repozitorijos šaknyje, pagalbiniai `.github` failai); `main` į `stage` sinchronizuojamas po sėkmingo production diegimo arba kai nieko build-reikšmingo nepasikeitė.
- **Tag-based:** `ci.build` po `push` į `main` stato candidate ir diegia į staging (candidate build'ai serializuoti viena grupe build job'e); staging įrodymas yra pasirašyta „staging-verified“ attestation, kurią `ci.release` patikrina prieš promotion; nekintamas `sha-<source SHA>` tag'as paskelbiamas tik po sėkmingo staging diegimo; `ci.release` priima tik `vX.Y.Z` ir į GitHub Release įrašo „Deployment record“.
- **Build:** pin'intas Buildx, SBOM ir provenance kaip registry attestation, nekintami tag'ai per `ensure_immutable_tag`; trečiųjų šalių action'ai fiksuoti commit SHA; Composer GitHub App token'ui nurodomas `owner` ir privačių paketų repozitorijos.
- **Smoke vartas** privalomas, o `smoke-published-images.sh` – pavyzdinė realizacija per secrets helperį ir production Compose: readiness su `release`, queue job'as per veikiantį worker'į, neigiama patikra. Topologiją skriptas atpažįsta iš `docker-compose.production.yml`; blue-green atveju paleidžia vieną slotą (`php-<slot>`, `SMOKE_SLOT`).
- **Diegimas:** deploy job'as vykdomas aplinkos self-hosted runner'yje (`runs-on: "${{ inputs.environment }}"`) per GitHub Environment; viena `cd-deploy-<aplinka>` concurrency grupė, kvietėjas `Ops: Deploy` – `ops-deploy-<aplinka>`, aplinkos tag'o perkėlimas – `promote-<aplinka>`; single-slot prieš migraciją pats paleidžia MySQL ir Redis. Blue-green aktyvų slotą nustato iš balancerio konfigūracijos, nepavykus ar atšaukus run'ą atstato ankstesnį slotą, seną šalina tik po sėkmingo perjungimo; balanceris pagal nutylėjimą perkraunamas `nginx -s reload`.
- **`ops.start-database`** (single-slot ir blue-green variantai): pagal jau paskelbtą nekintamą image tag'ą paruošia runtime secrets ir paleidžia tik MySQL; konfigūraciją checkout'ina iš to tag'o revision.
- **Runtime secrets:** helperis išskaido `RUNTIME_ENV` į `application.env` (be slaptų raktų) ir atskirus secret failus (`0444` kataloge `0700`), veikia „fail closed“ ir atmeta viengubą kabutę bei atvirkštinį brūkšnį DB slaptažodžiuose (jie sulaužytų MySQL inicializavimą); MySQL `healthcheck` vykdo tikrą užklausą, nes `mysqladmin ping` pavyksta ir su atmestu slaptažodžiu; PHP servisai montuoja tik `app_key`, `mysql_password` ir `redis_password`.
- **Docker ir Compose:** production PHP Dockerfile pagal etaloninio projekto etapus, `php.prod.ini`, FPM pool ir entrypoint pavyzdžiai; vienas Nginx image visiems vaidmenims (slotų upstream ir single-slot TLS listeneris montuojami); MySQL ir Redis neprivilegijuotu naudotoju; framework cache ir logai `tmpfs`, persistent tik naudotojų duomenys (Nginx įkėlimų volume montuoja su `nocopy`, kad jo savininkas liktų PHP naudotojas); `stop_grace_period` visiems servisams, worker'io heartbeat `healthcheck`; bendri anchor'ai `x-container-environment`, `x-logging` (50 MB × 5) ir `x-log-labels`; Compose projekto vardas fiksuotas faile (`name:`), kintamojo `COMPOSE_PROJECT_NAME` deploy nebereikia.
- **Logų eksportas:** Alloy atskirame `docker-compose.observability.yml` projekte su Docker socket proxy; renka konteinerius pagal `app.logging.enabled` label'į; deploy jį paleidžia po kiekvieno diegimo; socket proxy turi `ALLOW_LOGS=1`, be kurio logų skaitymas baigiasi `403`. H priede nurodyta, kuris proxy image šiuo metu rekomenduojamas (`linuxserver/socket-proxy`) ir kodėl.
- **Housekeeping:** pasirenkamas senų image versijų valymas (`prune-images`, dry run pagal nutylėjimą) su H.4 aprašytomis retention taisyklėmis.

**Jei projektas jau naudojo ankstesnius šios šakos pavyzdžius**

Prieš atnaujinant (kitaip prarandami duomenys arba nepavyksta pirmas diegimas):

- **Naudotojų įkėlimai perkelti į kitą volume.** Anksčiau persistent buvo `application_storage` (visas `storage/`) ir `application_bootstrap_cache`; dabar – tik `application_uploads` (`storage/app/public`). Prieš pirmą diegimą su nauju Compose failu `application_storage` turinį iš `app/public` reikia nukopijuoti į `application_uploads`, kitaip aplikacija startuos su tuščiais įkėlimais. `application_storage`, `application_bootstrap_cache` ir `alloy_data` nebenaudojami.
- **Aplikacija turi turėti readiness maršrutą** `/health/ready`, pasiekiamą privačiu Nginx `18080` listeneriu ir grąžinantį `release`, lygų source SHA. Be jo `cd.deploy` ir smoke vartas nepraeina (anksčiau tikrintas tik `/health`).
- **Worker'iui reikia heartbeat**: `Queue::looping(fn () => touch('/tmp/queue-worker.heartbeat'))`. Be jo worker'io `healthcheck` nepraeina ir `up --wait` baigiasi klaida.
- **Secrets perdavimas pasikeitė.** Nebėra `application_env` secret, montuojamo kaip `/var/www/.env`: PHP image turi turėti naują `entrypoint.sh`, o repozitorijoje – `docker/scripts/prepare-runtime-secrets.sh`. `TLS_CERTIFICATE_B64` ir `TLS_PRIVATE_KEY_B64` dabar privalomi Environment secrets.
- **Compose vykdomas iš checkout'o.** `cd.deploy` Compose failą ir `docker/nginx/conf.d/*` ima iš `source_sha` checkout'o, nebe iš `/srv/<application>/docker-compose.production.yml` – šie failai turi būti repozitorijoje.

Pasikeitę vardai ir sąsajos:

- GitHub Environment kintamasis `PUBLIC_URL` dabar privalomas abiem `cd.deploy` variantams.
- `cd.deploy` nebeturi `secrets:` bloko – kvietėjai turi perduoti `secrets: inherit`. `Ops: Deploy` pavyzdyje aplikacijos aplinkos secret vadinosi `PRODUCTION_ENV`; dabar visur `RUNTIME_ENV`.
- Kokybės vartas iškeltas: `ci.pipeline.yml` kviečia naują `ci.validate.yml`.
- `ops.start-database`: įvestį `database_service` pakeitė privaloma `image_tag`. `ops.deploy`: įvestys `operation` ir `service` (restart) pašalintos – jis atlieka tik redeploy.
- Tag-based: `ci.release` reikalauja „staging-verified“ attestation ir nebeskaito `image-metadata` artefakto. Senuoju `ci.build` pastatyto commit'o išleisti negalima, kol jam nepakartotas `ci.build`.
- Deploy concurrency grupė – `cd-deploy-<aplinka>` (buvo `blue-green-deploy-<aplinka>`); `ops.start-database` naudoja tą pačią grupę (buvo `ops-start-database-<aplinka>`).
- Blue-green failai saugomi standartiniais vardais `cd.deploy.yml` ir `docker-compose.production.yml` (nebe `cd.deploy-blue-green.yml`, `docker-compose.production.blue-green.yml`); `Ops: Deploy` pavyzdžiai yra `branch-based/` ir `tag-based/` kataloguose.
- Deploy job'ai nebenaudoja bendro `deployment` runner'io label'io – tik aplinkos vardą.
- Compose projekto vardas nebeperduodamas kintamuoju `COMPOSE_PROJECT_NAME` (buvo `<application>-<aplinka>`), o fiksuotas Compose faile. **Jau veikiančioje aplinkoje `name:` turi sutapti su dabartiniu projekto vardu** – kitu vardu Compose sukurtų naujus tuščius volume.
- Nauji neprivalomi secrets `ALLOY_ENV` ir `LOKI_PASSWORD`; be jų deploy tik įspėja, kad `OPS-MON-P02` aplinkai neįvykdyta. `ALLOY_IMAGE_REF` ir `ALLOY_CONFIG_DIR` nebenaudojami.

### Pakeista

- Sinchronizavimas sukuria `.github/pull_request_template.md` iš leidimo, jei repozitorija PR šablono neturi. Esamo šablono sinchronizavimas nekeičia. Šablono nuorodos į standartą veda į svetainę, kad veiktų ir kitose repozitorijose.
- PR šablone (E priedas) – instrukcija DI agentams: skiltis „Aprašymas / Description“ rašoma su diagrama arba `diff` eskizu, kitos skiltys pildomos kaip anksčiau. Žmonėms šablonas nesikeičia.
- Sinchronizavimo darbo eigą paleidžiant rankiniu būdu galima nurodyti `version` (`latest` arba konkretų leidimą), kad saugykla atnaujintų standartą iš karto, nelaukiant savaitinio paleidimo.
- D ir F priedų šablonai (ADR, runbook) pateikiami angliškai ir įtraukiami į `dev-standard-docs` įgūdį; F priedo šablono atvaizdavimas pataisytas.
- DI peržiūros metodas (`review-method.md`) atlieka du etapus: pirmiausia ieško defektų, tada tikrina pakeitimą pagal kiekvieną taikomą PRIVALOMA reikalavimą. Reikalavimo ID nurodomas tik tada, kai radinys pažeidžia to reikalavimo tekstą, o santraukoje nurodoma, kiek PRIVALOMA reikalavimų patikrinta.

## [1.0.0] - 2026-04-20

### Pridėta

- Pradinis standarto leidimas (13 skyrių).
- Sąvokos ir terminai (1 skyrius).
- Standarto paskirtis, taikymo sritis ir reikalavimų lygiai (2 skyrius).
- Architektūros ir dizaino principai: frontend, backend/API, duomenys, integracijos, konfigūracija, patikimumas, stebėsena, diagramos, mobilios aplikacijos, atitiktis (3 skyrius).
- Programinio kodo kūrimo ir keitimo gairės: principai, struktūra, versijų valdymas, code review, testai, saugumas, refaktoringas (4 skyrius).
- Versijavimas ir priklausomybių valdymas (5 skyrius).
- Saugumas: principai, autentifikacija, autorizacija, GDPR, secrets, naršyklės saugumas, OWASP Top 10, security testing (6 skyrius).
- Testavimo reikalavimai ir principai (7 skyrius).
- DevOps ir CI/CD reikalavimai (8 skyrius).
- Stebėsena, logai ir eksploatacija (9 skyrius).
- Dokumentacija (10 skyrius).
- Darbo organizavimas ir rolės (11 skyrius).
- Tiekėjų ir pavaldžių įstaigų reikalavimai (12 skyrius).
- Standarto priežiūra ir atnaujinimas (13 skyrius).
