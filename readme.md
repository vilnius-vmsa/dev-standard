# Programinės įrangos kūrimo standartas

Vilniaus miesto savivaldybės programinės įrangos kūrimo, keitimo,
diegimo ir priežiūros standartas.

[![Naujausia versija](https://img.shields.io/github/v/release/vilnius-vmsa/dev-standard?display_name=tag&sort=semver&label=versija)](https://github.com/vilnius-vmsa/dev-standard/releases/latest)
[![Testai](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/ci.lint-validate.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/ci.lint-validate.yml)
[![Diegimas](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/cd.deploy.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/cd.deploy.yml)
[![CodeQL](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/codeql.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/codeql.yml)
[![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Licencija: CC BY 4.0](https://img.shields.io/badge/licencija-CC_BY_4.0-2b5797?logo=creativecommons&logoColor=white)](LICENSE)

## Navigacija

- [Publikuota standarto svetainė](https://vilnius-vmsa.github.io/dev-standard/)
- [Atsisiųsti naujausią PDF](https://github.com/vilnius-vmsa/dev-standard/releases/latest/download/dev-standard.pdf)
- **[→ Greitas startas](docs/00-greitas-startas.md)** – pradėkite čia
- [Turinys](docs/index.md) – pilnas standarto turinys
- [Pakeitimų žurnalas](changelog.md) – versijų istorija

## Kam taikomas

- Vidinėms savivaldybės komandoms
- Pavaldžioms įstaigoms
- Išoriniams tiekėjams (per viešuosius pirkimus)

Detaliau: [2 skyrius – Standarto paskirtis ir taikymo sritis](docs/02-paskirtis-ir-taikymo-sritis.md)

## Versija

v1.0 | 2026-04-20

## Vietinis paleidimas

Reikalinga Node.js 20 arba naujesnė versija.

```bash
npm ci
npm run build
```

Priklausomybių saugumo patikra, naudojama ir CI procese:

```bash
npm audit --audit-level=high
```

Komanda grąžina klaidą, jei aptinkama aukšto (`high`) arba kritinio
(`critical`) lygio pažeidžiamumų.

## CI/CD ir versijos išleidimas

Pull request į `main` šaką automatiškai patikrina priklausomybių saugumą
ir Docusaurus svetainės surinkimą.

Naujos versijos išleidimas:

1. Sujunkite planuojamus pakeitimus į `main` šaką.
2. GitHub skiltyje **Actions** paleiskite **CI: Create release tag** workflow.
3. Įveskite žymą, sudarytą iš `v` ir trijų skaičių, pavyzdžiui,
   `v1.2.3`, ir trumpai aprašykite, kodėl versija išleidžiama.
4. Workflow patikrins žymą, sukurs GitHub Release ir automatiškai
   sugeneruos pakeitimų suvestinę iš Git commit bei sujungtų pull request.
5. Release workflow surinks ir prie GitHub Release pridės viešai
   atsisiunčiamą PDF failą.
6. **CD: Deploy to GitHub Pages** surinks būtent pažymėtą versiją ir
   publikuos svetainę į GitHub Pages.

Release taip pat sukuriamas automatiškai, kai į GitHub įkeliama tinkamo
formato Git žyma, pavyzdžiui, `v1.2.3`. Žymos su raidėmis, papildomomis
dalimis ar išankstinės versijos priesagomis nepriimamos.

Pakartotiniam jau publikuotos versijos diegimui galima rankiniu būdu
paleisti **CD: Deploy to GitHub Pages** ir nurodyti jos žymą.

GitHub Release suvestinė generuojama pagal
[`.github/release.yml`](.github/release.yml). Failas
[`changelog.md`](changelog.md) lieka ilgalaikis, rankiniu būdu prižiūrimas
versijų žurnalas.

## Licencija

[![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

Ši medžiaga platinama pagal
[Creative Commons Priskyrimas 4.0 Tarptautinė (CC BY 4.0)](LICENSE)
licenciją.

## Kontaktai

Vilniaus miesto savivaldybės administracijos [Inovacijų ir technologijų grupė](https://vilnius.lt/struktura-ir-kontaktai/inovaciju-ir-technologiju-grupe)
