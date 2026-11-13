# DevOps pavyzdžiai

Šiame kataloge pateikiami pritaikomi Docker ir GitHub Actions šablonai pagal [DevOps CI/CD modelių priedą](../devops-ci-cd-modeliai.md).

Šie failai nėra aktyvios darbo eigos ir nėra paruošti aklai kopijuoti į produkciją. Prieš naudojimą:

* pakeiskite `<...>` reikšmes projekto, registry, aplinkos ir infrastruktūros reikšmėmis;
* bazinių image reikšmes papildykite organizacijos patikrintais digest'ais;
* trečiųjų šalių action'ai pavyzdžiuose fiksuoti commit SHA su versijos komentaru – peržiūrėkite juos ir palikite SHA, nekeiskite į tag'us; organizacijos nuosavi workflow'ai (`vilnius-vmsa/*`) kol kas nurodomi `@main`;
* pritaikykite `composer`, `npm`, testų ir health komandų vietas konkrečiam stack'ui;
* secrets perduokite per GitHub Environment, runtime secret saugyklą arba patvirtintą deployment adapterį;

## Kaip išdėstyti pavyzdžiai

Pavyzdžiai sugrupuoti pagal tai, kurį metodą projektas pasirinko (`.dev-standard/config.json` stack'ai). Imkite `common/` ir po vieną katalogą iš kiekvienos poros:

| Katalogas | Kam skirtas | Stack'as |
|---|---|---|
| `github-actions/common/` | Workflow'ai, vienodi visiems metodams: kokybės vartas, housekeeping, skenavimas, sync | `infra` |
| `github-actions/branch-based/` | Git modelis `stage` → staging, `main` → production | `flow-branch` |
| `github-actions/tag-based/` | Git modelis su apsaugotu `vX.Y.Z` tag'u | `flow-tag` |
| `github-actions/single-slot/` | `cd.deploy` ir `ops.start-database` vienam slotui | `compose` |
| `github-actions/blue-green/` | `cd.deploy` ir `ops.start-database` su blue-green slotais | `compose-blue-green` |
| `docker/common/` | Dockerfile, Nginx ir PHP-FPM konfigūracija, skriptai, observability, development Compose | `docker`, `compose` |
| `docker/single-slot/` | Production Compose vienam slotui ir TLS listeneris | `compose` |
| `docker/blue-green/` | Production Compose su slotais ir slotų upstream failai | `compose-blue-green` |
| `instructions/` | Projekto vietinių taisyklių ir išimčių pavyzdys | visi |

Projekte failai dedami į H.1 priede aprašytas vietas (`.github/workflows/`, `docker/`, šaknis), ne į šiuos pakatalogius. `single-slot/` ir `blue-green/` failai turi tuos pačius vardus (`cd.deploy.yml`, `ops.start-database.yml`, `docker-compose.production.yml`, `docker-compose.ci-smoke.override.yml`): projektas ima vieną variantą, todėl `ci.build` ir `ci.release` abiem vienodi, o smoke skriptas topologiją atpažįsta iš Compose failo. Blue-green projektas papildomai tik prideda `force_recreate_balancer` įvestį `ops.deploy` faile.

## Docker

* [.dockerignore](docker/common/dockerignore.example) – kas nepatenka į build kontekstą; būtinas, nes lokalus `docker-compose.yml` secrets pagal nutylėjimą laiko `docker/secrets` kataloge build konteksto viduje.

* [Production multi-stage PHP-FPM Dockerfile](docker/common/Dockerfile.prod.example) jo [entrypoint](docker/common/php-fpm/entrypoint.sh.example), eksportuojantis sumontuotus secret failus, production [php.ini](docker/common/php-fpm/php.prod.ini.example) ir [PHP-FPM pool](docker/common/php-fpm/www.prod.conf.example).
* [Production multi-stage Nginx Dockerfile](docker/common/Dockerfile.nginx.prod.example)
* Nginx konfigūracija: bendras [nginx.conf](docker/common/nginx/nginx.conf.example), [site.conf](docker/common/nginx/site.conf.example) ir numatytasis [upstream.conf](docker/common/nginx/upstream.conf.example) (įkeliami į image), slot'ų [upstream.blue.conf](docker/blue-green/nginx/upstream.blue.conf.example) / [upstream.green.conf](docker/blue-green/nginx/upstream.green.conf.example) ir single-slot [edge-tls.conf](docker/single-slot/nginx/edge-tls.conf.example) (montuojami Compose).
* [Development Compose](docker/common/docker-compose.example.yml) — lokalus darbas, HTTP per hosto `:8080`.
* [Production Compose su PHP-FPM, worker, Nginx, MySQL ir Redis](docker/single-slot/docker-compose.production.example.yml) — serveriui, HTTPS per hosto `:443`.
* [Observability Compose (Alloy per Docker socket proxy)](docker/common/docker-compose.observability.example.yml) — atskiras projektas, bendras single-slot ir blue-green topologijoms; pavyzdinė [config.alloy](docker/common/alloy/config.alloy.example).
* [Optional blue-green production Compose](docker/blue-green/docker-compose.production.example.yml) — serveriui, balancerio HTTPS per hosto `:443`.
* Published-image CI smoke Compose override: [single-slot](docker/single-slot/docker-compose.ci-smoke.override.example.yml) arba [blue-green](docker/blue-green/docker-compose.ci-smoke.override.example.yml) — minimalus override, kurį smoke skriptas uždeda ant production Compose; tik išjungia hosto porto publikavimą (single-slot – Nginx, blue-green – balancerio).
* [Runtime secrets preparation script](docker/common/scripts/prepare-runtime-secrets.sh.example) — rekomenduojamas patogus pavyzdys; jo kelias ir failo vardas nėra privalomi.
* [Published-image smoke test script](docker/common/scripts/smoke-published-images.sh.example) — pavyzdinė privalomo smoke varto realizacija (projektas gali įgyvendinti savaip, jei įrodo tuos pačius punktus): paleidžia image'us per secrets helperį ir production Compose (`SMOKE_TOPOLOGY`: `single-slot` arba `blue-green`), tikrina readiness, worker'į ir priklausomybes; workflow žingsnis lieka trumpas.

## GitHub Actions

* [CI Validate – bendras kokybės vartas](github-actions/common/ci.validate.yml.example): formatavimas, statinė analizė, testai, priklausomybių auditas, Compose patikra, secrets helperio apsaugų testas ir secret scan.
* [Branch-based CI Pipeline](github-actions/branch-based/ci.pipeline.yml.example) – vartas, build-reikšmingų pakeitimų nustatymas, build/deploy ir `main → stage` sinchronizacija.
* [Tag-based CI Pipeline](github-actions/tag-based/ci.pipeline.yml.example) – tik vartas; candidate build paleidžiamas per `workflow_run`.
* [Dokumentacijos patikra](github-actions/common/docs-check.yml.example)
* [Dev standard sinchronizacija](github-actions/common/dev-standard-sync.yml.example)
* [Vietinės taisyklės ir išdėstymo išimtis](instructions/dev-standard-local.instructions.md.example) – `OPS-REPO-P02` išimties pavyzdys projektui, kurio Docker ir diegimo failai laikomi ne sutartose vietose
* [Branch-based build ir deploy](github-actions/branch-based/ci.build.yml.example)
* [Single-slot reusable deploy](github-actions/single-slot/cd.deploy.yml.example) – naudojamas abiejų Git modelių
* [Optional blue-green reusable deploy](github-actions/blue-green/cd.deploy.yml.example)
* [Branch-based operator redeploy](github-actions/branch-based/ops.deploy.yml.example)
* [Tag-based production release-tag redeploy](github-actions/tag-based/ops.deploy.yml.example)
* [Scheduled image, dependency ir secret scan](github-actions/common/ops.scheduled-scan.yml.example)
* Operator-only database start: [single-slot](github-actions/single-slot/ops.start-database.yml.example) arba [blue-green](github-actions/blue-green/ops.start-database.yml.example)
* [Scheduled housekeeping](github-actions/common/ops.housekeeping.yml.example) – workflow run'ų retention ir pasirenkamas senų image versijų valymas (`prune_images`, pagal nutylėjimą dry run).
* [Tag-based candidate build, staging deploy, scan ir attestation](github-actions/tag-based/ci.build.yml.example)
* [Tag-based tested-image promotion ir release](github-actions/tag-based/ci.release.yml.example)

Smoke skriptas image'us paleidžia per tą patį `prepare-runtime-secrets.sh` helperį ir
`docker-compose.production.yml`, kuriuos naudoja `CD: Deploy`, su vienkartinėmis
reikšmėmis laikiname `SECRETS_DIR` ir trumpalaikiu self-signed TLS sertifikatu.
`docker-compose.ci-smoke.override.yml` tik išjungia hosto `443` porto
publikavimą. Production `SECRETS_DIR` ar tikrų secrets naudoti draudžiama.

Image naming taisyklė: vienas deployuojamas servisas turi vieną kanoninį
registry image pavadinimą. Staging ir production atskiriami tag'ais ir OCI
label'iais, o deploy naudojamas konkretus digest; aplinkai skirtų repository
pavadinimų, tokių kaip `app-php-production`, kurti nereikia.

Branch-based modelis naudoja `stage → staging` ir `main → production`. Tag-based modelis po `main` push sukuria, patikrina ir įdiegia candidate image į staging, o apsaugotas `vX.Y.Z` tag paaukština tą patį nekintamą digest į leidimą ir produkciją.

Branch-based modelyje `CI: Pipeline` po protected branch push kviečia bendrą
`CI: Build`, o `CD: Deploy` lieka reusable deployment workflow. Jei reikia
pakartoti jau paskelbto image diegimą, `Ops: Deploy` pagal environment tag'ą
arba pasirenkamą `sha-<40>` tag'ą išsprendžia PHP-FPM ir Nginx digest'us,
patikrina revision bei attestation ir tik tada kviečia `CD: Deploy`; production
atveju explicit `sha-<40>` tag'as papildomai turi būti iš `main` pasiekiamas
source SHA, patikrintas per attestation source-ref ir repository ancestry. Jo
negalima naudoti naujam build arba saugos vartų apeigai. Prieš deployment
`CI: Build` skelbia tik immutable `sha-<40>` source tag'ą; `staging`,
`production` ir `latest` tag'ai perkeliami tik po sėkmingo `CD: Deploy` bei
health patikros. Šis `Ops: Deploy` pavyzdys skirtas branch-based modeliui ir
naudoja `ci.build.yml` kaip release attestation workflow.

Tag-based modeliui naudokite atskirą [tag-based `Ops: Deploy` pavyzdį](github-actions/tag-based/ops.deploy.yml.example).
Jis priima tik nepakeičiamą `vX.Y.Z` release tag'ą, patikrina, kad tag'o commit
sutampa su abiejų image source revision ir pasiekiamas iš `main`, o `CD: Deploy`
kviečia su `ci.release.yml` release attestation workflow. Tag-based pavyzdys
nesprendžia `staging` aplinkos per `production` release tag'ą; staging candidate
redeploy turi būti atskiras projekto workflow arba naudojamas digest pagrįstas
operatoriaus kelias.
Branch-based modelyje `CI: Pipeline` prieš build'ą palygina commit'ą su aplinkoje įdiegta versija
(image su aplinkos tag'u `revision` label'is), o ne su ankstesniu push'u. Jei nuo
įdiegtos versijos pasikeitė tik dokumentacija ar kiti ne-build failai, srautas
sustoja po validation vartų ir naujų image nekuria. Jei ankstesnis kodo push'as
nebuvo įdiegtas (build ar deploy nepavyko arba run'as išstumtas iš eilės), jis
lieka skirtumo dalimi ir subuild'inamas su kitu push'u, net jei tas keičia tik
dokumentaciją.
`Ops: Deploy` pavyzdys skirtas tik jau patikrinto image redeploy'ui. Runtime
service recreation, host-managed TLS pakeitimai ir secret rotation, jei jų
reikia, turi būti aprašyti atskira projekto arba platformos procedūra.
Secret paruošimo ir rotacijos procedūra turi gauti `RUNTIME_ENV`,
`DEPLOY_ENVIRONMENT`, image digest'us ir TLS Base64 reikšmes, validuoti aplinką
bei TLS porą, atomiškai paruošti `application.env`, Compose secret failus ir
`compose.env`, ir neprintinti secret reikšmių. Šiame priede pateiktas skriptas
`docker/common/scripts/prepare-runtime-secrets.sh.example` yra rekomenduojamas šaltinis,
kurį projekte galima nukopijuoti kaip `docker/scripts/prepare-runtime-secrets.sh`; kelias
ir failo vardas nėra privalomi. Galima naudoti kitą įrankį ar secret managerį.
Single-slot ir blue-green `CD: Deploy` workflow perduoda sugeneruotą
`SECRETS_DIR/compose.env` Compose interpolacijai; pats `RUNTIME_ENV` turinys
Compose'ui per `--env-file` neperduodamas. Single-slot `CD: Deploy` job'as į helperį
perduoda `RUNTIME_ENV`, `DEPLOY_ENVIRONMENT`, TLS reikšmes, image digest'us,
ir `SECRETS_DIR`; helperis sugeneruoja `application.env`,
Compose secret failus ir `compose.env`. Į `compose.env` įrašomi image nuorodos
(single-slot – `PHP_IMAGE_REF`, `NGINX_IMAGE_REF`; blue-green – slotų nuorodos ir
balancerio reikšmės), `SECRETS_DIR`, `DB_DATABASE` ir
`DB_USERNAME`. Abu deploy variantai prieš `pull` patikrina, kad šios reikšmės
sugeneruotos, ir validuoja pilną Compose konfigūraciją.
`CD: Deploy` ir blue-green workflow checkout'ina iš `source_sha` konkrečiam
deploy reikalingą production Compose failą bei secret helperį ir vykdo Compose
iš to checkout workspace. Single-slot `CD: Deploy` prieš migraciją pats paleidžia
MySQL ir Redis, todėl pirmam diegimui atskiro paruošimo nereikia.
`ops.start-database` yra savarankiškas operatoriaus kelias: pagal nekintamą
image tag'ą jis tuo pačiu helperiu paruošia runtime secrets ir `compose.env`,
tada paleidžia tik `mysql`. Jis nepriklauso aplikacijos build/deploy vartams ir
nevykdo migracijų. Yra du variantai, nes helperiui ir checkout'ui reikia tos pačios
topologijos kaip `cd.deploy`: blue-green variantas perduoda slotų image nuorodas,
balancerio reikšmes ir checkout'ina slotų upstream failus. Abu checkout'ina tą
revision, iš kurios pastatytas nurodytas image tag'as. Tag'as turi jau egzistuoti
registry; tag-based modelyje `sha-` tag'as atsiranda tik po pirmo sėkmingo staging
diegimo, tad DB paleisti prieš patį pirmą diegimą ten šiuo workflow negalima.

Dokumentacijos patikra, standardo sinchronizacija, scheduled vulnerability ir
secret scan bei artifact housekeeping yra atskiri pagalbiniai workflow. Jie
negali tapti production deploy vartų pakaitalu.

Development Compose yra skirtas tik lokaliam darbui: jis publikuoja HTTP per
hosto `:8080` ir neturi būti naudojamas staging ar production hoste.
Production Compose failai yra atskiri serverio pavyzdžiai: jie terminina TLS
balanceryje arba production Nginx procese, publikuoja hosto `443` į konteinerio
TLS portą ir reikalauja `tls_certificate` bei `tls_private_key` secrets.
Single-slot atveju tai yra `host 443 -> Nginx 8443`; blue-green atveju tai yra
`host 443 -> balancer 8443`, o balanceris vidiniu tinklu pasiekia Nginx slotą
per HTTP `8080`. Blue-green `8080` nėra viešas portas. Production Nginx image
yra vienodas visiems vaidmenims (`8080` aplikacija, privatus `18080`), o
vaidmeniui būdingus failus montuoja Compose: blue-green slotai gauna savo
`upstream.blue.conf` / `upstream.green.conf`, single-slot – `edge-tls.conf` su
`8443` TLS listeneriu. Local development lieka
atskiru HTTP-only hosto `:8080` keliu, o CI smoke paleidžia production Compose
be publikuotų portų. `127.0.0.1:<portas>` turi
likti tik host-local administravimo, metrics ar debug endpointams, pavyzdžiui,
`127.0.0.1:18080`, o ne pagrindiniam aplikacijos ingress.
Health kontraktas visuose pavyzdžiuose vienodas: `/health` yra Nginx liveness
ir naudojamas Compose `healthcheck` bei viešo HTTPS krašto patikrai, o
`/health/ready` pasiekiamas tik per privatų Nginx `18080` listenerį, eina per
PHP-FPM į aplikaciją, tikrina DB bei Redis ir grąžina
`{"status":"ok","checks":{...},"release":"<source SHA>"}`. Smoke skriptas,
`CD: Deploy` ir blue-green slot'o perjungimas remiasi tik readiness ir lygina
`release` su `source_sha`. Single-slot `CD: Deploy` readiness kviečia Nginx
konteinerio viduje, o viešą kraštą atskirai tikrina per GitHub Environment
kintamąjį `PUBLIC_URL`.
Blue-green deploy sugeneruoja balancerio TLS konfigūraciją, prieš perjungimą
tikrina naujo slot'o `http://127.0.0.1:18080/health/ready`, o po perjungimo –
tą patį kelią per balancerio `18080` monitoring listenerį. Jis, kaip ir single-slot `cd.deploy`, privalo patikrinti build
attestation bei konkretaus `release_workflow` release attestation abiem
šio repozitorijos sukurtiems image digest'ams prieš rollout. Išorinis
infrastruktūros balancerio image nėra šio build'o artefaktas: jis turi būti
atskirai peržiūrėtas ir nurodytas pilnu `repository@sha256:<digest>` reference'u;
jam netaikomas aplikacijos source-SHA ar release-attestation predicate.

Single-slot production Compose ir `cd.deploy.yml.example` yra numatytasis
variantas. Blue-green pavyzdžiai pasirenkami tik tada, kai reikia dviejų
keičiamų aplikacijos, worker ir Nginx slotų bei balancerio perjungimo; jie
nekeičia saugumo hardening, CPU/memory limitų, bendrų lint, build, scan,
attestation, smoke ir image digest vartų.
