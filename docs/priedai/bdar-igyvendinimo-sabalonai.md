# B priedas. BDAR / GDPR įgyvendinimo šablonai

> **Statusas:** gyvas dokumentas — atnaujinamas pagal [§13 Standarto priežiūra](../13-standarto-prieziura.md).
> **Susiję skyriai:** [6.3 Duomenų apsauga (GDPR kontekstas)](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5 Asmens duomenų apsauga (BDAR / GDPR)](../03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [9.7 Audit trail](../09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)

Šis priedas pateikia praktinius šablonus ir patarimus, padedančius įgyvendinti BDAR reikalavimus, apibrėžtus [§6.3](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) ir [§3.4.5](../03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr). Tai nėra teisinė konsultacija; visais klausimais rekomenduojama konsultuotis su organizacijos duomenų apsaugos pareigūnu (DPO).

---

## B.1. Duomenų klasifikacija

Klasifikacija yra pagrindas visoms kitoms priemonėms — prieigos kontrolei, logavimui, šifravimui ir saugojimo terminams.

### B.1.1. Rekomenduojami jautrumo lygiai

| Lygis | Aprašymas | Pavyzdžiai | Minimalios priemonės |
|---|---|---|---|
| **Viešas** | Laisvai prieinami duomenys | Organizacijos pavadinimas, viešai skelbiami dokumentai | Standartinė prieigos kontrolė |
| **Vidinis** | Organizacijos vidaus informacija | Darbuotojų el. pašto adresai, vidiniai identifikatoriai | Autentifikacija + RBAC |
| **Konfidencialus** | Asmens duomenys, jautrūs verslo duomenys | Piliečių vardas/pavardė, asmens kodas, adresas | Šifravimas ramybės ir tranzito metu, audit trail, minimali prieiga |
| **Ypatingas** | Ypatingų kategorijų duomenys (BDAR str. 9) | Sveikatos duomenys, biometriniai duomenys | Konfidencialaus + DPIA, pseudonimizacija, papildomas teisinis pagrindas |

### B.1.2. Klasifikacijos taikymo gairės

*   Kiekvienai duomenų bazės lentelei ar duomenų saugyklai priskirti jautrumo lygį projekto pradžioje.
*   Klasifikaciją dokumentuoti duomenų srauto diagramoje arba duomenų modelio apraše.
*   Kai laukas turi aukštesnį jautrumo lygį nei likusi lentelė — lauką anotuoti atskirai (pvz., `@PersonalData`, komentaras ar metaduomenų žymė).

---

## B.2. Saugojimo terminai ir trynimas

### B.2.1. Saugojimo terminų matrica (šablonas)

| Duomenų kategorija | Teisinis pagrindas | Saugojimo terminas | Trynimo mechanizmas | Atsakingas |
|---|---|---|---|---|
| Naudotojo paskyros duomenys | Sutartis / Teisėtas interesas | Iki paskyros panaikinimo + 30 d. | Soft delete → hard delete cron | _Užpildyti_ |
| Prašymų istorija | Teisinė prievolė (archyvavimas) | 5 metai nuo prašymo užbaigimo | Archyvavimas → anonimizacija | _Užpildyti_ |
| Sesijų ir prieigos logai | Teisėtas interesas (saugumas) | 90 dienų | Automatinis log rotation | _Užpildyti_ |
| Analitikos duomenys | Sutikimas | Iki sutikimo atšaukimo | Anonimizacija arba trynimas | _Užpildyti_ |
| _Papildyti pagal sistemą_ | | | | |

### B.2.2. Trynimo ir anonimizacijos šablonai

**Soft delete → Hard delete:**
1. Naudotojas / administratorius inicijuoja trynimą.
2. Įrašas pažymimas `deleted_at` laiku; duomenys nebeprieinami per API/UI.
3. Po grace period (pvz., 30 d.) — `cron` arba `scheduled job` galutinai ištrina arba anonimizuoja.
4. Trynimo įvykis registruojamas audit trail.

**Pseudonimizacija:**
*   Identifikuojantys laukai (vardas, el. paštas, asmens kodas) pakeičiami negrįžtamu hash arba betiksliu identifikatoriumi.
*   Neidentifikuojantys laukai (suma, data) paliekami analizei.
*   Pseudonimizuoti duomenys nebegali būti susieti su subjektu be papildomo rakto, kuris saugomas atskirai arba sunaikinamas.

**Kaskadinis trynimas tarp servisų:**
*   Kai asmens duomenys pasklidę per kelis servisus, pagrindinis servisas publikuoja `DataSubjectDeletionRequested` įvykį.
*   Kiekvienas duomenis turintis servisas prenumeruoja įvykį ir atlieka savo trynimą per apibrėžtą SLA (pvz., 72 val.).
*   Pagrindinis servisas seka visų servisų patvirtinimus; jei per SLA negaunamas — alertas.

---

## B.3. Duomenų subjektų teisės (DSAR)

### B.3.1. Teisių matrica

| Teisė (BDAR str.) | Techninis reikalavimas | Įgyvendinimo patarimas |
|---|---|---|
| **Prieiga** (str. 15) | Eksportuoti visus asmens duomenis apie subjektą | API endpoint `/api/dsar/export/{subjectId}` su autentifikacija ir audit log |
| **Ištaisymas** (str. 16) | Leisti koreguoti neteisingus duomenis | Standartinė CRUD operacija + audit trail |
| **Trynimas** (str. 17) | Ištrinti duomenis, kai nebėra teisinio pagrindo | Soft delete + kaskadinis mechanizmas (žr. B.2.2) |
| **Apribojimas** (str. 18) | Sustabdyti duomenų tvarkymą išlaikant duomenis | `processing_restricted` vėliavėlė; API/UI neleidžia matyti/naudoti |
| **Perkeliamumas** (str. 20) | Pateikti duomenis struktūruotu formatu | JSON/CSV eksportas per API |
| **Prieštaravimas** (str. 21) | Nutraukti tvarkymą profiliavimo tikslais | Opt-out mechanizmas; consent atšaukimas |

### B.3.2. DSAR apdorojimo srautas

1. Gautas prašymas → identifikuojamas subjektas (tapatybės patvirtinimas).
2. Nustatomas prašymo tipas ir taikomos teisės.
3. Surenkama informacija apie visas sistemas, turinčias subjekto duomenis.
4. Įvykdomas veiksmas (eksportas, trynimas, apribojimas).
5. Registruojamas audit trail įrašas.
6. Atsakymas subjektui per 30 dienų (BDAR str. 12).

---

## B.4. Logavimo ir audit trail reikalavimai BDAR kontekste

Logavimas turi padėti užtikrinti atsekamumą, bet pats negali pažeisti duomenų subjektų privatumo.

### B.4.1. Ką loginti

*   Kas atliko veiksmą (naudotojo identifikatorius, rolė).
*   Koks veiksmas atliktas (sukūrimas, peržiūra, keitimas, trynimas, eksportas).
*   Kada atliktas veiksmas (UTC laikas).
*   Kokio tipo duomenys buvo paliesti (duomenų kategorija, bet **ne patys asmens duomenys**).
*   Ar veiksmas buvo automatinis ar rankinis.

### B.4.2. Ko NEloginti

*   Asmens duomenų reikšmių (`asmens_kodas=39001010000` → draudžiama).
*   Slaptažodžių, tokenų, sesijų raktų.
*   Sveikatos ar kitų ypatingų kategorijų duomenų turinio.

> **Tinkami audit log pavyzdžiai:**
> ```json
> {"event": "personal_data_accessed", "subject_category": "citizen", "data_category": "konfidencialus", "actor": "user:12345", "action": "export", "timestamp": "2025-01-15T10:30:00Z"}
> ```

---

## B.5. DPIA (Duomenų apsaugos poveikio vertinimas) — kontrolinis sąrašas

Atsižvelgiant į BDAR str. 35, DPIA privalomas kai duomenų tvarkymas gali kelti didelę riziką. Šis kontrolinis sąrašas padeda nustatyti, ar DPIA reikalingas.

### B.5.1. Ar reikia DPIA?

Atsakykite „taip“ / „ne“:

- [ ] Ar sistema tvarko ypatingų kategorijų duomenis (sveikatos, biometriniai)?
- [ ] Ar vykdomas sistemingas ir platus profiliavimas?
- [ ] Ar duomenys renkami masiškai viešose erdvėse (pvz., vaizdo stebėjimas)?
- [ ] Ar naudojamos naujos technologijos duomenų tvarkymui (pvz., AI/ML)?
- [ ] Ar duomenys naudojami automatizuotiems sprendimams, turintiems teisinį poveikį?
- [ ] Ar tvarkomos pažeidžiamų asmenų (vaikų, pacientų) duomenys?
- [ ] Ar duomenys siunčiami į trečiąsias šalis?

> **Jei ≥ 2 atsakymai „taip“ — DPIA tikėtinai privalomas.** Konsultuokitės su DPO.

### B.5.2. DPIA proceso punktai

1. Duomenų tvarkymo veiksmų aprašymas ir tikslų pagrindimas.
2. Būtinumo ir proporcingumo vertinimas.
3. Rizikų duomenų subjektams identifikavimas.
4. Priemonių rizikoms sumažinti nustatymas.
5. DPO nuomonės gavimas.
6. Rezultatų dokumentavimas ir periodinis peržiūrėjimas.

---

## B.6. Privatumo inžinerijos principai (Privacy by Design) — suvestinė

| Principas | Praktinis patarimas |
|---|---|
| **Proaktyvumas** | Privatumą planuoti nuo pirmosios architektūros iteracijos, ne po fakto |
| **Privatumas kaip numatytoji nuostata** | Naudotojui pagal nutylėjimą rodyti/rinkti minimalų duomenų kiekį |
| **Privatumas įterptas į dizainą** | Duomenų minimizavimas, pseudonimizacija ir prieigos kontrolė — ne papildomi moduliai, o dizaino dalis |
| **Pilnas funkcionalumas** | Privatumo priemonės neturi degraduoti naudotojo patirties |
| **End-to-end saugumas** | Šifravimas tranzito IR ramybės metu; rakto valdymo strategija |
| **Skaidrumas** | Naudotojui aiškiai komunikuoti, kokie duomenys renkami ir kodėl |
| **Asmens duomenų kontrolė** | Naudotojas turi galėti peržiūrėti, eksportuoti ir ištrinti savo duomenis |

---

> **Pastaba:** šis priedas yra gairė kūrėjams ir projektuotojams. Konkretūs teisiniai reikalavimai priklauso nuo sistemos konteksto ir turi būti vertinami su DPO.
>
> Susiję skyriai: [6.3 Duomenų apsauga](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5 Asmens duomenų apsauga](../03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [7.12 Duomenų apsauga (BDAR/GDPR) testuose](../07-testavimas.md#712-duomenų-apsauga-bdar-gdpr-testuose) · [9.7 Audit trail](../09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)
