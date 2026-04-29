# E priedas. PR / MR šablonas (Pull Request Template)

> **Paskirtis:** standartizuotas PR / MR aprašymo formatas pagal [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai).
> **Naudojimas:** kopijuoti failą `pull_request_template.md` į projekto `.github/` (GitHub) arba `.gitlab/merge_request_templates/` (GitLab) katalogą.

---

## Parengtas šablonas

Šis repozitorius jau turi veikiantį GitHub šabloną: [`.github/pull_request_template.md`](https://github.com/vilnius-vmsa/dev-standard/blob/main/.github/pull_request_template.md).

Projektas gali naudoti šį šabloną tiesiogiai arba jį pritaikyti savo poreikiams, išlaikant žemiau aprašytą minimalią struktūrą.

---

## Minimalūs PR / MR laukai (pagal 4.3.5)

Šablonas privalo padengti šiuos punktus:

| # | Laukas | Standarto nuoroda | Aprašymas |
|---|---|---|---|
| 1 | **Description** — kas ir kodėl keičiama | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) | Trumpas pakeitimo aprašymas ir motyvacija |
| 2 | **Change type** | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) | feat / fix / refactor / docs / ci / test / chore |
| 3 | **Related task** | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) | Nuoroda į užduočių valdymo sistemą |
| 4 | **Impact assessment** | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) | Breaking changes, migracijos, API, infra, saugumas |
| 5 | **How to verify** | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) | Instrukcija reviewer’iui, kaip patikrinti pakeitimą |
| 6 | **Checklist** | [4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai), [10.5](../10-dokumentacija.md#105-dokumentacijos-atnaujinimo-taisyklės) | Konvencijos, testai, dokumentacija, CI status |

---

## Pritaikymas GitLab

GitLab naudoja kitą šablonų mechanizmą:

1. Sukurkite katalogą `.gitlab/merge_request_templates/`.
2. Įdėkite failą `Default.md` su šablono turiniu.
3. GitLab automatiškai naudos šį šabloną naujiems MR.

Turinys identiškas GitHub versijai — pakeiskite tik nuorodų formatus, jei reikia.

---

## Papildomi patarimai

- **Draft PR** naudokite ankstyvam grįžtamajam ryšiui ([4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai)).
- **Mažesni PR** yra geresnė praktika ([4.3.5](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai)) — jei PR per didelis, svarstykite skaidymą.
- Jei pakeitimas sugeneruotas su AI — pažymėkite checklistje ir peržiūrėkite output ([4.8](../04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants)).

> Susiję skyriai: [4.3.5 PR / MR reikalavimai](../04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [4.4 Code Review principai](../04-kodo-kurimo-gaires.md#44-code-review-principai) · [10.5 Dokumentacijos atnaujinimo taisyklės](../10-dokumentacija.md#105-dokumentacijos-atnaujinimo-taisyklės)
