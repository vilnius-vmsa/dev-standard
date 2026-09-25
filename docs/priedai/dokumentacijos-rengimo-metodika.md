# G priedas. Dokumentacijos rengimo metodika

> **Paskirtis:** kaip parengti, patikrinti ir palaikyti sistemos dokumentaciją, kad ja galėtų naudotis DI agentai, vidinės ir išorinės komandos. Priedas įgyvendina [10 skyriaus](../10-dokumentacija.md) reikalavimus ir naujų reikalavimų nenustato.
> **Naudojimas:** taikyti rengiant pradinę sistemos dokumentaciją, keičiant kodą ir tikrinant esamą dokumentaciją. DI agentams ši metodika pateikiama angliškame `dev-standard-docs` įgūdyje (žr. [G.10](#g10-di-agentams-dev-standard-docs)); jei įgūdis ir šis priedas skiriasi, galioja šis priedas.
> **Susiję skyriai:** [10 Dokumentacija](../10-dokumentacija.md) · [3.8 Diagramos ir dokumentavimas](../03-architektura.md#38-diagramos-ir-dokumentavimas) · [9.8 Eksploatacijos dokumentacija](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija) · [D priedas. ADR šablonas](adr-sablonas.md) · [E priedas. PR / MR šablonas](pr-mr-sablonas.md) · [F priedas. Runbook šablonas](runbook-sablonas.md)

Šis priedas yra metodinės gairės: jame nėra PRIVALOMA ar REKOMENDUOJAMA reikalavimų. Jis aiškina, kaip praktiškai įvykdyti jau galiojančius reikalavimus. Praktikoje pasiteisinusios gairės vėliau gali būti pasiūlytos kaip reikalavimai pagal [13.2.3](../13-standarto-prieziura.md#1323-pakeitimų-tvirtinimas).

---

## G.1. Principai

- **Vienas tiesos šaltinis** ([10.1](../10-dokumentacija.md#101-bendrieji-dokumentacijos-principai)). Kiekvienas faktas aprašomas vienoje vietoje; kiti dokumentai į jį nurodo, o ne kartoja.
- **Aprašoma tik esama elgsena.** Planai ir ketinimai į dokumentaciją nerašomi kaip faktai. Jie fiksuojami ADR su būsena (pvz., „Siūlomas“, „Atidėtas“) arba dengimo lentelėje (žr. [G.2](#g2-repozitorijos-dokumentacijos-struktūra)).
- **Nuorodos į kodą – kelias ir simbolis**, pvz., `src/Service/StorageService.php` ir metodas `bind()`. Eilučių numeriai nenaudojami, nes jie pasensta po pirmo pakeitimo.
- **Nuoroda vietoje kopijos** (DOC-GEN-R03). Diegimo žingsniai lieka README, architektūra – `docs/architecture.md`; AGENTS.md į juos tik nurodo.
- **Trumpai ir faktiškai.** Lentelės ir sąrašai vietoje pasakojimo; kiekvienas sakinys turi būti patikrinamas.
- **Kiekvienas faktas patikrintas pagal failą, į kurį nurodo.** Rašantis asmuo ar agentas atidaro nurodytą failą ir įsitikina, kad teiginys teisingas.
- **Srities faktus patvirtina žmogus.** Kam sistema skirta, kas ja naudojasi, kaip susijusios išorinės sistemos – to iš kodo pavadinimų ar komentarų įrodyti negalima. Tokie teiginiai pateikiami sąraše „Faktai patvirtinimui“ (žr. [G.7](#g7-pradinės-dokumentacijos-parengimas)).
- **Žinomos keistenybės aprašomos, o ne „ištaisomos“ tekste.** Jei kodas elgiasi netikėtai, dokumentacija aprašo, kaip jis elgiasi iš tikrųjų, ir nurodo, kur tai matyti.
- **Saugumo spragos aprašomos kaip stebima elgsena su nuoroda į kodą**, niekada kaip išnaudojimo instrukcija.

## G.2. Repozitorijos dokumentacijos struktūra

| Artefaktas | Vieta | Paskirtis | Reikalavimas |
|---|---|---|---|
| README | `README.md` | Paskirtis, paleidimas, konfigūracija, nuorodos, kontaktai | [3.8.4](../03-architektura.md#384-onboarding-dokumentacija) |
| Agentų vadovas | `AGENTS.md` | Kaip dirbti repozitorijoje: kur ką skaityti, komandos, konvencijos, tikrinimas | [G.6](#g6-agentsmd) |
| Dokumentacijos rodyklė | `docs/README.md` | Kurį dokumentą skaityti kada; dengimo lentelė | Šis priedas |
| Architektūros aprašas | `docs/architecture.md` | Paskirtis, ribos, komponentai, integracijos; C4 L1 ir L2 | [10.2.1](../10-dokumentacija.md#1021-architektūros-aprašas), [3.8.1](../03-architektura.md#381-architektūros-diagramos-c4-modelis) |
| Žodynas | `docs/glossary.md` | Srities terminai ir jų vieta kode | [G.5](#g5-žodynas) |
| Posistemių aprašai | `docs/<posistemis>.md` | Sudėtingų posistemių veikimas | [3.8.2](../03-architektura.md#382-sudėtingų-procesų-dokumentavimas), [G.4](#g4-posistemio-aprašas) |
| ADR | `docs/adr/NNNN-<pavadinimas>.md` | Reikšmingi sprendimai ir jų priežastys | [10.4](../10-dokumentacija.md#104-architecture-decision-records-adr), [D priedas](adr-sablonas.md) |
| API specifikacija | pvz., `docs/openapi.json` arba generuojamas failas | Mašiniškai skaitomas API kontraktas | [10.2.2](../10-dokumentacija.md#1022-api-dokumentacija), [3.3.1](../03-architektura.md#331-specifikacija-ir-dokumentacija) |
| Diegimas ir eksploatacija | `docs/deployment.md`, `docs/runbooks/` | Diegimas, konfigūracija, rollback, runbook’ai | [10.2.3](../10-dokumentacija.md#1023-diegimo-ir-eksploatacijos-instrukcijos), [9.8](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija), [F priedas](runbook-sablonas.md) |

**Dengimo lentelė.** `docs/README.md` turi lentelę su stulpeliais `Sritis | Dokumentas | Šaltinio keliai | Būsena`. Stulpelyje „Šaltinio keliai“ nurodomi katalogai ar failai, kuriuos dokumentas aprašo (pvz., `src/Storage/`, `config/packages/messenger.yaml`). Pagal šį stulpelį agentas ir peržiūrėtojas randa, kuriuos dokumentus paveikia kodo pakeitimas. Sąmoningai neaprašytos sritys ir žinomos, dar netaisytos keistenybės įrašomos kaip atskiros eilutės su būsena „Dar nėra“ arba „Žinoma keistenybė“; darbą atlikus eilutė pašalinama.

**Kalba.** Kalba pasirenkama projekto pradžioje ir taikoma nuosekliai (DOC-GEN-P05). Agentams skirtai techninei dokumentacijai (AGENTS.md, `docs/`) rekomenduojama anglų kalba, nes ja rašomas kodas ir identifikatoriai. Lietuviški srities terminai paliekami kaip yra ir paaiškinami žodyne.

## G.3. Ko reikalauja brandos lygiai

Lentelė susieja [2.6](../02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) brandos lygius su dokumentacija. Pažymėti (*) elementai yra šio priedo rekomendacija; kiti kyla iš galiojančių reikalavimų.

| Lygis | Dokumentacija |
|---|---|
| 1 – Bazinis | README ([3.8.4](../03-architektura.md#384-onboarding-dokumentacija)); API specifikacija ([3.3.1](../03-architektura.md#331-specifikacija-ir-dokumentacija)); architektūros aprašas su C4 L1 ([10.2.1](../10-dokumentacija.md#1021-architektūros-aprašas)); AGENTS.md*; `docs/README.md` su dengimo lentele*; žodynas* |
| 2 – Standartinis | Visas 1 lygis; C4 L2 ([3.8.1](../03-architektura.md#381-architektūros-diagramos-c4-modelis)); ADR ([10.4](../10-dokumentacija.md#104-architecture-decision-records-adr)); diegimo ir eksploatacijos instrukcijos, runbook’ai ([10.2.3](../10-dokumentacija.md#1023-diegimo-ir-eksploatacijos-instrukcijos), [9.8](../09-stebesena-logai.md#98-eksploatacijos-dokumentacija)); posistemių aprašai sudėtingoms dalims ([3.8.2](../03-architektura.md#382-sudėtingų-procesų-dokumentavimas)); dokumentacijos klausimas PR šablone (DOC-UPD-P04); nuorodų tikrintuvas CI* |
| 3 – Pavyzdinis | Visas 2 lygis; API specifikacijos aktualumo patikra CI (DOC-UPD-R02); periodinis dokumentacijos auditas po reikšmingų leidimų (DOC-UPD-R01); naudotojo dokumentacija, kai taikoma ([10.2.4](../10-dokumentacija.md#1024-naudotojo-dokumentacija)) |

## G.4. Posistemio aprašas

Posistemio aprašo reikia, kai naujas kūrėjas negali suprasti posistemio per 30 minučių skaitydamas tik kodą ([3.8.2](../03-architektura.md#382-sudėtingų-procesų-dokumentavimas)).

Struktūra (tušti skyriai praleidžiami, numeracija lieka nuosekli):

1. **Kam tai skirta** – kokią problemą sprendžia, kodėl atrodo taip, kaip atrodo.
2. **Duomenų modelis** – esybės, lentelės, svarbiausi laukai.
3. **Galiniai taškai ir sąsajos** – maršrutai, pranešimai, komandos.
4. **Veikimas** – po vieną skyrių kiekvienam svarbiam srautui (pvz., autorizacija, susiejimas, pakartojimai).
5. **Konfigūracija** – aplinkos kintamieji ir parametrai.
6. **Priežiūros komandos** – ką paleisti ir kada.
7. **Žinomos keistenybės** – visada paskutinis skyrius.

Aprašo pradžioje nurodoma nuoroda į `docs/architecture.md` bendram vaizdui. Ne daugiau kaip viena diagrama, kaip kodas (pvz., Mermaid, [3.8.3](../03-architektura.md#383-architektūrinės-dokumentacijos-palaikymas-ir-įrankiai)).

## G.5. Žodynas

`docs/glossary.md` – lentelė `Terminas | Reikšmė | Kodas`, po vieną eilutę terminui. Stulpelyje „Kodas“ nurodoma vieta, kur terminas apibrėžtas arba aiškiausiai naudojamas, ir, jei yra, posistemio aprašas. Lietuviški srities terminai (pvz., *Licencijavimas*) paliekami kaip yra ir trumpai paaiškinami. Prieš pavadinant naują esybę, lauką ar galinį tašką, pirmiausia peržiūrimas žodynas.

## G.6. AGENTS.md

AGENTS.md aprašo, **kaip dirbti** repozitorijoje, o ne kaip sistema veikia. Jame:

- **Maršrutų lentelė** – kurį dokumentą skaityti kokiam darbui (diegimas – README, architektūra – `docs/architecture.md`, visa kita – `docs/README.md`).
- **Kasdienės komandos** – paleidimas, testai, statinė analizė, migracijos, API specifikacijos generavimas.
- **Kodo konvencijos**, kurių nesutvarko linteriai.
- **Tikrinimas** – ką paleisti prieš pranešant, kad darbas baigtas, įskaitant dokumentacijos tikrintuvą.
- **Spąstai** (gotchas) – dalykai, kurie neakivaizdūs ir jau kainavo laiko.
- **Dokumentacijos taisyklės** – žodynas prieš naujus pavadinimus; dokumentacija atnaujinama tame pačiame PR; neakivaizdūs sprendimai – ADR; nuorodos – kelias ir simbolis.
- **„Vilnius dev standard“ skiltis**, įklijuota iš sinchronizavimo PR.

AGENTS.md nekartoja README ar architektūros aprašo – tik nurodo į juos.

## G.7. Pradinės dokumentacijos parengimas

1. **Inventorizacija.** Kas jau yra (README, `docs/`, wiki, komentarai, API specifikacija), kas pasenę, kur tiesos šaltinis.
2. **Sprendimai su komanda.** Apimtis, kuriems posistemiams reikia aprašų (G.4), kalba, kurios spragos įrašomos į dengimo lentelę.
3. **Rašymas su faktų tikrinimu.** Kiekvienas teiginys tikrinamas atidarant nurodytą failą.
4. **Nepriklausoma peržiūra.** Tekstą perskaito asmuo ar atskiras agentas, kuris jo nerašė, ir kiekvieną teiginį dar kartą patikrina pagal kodą.
5. **Tikrintuvas.** Paleidžiamas nuorodų ir kelių tikrintuvas (G.8).
6. **„Faktai patvirtinimui“.** PR aprašyme pateikiamas sąrašas srities teiginių, kurie nustatyti iš pavadinimų, komentarų ar commit žinučių, o ne iš elgsenos. Žmogus juos patvirtina prieš sujungiant PR.

Patirtis, kuria remiasi šie žingsniai:

- Pirminės apžvalgos faktai dažnai buvo klaidingi: tikrinant pagal kodą rasta neegzistuojanti esybė, neteisingas exchange pavadinimas, klaidingai aprašyta klasės paskirtis, neteisingi maršrutai, 401 vietoje 403 ir kaip nesanti aprašyta apsauga, kuri iš tikrųjų buvo.
- Agentas iš kodo pavadinimų padarė išvadą, kad Avilys ir DVS yra dvi sistemos ir kad Avilys – pasenusi sistema; abu teiginiai klaidingi. Srities faktams reikia žmogaus.
- Nepriklausoma peržiūra rado klaidų beveik kiekviename posistemio apraše, kurių rašantysis nepastebėjo.
- Rašant naują aprašą paaiškėjo klaidingų teiginių senesniuose dokumentuose. Pakeitimas turi ištaisyti prieštaravimus ir kitur, o ne tik pridėti naują dokumentą.
- Nuorodos į dar neparašytus dokumentus rašomos paprastu tekstu, ne nuorodomis: tikrintuvas atmeta neveikiančias nuorodas.

## G.8. Dokumentacijos palaikymas

- **Tame pačiame PR** ([10.5](../10-dokumentacija.md#105-dokumentacijos-atnaujinimo-taisyklės), DOC-GEN-P03). Jei pakeitimas liečia dengimo lentelės šaltinio kelius, atitinkamas dokumentas atnaujinamas tame pačiame PR.
- **PR šablonas** turi klausimą apie dokumentacijos atnaujinimą ([E priedas](pr-mr-sablonas.md), DOC-UPD-P04).
- **CI patikros** (DOC-UPD-R02): nuorodų ir kelių tikrintuvas, API specifikacijos aktualumas (sugeneruota specifikacija sutampa su įtraukta į repozitoriją). Tikrintuvas pateikiamas kartu su `dev-standard-docs` įgūdžiu; GitHub Actions žingsnis:

  ```yaml
  - name: Check documentation links and paths
    run: python3 .agents/skills/dev-standard-docs/check-docs.py
  ```

  Repozitorijos, kurios jau naudoja kitą nuorodų tikrintuvą, gali jį palikti.
- **DI agentas** prieš pranešdamas, kad užduotis atlikta, paleidžia `dev-standard-docs` atnaujinimo režimą.
- **Copilot PR peržiūra** pažymi kodo pakeitimus, kurie liečia dengimo lentelės šaltinio kelius, bet neturi atitinkamo dokumentacijos pakeitimo.
- Naudojamos tik patvirtintos DI priemonės ([4.8](../04-kodo-kurimo-gaires.md#48-di-priemonių-naudojimas-ai-coding-assistants)).

## G.9. Pavyzdys: eservices-backend

Šios metodikos pavyzdys yra `eservices-backend` repozitorija (šaka `docs/project-documentation`, kol nesujungta): AGENTS.md su maršrutų lentele ir dokumentacijos taisyklėmis, `docs/README.md` su rodykle ir dengimo lentele, `docs/glossary.md`, posistemių aprašai (storage, forms, camunda, messenger, security), penki ADR, į repozitoriją įtraukta `docs/openapi.json` su komanda `composer openapi:dump` ir nuorodų tikrintuvas.

## G.10. DI agentams: dev-standard-docs

DI agentų pakete kartu su standarto leidimu pateikiamas angliškas `dev-standard-docs` įgūdis. Sinchronizavimo veiksmas jį įdiegia į `.agents/skills/dev-standard-docs/` kartu su šablonais ir tikrintuvu `check-docs.py`. Įgūdis turi tris režimus:

- **bootstrap** – parengia minimalų dokumentacijos rinkinį repozitorijoje, kurioje jo beveik nėra (G.7);
- **update** – po kodo pakeitimo pagal dengimo lentelę randa paveiktus dokumentus ir juos atnaujina tame pačiame PR (G.8);
- **audit** – tikrina esamą dokumentaciją pagal kodą ir 10 skyrių, praneša apie neatitikimus ir spragas.

Kiekvienas režimas baigiamas nepriklausoma peržiūra (G.7, 4 žingsnis); bootstrap ir audit – sąrašu „Faktai patvirtinimui“. Kaip prijungti repozitoriją, aprašyta [standarto repozitorijos README](https://github.com/vilnius-vmsa/dev-standard#using-the-standard-in-your-repository).

> Susiję skyriai: [10 Dokumentacija](../10-dokumentacija.md) · [3.8 Diagramos ir dokumentavimas](../03-architektura.md#38-diagramos-ir-dokumentavimas) · [2.6 Brandos lygiai](../02-paskirtis-ir-taikymo-sritis.md#26-standarto-įgyvendinimo-brandos-lygiai) · [D priedas. ADR šablonas](adr-sablonas.md)
