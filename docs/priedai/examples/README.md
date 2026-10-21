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
* [Development Compose](docker/docker-compose.example.yml)
* [Production Compose su PHP-FPM, worker, Nginx, MySQL, Redis ir Alloy](docker/docker-compose.production.example.yml)
* [Optional blue-green production Compose](docker/docker-compose.production.blue-green.example.yml)
* [Published-image CI smoke Compose override](docker/docker-compose.ci-smoke.override.example.yml)

## GitHub Actions

* [Bendras lint ir validation vartas](github-actions/ci.lint.yml.example)
* [Branch-based build ir deploy](github-actions/branch-based/ci.build.yml.example)
* [Branch-based reusable deploy](github-actions/cd.deploy.yml.example)
* [Optional blue-green reusable deploy](github-actions/cd.deploy-blue-green.yml.example)
* [Operator-only immutable digest redeploy](github-actions/ops.deploy.yml.example)
* [Operator-only allowlisted service restart](github-actions/ops.restart.yml.example)
* [Tag-based candidate build, scan ir attestation](github-actions/tag-based/ci.build.yml.example)
* [Tag-based tested-image promotion ir release](github-actions/tag-based/ci.release.yml.example)

Image naming taisyklė: vienas deployuojamas servisas turi vieną kanoninį
registry image pavadinimą. Staging ir production atskiriami tag'ais ir OCI
label'iais, o deploy naudojamas konkretus digest; aplinkai skirtų repository
pavadinimų, tokių kaip `app-php-production`, kurti nereikia.

Branch-based modelis naudoja `stage → staging` ir `main → production`. Tag-based modelis pirmiausia sukuria ir patikrina candidate image, o apsaugotas `vX.Y.Z` tag paaukština tą patį nekintamą digest į leidimą ir produkciją.

Branch-based modelyje `CI: Lint` po protected branch push kviečia bendrą
`CI: Build`, o `CD: Deploy` lieka reusable deployment workflow. Jei reikia
pakartoti jau paskelbto image diegimą, naudokite atskirą `Ops: Deploy` workflow
su PHP-FPM ir Nginx `@sha256:...` nuorodomis; jo negalima naudoti naujam build
arba saugos vartų apeigai.
Jei reikia atnaujinti host-managed TLS ar atlikti kitą leidžiamą runtime
serviso atkūrimą, naudokite atskirą `Ops: Restart` workflow su aiškiu serviso
allowlist'u; jis naudoja hoste esantį image, vykdo `--pull never` ir tikrina
atkurtos paslaugos būseną.
Secret paruošimo ir rotacijos skriptas turi būti projekto
`scripts/prepare-secrets.sh`: jis validuoja aplikacijos aplinką ir TLS porą,
išsaugo aktyvų slot'ą, failus įdiegia atomiškai ir neprintina secret reikšmių.
`ops.start-database` lieka atskira vienkartine infrastruktūros operacija ir
nepriklauso aplikacijos build/deploy vartams.

Single-slot production Compose ir `cd.deploy.yml.example` yra numatytasis
variantas. Blue-green pavyzdžiai pasirenkami tik tada, kai reikia dviejų
keičiamų aplikacijos, worker ir Nginx slotų bei balancerio perjungimo; jie
nekeičia bendrų lint, build, scan, attestation, smoke ir image digest vartų.
