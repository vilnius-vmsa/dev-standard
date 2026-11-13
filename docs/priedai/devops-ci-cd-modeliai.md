# H priedas. DevOps CI/CD modeliai

Šis priedas yra praktinis [8 skyriaus](../08-devops-ci-cd.md) pritaikymo pavyzdys aplikacijoms, kurios leidžiamos kaip Docker image. Jis aprašo du suderinamus leidimo modelius, bet nenustato konkrečių registry, cloud ar runner tiekėjų.

## Prielaidos

Pavyzdžiai veikia tik tada, kai tenkinamos šios sąlygos. Jų neįmanoma patikrinti
iš pull request'o, todėl jos tikrinamos prieš pradedant taikyti priedą projekte:

- **Artifact attestations.** Visa vartų grandinė (build, release ir
  „staging-verified“ attestation bei jų tikrinimas prieš deploy) naudoja GitHub
  artifact attestations. Privačioms repozitorijoms ši funkcija prieinama tik su
  GitHub Enterprise licencija. Organizacijos repozitorijos yra GitHub
  Enterprise organizacijoje, todėl sąlyga tenkinama; taikant pavyzdžius kitur
  ją reikia patikrinti iš anksto, nes be jos pavyzdžiai sustoja ties pirmu
  `actions/attest` žingsniu.
- **Slaptųjų raktų saugykla.** Pavyzdžiai reikšmes (`RUNTIME_ENV`, TLS,
  Loki) gauna iš GitHub Environment secrets. Tai yra saugi saugykla pagal
  [8.1](../08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai); organizacijos
  slaptažodžių saugykla (DVLS) naudojama papildomai.
- **Pasirinktas profilis.** Projektas `.dev-standard/config.json` faile nurodo
  vieną Git modelį (`flow-branch` arba `flow-tag`) ir vieną diegimo būdą
  (`compose`, `compose-blue-green` arba `k8s`); nuo to priklauso, kurios
  taisyklės jam taikomos ([8.10](../08-devops-ci-cd.md#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas)).
- **GitHub nustatymai.** Kiekvienai aplinkai sukurtas Environment su savo
  secrets, šakų ar tag'ų politika ir savo self-hosted runner'iu (H.4
  „Runner'iai ir GitHub Environment“).

## Kaip priedas siejasi su 8 skyriumi

| Priedo dalis | 8 skyriaus poskyris | Stack'as |
|---|---|---|
| H.1 Repozitorijos struktūra | [8.10](../08-devops-ci-cd.md#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas) (`OPS-REPO-P02`), [8.13.1](../08-devops-ci-cd.md#8131-bendri-reikalavimai-single-slot) | visi, `compose` |
| H.2 Dockerfile kontrolė | [8.12](../08-devops-ci-cd.md#812-konteinerių-image) | `docker` |
| H.3 Compose kontrolė | [8.13](../08-devops-ci-cd.md#813-docker-compose-diegimas) | `compose`, `compose-blue-green` |
| H.3 dalys: health kontraktas (readiness vartas), runtime secrets kontraktas | [8.10](../08-devops-ci-cd.md#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas) (`OPS-PIPE-P01`), [8.1](../08-devops-ci-cd.md#81-aplinkos-ir-bendri-principai) (`OPS-ENV-P05`), [8.13.1](../08-devops-ci-cd.md#8131-bendri-reikalavimai-single-slot) (`OPS-COMPOSE-P09`) | `infra`, `compose` |
| H.4 GitHub Actions atsakomybės, smoke vartas, runner'iai ir GitHub Environment | [8.10](../08-devops-ci-cd.md#810-bendri-pipeline-vartai-ir-profilio-pasirinkimas) | `infra` |
| H.4 dalys: logų ir metrikų eksportas, image retention | [8.6](../08-devops-ci-cd.md#86-stebėsena-logai-ir-įvykių-valdymas-ci-cd-užtikrinimas) (`OPS-MON-P02`), [8.9](../08-devops-ci-cd.md#89-kainodara-ir-efektyvumas-finops) (`OPS-FIN-P02`) | `infra` |
| H.4 dalys apie single-slot ir blue-green diegimą (slotų perjungimas, rollback, balanceris) | [8.13](../08-devops-ci-cd.md#813-docker-compose-diegimas) | `compose`, `compose-blue-green` |
| H.5 Branch-based srautas | [8.11.1](../08-devops-ci-cd.md#8111-branch-based-diegimo-modelis) | `flow-branch` |
| H.6 Tag-based srautas | [8.11.2](../08-devops-ci-cd.md#8112-tag-based-leidimo-modelis) | `flow-tag` |
| H.7 Rollback, H.8 kontrolinis sąrašas | visi | – |

Kubernetes diegimui ([8.14](../08-devops-ci-cd.md#814-kubernetes-ir-gitops)) pavyzdžių šiame priede kol kas nėra.

## H.1. Rekomenduojama repozitorijos struktūra

Katalogų pavadinimai gali skirtis, tačiau atsakomybės turi likti atskirtos:

```text
application/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── workflows/               # plokščias katalogas: GitHub nevykdo workflow'ų iš pakatalogių
│       ├── ci.validate.yml      # iš github-actions/common/ pavyzdžių
│       ├── ci.pipeline.yml      # iš branch-based/ arba tag-based/ pavyzdžio
│       ├── ci.build.yml         # iš branch-based/ arba tag-based/ pavyzdžio
│       ├── ci.release.yml       # tik tag-based
│       ├── cd.deploy.yml        # iš single-slot/ ARBA blue-green/ pavyzdžio (vienas failas)
│       ├── ops.deploy.yml       # iš branch-based/ arba tag-based/ pavyzdžio
│       ├── ops.start-database.yml  # iš single-slot/ ARBA blue-green/ pavyzdžio
│       ├── ops.scheduled-scan.yml
│       ├── ops.housekeeping.yml
│       ├── docs-check.yml
│       └── dev-standard-sync.yml
├── docker/
│   ├── php-fpm/                 # po katalogą kiekvienam savo image
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   ├── entrypoint.sh        # eksportuoja sumontuotus secret failus
│   │   ├── conf.d/              # php.prod.ini
│   │   └── pool.d/              # www.prod.conf (FPM pool)
│   ├── nginx/
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   ├── nginx.conf           # bendra konfigūracija, įdedama į image
│   │   └── conf.d/              # default.conf, upstream*.conf, edge-tls.conf
│   ├── balancer/                # tik blue-green; image – oficialus Nginx, savo Dockerfile neturi
│   │   └── conf.d/              # default.conf (TLS ir monitoringo listeneriai)
│   ├── alloy/
│   │   └── config.alloy         # naudojamas docker-compose.observability.yml
│   └── scripts/
│       ├── prepare-runtime-secrets.sh   # iš prepare-runtime-secrets.sh.example
│       └── smoke-published-images.sh
├── docker-compose.yml
├── docker-compose.production.yml   # iš single-slot/ ARBA blue-green/ pavyzdžio (vienas failas)
├── docker-compose.ci-smoke.override.yml   # iš single-slot/ ARBA blue-green/ pavyzdžio
├── docker-compose.observability.yml
├── .dockerignore                # iš dockerignore.example; apima ir lokalų docker/secrets
└── application source, lock files and tests
```

Šis išdėstymas yra privalomas (`OPS-REPO-P02`): automatinis review DevOps taisykles taiko pagal failų kelius, todėl kitur padėtas Dockerfile, manifestas ar diegimo skriptas liktų nepatikrintas. Jei projektui reikia kitos vietos, išimtis su keliais ir priežastimi įrašoma į `.github/instructions/dev-standard-local.instructions.md` ([pavyzdys](examples/instructions/dev-standard-local.instructions.md.example)).

Blue-green projektas naudoja tuos pačius failų vardus kaip single-slot: `cd.deploy.yml` ir `docker-compose.production.yml` kopijuojami iš `blue-green/` pavyzdžių vietoj single-slot variantų. Tas pats galioja `ops.start-database.yml`. Todėl `ci.build`, `ci.release` ir smoke skriptas abiem variantams vienodi (smoke skriptas topologiją atpažįsta iš Compose failo); blue-green projektui lieka vienas pakeitimas – `ops.deploy` pridėti neprivalomą `force_recreate_balancer` įvestį.

Aktyvios darbo eigos laikomos `.github/workflows/`, o pavyzdžiai ir reusable workflow šablonai – atskiroje dokumentuotoje vietoje. Produkcinė Compose konfigūracija turi būti checkout'inama iš to paties patikrinto source SHA, kuris perduodamas deploy'ui, ir vykdoma iš workflow workspace. Tai nėra aplikacijos build'as: Compose gali būti checkout'e, tačiau production servisai visada naudoja nekintamus image digest'us ir runtime secrets.

Pritaikomi Dockerfile, Compose ir GitHub Actions failai pateikti [DevOps pavyzdžių kataloge](examples/README.md). Jie laikomi dokumentacijos dalimi, todėl jų kopijavimas į `.github/workflows/` turi būti sąmoningas veiksmas, atlikus projekto, registry, secrets ir deployment adapterio pritaikymą.

## H.2. Dockerfile kontrolė

Produkciniai Dockerfile turi būti multi-stage:

1. Bazinis etapas (pavyzdyje `php_base`) nustato fiksuotą OS/runtime versiją, ne-root vartotoją ir PHP-FPM `ping.path` liveness patikrai.
2. Priklausomybių etapai (`vendor_build`, `assets_build`) naudoja Composer/npm ar kitos ekosistemos lock failus.
3. Build etapas (`application_build`) surenka aplikaciją; kešai naudojami tik per BuildKit cache mount.
4. Galutinis etapas (`final`) kopijuoja tik vykdymui reikalingus failus, įrašo `RELEASE_NUMBER` (pats `healthcheck` aprašomas Compose faile) ir nustatomas exec formos `CMD`.

PHP-FPM ir Nginx/frontend image turi turėti atskirus build ir runtime etapus. Runtime etape negali likti Node, Composer, kompiliatoriai, Git ar package manager cache'ai. Pritaikomi pavyzdžiai: [PHP-FPM Dockerfile](examples/docker/common/php-fpm/Dockerfile.prod.example) ir [Nginx/frontend Dockerfile](examples/docker/common/nginx/Dockerfile.prod.example).

Bazinis image turi būti nurodytas kartu su versija ir digest. `latest` ir plaukiojantys package manager reikalavimai produkciniame build'e draudžiami. Composer auth, npm tokenai, sertifikatai ir kiti secrets perduodami per BuildKit secret mount arba runtime secret saugyklą; jų negalima palikti `ARG`, `ENV`, source checkout'e ar image layer'iuose.

Galutiniame image neturi būti kompiliatorių, Git, package manager cache'ų ar testų įrankių, nebent jie yra aiškiai reikalingi runtime. Failų kopijavimas turi naudoti tinkamą owner'į, o procesai turi veikti ne-root teisėmis.

### Image pavadinimas, tag'ai, label'iai ir digest'ai

Kiekvienas deployuojamas servisas turi vieną kanoninį registry image
pavadinimą, pavyzdžiui, `ghcr.io/<org>/<app>-php` arba
`ghcr.io/<org>/<app>-nginx`. Tas pats pavadinimas naudojamas staging ir
production; aplinka neturi būti įrašoma į repository pavadinimą, pvz.
`<app>-php-production`. Aplinką, release versiją ir build identifikatorių
aprašo tag'ai bei OCI label'iai, o faktinis deploy visada remiasi konkrečiu
`@sha256:...` digest'u. Bent `org.opencontainers.image.revision`,
`org.opencontainers.image.source` ir `org.opencontainers.image.version` turi
leisti susieti image su source commit ir release. Blue-green slotai naudoja tą
patį image pavadinimą ir digest'ą; skiriasi tik Compose slotas ir jo runtime
topologija.

## H.3. Compose kontrolė

Naudokite atskirus Compose vaidmenis:

| Failas / override | Paskirtis | Leidžiama build'inti iš checkout'o | Būtinos kontrolės |
|---|---|---:|---|
| Development | Kasdienis lokalus darbas | Taip | bind mount'ai, dokumentuoti portai, vietiniai secrets |
| Production | Leidimas serveryje | Ne | immutable image, runtime secrets, persistent data, healthcheck |
| Production blue-green (pasirenkamas) | Slotų keitimas be pilno vieno slot'o sustabdymo | Ne | du PHP/worker/Nginx slotai, bendras balanceris, bendras state, slot healthcheck |
| CI image test | Vienkartinis image patikrinimas | Ne | disposable MySQL/Redis, izoliuotas tinklas, automatinis cleanup |

Bendri servisų nustatymai aprašomi YAML anchor'uose. Pavyzdžiuose visi servisai dalijasi trimis: `x-container-environment` (`TZ: UTC` visiems konteineriams – pagal `ARCH-API-P13` serveriai ir duomenų bazės laiką laiko UTC, kaip ir PHP `date.timezone`; vietinis laikas yra tik atvaizdavimo reikalas), `x-logging` (`json-file` su dydžio ir failų skaičiaus riba, kad logai neužpildytų hosto disko) ir `x-log-labels` (label'iai centriniam logų rinkimui, žr. „Logų ir metrikų eksportas“). Naujas servisas turi gauti visus tris. Numatytoji produkcija gali
naudoti vieną aplikacijos slotą. Jei pasirenkamas blue-green variantas, slotai
paveldi bendrą konfigūraciją ir keičia tik slot'o image, pavadinimą bei
priklausomybes; viešą portą valdo vienas balancer. Stateful duomenys (duomenų
bazė, uploads ir reikalingi runtime failai) turi turėti aiškią persistent
saugyklą. Naudotojų įkėlimų volume Nginx montuoja tik skaitymui ir su `nocopy`:
kol volume tuščias, Docker jo savininką perima iš paskutinio sukurto konteinerio
image, tad be `nocopy` volume atitektų Nginx naudotojui ir PHP negalėtų įrašyti
pirmo failo.

Persistent saugykloje laikomi tik naudotojų duomenys (pavyzdyje –
`storage/app/public`). `storage/framework/*`, `storage/logs` ir `/tmp` yra
`tmpfs`, o `bootstrap/cache` nemontuojamas ir lieka toks, koks sugeneruotas
image build metu. Named volume užpildomas iš image tik pirmą kartą, todėl
persistent `bootstrap/cache` ar `storage/framework` po kito leidimo uždengtų
naujo image paketų manifestą ir cache senais failais, o blue-green atveju juos
vienu metu dalytųsi dvi skirtingos kodo versijos.

Development Compose yra skirtas tik lokaliam darbui ir gali publikuoti HTTP per
hosto `:8080`. Staging ir production turi naudoti atskirą serverio Compose
failą, kuriame edge balanceris arba production Nginx terminina TLS ir publikuoja
HTTPS per hosto `443` (balancerio konteinerio TLS listeneris pavyzdyje yra
`8443`). Šie failai negali būti sukeisti: lokalus HTTP pavyzdys nėra serverio
deployment konfigūracija.

Nginx portų kontraktas priklauso nuo topologijos, o ne nuo aplinkos pavadinimo:
single-slot production publikuoja tik `host 443 -> Nginx 8443`; blue-green
production publikuoja `host 443 -> balancer 8443`, o balanceris vidiniu tinklu
pasiekia aktyvų Nginx slotą per HTTP `8080`. `8080` blue-green atveju nėra
viešas portas ir nėra local development išimtis.

Production Nginx image yra vienodas visiems vaidmenims: į jį įkeliama tik
aplikacijos `8080` ir privataus monitoringo `18080` konfigūracija bei
numatytasis PHP-FPM upstream (`php`). Vaidmeniui būdingą konfigūraciją montuoja
Compose, todėl tas pats image digest'as tinka single-slot ir abiem blue-green
slotams:

| Failas | Kas jį naudoja | Paskirtis |
|---|---|---|
| `conf.d/default.conf` (image) | visi | `8080` aplikacija, `18080` readiness ir monitoringas |
| `conf.d/upstream.conf` (image) | single-slot | `php-upstream` → `php:9000` |
| `conf.d/upstream.blue.conf`, `upstream.green.conf` (mount) | `nginx-blue`, `nginx-green` | montuojami vietoj `upstream.conf`: kiekvienas slotas kreipiasi į savo `php-blue` / `php-green` |
| `docker/balancer/conf.d/default.conf` (mount) | blue-green `balancer` | `8443` TLS listeneris ir `18080` monitoringas; užklausas perduoda į upstream'us `application` ir `application_monitor`, kuriuos į `active.conf` įrašo deploy |
| `conf.d/edge-tls.conf` (mount) | single-slot `nginx` | `8443` TLS listeneris, perduodantis užklausą į vietinį `8080`; slotai jo nemontuoja ir TLS secrets neturi |

Upstream vardai sprendžiami vykdymo metu: `server php:9000 resolve;` su `zone` ir `resolver 127.0.0.11 valid=5s ipv6=off;` (Nginx 1.27.3 ar naujesnis; tas pats galioja balancerio upstream'ams į slotus). Be to Nginx vardą išverčia tik paleidimo ar perkrovimo metu: jei PHP-FPM konteineris grįžta su kitu adresu (pvz. po avarijos), visos užklausos baigiasi klaida, kol Nginx neperkraunamas, o `/health` tuo metu rodo „ok“.

Aplikacijos konfigūracija visada kreipiasi į `php-upstream` ir niekada tiesiogiai
į serviso vardą. Jei upstream būtų įrašytas image konfigūracijoje, abu slotai
kreiptųsi į tą patį PHP servisą ir naujas slotas tyliai aptarnautų seną kodą.
Pavyzdžiai: [site.conf](examples/docker/common/nginx/site.conf.example),
[upstream.conf](examples/docker/common/nginx/upstream.conf.example),
[upstream.blue.conf](examples/docker/blue-green/nginx/upstream.blue.conf.example),
[upstream.green.conf](examples/docker/blue-green/nginx/upstream.green.conf.example) ir
[edge-tls.conf](examples/docker/single-slot/nginx/edge-tls.conf.example), balancerio [default.conf](examples/docker/blue-green/balancer/default.conf.example); bendras [nginx.conf](examples/docker/common/nginx/nginx.conf.example) pritaikytas read-only failų sistemai ir neprivilegijuotam naudotojui.

Local development naudoja atskirą HTTP-only kelią per hosto `:8080`; CI smoke
paleidžia production Compose be publikuotų portų ir kreipiasi į Nginx
konteinerio viduje. `127.0.0.1:<portas>` rezervuojamas tik
host-local administravimo, metrics ar debug endpointams, pavyzdžiui,
`127.0.0.1:18080`; jis nenaudojamas pagrindiniam aplikacijos ingress.

Blue-green deploy strategija negali susilpninti single-slot saugumo ar resursų
kontrolės: abu slotai, balanceris ir stateful servisai turi paveldėti tą pačią
hardening bazę, healthcheck ir explicit CPU/memory limitus. `read_only`,
`no-new-privileges` ir capabilities turi būti taikomi pagal mažiausių privilegijų
principą, neaklai sugadinant oficialaus image startą: būtini writable keliai
apribojami `tmpfs` arba persistent volume, `cap_drop: [ALL]` papildomas tik
konkrečiai būtinais `cap_add`, o kiekviena išimtis dokumentuojama ir tikrinama
su realiu image. Keičiasi tik slotų topologija, image ref ir balancerio
maršrutizavimas.

Produkcijai rekomenduojama naudoti Compose Deploy Specification
`deploy.resources.limits` ir `reservations`, įskaitant aplikaciją, worker'ius,
balancerį ir stateful servisus. Jei konkretus Compose/runtime diegimas taiko
tik service-level `cpus`, `mem_limit` ir `mem_reservation`, ši forma taip pat
galima, tačiau viename projekte pasirinkimas turi būti nuoseklus ir neturi
likti nė vienas neribotas produkcinis servisas.

Servisai vienas kitą pasiekia Compose service DNS vardu, o ne `127.0.0.1` ar `localhost`. Production tinklų topologija turi aiškiai atskirti public ingress ir stateful servisus: Nginx turi būti `edge` ir `internal` tinkluose, PHP/worker – `internal` ir `egress`, balanceris – `edge`, MySQL/Redis – tik `internal`. `internal: true` tinklas negali būti vienintelis tinklas servisui, kuris publikuoja portą arba kreipiasi į išorę. `depends_on` nepakeičia healthcheck: prieš migration, queue worker ar aplikacijos startą turi būti patikrinta faktinė priklausomybės parengtis. Single-slot deploy pirmiausia sustabdo workerį, vykdo migraciją su nauju PHP image ir tik tada paleidžia visą naują versiją. Blue-green deploy pirmiausia paleidžia naujo slot'o PHP, sustabdo seno slot'o workerį, vykdo migraciją, patikrina naujo slot'o readiness, perjungia traffic'ą ir tik tada paleidžia naujo slot'o workerį. Migracijos turi būti suderinamos su trumpu seno ir naujo kodo persidengimu (expand/contract). Logai rašomi į stdout/stderr ir surenkami centralizuotai; secrets nemontuojami į logus ar debug output.

### Health kontraktas: liveness ir readiness

Pavyzdžiai atskiria patikrinimus pagal [3.6.2 skyrių](../03-architektura.md#362-sveikatos-patikrinimas); jų negalima sukeisti:

| Patikrinimas | Kur pasiekiamas | Kas atsako | Ką įrodo | Kur naudojamas |
|---|---|---|---|---|
| `/health` (liveness) | Nginx `8443` / `8080` | Pats Nginx, be upstream | Nginx procesas gyvas | Nginx ir balancerio Compose `healthcheck`, viešo HTTPS krašto patikra |
| PHP-FPM `ping.path` (liveness) | FastCGI `9000` (`cgi-fcgi`) | PHP-FPM | FPM procesas priima užklausas | PHP serviso Compose `healthcheck` |
| `/health/ready` (readiness) | Tik privatus Nginx `18080` listeneris | Aplikacija per Nginx → PHP-FPM | Aplikacija pasikrovė, pasiekia DB ir Redis, atsako nurodyta release versija | smoke vartas, `CD: Deploy` sėkmės patikra, blue-green slot'o patikra prieš perjungimą ir po jo |

`/health/ready` yra aplikacijos maršrutas. Jis turi patikrinti kritines
priklausomybes (bent DB ir Redis užklausą), sėkmės atveju grąžinti HTTP 200, o
bent vienos priklausomybės nesėkmės atveju – HTTP 503. Atsakymas yra
struktūrizuotas JSON:

```json
{"status": "ok", "checks": {"database": "ok", "redis": "ok"}, "release": "<source SHA>"}
```

`checks` leidžia atskirti bendrą būseną nuo priklausomybių būsenų, o `release`
ateina iš image build argumento `RELEASE_NUMBER`, todėl vartai gali palyginti jį
su `source_sha` ir įrodyti, kad atsako būtent naujai įdiegta versija, o ne
ankstesnis konteineris. Atsakyme neturi būti priklausomybių adresų, klaidų
tekstų ar kitos vidinės informacijos.

Readiness nėra viešas endpointas: Nginx viešuose listeneriuose `/health/ready`
grąžina `404` visais kelio variantais, kuriuos aplikacija nukreiptų į tą patį
maršrutą (`/health/ready/`, `/index.php/health/ready`), o į PHP-FPM jį perduoda tik privatus `18080` listeneris, ribojamas
iki `127.0.0.1` ir vidinio Docker tinklo. Deploy vartai jį kviečia konteinerio
viduje (`docker compose exec`), todėl nei priklausomybių būsena, nei release
identifikatorius nepatenka į internetą.

```nginx
# viešas / slot'o listeneris (8443, 8080)
location = /health       { access_log off; default_type text/plain; return 200 'ok'; }
# prieš `index.php` location: regex location'ai tikrinami iš eilės
location ~* ^/(index\.php/)?health/ready(/|$) { return 404; }

# privatus monitoring listeneris
server {
    listen 18080;
    location = /health/ready {
        include fastcgi_params;
        fastcgi_pass php-upstream;
        fastcgi_param SCRIPT_FILENAME /var/www/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
        fastcgi_param REQUEST_URI /health/ready;
        allow 127.0.0.1;
        allow 172.16.0.0/12;
        deny all;
    }
    location / { return 404; }
}
```

Laravel aplikacijoje (pavyzdys; priklausomybių sąrašą pritaikykite projektui):

```php
// routes/health.php – kraunamas be middleware grupės: be sesijos ir cookies
Route::get('/health/ready', [HealthController::class, 'ready'])->name('health.ready');

// app/Http/Controllers/HealthController.php
public function ready(): JsonResponse
{
    $checks = [
        'database' => $this->passes(fn () => DB::connection('healthcheck')->select('select 1')),
        'redis' => $this->passes(fn () => Redis::connection('healthcheck')->ping()),
    ];
    $ready = ! in_array(false, $checks, true);

    return response()->json([
        'status' => $ready ? 'ok' : 'unavailable',
        'checks' => array_map(fn (bool $passed) => $passed ? 'ok' : 'fail', $checks),
        'release' => config('app.release'), // config/app.php: env('RELEASE_NUMBER')
    ], $ready ? 200 : 503, ['Cache-Control' => 'no-store, private']);
}
```

`passes()` pagauna išimtį, užregistruoja tik priklausomybės vardą bei išimties
klasę ir grąžina `false`. Rekomenduojama atskira `healthcheck` jungtis su
trumpu timeout, kad neveikianti priklausomybė neužlaikytų patikros. `release`
skaitomas per `config()`, nes po `config:cache` tiesioginis `env()` kvietimas
grąžina `null`.

Compose `healthcheck` lieka liveness: jo nesėkmė reiškia serviso perkrovimą, o
ne pašalinimą iš srauto, todėl DB ar Redis sutrikimas neperkrauna visų
konteinerių. Dėl to `docker compose up --wait` sėkmė dar nėra deploy sėkmė – ją
patvirtina tik readiness vartas. Smoke vartas papildomai tikrina, kad
`/health/ready` nepasiekiamas per aplikacijos listenerį, o sustabdžius duomenų
bazę nebegrąžina `ok`; maršrutas, kuris vis tiek atsako sėkmingai, yra liveness
ir šio kontrakto neatitinka.

### Sustabdymas ir worker'io būsena

Kiekvienas servisas turi `stop_grace_period`, atitinkantį tai, ką jis turi
užbaigti prieš sustabdomas ([3.6.5](../03-architektura.md#365-graceful-shutdown-ir-ilgų-operacijų-valdymas)).
Be jo Docker po 10 s nutraukia procesą, todėl deploy metu žūtų vykdomas queue
job'as ar užklausa.

| Servisas | `stop_grace_period` | Su kuo suderintas |
|---|---|---|
| `worker` | `100s` | ilgesnis už `queue:work --timeout=90` |
| `php`, `nginx`, balanceris | `130s` | ilgesnis už FPM `process_control_timeout = 120s` ir PHP `max_execution_time` |
| `mysql`, `redis` | `60s` | švarus duomenų įrašymas išjungiant |

Keičiant job'o ar užklausos laiko ribą, kartu keičiamas ir atitinkamas
`stop_grace_period`.

Worker'io `healthcheck` tikrina ne procesą, o queue ciklą: aplikacija kiekviename
cikle atnaujina heartbeat failą, o Compose tikrina, ar jis ne senesnis nei 120 s.
Be to `up --wait` worker'iui reikštų tik „procesas paleistas“. Laravel
aplikacijoje pakanka vieno klausytojo:

```php
// app/Providers/AppServiceProvider.php, boot()
Event::listen(
    [Looping::class, JobProcessing::class, JobProcessed::class],
    fn () => touch('/tmp/queue-worker.heartbeat'),
);
```

`Looping` suveikia kiekviename cikle, o job'o įvykiai atnaujina failą ir tada, kai
vykdomas ilgas job'as. Pavyzdys:
[queue-worker-heartbeat.php](examples/application/queue-worker-heartbeat.php.example).
Šio kodo aplikacijoje reikia ir CI smoke vartui: be jo worker'io `healthcheck`
niekada nepraeina.

`/tmp` worker'io konteineryje yra `tmpfs`, todėl failas nepergyvena perkrovimo
ir pasenęs heartbeat negali likti iš ankstesnio konteinerio.

### Runtime secrets kontraktas

Single-slot ir blue-green serverio pavyzdžiai naudoja tą patį runtime secrets
modelį. `CD: Deploy` gauna GitHub Environment secrets, o rekomenduojamas
helperis juos validuoja ir atomiškai įrašo į hosto `SECRETS_DIR`. `compose.env`
naudojamas tik Compose kintamųjų interpolacijai per `--env-file`.

Slapti raktai nekeliauja aplikacijos aplinkos faile. Helperis `RUNTIME_ENV`
išskaido: `SECRET_KEYS` sąraše esantys raktai (`APP_KEY`, `DB_PASSWORD`,
`DB_ROOT_PASSWORD`, `REDIS_PASSWORD` ir projekto papildymai) tampa atskirais
secret failais, o visa kita – `application.env`, kurį PHP servisams perduoda
Compose `env_file`. Kiekvienas servisas montuoja tik jam reikalingus failus:
PHP gauna `app_key`, `mysql_password` ir `redis_password`, o DB root
slaptažodis montuojamas tik į `mysql` ir aplikacijai nepasiekiamas. Image
entrypoint'as (`docker/php-fpm/entrypoint.sh`) šiuos failus eksportuoja tik PHP
procesui, todėl reikšmių nėra nei `docker inspect`, nei Compose konfigūracijoje.
Duomenų bazė, Redis ir aplikacija slaptažodį skaito iš to paties failo, todėl
skirtingas `.env` reikšmių interpretavimas negali jų išskirti.

Helperis veikia „fail closed“: jei `RUNTIME_ENV` turi raktą, kurio vardas
atrodo kaip slaptas (`PASSWORD`, `SECRET`, `TOKEN`, `KEY`, `SALT`, `DSN` ir
pan.), bet jo nėra nei `SECRET_KEYS`, nei `NON_SECRET_KEYS` sąraše, paruošimas
sustoja. Naujas raktas pridedamas trijose vietose kartu: helperio sąraše,
entrypoint'e ir Compose `secrets:`.

Compose projekto vardas nėra kontrakto dalis: jis fiksuotas pačiame Compose faile (`name:`), kaip etaloniniame projekte. Jei vardas būtų imamas iš checkout katalogo, perkėlus runner'io darbo katalogą Compose paleistų antrą stack'ą su tuščiais volume, nes volume vardai prasideda projekto vardu. Diegimo workflow'ai vardo neperduoda nei kintamuoju `COMPOSE_PROJECT_NAME`, nei `-p`, nei per Environment kintamuosius ar secrets: vardas keičiamas tik Compose faile, t. y. per PR su review, o ne aplinkos nustatymu, kuris gali pasikeisti nepastebėtas. Vienintelė išimtis – smoke vartas CI runner'yje: jis vardą perrašo kintamuoju `COMPOSE_PROJECT_NAME`, kad jo vienkartiniai konteineriai ir volume nesimaišytų su kitais, ir diegiamos aplinkos neliečia.

| Kontrakto dalis | Reikšmė / paskirtis |
|---|---|
| `RUNTIME_ENV` | Pilnas target aplinkos aplikacijos `.env` turinys – vardas vienodas staging ir production, nes kiekvienas GitHub Environment turi savo reikšmę (`OPS-ENV-P03`); perduodamas tik per protected GitHub Environment secret ir niekada neprintinamas. Helperis jį išskaido į `application.env` (be slaptų raktų) ir atskirus secret failus. |
| `DEPLOY_ENVIRONMENT` | `staging` arba `production`; naudojamas aplinkos ir `APP_ENV` suderinamumui tikrinti. |
| `TLS_CERTIFICATE_B64`, `TLS_PRIVATE_KEY_B64` | TLS sertifikato ir privataus rakto Base64 reikšmės; helperis tikrina dekodavimą, porą ir sertifikato galiojimą. |
| `SECRETS_DIR` | Hosto runtime katalogas. Katalogas yra `0700` ir priklauso runner'io paskyrai; konteinerių montuojami secret failai jame yra `0444`, nes Compose file-secrets yra bind mount'ai ir neprivilegijuoti konteinerių naudotojai (PHP, Nginx, MySQL, Redis) kitaip jų neperskaitytų. `compose.env` skaito tik Compose hoste, todėl lieka `0600`. |
| Rekomenduojamas `prepare-runtime-secrets.sh` helperis | Iš aukščiau nurodytų įėjimų atomiškai sukuria `application.env` (be slaptų raktų), `app_key`, `mysql_password`, `mysql_root_password`, `redis_password`, `tls_certificate`, `tls_private_key` ir `compose.env`. |
| `compose.env` | Sugeneruoti `SECRETS_DIR`, DB reikšmės ir pinned image refs; perduodamas `docker compose --env-file` prieš `config`, `pull` ir rollout. |

Priedo skriptas `docker/common/scripts/prepare-runtime-secrets.sh.example` yra
rekomenduojamas helperio šaltinis, kurį projekte galima nukopijuoti kaip
`docker/scripts/prepare-runtime-secrets.sh`. Failo kelias ir vardas nėra norminis
reikalavimas: galima naudoti secret managerį ar kitą operatoriaus įrankį, jei
jis išlaiko tą pačią įėjimų, atominių išėjimų ir neprintinamų reikšmių sutartį.
`RUNTIME_ENV` turinys Compose'ui tiesiogiai per `--env-file` neperduodamas: Compose interpoliacijai naudojamas tik helperio sugeneruotas `compose.env`.

## H.4. GitHub Actions atsakomybės

Branch-based projektuose `CI: Pipeline` vykdo PR ir protected branch push vartus,
o po sėkmingo push vartų rezultato kviečia bendrą `CI: Build` workflow. `CD:
Deploy` lieka reusable deployment workflow. `Ops: Deploy` yra atskiras
operatoriaus kelias jau paskelbto PHP-FPM ir Nginx digest redeploy'ui: pagal
environment arba pasirenkamą `sha-<40>` tag'ą išsprendžia digest'us, patikrina
revision bei attestation, tada kviečia `CD: Deploy`; jis neatlieka rebuild ir
negali apeiti lint, scan, attestation ar smoke vartų. Production atveju explicit
`sha-<40>` tag'as dar turi būti susietas su protected production source ref,
pavyzdžiui, `refs/heads/main`, tikrinant attestation source-ref ir repository
ancestry; staging gali naudoti staging source SHA.
Tai šio pavyzdžio būdas įvykdyti `OPS-FLOW-P05`: taisyklė reikalauja rezultato,
o tag'o formatą ir patikros būdą projektas gali pasirinkti kitą.
Šis `Ops: Deploy` pavyzdys atlieka tik redeploy; jis nebuild'ina, nepromote'ina
ir neatkuria atskirų runtime servisų. Jei projektui reikalingas runtime
maintenance arba secret rotation, tai turi būti atskira projekto ar platformos
procedūra.

Jei repozitorijoje yra `composer.json`, `CI: Pipeline` prieš Composer auditą ir
testus turi parinkti projekto palaikomą PHP versiją bei Composer įrankį,
patikrinti Composer metaduomenis ir įdiegti lock faile nurodytas priklausomybes.
CI negali remtis `ubuntu-latest` iš anksto įdiegtu PHP ar paleisti
`composer test` be `vendor/`; PHP extensions turi būti nurodytos pagal konkretų
projektą.

`CI: Pipeline` Compose patikra tikrina failo struktūrą ir sujungimą su
`docker compose config --no-interpolate --quiet`; ji neturi production image,
runtime secretų ar pirmo deploy metu sugeneruoto `SECRETS_DIR`. Faktinių
interpolation kintamųjų, secret failų ir image digest'ų patikra vykdoma
`CD: Deploy` po `prepare-runtime-secrets.sh`, prieš `pull` ir rollout.

Nepavykus protected branch push vartams, GitHub Actions turi pranešti push'o
autoriui. Retry nėra automatinis: autorius turi pašalinti nesėkmės priežastį ir
pakartoti failed job/workflow, jei nesėkmė laikina, arba push'inti pataisytą
commit'ą. Jei to nepadaroma, neįdiegtas kodas nedingsta: kitas push į tą pačią
šaką, net ir vien dokumentacijos, jį subuild'ins, nes build'o poreikis
nustatomas lyginant su aplinkoje įdiegta versija.

Tag-based projektui naudokite atskirą `tag-based/ops.deploy` pavyzdį. Jis priima
tik nekintamą `vX.Y.Z` release tag'ą, patikrina, kad tag'o commit sutampa su
image source revision ir yra pasiekiamas iš protected `main`, o `CD: Deploy`
kviečia su `ci.release.yml` release attestation workflow. Branch-based
`branch-based/ops.deploy` ir `tag-based/ops.deploy` nėra vienas universalus
workflow: jų `image_tag` formatas ir release attestation šaltinis skiriasi.

Darbo eigų failai gali būti sujungti ar išskaidyti pagal projekto dydį, tačiau vartai turi išlikti aiškūs:

| Darbo eiga / job grupė | Trigger'is | Atsakomybė | Išvestis |
|---|---|---|---|
| `ci.validate` | kviečiamas iš `ci.pipeline` (PR ir protected branch push) | formatavimas ir linting, statinė analizė, unit/contract testai, Composer/npm auditas, Compose struktūros patikra, secrets helperio apsaugų testas ir secret scan | privalomas kokybės vartas |
| `ci.pipeline` | PR ir protected branch push | kviečia `ci.validate`; branch-based variante po push papildomai nustato build-reikšmingus pakeitimus, kviečia `ci.build` ir sinchronizaciją; tag-based variante yra tik vartas | vartų rezultatas, branch-based – ir build/deploy |
| `docs-check` | dokumentacijos pakeitimai | nuorodų, anchor'ų ir dokumentacijos kelių patikra | dokumentacijos kokybės vartas |
| `dev-standard-sync` | schedule arba manual | pasirinkto dev-standard release pritaikymas ir PR paruošimas | atnaujinimo PR arba sinchronizacijos rezultatas |
| `ci.build` | branch-based: sėkmingas `ci.pipeline` po merge, kai nustatyti build-reikšmingi pakeitimai; tag-based: per `workflow_run` po sėkmingo `ci.pipeline` push'ui į `main` | checkout pagal exact SHA, multi-stage build, registry push, image scan, SBOM, provenance, attestation, image verification, disposable smoke test ir immutable source tag publication | patikrintas immutable digest perduotas į `cd.deploy`; environment tag promotion atliekamas tik po sėkmingo deploy ir health |
| pasirenkamas `ci.test-image` | po build/attestation, didesniuose projektuose | Tas pats image-test etapas kaip atskira reusable workflow, kai jo nereikia laikyti pagrindiniame build workflow | patikrintas digest |
| `cd.deploy` | po smoke; branch-based – po immutable source tag'o paskelbimo, tag-based staging diegime tag'as skelbiamas tik po šio deploy | numatytasis single-slot runtime secrets, image digest deploy, migracijos politika ir health/readiness patikra | faktinio deploy rezultatas; tik po jo galima environment tag promotion |
| `cd.deploy`, blue-green variantas | kaip `cd.deploy` | neaktyvaus slot'o paleidimas, health patikra ir balancerio perjungimas | faktinio slot switch ir deploy rezultatas; tik po jo galima environment tag promotion |
| `ops.start-database` (jei taikoma) | atskiras operatoriaus veiksmas | savarankiškas DB paleidimas prieš pirmą deploy arba po incidento: pagal jau paskelbtą nekintamą image tag'ą paruošia runtime secrets ir paleidžia tik MySQL; variantas (single-slot ar blue-green) turi sutapti su `cd.deploy` | audituojamas operatoriaus rezultatas |
| `ops.deploy`, branch-based variantas (jei taikoma) | atskiras operatoriaus veiksmas | jau patikrintų PHP-FPM/Nginx digest'ų redeploy pagal environment arba `sha-<40>` tag'ą | audituojamas redeploy ir health rezultatas |
| `ops.deploy`, tag-based variantas (jei taikoma) | atskiras operatoriaus veiksmas | `vX.Y.Z` release tag'o redeploy; tag'as susiejamas su image source SHA ir `ci.release.yml` release attestation | audituojamas version tag redeploy ir health rezultatas |
| `ops.scheduled-scan` | weekly schedule arba manual | promoted image, lockfile dependency ir secret istorijos scan | audituojami scan rezultatai |
| `ops.housekeeping` | schedule arba manual | workflow run'ų ir logų retention (pavyzdyje 90 dienų); pasirinktinai – senų container image versijų valymas (`prune_images`) | kontroliuojamas CI ir registry saugojimas |

`ci.build` smoke žingsnis turi likti trumpas ir aiškus workflow faile. Jei
patikra telpa į kelias komandas, ji gali būti workflow žingsnyje; sudėtingesnė
DB, Redis, worker ir Nginx patikra rekomenduojama perkelti į projekto skriptą,
kurį workflow iškviečia pagal digest'ais patikrintus image. Pavyzdinis
`docker/scripts/smoke-published-images.sh` image'us paleidžia tuo pačiu keliu
kaip tikras deploy: secrets helperis su vienkartinėmis reikšmėmis, production
Compose failas ir `CD: Deploy` komandų seka (`up` MySQL/Redis → migracija →
`up --wait`). Tada per privatų Nginx `18080` listenerį užklausia
`/health/ready`, palygina grąžintą `release` su `SOURCE_SHA`, įdeda
deterministinį queue job'ą, kurį apdoroja veikiantis `worker` servisas, ir
pabaigoje viską išvalo. `SMOKE_JOB_CLASS`, markerio ir readiness maršruto
kontraktas turi būti pritaikyti konkrečiai aplikacijai.

Prieš kiekvieną `docker/build-push-action` turi būti inicializuotas Docker
Buildx builderis su `docker/setup-buildx-action`. Tai būtina registry cache,
BuildKit provenance ir SBOM generavimui.

Visi trečiųjų šalių action'ai nurodomi pilnu commit SHA su versijos komentaru
(`uses: actions/checkout@3d3c42e5… # v7`), niekada tag'u ar šaka (`OPS-PIPE-P04`):
tag'ą jo savininkas gali perkelti į kitą kodą, o build job'e tas kodas gautų
registry rašymo teises ir galimybę pasirašyti attestation. Pavyzdžiuose įrašyti
SHA yra tie, kuriuos naudoja etaloninis `login` projektas; prieš naudojant juos
reikia peržiūrėti iš naujo, o atnaujinimus palikti Dependabot'ui
(`github-actions` ekosistema).

Organizacijos nuosavi reusable workflow'ai ir action'ai (`shared-workflows`,
`dev-standard`) kol kas nurodomi šaka `@main`: juos keičia ir peržiūri ta pati
organizacija, o visi projektai iškart gauna bendrą versiją. Tai reiškia, kad
pakeitimas tų repozitorijų `main` šakoje iškart veikia visus projektus, todėl
jų `main` turi būti apsaugota, o naujos įvestys pridedamos tik kaip
neprivalomos. `sbom: true` turi
saugoti SBOM prie publikuoto image registry attestation metaduomenyse, o
`docker buildx imagetools inspect` turi patikrinti, kad SBOM ir provenance yra
prieinami prieš smoke/promotion vartus. Atskirų lokalių SBOM failų generuoti
nereikia, jei registry attestation yra išsaugota ir patikrinta.

`ci.build` (arba pasirenkamas `ci.test-image`) turi perduoti tarp job'ų konkretų source SHA bei digest, o ne per naujo spręsti branch'o ar perrašomo tag reikšmę. `cd.deploy` negali būti laikomas sėkmingu vien todėl, kad paruošė secrets, Compose failą ar sulaukė `up --wait`: sėkmė reiškia faktinį paleidimą ir readiness patikrą, kurioje `release` sutampa su `source_sha`. Minimalūs pavyzdžiai pateikti [kokybės vartui](examples/github-actions/common/ci.validate.yml.example), [branch-based](examples/github-actions/branch-based/ci.pipeline.yml.example) ir [tag-based](examples/github-actions/tag-based/ci.pipeline.yml.example) CI Pipeline, [docs check](examples/github-actions/common/docs-check.yml.example), [dev-standard sync](examples/github-actions/common/dev-standard-sync.yml.example), [branch-based build](examples/github-actions/branch-based/ci.build.yml.example), [reusable deploy](examples/github-actions/single-slot/cd.deploy.yml.example), [branch-based Ops: Deploy](examples/github-actions/branch-based/ops.deploy.yml.example), [tag-based Ops: Deploy](examples/github-actions/tag-based/ops.deploy.yml.example), [scheduled scan](examples/github-actions/common/ops.scheduled-scan.yml.example), [housekeeping](examples/github-actions/common/ops.housekeeping.yml.example), start database ([single-slot](examples/github-actions/single-slot/ops.start-database.yml.example), [blue-green](examples/github-actions/blue-green/ops.start-database.yml.example)) ir [tag-based release](examples/github-actions/tag-based/ci.release.yml.example).
Deploy workflow checkout'ina iš `source_sha` tik tuos Compose, helperio ir runtime konfigūracijos failus, kurių reikia konkrečiam paleidimui, ir `docker compose -f` vykdo iš checkout workspace. Todėl hoste nelieka neaiškaus `/srv/<application>/docker-compose...` failo šaltinio. Pirmam diegimui atskiro paruošimo nereikia: `CD: Deploy` prieš migraciją pats paleidžia MySQL bei Redis ir sulaukia jų health. `ops.start-database` yra savarankiškas operatoriaus kelias, kai duomenų bazę reikia paleisti atskirai nuo aplikacijos (pvz., prieš pirmą deploy atkurti dump'ą arba po incidento): jis priima nekintamą `sha-<40>` arba `vX.Y.Z` image tag'ą, tuo pačiu helperiu paruošia runtime secrets ir `compose.env`, patikrina Compose konfigūraciją ir paleidžia tik `mysql`. Konfigūracijos failus jis checkout'ina iš tos revision, iš kurios pastatytas nurodytas image tag'as (`sha-<40>` – iš to commit'o, `vX.Y.Z` – iš to tag'o), o ne iš paleidimo šakos viršūnės; pats workflow failas vis tiek vykdomas iš paleidimo ref, todėl tas ref turi būti apsaugotas Environment šakų politika. Jis dalijasi `cd-deploy-<aplinka>` concurrency grupe, nes perrašo secrets katalogą. Tag'as turi jau egzistuoti registry: tag-based modelyje `sha-` tag'as atsiranda tik po pirmo sėkmingo staging diegimo, tad prieš patį pirmą diegimą šiuo workflow DB paleisti ten negalima. Variantas (single-slot ar blue-green) turi sutapti su `cd.deploy`.
Blue-green `cd.deploy` variantas turi naudoti tą patį `source_sha`, image
digest'ų, build attestation ir `release_workflow` release attestation vartą
kaip single-slot `cd.deploy` visiems šio repozitorijos sukurtiems image'ams;
skiriasi tik slotų rollout ir balancerio perjungimas. Išorinių infrastruktūros
image, pvz. atskiro balancerio, nereikia attestuoti šio aplikacijos build'u:
tokie image privalo būti atskirai peržiūrėti ir pilnai pin'inti
`repository@sha256:<digest>` reference'u.

Blue-green deploy aktyvų slotą nustato iš balancerio konfigūracijos
(`active.conf`), o ne iš atskiro žymeklio failo – taip slot'o būsena negali
išsiskirti su tuo, kur realiai eina srautas. Seka: paleidžiamas neaktyvus
slotas → migracija → slot'o readiness → balancerio perjungimas → readiness per
balancerį → naujas worker'is → viešo HTTPS krašto patikra → seno slot'o
sustabdymas. Jei bet kuris žingsnis po slot'o parinkimo nepavyksta arba run'as
atšaukiamas, rollback žingsnis atstato ankstesnę balancerio konfigūraciją (ji
išsaugoma prieš perrašant; failas keičiamas vietoje, nes tai vieno failo bind
mount), pašalina naują slotą ir vėl paleidžia seno slot'o worker'į. Senas slotas
šalinamas tik po sėkmingo perjungimo, todėl vėlesnis grįžimas prie ankstesnės
versijos yra įprastas tos versijos redeploy per `Ops: Deploy`, o ne slot'o
perjungimas atgal.

Balancerio image yra oficialus Nginx image (1.27.3 ar naujesnis, nes upstream'ai
naudoja `resolve`), fiksuotas digest'u ir atnaujinamas kaip kiti baziniai image.
Projekto Nginx image balanceriui netinka: jame įdėta aplikacijos `default.conf`
ir PHP-FPM upstream. Balancerio konfigūracija laikoma savo kataloge
`docker/balancer/conf.d/default.conf` (TLS ir monitoringo listeneriai,
`server_tokens off`, kad viešas kraštas nerodytų Nginx versijos) ir montuojama iš
checkout'o. Deploy generuoja tik `active.conf` su upstream'ais į aktyvų slotą;
jis montuojamas kaip `upstream.conf`. Pakeitus `default.conf`, balanceris
perkuriamas su `force_recreate_balancer`, nes veikiantis konteineris mato seną failą.

Blue-green balanceris pagal nutylėjimą nekeičiamas: po `nginx -t` aktyvi
konfigūracija pritaikoma per `nginx -s reload`, kad nebūtų nutraukiami aktyvūs
ryšiai. Blue-green projekto `Ops: Deploy` turi `force_recreate_balancer` input'ą
ir perduoda jį į `cd.deploy` (`Ops: Deploy` pavyzdžiuose jo nėra: blue-green projektas prideda boolean `workflow_dispatch` input'ą ir perduoda `force_recreate_balancer: ${{ inputs.force_recreate_balancer }}`);
jis nustatomas į `true`, kai reload nepakanka, pavyzdžiui, pasikeitus
balancerio image'ui, mount'ams ar kitai paleidimo konfigūracijai, taip pat
atnaujinus TLS sertifikatą: secret failai yra bind mount'ai, todėl veikiantis
balanceris po `reload` toliau naudoja seną failą, kol nėra perkurtas. Šis pasirinkimas
turi būti aiškus ir sąmoningas, nes gali trumpam nutraukti balancerio ryšius.

### Logų ir metrikų eksportas

Alloy nėra aplikacijos Compose failo servisas. Jis aprašytas atskirame
[docker-compose.observability.yml](examples/docker/common/docker-compose.observability.example.yml)
projekte, todėl tas pats failas tinka single-slot ir blue-green topologijoms, o
nepavykęs aplikacijos diegimas nesustabdo logų siuntimo. Abu deploy workflow'ai
jį paleidžia po kiekvieno diegimo (`if: always()`), jei secrets helperis gavo
`ALLOY_ENV` ir `LOKI_PASSWORD`; jei ne, run'e paliekamas įspėjimas, kad
`OPS-MON-P02` šiai aplinkai neįvykdyta. Logų eksporto žingsnis niekada nelemia diegimo rezultato (`continue-on-error`): jei Alloy nepasileidžia, run'e paliekama klaidos anotacija, bet job'o rezultatas lieka toks, koks buvo po rollout'o, todėl aplinkos tag'as ir sinchronizacija atitinka tai, kas iš tikrųjų įdiegta. Alloy nemontuoja Docker socket'o: jį
pasiekia per socket proxy, kuris atveria tik skaitymo endpointus. Logų skaitymui
proxy turi turėti `ALLOW_LOGS=1`: vien `CONTAINERS=1` leidžia rasti konteinerius,
bet ne skaityti jų logų, o Alloy tokiu atveju atrodo sveikas ir nieko nesiunčia.

Socket proxy image šiuo metu rekomenduojamas `ghcr.io/linuxserver/socket-proxy`,
prisegtas digest'u: iš išbandytų variantų jis vienintelis neturi aukštų ar kritinių
Trivy radinių ir leidžia atverti logų skaitymą atskirai nuo kitų `/containers/`
užklausų. `tecnativa/docker-socket-proxy` nerekomenduojamas: atnaujinamas retai
ir skenuojant turi dešimtis žinomų pažeidžiamumų. Abu yra bendruomenės image, o
proxy dirba kaip root prie Docker socket'o, todėl projektas tai įrašo kaip priimtą
riziką. Keičiant proxy image ar jo versiją būtina iš naujo patikrinti, kad logai
pasiekia Loki: tie patys nustatymai skirtinguose image reiškia ne tą patį.
Organizacijos nuosavas proxy image ant oficialaus HAProxy (be root, su vienu
peržiūrimu leidimų sąrašu) yra rengiamas; kai bus išleistas, pavyzdys rodys į jį. Compose
profiliai tam nenaudojami nei development, nei production failuose: eksportas
yra atskiras failas, kurį galima paleisti arba nepaleisti. Pavyzdinė
[config.alloy](examples/docker/common/alloy/config.alloy.example) renka tik tų konteinerių
stdout/stderr, kurie turi label'į `app.logging.enabled=true`. Production Compose
failuose šiuos label'ius kiekvienam servisui suteikia `x-log-labels` anchor'ai
(`component`, `service_name`, `type`), o Alloy juos paverčia Loki label'iais.
Abu blue-green slotai turi tuos pačius label'ius, todėl naujas slotas pradedamas
rinkti iškart. Naujas servisas be šio label'io į centrinę logų sistemą nepatenka.

### Image retention

Kiekvienas build'as registry palieka `candidate-<sha>-<run>` tag'ą, o sėkmingas
– dar ir `sha-<40>`. Be valymo registry auga neribotai (`OPS-FIN-P02`). Valymą
atlieka bendro `housekeeping` workflow job'as `prune-images`, kuris vykdomas tik
tada, kai `ops.housekeeping` jo paprašo: rankiniu paleidimu pažymėjus
`prune_images` arba pagal tvarkaraštį nustačius repozitorijos kintamąjį
`HOUSEKEEPING_PRUNE_IMAGES`. Pagal nutylėjimą jis tik praneša, ką trintų (dry
run); sąrašas matomas run'o suvestinėje. Tvarkaraščio paleidimas iš tikrųjų
trina tik tada, kai papildomai nustatytas `HOUSEKEEPING_PRUNE_DRY_RUN` = `false`.

Diegimo hoste senus image valo pats `cd.deploy`: po sėkmingo diegimo paskutinis
žingsnis kviečia organizacijos `docker-cleanup` action'ą
(`vilnius-vmsa/shared-workflows/.github/actions/docker-cleanup@main` arba jo
kopiją projekto `.github/actions/` kataloge). Jis pašalina image, kurių
nenaudoja joks konteineris, nenaudojamus tinklus ir seną build cache. Kitaip
kiekvienas diegimas paliktų ankstesnius PHP ir Nginx image tame pačiame
diske kaip duomenų bazės volume. Volume netrinami, o valymo klaida diegimo
rezultato nekeičia (`continue-on-error`). Grįžtant prie senesnės versijos jos image vėl parsiunčiamas
iš registry, todėl registry saugojimo riba turi apimti rollback laikotarpį.

GHCR trina visą image versiją su visais jos tag'ais, o ne atskirą tag'ą, todėl
versija parenkama tik tada, kai tai leidžia kiekvienas jos tag'as:

| Versija | Veiksmas |
|---|---|
| Visi tag'ai yra `candidate-*` (build'as nepraėjo vartų) ir versija senesnė nei 14 d. | Trinama |
| Turi `staging`, `production`, `latest`, `vX.Y.Z` ar `buildcache` | Niekada netrinama |
| Turi tik `sha-<40>` (ir `candidate-*`) | Paliekama 20 naujausių ir visos jaunesnės nei 90 d.; senesnės trinamos |
| Attestation tag'ai (`sha256-<digest>…`) | Trinami tik kartu su savo image arba kai jų image nebėra |
| Be tag'ų | Neliečiama |

Netag'intos versijos neliečiamos sąmoningai: tarp jų yra paliekamų image SBOM,
provenance ir platformų manifestai, ir aklai juos trinant sugadinami galiojantys
image. Skaičiai (14 d., 20 versijų, 90 d.) keičiami `ops.housekeeping`
parametrais; `sha-<40>` riba turi apimti laikotarpį, per kurį dar gali prireikti
grįžti prie senesnės versijos per `Ops: Deploy`.

### Runner'iai ir GitHub Environment

Workflow failuose esančios patikros (attestation, ancestry, source ref) saugo tik
tada, kai paties deploy kelio negalima apeiti. Tai užtikrina ne YAML, o GitHub
nustatymai, todėl jie yra pavyzdžių dalis:

| Kas | Kur vykdoma / kaip nustatyta |
|---|---|
| Lint, testai, build, scan, attestation, smoke, tag promotion | GitHub-hosted `ubuntu-latest`; be `environment:` ir be prieigos prie hostų |
| Deploy, redeploy, `ops.start-database` | `runs-on: "${{ inputs.environment }}"` ir `environment: ${{ inputs.environment }}` |
| Self-hosted runner'is | Po vieną kiekvienai aplinkai, su tos aplinkos label'iu (`staging`, `production`); prieinamas tik tam skirtoms repozitorijoms |
| GitHub Environment | Po vieną kiekvienai aplinkai; jame tik tos aplinkos secrets ir kintamieji (`RUNTIME_ENV`, TLS, `PUBLIC_URL`) |
| Build kredencialai (`COMPOSER_APP_ID`, `COMPOSER_APP_PRIVATE_KEY`) | Repozitorijos arba organizacijos lygio kintamasis ir secret, ne Environment: build job'as aplinkos nedeklaruoja. GitHub App token'ui `ci.build` nurodo `owner` ir privačių paketų repozitorijų sąrašą – be jų token'as galioja tik pačiai repozitorijai |
| Environment „Deployment branches and tags“ | Branch-based: `staging` ← `stage`, `production` ← `main`; tag-based: `staging` ← `main`, `production` ← `v*.*.*` ir `main` (operatoriaus redeploy) |
| Environment „Required reviewers“ | Rekomenduojama production aplinkai (ypač tag-based modelyje); neprivaloma. Privalomas patvirtinimas – PR peržiūra prieš sujungimą į apsaugotą šaką ([4.3.3](../04-kodo-kurimo-gaires.md#433-šakų-branch-apsauga)) |

Kodėl to reikia: `workflow_dispatch` galima paleisti iš bet kurios šakos, ir
tada vykdoma tos šakos workflow versija, kurioje patikros gali būti pakeistos.
Environment šakų ir tag'ų politika tokį run'ą sustabdo dar prieš job'ui gaunant
secrets ar runner'į. Bendras label'is visoms aplinkoms (pvz., `deployment`)
netinka: production job'as galėtų būti įvykdytas staging hoste ir atvirkščiai.
Šių nustatymų code review nemato, todėl jie tikrinami perduodant projektą ir
aprašomi projekto diegimo dokumentacijoje.

Permissions nurodomos workflow arba job lygiu, `pull_request` iš fork'o negali gauti production secrets ar privileged build tokenų. Visi diegimo ir redeploy keliai baigiasi tame pačiame `CD: Deploy` job'e, o jo job lygio concurrency grupė `cd-deploy-<aplinka>` užtikrina, kad diegimas ir redeploy į tą pačią aplinką nevyktų lygiagrečiai. `ops.start-database` hostą keičia savo job'e (perrašo secrets katalogą), todėl naudoja tą pačią grupę. Aplinkos tag'o perkėlimas po diegimo (`promote-environment`) turi savo grupę `promote-<aplinka>`: bendroje deploy grupėje laukiantį perkėlimą galėtų atšaukti į eilę atėjęs kitas diegimas, ir tag'as liktų ant senos versijos. Kviečiantis workflow (pvz., `Ops: Deploy`) privalo naudoti kitą grupės vardą (`ops-deploy-<aplinka>`): jei kvietėjas ir kviečiamas job'as prašo tos pačios grupės, GitHub run'ą atšaukia kaip deadlock. Build ir release workflow grupės taip pat atskiros.


### Published-image smoke patikra

Smoke vartas yra privalomas (`OPS-PIPE-P01`): kiekviena aplikacija turi turėti
savo smoke testus, kurie prieš deploy paleidžia ką tik paskelbtus image ir
patikrina, kad aplikacija iš tikrųjų veikia. Kaip vartas įgyvendintas,
sprendžia projektas – tai gali būti skriptas, workflow žingsniai ar atskiras
reusable workflow. Privalomas yra rezultatas, ne forma.

Ką smoke vartas turi įrodyti, nepriklausomai nuo realizacijos:

1. tikrinami tie patys image digest'ai, kurie bus diegiami, ir tik po build
   attestation patikros;
2. aplikacija startuoja su savo priklausomybėmis (DB, cache, queue) ir gali
   vykdyti migracijas;
3. bent viena tikra užklausa praeina visą kelią web serveris → aplikacijos
   procesas → priklausomybės; pavyzdžiuose tai readiness maršrutas, kuris dar ir
   grąžina `release`, lygų build'intam source SHA;
4. readiness nepraeina, kai kritinė priklausomybė neveikia;
5. foniniai procesai (queue worker) realiai apdoroja užduotį, o ne tik
   pasileidžia;
6. naudojamos tik vienkartinės CI reikšmės – jokių aplinkų secrets ar duomenų –
   ir viskas išvaloma net nesėkmės atveju.

Rekomenduojama, kad vartas paleistų image'us ta pačia konfigūracija, kuria jie
diegiami (tas pats Compose failas ir secrets paruošimas), nes tada CI patikrina
ir diegimo topologiją: read-only failų sistemas, `cap_drop`, neprivilegijuotus
naudotojus, secret failų teises, tinklus ir healthcheck'us. Jei smoke naudoja
atskirus `docker run` parametrus, juos reikia ranka laikyti sinchronizuotus su
Compose, o topologija pirmą kartą paleidžiama tik staging hoste.

#### Pavyzdinė realizacija

`docker/scripts/smoke-published-images.sh` yra tik pavyzdys, kaip šiuos punktus
įgyvendinti Laravel aplikacijai su Docker Compose; jo kopijuoti neprivaloma.
Abiejuose `ci.build` pavyzdžiuose workflow turi trumpą `Smoke-test` žingsnį,
kuris jį iškviečia su konkrečiais PHP-FPM ir Nginx digest'ais.

Pavyzdinis skriptas nenaudoja atskirų `docker run` parametrų. Jis kviečia tą
patį `prepare-runtime-secrets.sh` helperį ir tą patį production Compose failą,
kuriuos naudoja `CD: Deploy`, su vienkartinėmis reikšmėmis laikiname
`SECRETS_DIR`, ir kartoja deploy seką: MySQL/Redis → migracija → `up --wait` →
readiness per privatų `18080` listenerį → queue job'as, kurį apdoroja veikiantis
`worker` servisas → patikra, kad sustabdžius duomenų bazę readiness nepraeina.

Skriptas paleidžia tą topologiją, kurią projektas diegia. Abu variantai naudoja
tą patį failo vardą, todėl topologiją skriptas atpažįsta iš paties
`docker-compose.production.yml`: jei jame yra slotų servisai (`php-blue`,
`php-green`), tai blue-green. `ci.build` nieko nustatyti nereikia; kintamuoju
`SMOKE_TOPOLOGY` topologiją galima nurodyti ir tiesiogiai.

| Topologija | Compose failas | Paleidžiami servisai | Aplikacijos listeneris |
|---|---|---|---|
| `single-slot` | `docker-compose.production.yml` + CI override | `php`, `worker`, `nginx` | TLS `8443` |
| `blue-green` | `docker-compose.production.yml` (blue-green variantas) + CI override | vienas slotas: `php-<slot>`, `worker-<slot>`, `nginx-<slot>` su montuojamu slot'o upstream | `8080` |

CI runner'yje nieko nėra įdiegta, todėl aktyvaus sloto ten nėra: vartas paleidžia
vieno sloto apibrėžimą (`blue`, jei `SMOKE_SLOT` nenurodo kito). Į kurį slotą
versija diegiama hoste, nusprendžia `cd.deploy` pagal balancerio konfigūraciją.

Blue-green atveju balanceris nepaleidžiamas: jo image yra išorinis, o
konfigūraciją sugeneruoja deploy. Slot'o perjungimas ir rollback tikrinami
paties blue-green `cd.deploy` readiness vartais.

Jei projektas neturi Laravel queue ar vieno iš šių servisų, vartas turi būti
pritaikytas konkrečiam runtime, išlaikant atitinkamų kritinių dependency,
worker ir edge health vartų rezultatą.

### Single-slot ar blue-green

`CD: Deploy` naudoja single-slot Compose pagal nutylėjimą. Jei projektui
reikalingas slotų perjungimas, tas pats image digest handoff gali būti perduotas
blue-green `cd.deploy` ir Compose variantams.

Runtime pasirinkimas turi būti aiškus kiekvienai aplinkai: `CD: Deploy` gali
naudoti single-slot arba blue-green rollout, tačiau `Ops: Deploy` pavyzdys
abiem atvejais atlieka tik jau patikrinto image redeploy. Runtime service
recreation ir secret rotation, jei jų reikia, nepatenka į šį workflow.

Abiem variantams privalomi tie patys source SHA, digest, attestation, smoke ir
health vartai. Šiame priede pateikti workflow pavadinimai, skriptų keliai ir Compose
komandos yra rekomenduojama šio priedo realizacija; scriptas yra tik patogus
secrets sukūrimo būdas, todėl projektas gali naudoti secret managerį, platformos
native mechanizmą ar kitą operatoriaus įrankį, taip pat sujungti ar pervadinti
pavyzdžius, jei išlaiko tuos pačius saugos ir atsekamumo rezultatus.

### Neakivaizdūs pavyzdžių sprendimai

Pavyzdžių failuose komentarų nėra, todėl čia surašyta, kodėl kai kurios eilutės yra būtent tokios ir kodėl jų nereikia „supaprastinti“:

- **`docker buildx imagetools create --prefer-index=false`** (`ci.build`, `ci.release`): tag'o perkėlimas turi būti tiksli kopija. Pagal nutylėjimą Buildx vienos platformos manifestą įvelka į naują image index su kitu digest'u, ir digest'o patikra nepraeitų. Build'ai su SBOM ir provenance jau stumia index'ą, kuris kopijuojamas nepakeistas.
- **`fastcgi_read_timeout` ir `proxy_read_timeout` 130 s** (Nginx, TLS kraštas, balanceris): ilgiau nei PHP `max_execution_time` (120 s). Su numatytomis 60 s Nginx grąžintų `504`, kol PHP dar leidžiama dirbti.
- **`fastcgi_keep_conn on`**: be jo upstream'o `keepalive` neveikia.
- **MySQL `healthcheck` vykdo `SELECT 1`**, ne `mysqladmin ping`: `ping` pavyksta ir tada, kai slaptažodis atmestas.
- **Redis slaptažodis įrašomas į konfigūracijos failą `tmpfs` kataloge**, o ne perduodamas komandinėje eilutėje, kad nebūtų matomas procesų sąraše ir `docker inspect`.
- **Nginx įkėlimų volume montuojamas su `nocopy`**: kitaip tuščias volume perimtų Nginx image katalogo savininką ir PHP nebegalėtų į jį rašyti.
- **Alloy konfigūracijoje nėra `stage.docker`**: jis skirtas `json-file` log driver formatui, kurio Docker API šaltinis neteikia, ir perrašytų aplikacijos JSON eilutę su `log` ir `stream` raktais.
- **`git fetch` nėra po checkout su `persist-credentials: false`** (tag-based `ops.deploy`): privačioje repozitorijoje jis nepavyktų; `fetch-depth: 0` jau parsiunčia visas šakas ir tag'us.

## H.5. Branch-based srauto pavyzdys

Šis modelis tinka, kai `stage` yra nuolatinė staging aplinka, `main` – produkcijos šaltinis, o komanda tą pačią dieną leidžia daug pakeitimų. Pritaikomas workflow pavyzdys: [branch-based/ci.build.yml.example](examples/github-actions/branch-based/ci.build.yml.example).

```text
feature/*
   │ PR
   ▼
stage ── CI: Pipeline ── CI: Build (build/scan/SBOM/attest/verify/smoke → immutable source tag) ── CD: Deploy + health ── promote staging tag
   │
   │ patvirtintas PR
   ▼
main  ── CI: Pipeline ── CI: Build (build/scan/SBOM/attest/verify/smoke → immutable source tag) ── CD: Deploy + health ── promote production tag
                                                                  │
                                                                  ▼
                                                        optional main → stage sync PR
```

### Build nesėkmės ir docs-only push elgsena

Ar push'ui reikia image build'o, `CI: Pipeline` sprendžia lygindamas šį commit'ą
ne su ankstesniu push'u, o su tuo, kas aplinkoje įdiegta: bazė yra image, šiuo
metu turinčio aplinkos tag'ą (`staging` arba `production`), `revision` label'is.
Aplinkos tag'as perkeliamas tik po sėkmingo deploy ir readiness patikros, todėl
jis tiksliai atspindi paskutinę įdiegtą versiją.

| Situacija | Sprendimas |
|---|---|
| Aplinkos tag'o dar nėra (pirmas diegimas) | build'inti |
| Įdiegtas commit'as nėra šios repozitorijos arba nėra šio commit'o protėvis | build'inti |
| Nuo įdiegtos versijos pasikeitė bent vienas failas, galintis patekti į image | build'inti |
| Nuo įdiegtos versijos pasikeitė tik dokumentacija ir pagalbiniai failai | nebuild'inti |
| Registry nepasiekiama | job'as nepavyksta (nei build'inama, nei praleidžiama) |

Kodėl ne push intervalas: lyginant tik su ankstesniu push'u kodas galėtų dingti
tyliai. Jei kodo push'as būtų išstumtas iš eilės arba jo diegimas nepavyktų, o
kitas push keistų tik dokumentaciją, build'as būtų praleistas ir tas kodas
niekada nepasiektų aplinkos, nors `main` būtų sinchronizuotas į `stage`. Lyginant
su įdiegta versija toks commit'as lieka skirtumo dalimi ir subuild'inamas su
kitu push'u, kad ir ką tas push'as keistų.

Kurie failai laikomi build-reikšmingais, sprendžiama pagal sąrašą failų, kurie
tikrai nepatenka į image (`docs/**`, Markdown failai repozitorijos šaknyje,
pagalbiniai `.github` failai). Markdown gilesniuose kataloguose (pvz.
`resources/`) laikomas build-reikšmingu, nes gali būti aplikacijos turinys.
Visa kita build'ą sukelia, todėl naujas katalogas ar failo tipas nelieka tyliai
neįdiegtas. Projektas, kurio Dockerfile kopijuoja aiškų kelių sąrašą, gali
vietoj to naudoti tą patį sąrašą kaip leidžiamųjų sąrašą, bet tada abu privalo
būti keičiami kartu.

Jei build ar deploy nepavyksta, GitHub Actions praneša push autoriui. Autorius
pašalina priežastį ir pasirenka `Re-run failed jobs`, jei klaida buvo laikina,
arba push'ina pataisytą commit'ą. Kol tai nepadaryta, senesnis patikrintas image
lieka įdiegtas, aplinkos tag'as nepajuda, o failed workflow būsena lieka matoma
ir audituojama.

`main` į `stage` sinchronizuojamas tik dviem atvejais: po sėkmingo šio run'o
build ir deploy arba kai nuo įdiegtos versijos nepasikeitė nieko
build-reikšmingo, t. y. `main` tikrai atitinka production.

Šiame modelyje `stage` ir `main` image build'inami atskirai, nes `stage` gali
turėti dar nepatvirtintų funkcijų. Todėl production image nėra tas pats
artefaktas, kuris veikė staging'e: staging patvirtina kodą, o production
build'ą saugo tik pipeline vartai – digest'u fiksuotos bazės, lock failai, tas
pats Dockerfile ir pilnas smoke vartas. Už tai, kad į `main` patektų tik
staging'e išbandyti pakeitimai, atsako komanda, ne pipeline. Jei reikia, kad į
production patektų tiksliai staging'e patikrintas artefaktas, renkamasis
tag-based modelis.

Svarbios sąlygos:

- workflow perduoda tikslų commit SHA, kuris praėjo CI vartus, o ne vėliau iš naujo išsprendžia branch'o HEAD;
- staging ar production deploy vyksta tik po visų saugumo ir smoke vartų;
- `main` → `stage` sinchronizacija kuriama tik po užbaigto reusable build/deploy job ir faktinio production readiness patikrinimo, arba kai push nepakeitė nė vieno build-reikšmingo failo (niekas nediegta, `main` tebeatitinka production); nepavykęs ar atšauktas deploy niekada nesinchronizuojamas;
- `stage` → `main` automatinė sinchronizacija draudžiama, nes staging gali turėti nebaigtų funkcijų;
- konfliktas sinchronizacijos PR sustabdo automatizavimą ir paliekamas žmogui išspręsti;
- kiekvienas aplinkos deploy turi būti rollback'inamas pagal konkretų image digest;
- rankinis redeploy atliekamas per `Ops: Deploy`, kuris išsprendžia promoted environment arba `sha-<40>` tag'ą į jau patikrintus PHP-FPM ir Nginx digest'us;
- host-managed TLS ir kitas runtime maintenance valdomas atskira projekto arba platformos procedūra, nepatenkančia į `Ops: Deploy` redeploy workflow;
- secret paruošimas ar rotacija vykdoma per dokumentuotą, saugią ir audituojamą procedūrą pagal H.3 aprašytą `RUNTIME_ENV`, TLS Base64, `SECRETS_DIR` ir `compose.env` kontraktą. Rekomenduojamas patogus helperio šaltinis yra `docker/common/scripts/prepare-runtime-secrets.sh.example`, kurį projekte galima nukopijuoti kaip `docker/scripts/prepare-runtime-secrets.sh`; šis kelias ir failo vardas nėra privalomi.

## H.6. Tag-based srauto pavyzdys

Šis modelis tinka, kai production leidimai turi būti aiškiai versijuoti ir patvirtinti. Šiame standarto pavyzdyje `main` push sukuria candidate digest, jį patikrina ir įdiegia į staging; vėliau apsaugotas tag paaukština tą patį staging patikrintą digest į production per production GitHub Environment. Jį sudaro atskiras candidate build ir staging deploy etapas ([tag-based/ci.build.yml.example](examples/github-actions/tag-based/ci.build.yml.example)) bei tag'o promotion/release etapas ([tag-based/ci.release.yml.example](examples/github-actions/tag-based/ci.release.yml.example)).

```text
push main ── CI quality gate ── candidate build/scan/SBOM/provenance
                                      │
                         attestation/verify/smoke
                                      │
                                      ▼
                               deploy staging
                                      │
                         protected vX.Y.Z tag
                                      │
                                      ▼
          verify staging-tested SHA → promote same digest → deploy production (optional Environment approval)
```

Tag-based `ci.build` paleidžiamas per `workflow_run`, kuris suveikia ir PR
run'ams, o `branches` filtras tikrina tik head šakos pavadinimą. Todėl build
job'as privalo papildomai tikrinti, kad pradinis įvykis buvo `push`, šaka –
`main`, o head repozitorija – ta pati; kitaip PR iš fork'o su šaka `main` gautų
build teises ir staging deploy.

Tag workflow turi:

1. `main` push candidate digest'ą įdiegti į staging tik po CI, scan, attestation, verify ir smoke vartų;
2. išspręsti tag į konkretų commit ir patikrinti, kad ref yra tikras `refs/tags/...`, o ne taip pavadintas branch'as;
3. pagal `sha-<source SHA>` tag'ą surasti digest'us ir patikrinti jų „staging-verified“ attestation, kurią `ci.build` pasirašo tik po sėkmingo staging deploy ir readiness patikros; be jos promotion nevyksta;
4. production deploy vykdyti per apsaugotą GitHub Environment, kuris leidžia diegti tik iš apsaugotų tag'ų; „Required reviewers“ jame rekomenduojami, bet neprivalomi;
5. promotion metu naudoti tą patį digest, o ne rebuild'inti source iš tag'o;
6. įrašyti versiją, commit SHA, image digest'us, migracijas ir rollback veiksmus į release notes – pavyzdyje `ci.release` tai sugeneruoja pats kaip „Deployment record“ (naujos migracijos nuo ankstesnio tag'o, atskirai – pakeistos, ištrintos ar pervadintos jau išleistos migracijos, ir ankstesnė versija rollback'ui) ir prideda prie GitHub Release;
7. neleisti perrašyti jau paskelbto version tag ir naudoti `latest` kaip vienintelio rollback identifikatoriaus.

Release workflow turi workflow lygiu nustatyti tik `contents: read`. Job'as,
kuris išsprendžia smoke-tested metadata, promote'ina digest'us, kuria release ir
rašo release attestation, gauna `contents: write`,
`packages: write`, `id-token: write` ir `attestations: write` teises. Reusable
`CD: Deploy` job'as gauna tik `contents: read`, `packages: read` ir
`attestations: read`; promotion teisės negali būti paveldimos į deploy job'ą.

Tag-based candidate build po sėkmingų scan, attestation, verify ir smoke vartų
įdiegiamas į staging. Tik po sėkmingo staging deploy ir health patikros atskiras
job'as paskelbia immutable `sha-<source SHA>` tag'ą prie kiekvieno deployuojamo
image. `ci.release` šiuos tag'us išsprendžia tiesiai registry į digest'us ir nebesisiunčia
`image-metadata` workflow artifact'o. Todėl release sukūrimas nepriklauso nuo
workflow artifact retention. Registry image versijas valo `ops.housekeeping`
(žr. „Image retention“): `sha-<40>` tag'ų saugojimo riba turi apimti laiką
tarp staging diegimo ir release tag'o sukūrimo, kitaip `ci.release` neras digest'o.

GitHub Release `--latest` žyma šiame modelyje yra informacinė: ji rodo
paskutinį sėkmingą ir patikrintą release build'ą, o ne paskutinę sėkmingai į
production įdiegtą versiją. `CD: Deploy` GitHub Release nenaudoja — jis gauna
konkretų source SHA ir image digest'us bei atskirai tikrina production health.
Todėl release gali būti pažymėtas `--latest` prieš deploy; nesėkmingas deploy
nepaverčia release nepatikrintu build'u ir neturi automatiškai perkelti
`--latest` žymos atgal.

Šiame projekto modelyje staging yra privalomas tarpinis deploy prieš production tag promotion. Kituose tag-based modeliuose staging gali būti pasirenkamas tik tada, kai candidate jau pilnai patikrintas kitu būdu ir production Environment reikalauja „Required reviewers“ patvirtinimo; tai nekeičia šio pavyzdžio sekos. Jei candidate build arba staging health patikra nepraėjo, jo digest negali būti paaukštintas vien todėl, kad vėliau atsirado tag su tuo pačiu SHA. Candidate build'ai vykdomi po vieną, merge tvarka (viena concurrency grupė build job'e; ji nustatyta job'o, ne workflow lygiu, kad praleidžiami run'ai – po nepavykusio `CI: Pipeline` ar iš PR – neužimtų eilės), todėl staging visada lieka ties naujausiu commit'u. Jei eilėje susikaupia keli merge, senesnis laukiantis candidate atšaukiamas ir jo commit'as į staging nepatenka – release tag'ą tada reikia dėti ant naujesnio commit'o arba pakartoti to commit'o `ci.build` run'ą.

## H.7. Rollback

Pavyzdžiai šiuo metu įgyvendina du rollback mechanizmus. Kita dalis dar
neaprašyta ir pažymėta atskirai; kol jos nėra, ją turi apibrėžti projekto
diegimo dokumentacija (`OPS-CD-P03`).

### Kas įgyvendinta

| Situacija | Mechanizmas | Kur |
|---|---|---|
| Blue-green diegimas nepavyko arba run'as atšauktas | Automatinis rollback to paties run'o viduje: atstatoma ankstesnė balancerio konfigūracija, pašalinamas naujas slotas, vėl paleidžiamas seno slot'o worker'is | blue-green `cd.deploy`, žingsnis „Roll back a failed or cancelled deployment“ |
| Diegimas nepavyko (bet kuri topologija) | Aplinkos tag'as (`staging`, `production`) neperkeliamas ir lieka ant paskutinės sėkmingai įdiegtos versijos | branch-based `ci.build`, job'as `promote-environment` |
| Reikia grįžti prie anksčiau paskelbtos versijos | Operatoriaus redeploy pagal nekintamą tag'ą: tikrinama image kilmė ir attestation, nieko nebuild'inama | branch-based `Ops: Deploy` (`sha-<40>` arba tuščias – aplinkos tag'as), tag-based `Ops: Deploy` (`vX.Y.Z`) |

Bendra visiems atvejams: rollback visada remiasi nekintamu digest'u, o ne
perrašomu `latest`, ir duomenų bazės schemos atgal nekeičia. Todėl migracijos
turi būti suderinamos su ankstesne kodo versija (expand/contract, žr. H.3).

### Dar neaprašyta

Šios dalys pavyzdžiuose neįgyvendintos ir standarte dar neapibrėžtos:

- **Single-slot nepavykęs diegimas.** Automatinio grįžimo nėra: nepavykus
  migracijai ar `up`, worker'is lieka sustabdytas, o secrets katalogas jau
  pakeistas. Grįžtama operatoriaus redeploy.
- **Aplinkos tag'o reikšmė po rankinio rollback.** `Ops: Deploy` aplinkos
  tag'o neperkelia, todėl po grįžimo prie senesnės versijos `production` tag'as
  toliau rodo į naujesnę. Neapibrėžta, ar tag'as reiškia „paskutinė pipeline
  įdiegta“, ar „šiuo metu veikianti“ versija.
- **Ankstesnės geros versijos radimas.** Nėra `production-previous` tag'o ar
  kito įrašo; ankstesnį SHA operatorius randa Actions istorijoje.
- **Duomenų bazės kopija prieš migraciją.** Deploy jos nedaro; atsarginių
  kopijų reikalavimai yra [3.6.7 skyriuje](../03-architektura.md#367-duomenų-atsarginės-kopijos-ir-atkūrimas),
  bet ryšys su diegimu neaprašytas.
- **Rollback bandymas.** `OPS-CD-P03` reikalauja patikrinto rollback; kaip ir
  kada jis bandomas, neaprašyta.

## H.8. Bendras CI/CD kontrolinis sąrašas

Prieš sujungiant DevOps pakeitimą patikrinkite:

- [ ] Dockerfile bazės turi versiją ir digest, naudojami multi-stage etapai.
- [ ] Lock failai, BuildKit cache ir BuildKit secrets naudojami be credential'ų image layer'iuose.
- [ ] Production Compose nenaudoja `build:` ar source bind mount'ų.
- [ ] Persistent volume turi tik naudotojų duomenys; `bootstrap/cache`, `storage/framework/*` ir logai nėra persistent ar tarp slotų bendrinami.
- [ ] Service DNS, healthcheck, `depends_on`, resursų ribos ir persistent volumes aprašyti.
- [ ] Stateful servisai (MySQL, Redis) startuoja neprivilegijuotu naudotoju su `cap_drop: [ALL]` be `cap_add`; kiekvienas servisas su savo `tmpfs` sąrašu pakartoja reikalingą `/tmp`.
- [ ] Aplikacija turi smoke vartą su savo smoke testais; jis įrodo H.4 „Published-image smoke patikra“ išvardytus punktus. Rekomenduojama image'us paleisti per production Compose ir secrets paruošimą, o ne per atskirus `docker run` parametrus.
- [ ] PR ir protected branch/tag vartai vykdo lint, test, vulnerability scan ir secret scan.
- [ ] Build ir testai vykdomi GitHub-hosted runner'iuose; deploy job'ai – tik tos aplinkos self-hosted runner'yje ir per tos aplinkos GitHub Environment su šakų/tag'ų politika.
- [ ] Image turi SBOM, provenance ir attestation; attestation patikrinama prieš smoke test/promotion vartus.
- [ ] Branch-based sraute prieš deploy paskelbiamas tik nekintamas `sha-<40>` source tag'as, o `staging` / `production` / `latest` tag'ai perkeliami tik po sėkmingo deploy ir health patikros.
- [ ] Smoke test patvirtina ne tik HTTP atsakymą, bet ir kritinį worker/database/Redis veikimą, kai jie yra sistemos dalis.
- [ ] Liveness (`/health`, FPM ping) ir readiness (`/health/ready` per PHP-FPM su DB/Redis patikra) yra atskirti; Compose `healthcheck` naudoja liveness, o readiness pasiekiamas tik per privatų listenerį.
- [ ] Smoke ir deploy vartai tikrina readiness ir lygina grąžintą `release` su `source_sha`; deploy išsaugo įdiegtą digest.
- [ ] Rollback procedūra išbandyta ir nurodo nekintamą digest arba version tag; H.7 „Dar neaprašyta“ dalys apibrėžtos projekto diegimo dokumentacijoje.
- [ ] Pasirinktas Git leidimo modelis ir diegimo būdas įrašyti `.dev-standard/config.json` stack'ais ir aprašyti diegimo dokumentacijoje (`OPS-PIPE-P07`).

> Šablonas turi būti pritaikytas projekto runtime, registry, secrets ir infrastruktūrai. Šis priedas nepakeičia projekto threat model, incidentų runbook ar konkretaus cloud tiekėjo reikalavimų.
