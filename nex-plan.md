# Planas: DevOps standarto skaidymas pagal metodus

**Būsena: planas įvykdytas** (žingsniai 1–8). Liko tik žingsnis 9 (`login` `config.json`), kurį galima daryti tik po leidimo, ir `legacyIncludes` pašalinimas kitame leidime. Nuo plano nukrypta dviem vietomis: H priedo poskyriai nepernumeruoti (pridėta atitikimo lentelė), `OPS-PIPE-P06` palikta `infra`. Sprendimai dėl 7 skyriaus klausimų: pavadinimai ir skirstymas kaip plane; pereinamasis laikotarpis – variantas (a), įgyvendintas `legacyIncludes` lauku `standard/stacks.yaml`, kurį kitame leidime reikia pašalinti.

Šis planas vykdomas **po to**, kai uždarytos `pastabos.md` C ir D skyrių pastabos. Jis nekeičia reikalavimų turinio – keičia, kuriam projektui kurios `OPS-*` taisyklės taikomos, ir atitinkamai pertvarko 8 skyrių, H priedą bei pavyzdžius.

## 1. Tikslas

Šiandien visos `OPS-*` taisyklės turi vieną žymą `stacks=infra`, todėl automatinis review tag-based projektui taiko branch-based taisykles, single-slot projektui – blue-green, o Kubernetes projektui – Compose taisykles.

Po pakeitimo:

- bendros taisyklės galioja visiems;
- metodui būdingas taisykles projektas gauna tik pasirinkęs tą metodą;
- technologijai, kuriai profilio nėra, specifinės taisyklės netaikomos, bet review tai pasako aiškiai, o bendros taisyklės galioja toliau.

## 2. Kaip tai veikia dabar (ko nereikia kurti)

- Kiekviena repozitorija stack'us deklaruoja `.dev-standard/config.json` (`login`: `php, laravel, frontend, mobile, infra, db`).
- Stack'ai aprašyti [standard/stacks.yaml](standard/stacks.yaml): `description`, privalomas `applyTo` (failų glob'ai) ir `implies` (kokius stack'us apima automatiškai).
- Taisyklės stack'as nurodomas žymoje virš taisyklės: `<!-- OPS-X-P01 | ai-reviewable | stacks=infra | enforced-by=ai -->`.
- Sinchronizacija ([.github/actions/sync/sync.mjs](.github/actions/sync/sync.mjs)) išskleidžia `implies` ir į repozitoriją atneša po vieną `dev-standard-<stack>.instructions.md` kiekvienam stack'ui.

Vadinasi, skaidymui užtenka naujų stack'ų ir taisyklių žymų pakeitimo. Taisyklių ID nekeičiami.

## 3. Tiksliniai stack'ai

| Stack | Apima (`implies`) | Turinys | `applyTo` (siūloma) |
|---|---|---|---|
| `infra` | – | Bendros taisyklės: aplinkos, CI, CD, versijavimas, DevSecOps, stebėsena, IaC, leidimai, FinOps, pipeline vartai, runner'iai ir Environment, health/readiness vartas, redeploy ir secrets procedūros | `.github/workflows/**,**/*.tf,**/*.tfvars` |
| `docker` | `infra` | Image build: Dockerfile, registry vardai, tag'ai, label'iai, digest'ai | `**/Dockerfile*,**/.dockerignore` |
| `compose` | `docker` | Compose diegimas (numatytasis single-slot): failų atskyrimas, hardening, secrets failai, persistent duomenys, smoke per Compose | `**/docker-compose*.yml,**/compose*.yml,docker/**` |
| `compose-blue-green` | `compose` | Slotai, balanceris, slot'o upstream, automatinis rollback | kaip `compose` |
| `flow-branch` | `infra` | `stage → staging`, `main → production`, vienkryptė sinchronizacija, aplinkos tag'ų perkėlimas | `.github/workflows/**` |
| `flow-tag` | `infra` | Apsaugotas release tag, promotion be rebuild, privalomas approval, release įrašas | `.github/workflows/**` |
| `k8s` | `docker` | Esamos `OPS-K8S-*` ir `OPS-GITOPS-*` taisyklės; pavyzdžių kol kas nėra | `**/k8s/**,**/helm/**,**/charts/**,**/kustomization.yaml` |

Pastabos:

- **Atskiro `single-slot` stack'o nereikia.** Single-slot neturi savų taisyklių – tai tiesiog `compose` be blue-green papildymo.
- **`infra` `applyTo` jau susiaurintas** (workflow'ai, `docker/**`, Dockerfile, Compose, Terraform, Kubernetes katalogai). Skaidant stack'us šiuos kelius reikia padalyti naujiems stack'ams.
- **Pavadinimai.** Dabartinis modelis su ilgalaikėmis `stage` ir `main` šakomis nėra trunk-based, todėl vadinamas `flow-branch`. Jei norima kito vardo, jis keičiamas tik čia ir `stacks.yaml`.

Pavyzdys: `login` `config.json` po migracijos turėtų `flow-branch` ir `compose-blue-green` vietoj `infra` (kiti stack'ai nesikeičia).

## 4. Taisyklių paskirstymas

Žemiau – dabartinės 8 skyriaus taisyklės. „Skaidyti“ reiškia, kad vienos taisyklės tekstas dalijamas į dvi su skirtingais stack'ais; naujai daliai suteikiamas naujas ID.

| Taisyklės | Dabar | Po pakeitimo |
|---|---|---|
| `OPS-ENV-*`, `OPS-CI-*`, `OPS-CD-*`, `OPS-VER-*`, `OPS-DEVSEC-*`, `OPS-MON-*`, `OPS-IAC-*`, `OPS-REL-*`, `OPS-FIN-*` | `infra` | `infra` (be pakeitimų) |
| `OPS-PIPE-P01`, `P02`, `P03` | `infra` | `infra` |
| `OPS-K8S-P01`–`P04`, `R01`, `R02` | `infra` | `k8s` |
| `OPS-GITOPS-P01`–`P03`, `R01`–`R03` | `infra` | `k8s` (žr. atvirą klausimą 7.2) |
| `OPS-DOCKER-P01`, `P02`, `P03` | `infra` | `docker`. Iš `P03` iškelti sakinį apie blue-green slotus į `compose-blue-green` |
| `OPS-REPO-P01` | `infra` | `compose` |
| `OPS-COMPOSE-P01` | `infra` | `compose` |
| `OPS-COMPOSE-P02` | `infra,db` | **Skaidyti:** bendra dalis (healthcheck, priklausomybės, ribos, saugus vykdymas, persistent tik naudotojų duomenims) → `compose`; blue-green dalis → nauja `compose-blue-green` taisyklė |
| `OPS-FLOW-P01`–`P04` | `infra` | `flow-branch`. Iš `P04` iškelti sakinį „single-slot ir blue-green naudoja tuos pačius vartus“ į `compose` |
| `OPS-FLOW-P05` (redeploy) | `infra` | **Perrašyti į rezultatą ir kelti į `infra`**: redeploy išsprendžia digest'ą, patikrina kilmę iš apsaugoto ref, nieko nebuild'ina. `sha-<40>` formatas → `flow-branch` taisyklė; `vX.Y.Z` → nauja `flow-tag` taisyklė |
| `OPS-FLOW-P06` (runtime atkūrimas) | `infra` | **Skaidyti:** bendra dalis → `compose`; slotų ir balancerio dalis → `compose-blue-green` |
| `OPS-FLOW-P07` (secrets rotacija) | `infra` | **Skaidyti:** bendra dalis → `infra`; „išsaugo aktyvų slotą“ → `compose-blue-green`; „saugi restart seka“ → `compose` |
| `OPS-TAG-P01`–`P03` | `infra` | `flow-tag` |
| Kitų skyrių taisyklės su `infra` (3, 5, 7 skyriuose, 22 vnt.) | `infra` arba `php,infra` | Peržiūrėti po vieną; dauguma lieka `infra` |

Naujos taisyklės, kurių dabar nėra, bet pavyzdžiai jomis remiasi (iš `pastabos.md` D10):

| Nauja taisyklė | Stack |
|---|---|
| Projektas deklaruoja Git modelį ir diegimo topologiją (`config.json` ir diegimo dokumentacija) | `infra` |
| Tag-based: staging privalomas prieš production (Environment „Required reviewers“ – tik rekomendacija) | `flow-tag` |
| Aktyvus slotas nustatomas iš balancerio konfigūracijos | `compose-blue-green` |

Jau sukurtos su `stacks=infra`; skaidant tik perkelti į tikslų stack'ą: `OPS-PIPE-P05` (deploy concurrency) lieka `infra`, `OPS-PIPE-P06` (`workflow_run` patikra) → `flow-tag`, `OPS-COMPOSE-P03` (slot'o upstream) → `compose-blue-green`.

## 5. 8 skyriaus struktūra

| Nauja vieta | Turinys | Iš kur |
|---|---|---|
| 8.1–8.9 | Bendri reikalavimai | dabartiniai 8.1–8.4, 8.6–8.10 |
| 8.10 Bendri pipeline vartai | vartai, readiness, runner'iai ir Environment, redeploy ir secrets procedūros, modelio deklaravimas | dabartinis 8.15 + bendros `FLOW-P05`–`P07` dalys |
| 8.11 Git leidimo modeliai | 8.11.1 Branch-based, 8.11.2 Tag-based, palyginimo lentelė | dabartiniai 8.13, 8.14 |
| 8.12 Konteinerių image | Dockerfile, registry, tag'ai | `OPS-DOCKER-*` iš 8.12 |
| 8.13 Docker Compose diegimas | 8.13.1 Bendra (single-slot), 8.13.2 Blue-green | likusi 8.12 dalis |
| 8.14 Kubernetes ir GitOps | esamos taisyklės, pažymėta „pavyzdžių nėra“ | dabartiniai 8.5, 8.11 |
| 8.15 Neaprašytos technologijos | kaip review elgiasi be profilio (žr. 6 skyrių) | nauja |

Kiekvieno metodo poskyrio pradžioje – viena eilutė: kuris stack'as jį įjungia.

Rizika: pernumeravus poskyrius lūžta nuorodos iš kitų skyrių ir taisyklių tekstų („8.13“, `#813-…`). Prieš pernumeruojant surinkti visas nuorodas (`grep -rn "08-devops-ci-cd.md#" docs standard`) ir po pakeitimo paleisti dokumentacijos nuorodų patikrą.

## 6. Kaip review elgiasi

Keičiamas [standard/skills/dev-standard/review-method.md](standard/skills/dev-standard/review-method.md):

1. Review pradžioje nustato aktyvius DevOps profilius iš `.dev-standard/config.json`.
2. Taiko `infra` ir pasirinktų profilių taisykles; kitų profilių taisyklių nevertina ir necituoja.
3. Ataskaitos pabaigoje viena eilute nurodo, kas vertinta ir kas ne, pvz.: „DevOps profiliai: `flow-branch`, `compose-blue-green`. Nevertinta: `flow-tag`, `k8s`.“
4. Jei pakeitime yra diegimo failų (workflow'ai, manifestai), bet nepasirinktas nė vienas diegimo profilis, review tai įvardija kaip pastabą: „diegimo profilis nepasirinktas arba standarte neaprašytas; specifinės taisyklės nevertintos“. Tai ne tylus praleidimas.
5. Jei pasirinkti abu `flow-branch` ir `flow-tag`, review tai žymi kaip konfigūracijos klaidą (žr. 7.4).

## 7. Atviri klausimai (nuspręsti prieš pradedant)

1. **Pavadinimai.** `flow-branch` / `flow-tag` ar kiti. Rekomendacija: palikti.
2. **`OPS-GITOPS-*`.** Į `k8s` ar atskirą `gitops` stack'ą. Rekomendacija: `k8s`, kol GitOps naudojamas tik su Kubernetes.
3. **Ar `docker` atskiras stack'as.** Alternatyva – palikti `OPS-DOCKER-*` stack'e `infra`. Rekomendacija: atskiras, nes tada `applyTo` tiksliai atitinka Dockerfile.
4. **Abu Git modeliai vienu metu.** Draudžiama įrankiu (sync klaida) ar tik review pastaba. Rekomendacija: sync įspėjimas, review pastaba.
5. **Pereinamasis laikotarpis.** Projektai su `infra` po pakeitimo gaus tik bendrą dalį. Variantai: (a) vienas leidimas, kuriame `infra` laikinai apima viską, ir įspėjimas pasirinkti profilį; (b) keisti iškart ir migruoti projektus rankomis. Rekomendacija: (a), jei standartą naudoja daugiau nei keli projektai.
6. **Versija.** Tai elgsenos pakeitimas vartotojams – nuspręsti, ar didinti major versiją.

## 8. Žingsniai

Kiekvienas žingsnis baigiamas `npm run rules:validate` ir `npm test`.

1. **Stack'ai.** Papildyti `standard/stacks.yaml` pagal 3 skyrių; susiaurinti `infra` `applyTo`. Papildyti `scripts/standard/lib/stacks.test.mjs` ir `bundle.test.mjs` grandinei `compose-blue-green → compose → docker → infra`.
2. **Žymos be teksto keitimo.** Pakeisti `stacks=` taisyklėms, kurios tik keliauja į kitą stack'ą (4 skyriaus eilutės be „skaidyti“). Tekstai nesikeičia, tad `rules.en.yaml` hash'ai lieka galioti.
3. **Skaidomos taisyklės.** Po vieną: `COMPOSE-P02`, `DOCKER-P03`, `FLOW-P04`–`P07`. Kiekvienai – LT tekstas, EN tekstas `rules.en.yaml`, `npm run rules:accept -- <ID>`.
4. **Naujos taisyklės** iš 4 skyriaus antros lentelės.
5. **8 skyrius.** Perkelti poskyrius pagal 5 skyrių, sutvarkyti nuorodas.
6. **H priedas ir pavyzdžiai.** Priedo poskyriai ta pačia tvarka kaip 8 skyrius. Pavyzdžių katalogai:
   - `github-actions/common/`, `branch-based/`, `tag-based/` (dabartinis `ci.pipeline` yra branch-based – perkelti ir pridėti tag-based variantą);
   - `docker/common/` (Dockerfile, Nginx, skriptai, observability), `docker/single-slot/`, `docker/blue-green/`;
   - `cd.deploy` → `single-slot/` ir `blue-green/` (tas pats failo vardas abiem variantams).
7. **Review metodas.** Pakeisti `review-method.md` pagal 6 skyrių; atnaujinti `SKILL.md`, jei jame išvardyti stack'ai.
8. **Sync įrankis.** Patikrinti, kad `resolveStacks` teisingai išskleidžia trijų lygių `implies`; pridėti įspėjimus pagal 7.4 ir 7.5; papildyti `sync.test.mjs`.
9. **Migracija.** `login` `config.json`: `infra` → `flow-branch`, `compose-blue-green`. Changelog įrašas su migracijos instrukcija kitiems projektams.

## 9. Kaip patikrinti, kad pavyko

- `npm run rules:validate` ir `npm test` praeina.
- `npm run rules:bundle` sugeneruoja po instrukcijų failą kiekvienam naujam stack'ui; `dev-standard-flow-tag.instructions.md` nėra nė vienos `OPS-FLOW-*` taisyklės, o `dev-standard-compose.instructions.md` – nė vienos blue-green taisyklės.
- Sinchronizacija `login` repozitorijoje su nauju `config.json` atneša `infra`, `docker`, `compose`, `compose-blue-green`, `flow-branch` ir neatneša `flow-tag`, `k8s`.
- Bandomasis review `login` pakeitimui, liečiančiam `cd.deploy.yml`, necituoja `OPS-TAG-*` ir ataskaitoje turi eilutę apie nevertintus profilius.
- Bandomasis review repozitorijai be diegimo profilio pateikia pastabą „profilis nepasirinktas“, o ne tylą.
- Nuorodų patikra neranda lūžusių `#8…` anchor'ų.

## 10. Ko šis planas neapima

- Kubernetes pavyzdžių ir naujų Kubernetes taisyklių kūrimo – `k8s` stack'e lieka tik tai, kas jau parašyta.
- `login` smoke job'o perrašymo per Compose (atskira, jau įvardyta užduotis).
- Reikalavimų turinio keitimo: taisyklės skaidomos ir perkeliamos, bet nei griežtinamos, nei švelninamos.
