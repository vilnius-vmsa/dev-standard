# Pakeitimų žurnalas (Changelog)

Visi reikšmingi standarto pakeitimai dokumentuojami šiame faile.

Formatas paremtas [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versijavimas – [SemVer](https://semver.org/).

## [Unreleased]

### Pridėta

- Automatiškai tikrinamų reikalavimų žymose nurodomos technologijų sritys (`stacks`) ir tikrinimo priemonė (`enforced-by`) (2.4.1 poskyris).
- Reikalavimų vertimas į anglų kalbą DI agentams (`standard/rules.en.yaml`), neprivalomas angliškas reikalavimų sąrašas svetainėje (`/rules`) ir DI agentų paketas prie kiekvieno leidimo.
- G priedas „Dokumentacijos rengimo metodika“: kaip rengti, tikrinti ir palaikyti sistemų dokumentaciją, kad ja galėtų naudotis DI agentai, vidinės ir išorinės komandos (10 skyrius).
- DI agentų pakete – `dev-standard-docs` įgūdis dokumentacijai kurti, atnaujinti ir tikrinti, su šablonais ir nuorodų tikrintuvu `check-docs.py`; sinchronizavimas diegia visus paketo įgūdžius ir įspėja apie pasenusią `AGENTS.md` skiltį.

### Pakeista

- Sinchronizavimo darbo eigą paleidžiant rankiniu būdu galima nurodyti `version` (`latest` arba konkretų leidimą), kad saugykla atnaujintų standartą iš karto, nelaukiant savaitinio paleidimo.
- D ir F priedų šablonai (ADR, runbook) pateikiami angliškai ir įtraukiami į `dev-standard-docs` įgūdį; F priedo šablono atvaizdavimas pataisytas.

## [1.0.0] - 2026-04-20

### Pridėta

- Pradinis standarto leidimas (13 skyrių).
- Sąvokos ir terminai (1 skyrius).
- Standarto paskirtis, taikymo sritis ir reikalavimų lygiai (2 skyrius).
- Architektūros ir dizaino principai: frontend, backend/API, duomenys, integracijos, konfigūracija, patikimumas, stebėsena, diagramos, mobilios aplikacijos, atitiktis (3 skyrius).
- Programinio kodo kūrimo ir keitimo gairės: principai, struktūra, versijų valdymas, code review, testai, saugumas, refaktoringas (4 skyrius).
- Versijavimas ir priklausomybių valdymas (5 skyrius).
- Saugumas: principai, autentifikacija, autorizacija, GDPR, secrets, naršyklės saugumas, OWASP Top 10, security testing (6 skyrius).
- Testavimo reikalavimai ir principai (7 skyrius).
- DevOps ir CI/CD reikalavimai (8 skyrius).
- Stebėsena, logai ir eksploatacija (9 skyrius).
- Dokumentacija (10 skyrius).
- Darbo organizavimas ir rolės (11 skyrius).
- Tiekėjų ir pavaldžių įstaigų reikalavimai (12 skyrius).
- Standarto priežiūra ir atnaujinimas (13 skyrius).
