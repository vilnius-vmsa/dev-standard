# DevOps pavyzdžiai

Šiame kataloge pateikiami pritaikomi Docker ir GitHub Actions šablonai pagal [DevOps CI/CD modelių priedą](../devops-ci-cd-modeliai.md).

Šie failai nėra aktyvios darbo eigos ir nėra paruošti aklai kopijuoti į produkciją. Prieš naudojimą:

* pakeiskite `<...>` reikšmes projekto, registry, aplinkos ir infrastruktūros reikšmėmis;
* bazinių image reikšmes papildykite organizacijos patikrintais digest'ais;
* pritaikykite `composer`, `npm`, testų ir health komandų vietas konkrečiam stack'ui;
* secrets perduokite per GitHub Environment, runtime secret saugyklą arba patvirtintą deployment adapterį;

## Docker

* [Production multi-stage PHP-FPM Dockerfile](docker/Dockerfile.prod.example)
* [Production multi-stage Nginx Dockerfile](docker/Dockerfile.nginx.prod.example)
* [Development Compose](docker/docker-compose.example.yml) — lokalus darbas, HTTP per `127.0.0.1:8080`.
* [Production Compose su PHP-FPM, worker, Nginx, MySQL, Redis ir Alloy](docker/docker-compose.production.example.yml) — serveriui, HTTPS per hosto `:443`.
* [Optional blue-green production Compose](docker/docker-compose.production.blue-green.example.yml) — serveriui, balancerio HTTPS per hosto `:443`.
* [Published-image CI smoke Compose override](docker/docker-compose.ci-smoke.override.example.yml)

## GitHub Actions

* [CI Pipeline lint ir validation vartas](github-actions/ci.pipeline.yml.example)
* [Dokumentacijos patikra](github-actions/docs-check.yml.example)
* [Dev standard sinchronizacija](github-actions/dev-standard-sync.yml.example)
* [Branch-based build ir deploy](github-actions/branch-based/ci.build.yml.example)
* [Branch-based reusable deploy](github-actions/cd.deploy.yml.example)
* [Optional blue-green reusable deploy](github-actions/cd.deploy-blue-green.yml.example)
* [Operator-only promoted-tag redeploy or allowlisted service restart](github-actions/ops.deploy.yml.example)
* [Scheduled image, dependency ir secret scan](github-actions/ops.scheduled-scan.yml.example)
* [Operator-only database start](github-actions/ops.start-database.yml.example)
* [Scheduled artifact housekeeping](github-actions/ops.housekeeping.yml.example)
* [Tag-based candidate build, scan ir attestation](github-actions/tag-based/ci.build.yml.example)
* [Tag-based tested-image promotion ir release](github-actions/tag-based/ci.release.yml.example)

Image naming taisyklė: vienas deployuojamas servisas turi vieną kanoninį
registry image pavadinimą. Staging ir production atskiriami tag'ais ir OCI
label'iais, o deploy naudojamas konkretus digest; aplinkai skirtų repository
pavadinimų, tokių kaip `app-php-production`, kurti nereikia.

Branch-based modelis naudoja `stage → staging` ir `main → production`. Tag-based modelis pirmiausia sukuria ir patikrina candidate image, o apsaugotas `vX.Y.Z` tag paaukština tą patį nekintamą digest į leidimą ir produkciją.

Branch-based modelyje `CI: Pipeline` po protected branch push kviečia bendrą
`CI: Build`, o `CD: Deploy` lieka reusable deployment workflow. Jei reikia
pakartoti jau paskelbto image diegimą, `Ops: Deploy` pagal environment tag'ą
arba pasirenkamą `sha-<40>` tag'ą išsprendžia PHP-FPM ir Nginx digest'us,
patikrina revision bei attestation ir tik tada kviečia `CD: Deploy`; jo
negalima naudoti naujam build arba saugos vartų apeigai.
`CI: Pipeline` prieš build'ą patikrina push range: vien dokumentacijos ar kitų
ne-build failų pakeitimai sustabdo srautą po validation vartų ir nekuria naujų
image.
Jei reikia atnaujinti host-managed TLS ar atlikti kitą leidžiamą runtime
serviso atkūrimą, naudokite `Ops: Deploy` workflow restart operaciją su aiškiu
serviso allowlist'u; ji naudoja hoste esantį image, vykdo `--pull never` ir
tikrina atkurtos paslaugos būseną. Restart prieš Compose validaciją nuskaito
visų blue-green servisų esamus digest image reference'us iš hosto konteinerių
label'ių ir perduoda juos Compose nekeičiant; todėl restart nereikalauja
perrašomo tag'o ar naujo image pasirinkimo.
Secret paruošimo ir rotacijos skriptas turi būti projekto
`scripts/prepare-secrets.sh`: jis validuoja aplikacijos aplinką ir TLS porą,
išsaugo aktyvų slot'ą, failus įdiegia atomiškai ir neprintina secret reikšmių.
`ops.start-database` lieka atskira vienkartine infrastruktūros operacija ir
nepriklauso aplikacijos build/deploy vartams.

Dokumentacijos patikra, standardo sinchronizacija, scheduled vulnerability ir
secret scan bei artifact housekeeping yra atskiri pagalbiniai workflow. Jie
negali tapti production deploy vartų pakaitalu; `ops.start-database` taip pat
tik paleidžia ir patikrina leistiną duomenų bazės servisą.

Development Compose yra skirtas tik lokaliam darbui: jis publikuoja HTTP per
`127.0.0.1:8080` ir neturi būti naudojamas staging ar production hoste.
Production Compose failai yra atskiri serverio pavyzdžiai: jie terminina TLS
balanceryje arba production Nginx procese, publikuoja hosto `443` į konteinerio
TLS portą ir reikalauja `tls_certificate` bei `tls_private_key` secrets.
Blue-green deploy sugeneruoja balancerio TLS konfigūraciją ir tikrina
`https://127.0.0.1:8443/health` konteineryje bei viešą HTTPS endpointą per hosto
`:443`. Jis, kaip ir single-slot `cd.deploy`, privalo patikrinti build
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
