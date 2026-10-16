# DevOps pavyzdžiai

Šiame kataloge pateikiami pritaikomi Docker ir GitHub Actions šablonai pagal [DevOps CI/CD modelių priedą](../devops-ci-cd-modeliai.md).

Šie failai nėra aktyvios darbo eigos ir nėra paruošti aklai kopijuoti į produkciją. Prieš naudojimą:

* pakeiskite `<...>` reikšmes projekto, registry, aplinkos ir infrastruktūros reikšmėmis;
* bazinių image reikšmes papildykite organizacijos patikrintais digest'ais;
* pritaikykite `composer`, `npm`, testų ir health komandų vietas konkrečiam stack'ui;
* secrets perduokite per GitHub Environment, runtime secret saugyklą arba patvirtintą deployment adapterį;
* trečiųjų šalių GitHub Actions nuorodas užfiksuokite į peržiūrėtus commit SHA.

## Docker

* [Production multi-stage Dockerfile](docker/Dockerfile.prod.example)
* [Production Compose su app, worker, Nginx, MySQL ir Redis](docker/docker-compose.production.yml.example)

## GitHub Actions

* [Bendras lint ir validation vartas](github-actions/ci.lint.yml.example)
* [Branch-based build ir deploy](github-actions/branch-based/ci.build.yml.example)
* [Branch-based reusable deploy](github-actions/cd.deploy.yml.example)
* [Tag-based candidate build, scan ir attestation](github-actions/tag-based/ci.build.yml.example)
* [Tag-based tested-image promotion ir release](github-actions/tag-based/ci.release.yml.example)

Branch-based modelis naudoja `stage → staging` ir `main → production`. Tag-based modelis pirmiausia sukuria ir patikrina candidate image, o apsaugotas `vX.Y.Z` tag paaukština tą patį nekintamą digest į leidimą ir produkciją.
