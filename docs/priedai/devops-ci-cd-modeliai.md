# DevOps CI/CD modeliai

Šis priedas yra praktinis [8 skyriaus](../08-devops-ci-cd.md) pritaikymo pavyzdys aplikacijoms, kurios leidžiamos kaip Docker image. Jis aprašo du suderinamus leidimo modelius, bet nenustato konkrečių registry, cloud ar runner tiekėjų.

## D.1. Rekomenduojama repozitorijos struktūra

Katalogų pavadinimai gali skirtis, tačiau atsakomybės turi likti atskirtos:

```text
application/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.lint.yml
│       ├── ci.build.yml
│       └── cd.deploy.yml
├── docker/
│   ├── <service>/
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   └── conf.d/
│   ├── alloy/
│   │   └── config.alloy
│   └── templates/
├── docker-compose.yml
├── docker-compose.production.yml
├── docker-compose.ci-test-image.override.yml
├── docs/priedai/examples/       # reference files; not active workflows
├── .dockerignore
└── application source, lock files and tests
```

Aktyvios darbo eigos laikomos `.github/workflows/`, o pavyzdžiai ir reusable workflow šablonai – atskiroje dokumentuotoje vietoje. Produkcinė Compose konfigūracija turi būti vykdoma iš konkretaus image ref, o ne iš lokalaus checkout'o.

Pritaikomi Dockerfile, Compose ir GitHub Actions failai pateikti [DevOps pavyzdžių kataloge](examples/README.md). Jie laikomi dokumentacijos dalimi, todėl jų kopijavimas į `.github/workflows/` turi būti sąmoningas veiksmas, atlikus projekto, registry, secrets ir deployment adapterio pritaikymą.

## D.2. Dockerfile kontrolė

Produkcinis Dockerfile turi būti multi-stage:

1. `base` etape nustatoma fiksuota OS/runtime versija ir ne-root vartotojas.
2. `dependencies` etape naudojami Composer/npm ar kito ekosistemos lock failai.
3. `build` etape kompiliuojami asset'ai ir aplikacija; kešai naudojami tik per BuildKit cache mount.
4. `runtime` etape kopijuojami tik vykdymui reikalingi failai, nustatomi healthcheck ir exec formos `CMD`.

Bazinis image turi būti nurodytas kartu su versija ir digest. `latest` ir plaukiojantys package manager reikalavimai produkciniame build'e draudžiami. Composer auth, npm tokenai, sertifikatai ir kiti secrets perduodami per BuildKit secret mount arba runtime secret saugyklą; jų negalima palikti `ARG`, `ENV`, source checkout'e ar image layer'iuose.

Galutiniame image neturi būti kompiliatorių, Git, package manager cache'ų ar testų įrankių, nebent jie yra aiškiai reikalingi runtime. Failų kopijavimas turi naudoti tinkamą owner'į, o procesai turi veikti ne-root teisėmis.

## D.3. Compose kontrolė

Naudokite atskirus Compose vaidmenis:

| Failas / override | Paskirtis | Leidžiama build'inti iš checkout'o | Būtinos kontrolės |
|---|---|---:|---|
| Development | Kasdienis lokalus darbas | Taip | bind mount'ai, dokumentuoti portai, vietiniai secrets |
| Production | Leidimas serveryje | Ne | immutable image, runtime secrets, persistent data, healthcheck |
| CI image test | Vienkartinis image patikrinimas | Ne | disposable MySQL/Redis, izoliuotas tinklas, automatinis cleanup |

Bendri servisų nustatymai aprašomi YAML anchor'uose. Blue-green servisai paveldi bendrą konfigūraciją ir keičia tik slot'o image, pavadinimą bei priklausomybes; viešą portą valdo vienas balancer. Stateful duomenys (duomenų bazė, uploads ir reikalingi runtime failai) turi turėti aiškią persistent saugyklą.

Servisai vienas kitą pasiekia Compose service DNS vardu, o ne `127.0.0.1` ar `localhost`. `depends_on` nepakeičia healthcheck: prieš migration, queue worker ar aplikacijos startą turi būti patikrinta faktinė priklausomybės parengtis. Logai rašomi į stdout/stderr ir surenkami centralizuotai; secrets nemontuojami į logus ar debug output.

## D.4. GitHub Actions atsakomybės

Darbo eigų failai gali būti sujungti ar išskaidyti pagal projekto dydį, tačiau vartai turi išlikti aiškūs:

| Darbo eiga / job grupė | Trigger'is | Atsakomybė | Išvestis |
|---|---|---|---|
| `ci.lint` | PR ir protected branch push | Composer/npm validacija, formatavimas, unit/contract testai, Compose lint ir secret scan | privalomas kokybės vartas |
| `ci.build` | sėkmingas `ci.lint` po merge | checkout pagal exact SHA, multi-stage build, registry push, image scan, SBOM, provenance, attestation, image verification ir disposable smoke test | patikrintas immutable candidate digest |
| pasirenkamas `ci.test-image` | po build/attestation, didesniuose projektuose | Tas pats image-test etapas kaip atskira reusable workflow, kai jo nereikia laikyti pagrindiniame build workflow | patikrintas digest |
| `cd.deploy` | po promotion ir smoke | runtime secrets, image digest deploy, migracijos politika ir health/readiness patikra | faktinio deploy rezultatas |
| `ops` (jei taikoma) | atskiras operatoriaus veiksmas | vienkartinės DB ar atkūrimo operacijos su aiškiu target environment | audituojamas operatoriaus rezultatas |

`ci.build` (arba pasirenkamas `ci.test-image`) turi perduoti tarp job'ų konkretų source SHA bei digest, o ne per naujo spręsti branch'o ar perrašomo tag reikšmę. `cd.deploy` negali būti laikomas sėkmingu vien todėl, kad paruošė secrets ar Compose failą: sėkmė reiškia faktinį paleidimą ir health patikrą. Minimalūs pavyzdžiai pateikti [bendram lint vartui](examples/github-actions/ci.lint.yml.example), [branch-based build](examples/github-actions/branch-based/ci.build.yml.example), [reusable deploy](examples/github-actions/cd.deploy.yml.example) ir [tag-based release](examples/github-actions/tag-based/ci.release.yml.example).

GitHub Actions trečiųjų šalių action'ai pin'inami į commit SHA, permissions nurodomos workflow arba job lygiu, o `pull_request` iš fork'o negali gauti production secrets ar privileged build tokenų. Concurrency grupės neleidžia dviem leidimams vienu metu perrašyti tos pačios aplinkos.

## D.5. Branch-based srauto pavyzdys

Šis modelis tinka, kai `stage` yra nuolatinė staging aplinka, `main` – produkcijos šaltinis, o komanda tą pačią dieną leidžia daug pakeitimų. Pritaikomas workflow pavyzdys: [branch-based/ci.build.yml.example](examples/github-actions/branch-based/ci.build.yml.example).

```text
feature/*
   │ PR
   ▼
stage ── CI lint/validate/test ── build/scan/SBOM/attest/smoke ── deploy staging
   │
   │ patvirtintas PR
   ▼
main  ── CI lint/validate/test ── build/scan/SBOM/attest/smoke ── deploy production
                                                                  │
                                                                  ▼
                                                        optional main → stage sync PR
```

Svarbios sąlygos:

- workflow naudoja įvykio `head_sha`, o ne vėliau iš naujo išsprendžiamą branch'o HEAD;
- staging ar production deploy vyksta tik po visų saugumo ir smoke vartų;
- `main` → `stage` sinchronizacija kuriama tik po faktinio production health patikrinimo;
- `stage` → `main` automatinė sinchronizacija draudžiama, nes staging gali turėti nebaigtų funkcijų;
- konfliktas sinchronizacijos PR sustabdo automatizavimą ir paliekamas žmogui išspręsti;
- kiekvienas aplinkos deploy turi būti rollback'inamas pagal konkretų image digest.

## D.6. Tag-based srauto pavyzdys

Šis modelis tinka, kai production leidimai turi būti aiškiai versijuoti ir patvirtinti. Pritaikomas workflow pavyzdys: [tag-based/ci.release.yml.example](examples/github-actions/tag-based/ci.release.yml.example).

```text
PR/main ── lint/validate/test ── candidate build ── scan/SBOM/provenance
                                      │
                                      ▼
                                  attestation ── smoke test
                                      │
                         protected vX.Y.Z tag
                                      │
                                      ▼
                 verify tag → tested SHA → promote same digest → deploy production
```

Tag workflow turi:

1. išspręsti tag į konkretų commit ir patikrinti, kad ref yra tikras `refs/tags/...`, o ne taip pavadintas branch'as;
2. susieti tag su konkretaus sėkmingo candidate build ir smoke test run'o digest'ais;
3. promotion metu naudoti tą patį digest, o ne rebuild'inti source iš tag'o;
4. įrašyti versiją, commit SHA, image digest'us, migracijas ir rollback veiksmus į release notes;
5. neleisti perrašyti jau paskelbto version tag ir naudoti `latest` kaip vienintelio rollback identifikatoriaus.

Tag yra leidimo ir rollback nuoroda, ne papildomas testavimo etapas. Jei candidate build nepraėjo smoke testų, jo digest negali būti paaukštintas vien todėl, kad vėliau atsirado tag su tuo pačiu SHA.

## D.7. Bendras CI/CD kontrolinis sąrašas

Prieš sujungiant DevOps pakeitimą patikrinkite:

- [ ] Dockerfile bazės turi versiją ir digest, naudojami multi-stage etapai.
- [ ] Lock failai, BuildKit cache ir BuildKit secrets naudojami be credential'ų image layer'iuose.
- [ ] Production Compose nenaudoja `build:` ar source bind mount'ų.
- [ ] Service DNS, healthcheck, `depends_on`, resursų ribos ir persistent volumes aprašyti.
- [ ] PR ir protected branch/tag vartai vykdo lint, test, vulnerability scan ir secret scan.
- [ ] Image turi SBOM, provenance ir attestation; attestation patikrinama prieš smoke test/promotion vartus.
- [ ] Smoke test patvirtina ne tik HTTP atsakymą, bet ir kritinį worker/database/Redis veikimą, kai jie yra sistemos dalis.
- [ ] Deploy tikrina realią tikslinės aplinkos parengtį ir išsaugo įdiegtą digest.
- [ ] Rollback procedūra išbandyta ir nurodo nekintamą digest arba version tag.
- [ ] Pasirinktas branch-based arba tag-based modelis bei jo trigger'iai aprašyti projekto README ir release dokumentacijoje.

> Šablonas turi būti pritaikytas projekto runtime, registry, secrets ir infrastruktūrai. Šis priedas nepakeičia projekto threat model, incidentų runbook ar konkretaus cloud tiekėjo reikalavimų.
