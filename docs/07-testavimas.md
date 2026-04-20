# 7. Testavimo reikalavimai ir principai

Šis skyrius nustato privalomus ir rekomenduojamus testavimo reikalavimus, taikomus visoms savivaldybės sistemoms: web, API, integracijoms ir, jei taikoma, mobiliosioms aplikacijoms.

Testavimas laikomas ne papildoma veikla projekto pabaigoje, o integralia kūrimo, keitimo, leidimo ir eksploatacijos kokybės užtikrinimo dalimi.

Šio skyriaus reikalavimai taikomi tiek vidinėms komandoms, tiek išoriniams tiekėjams.

## 7.1. Testavimo strategija („Test Pyramid“)

PRIVALOMA:

<!-- TEST-STRAT-P01 | ai-reviewable -->
*   Testavimo strategija turi būti paremta aiškiu testų sluoksnių paskirstymu.
<!-- TEST-STRAT-P02 | ai-reviewable -->
*   Daugiausia turi būti naudojami unit testai, mažiau integration arba API testai, o mažiausiai – E2E testai.
<!-- TEST-STRAT-P03 | ai-reviewable -->
*   Testai turi būti kuriami ir vykdomi kiekviename PR/MR procese, nepaliekant pagrindinio tikrinimo tik UAT ar priešprodukcinėms aplinkoms.
<!-- TEST-STRAT-P04 | ai-reviewable -->
*   Testavimo apimtis turi būti proporcinga pakeitimo rizikai, sistemos kritiškumui ir nefunkciniams reikalavimams.

REKOMENDUOJAMA:

<!-- TEST-STRAT-R01 | ai-reviewable -->
*   Jei projekte sąmoningai nukrypstama nuo testavimo piramidės principo, toks sprendimas rekomenduojamas pagrįsti ir dokumentuoti.
<!-- TEST-STRAT-R02 | ai-reviewable -->
*   Kritinėms sistemoms testavimo strategiją rekomenduojama periodiškai peržiūrėti, vertinant realiai randamų defektų pobūdį ir testų efektyvumą.

> Susiję skyriai: [4.5](04-kodo-kurimo-gaires.md#45-testai) · [8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai)

## 7.2. Testų tipai ir minimalūs reikalavimai

PRIVALOMA:

<!-- TEST-TYPE-P01 | ai-reviewable -->
*   Unit testai turi būti taikomi verslo logikai ir izoliuotiems komponentams.
<!-- TEST-TYPE-P02 | ai-reviewable -->
*   Integration testai turi būti taikomi moduliams ir integracijoms su realiomis arba joms artimomis priklausomybėmis.
<!-- TEST-TYPE-P03 | ai-reviewable -->
*   API testai turi tikrinti sutarčių laikymąsi ir pagrindinių scenarijų veikimą.
<!-- TEST-TYPE-P04 | ai-reviewable -->
*   E2E testai turi būti taikomi kritiniams naudotojo keliams.
<!-- TEST-TYPE-P05 | ai-reviewable -->
*   Regresijos testai turi būti palaikomi kaip nuolatinė testų bazės dalis.
<!-- TEST-TYPE-P06 | ai-reviewable -->
*   Kiekvienas bug fix turi papildyti testų rinkinį testu, kuris atkartoja klaidą ir patvirtina jos pataisymą.
<!-- TEST-TYPE-P07 | ai-reviewable -->
*   Saugumo, našumo ar prieinamumo testai turi būti taikomi tais atvejais, kai jų reikia pagal sistemos kritiškumą ar pakeitimo pobūdį.

REKOMENDUOJAMA:

<!-- TEST-TYPE-R01 | ai-reviewable -->
*   Naudoti aiškų testų tipų priskyrimą, kad komanda vienodai suprastų, kas laikoma unit, integration, API ar E2E testu.
<!-- TEST-TYPE-R02 | ai-reviewable -->
*   Sudėtingoms integracijoms ar aukštos rizikos sistemoms papildomai taikyti atsparumo ar degradacijos scenarijų testus.

> Susiję skyriai: [3.3.1](03-architektura.md#331-specifikacija-ir-dokumentacija) · [3.3.2](03-architektura.md#332-versijavimas) · [3.6](03-architektura.md#36-patikimumas-ir-atsparumas) · [3.9.6](03-architektura.md#396-testavimas)

## 7.3. Priemonės ir rekomenduojamos technologijos

PRIVALOMA:

<!-- TEST-TOOL-P01 | ai-reviewable -->
*   Pasirinkti testavimo įrankiai turi būti suderinti su naudojamu technologijų rinkiniu ir komandos kompetencija.
<!-- TEST-TOOL-P02 | ai-reviewable -->
*   Naudojami testavimo įrankiai turi būti palaikomi, dokumentuoti ir įtraukti į projekto ar organizacijos technologijų registrą, kai tai taikoma.
<!-- TEST-TOOL-P03 | ai-reviewable -->
*   Automatizuotų testų vykdymas turi būti integruojamas į CI/CD procesą.

REKOMENDUOJAMA:

<!-- TEST-TOOL-R01 | ai-reviewable -->
*   Unit ir integration testams naudoti kalbos ar platformos bendruomenėje plačiai priimtus įrankius.
<!-- TEST-TOOL-R02 | ai-reviewable -->
*   API testams naudoti priemones, leidžiančias tikrinti kontraktus, statusus, atsakymų struktūrą ir pagrindinius scenarijus.
<!-- TEST-TOOL-R03 | ai-reviewable -->
*   Našumo ir apkrovos testams naudoti organizacijoje priimtus įrankius.
<!-- TEST-TOOL-R04 | ai-reviewable -->
*   Prieinamumo testams derinti automatinius įrankius su rankiniu tikrinimu.

> Susiję skyriai: [4.2.3](04-kodo-kurimo-gaires.md#423-automatinis-formatavimas-ir-linting) · [8](08-devops-ci-cd.md)

## 7.4. Aprėptis ir kokybės vartai (Quality Gates)

PRIVALOMA:

<!-- TEST-GATE-P01 | ai-reviewable -->
*   Projektui turi būti apibrėžti minimalūs testavimo kokybės vartai.
<!-- TEST-GATE-P02 | ai-reviewable -->
*   PR arba MR negali būti laikomas paruoštu merge’inimui, jei nepraeina privalomi build, testų ar kiti kokybės patikrinimai.
<!-- TEST-GATE-P03 | ai-reviewable -->
*   Kritinių modulių testavimo reikalavimai turi būti griežtesni negu pagalbinių ar mažos rizikos komponentų.
<!-- TEST-GATE-P04 | ai-reviewable -->
*   Nestabilūs testai negali būti ignoruojami ilgiau kaip 5 darbo dienas; jie turi būti identifikuojami, pažymimi ir taisomi.

REKOMENDUOJAMA:

<!-- TEST-GATE-R01 | ai-reviewable -->
*   Testų aprėpties tikslus nustatyti projekto pradžioje ir vertinti ne tik bendrą procentą, bet ir kritinių sričių padengimą.
<!-- TEST-GATE-R02 | human-reviewable -->
*   Aprėpties slenksčius naudoti kaip kokybės signalą, o ne vien formalų skaičių.
<!-- TEST-GATE-R03 | ai-reviewable -->
*   Flaky testų problematiką rekomenduojama valdyti kaip atskirą kokybės riziką, o ne spręsti jų išjungimu be priežasties.

> Susiję skyriai: [4.5](04-kodo-kurimo-gaires.md#45-testai) · [8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai) · [6.6](06-saugumas.md#66-owasp-top-10)

## 7.5. Testavimo duomenys ir aplinkos

PRIVALOMA:

<!-- TEST-DATA-P01 | ai-reviewable -->
*   Testavimo duomenys turi būti aiškiai parengti, valdomi ir pakartojami.
<!-- TEST-DATA-P02 | ai-reviewable -->
*   Testavimo aplinkos turi būti atskirtos nuo produkcijos.
<!-- TEST-DATA-P03 | ai-reviewable -->
*   Asmens duomenys testavimo aplinkose turi būti anonimizuoti arba pseudonimizuoti, išskyrus aiškiai pagrįstus ir teisėtus atvejus.
<!-- TEST-DATA-P04 | ai-reviewable -->
*   Išorinės priklausomybės testavimo metu turi būti valdomos per sandbox, mock arba kitus kontroliuojamus mechanizmus, kai tai įmanoma.

REKOMENDUOJAMA:

<!-- TEST-DATA-R01 | ai-reviewable -->
*   Naudoti versijuotus seed duomenis arba aiškiai aprašytus testinių duomenų rinkinius.
<!-- TEST-DATA-R02 | ai-reviewable -->
*   Aplinkų konfigūraciją laikyti pakankamai artimą realiam scenarijui, kai to reikia testų patikimumui.
<!-- TEST-DATA-R03 | ai-reviewable -->
*   Jei naudojamos išorinės sistemos, rekomenduojama aiškiai apibrėžti testavimo langus, ribas ir atsakomybę už testavimo poveikį.

> Susiję skyriai: [3.5](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.9.6](03-architektura.md#396-testavimas)

## 7.6. Našumo ir apkrovos testavimas

PRIVALOMA:

<!-- TEST-PERF-P01 | ai-reviewable -->
*   Kritinėms ir viešosioms sistemoms turi būti atliekami našumo arba apkrovos testai prieš reikšmingus leidimus ar esminius architektūrinius pokyčius.
<!-- TEST-PERF-P02 | ai-reviewable -->
*   Testavimo scenarijai turi būti susieti su aiškiais našumo tikslais ir realiais naudojimo modeliais.
<!-- TEST-PERF-P03 | human-reviewable -->
*   Turi būti aišku, kokia apkrova, kokie duomenų kiekiai ir kokie atsako laikai laikomi priimtinais.
<!-- TEST-PERF-P04 | ai-reviewable -->
*   Našumo testų rezultatai turi būti išsaugomi ir naudojami sprendžiant apie leidimo pasirengimą.

REKOMENDUOJAMA:

<!-- TEST-PERF-R01 | ai-reviewable -->
*   Atlikti ne tik tipinės apkrovos, bet ir staigaus šuolio, ilgalaikio veikimo ar resursų degradacijos scenarijus, kai tai aktualu.
<!-- TEST-PERF-R02 | ai-reviewable -->
*   Našumo testų rezultatus naudoti ne tik leidimo sprendimui, bet ir architektūros, talpyklų, duomenų bazių ar infrastruktūros korekcijai.

> Susiję skyriai: [3.1.1](03-architektura.md#311-kokybės-atributai-nfr) · [3.3.9](03-architektura.md#339-greitaveika-patikimumas-ir-talpyklos) · [9.5](09-stebesena-logai.md#95-sla-slo-ir-sli)

## 7.7. Saugumo testavimas (DevSecOps)

Saugumo testavimo reikalavimai apibrėžti [#6.7](06-saugumas.md#67-security-testing) skyriuje „Security testing", o DevSecOps kontrolės CI/CD procese – [#8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) skyriuje.

## 7.8. Prieinamumo (Accessibility) testavimas

PRIVALOMA:

<!-- TEST-A11Y-P01 | ai-reviewable -->
*   Jei sistema turi naudotojo sąsają, prieinamumo testavimas turi būti planuojamas ir vykdomas kaip testavimo dalis.
<!-- TEST-A11Y-P02 | human-reviewable -->
*   Automatiniai prieinamumo patikrinimai turi būti derinami su rankiniu tikrinimu bent kritiniuose scenarijuose.
<!-- TEST-A11Y-P03 | ai-reviewable -->
*   Prieinamumo tikrinimas turi apimti bent klaviatūros navigaciją, fokusų valdymą, semantiką ir ekrano skaitytuvų pagrindinius scenarijus.

REKOMENDUOJAMA:

<!-- TEST-A11Y-R01 | human-reviewable -->
*   Prieinamumo tikrinimą vykdyti ne tik prieš leidimą, bet ir po reikšmingų UI pokyčių.
<!-- TEST-A11Y-R02 | ai-reviewable -->
*   Aukštos rizikos ar plačiai naudojamoms sistemoms prieinamumo testavimą rekomenduojama įtraukti į regresijos procesą.

> Susiję skyriai: [3.2.5](03-architektura.md#325-prieinamumas-a11y) · [3.9.4](03-architektura.md#394-prieinamumas-ir-lokalizacija)

## 7.9. Testų vykdymas CI/CD ir ataskaitos

PRIVALOMA:

<!-- TEST-CICD-P01 | ai-reviewable -->
*   Automatizuoti testai turi būti integruoti į CI/CD procesą pagal projekto poreikį.
<!-- TEST-CICD-P02 | ai-reviewable -->
*   Testų rezultatai turi būti saugomi kaip atsekami artefaktai.
<!-- TEST-CICD-P03 | ai-reviewable -->
*   Kokybės vartai turi blokuoti leidimą ar merge’inimą, jei neįvykdomi privalomi testavimo reikalavimai.
<!-- TEST-CICD-P04 | ai-reviewable -->
*   Turi būti aišku, kurie testai vykdomi per PR, kurie per pagrindinius build’us, o kurie prieš leidimą.

REKOMENDUOJAMA:

<!-- TEST-CICD-R01 | ai-reviewable -->
*   Naudoti centralizuotas ataskaitas ar suvestines, leidžiančias matyti testų stabilumą, aprėptį ir kokybės tendencijas.
<!-- TEST-CICD-R02 | ai-reviewable -->
*   Kritinių testų rezultatus rekomenduojama įtraukti į release peržiūrą.

> Susiję skyriai: [4.3.5](04-kodo-kurimo-gaires.md#435-pull-request-merge-request-reikalavimai) · [8.2](08-devops-ci-cd.md#82-ci-continuous-integration-minimalūs-reikalavimai) · [8.9](08-devops-ci-cd.md#89-leidimų-release-valdymas)

## 7.10. Priėmimas (UAT) ir nefunkciniai kriterijai

PRIVALOMA:

<!-- TEST-UAT-P01 | ai-reviewable -->
*   Naudotojų priėmimo testavimas turi būti grindžiamas aiškiais priėmimo kriterijais.
<!-- TEST-UAT-P02 | process-level -->
*   Kritiniai naudotojų scenarijai turi būti patvirtinti prieš leidimą, kai to reikalauja sistemos paskirtis.
<!-- TEST-UAT-P03 | ai-reviewable -->
*   Nefunkciniai kriterijai, tokie kaip našumas, saugumas ar prieinamumas, turi turėti aiškiai apibrėžtas priėmimo ribas, jei jie yra reikšmingi sistemai.

REKOMENDUOJAMA:

<!-- TEST-UAT-R01 | ai-reviewable -->
*   UAT scenarijus derinti su product owner ir analitiku dar prieš aktyvų testavimo etapą.
<!-- TEST-UAT-R02 | process-level -->
*   UAT radinius aiškiai atskirti nuo techninių defektų ir naudoti kaip įvestį regresijos bei release planavimui.

> Susiję skyriai: [11.3](11-darbo-organizavimas.md#113-reikalavimų-valdymas) · [11](11-darbo-organizavimas.md) · [9.5](09-stebesena-logai.md#95-sla-slo-ir-sli)

## 7.11. Defektų valdymas ir regresija

PRIVALOMA:

<!-- TEST-REG-P01 | process-level -->
*   Defektai turi būti registruojami, prioritetizuojami ir atsekami.
<!-- TEST-REG-P02 | ai-reviewable -->
*   Kritiniai defektai, darantys poveikį saugumui, duomenų vientisumui ar pagrindiniam funkcionalumui, negali būti ignoruojami prieš leidimą.
<!-- TEST-REG-P03 | ai-reviewable -->
*   Regresijos rinkinys turi būti palaikomas kaip nuolatinė testų bazės dalis.
<!-- TEST-REG-P04 | ai-reviewable -->
*   Kiekvienas reikšmingas bug fix turi papildyti regresijos rinkinį.

REKOMENDUOJAMA:

<!-- TEST-REG-R01 | human-reviewable -->
*   Defektų prioritetus rekomenduojama nustatyti pagal poveikį naudotojui, riziką duomenims ir leidimo stabilumui.
<!-- TEST-REG-R02 | process-level -->
*   Regresijos rinkinį peržiūrėti periodiškai, kad jis išliktų aktualus ir neperkrautas pasenusių scenarijų.

> Susiję skyriai: [4.5](04-kodo-kurimo-gaires.md#45-testai) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas)

## 7.12. Duomenų apsauga (BDAR/GDPR) testuose

PRIVALOMA:

<!-- TEST-GDPR-P01 | ai-reviewable -->
*   Testavimo metu turi būti laikomasi duomenų apsaugos reikalavimų.
<!-- TEST-GDPR-P02 | ai-reviewable -->
*   Testų aplinkose negali būti naudojami realūs asmens duomenys be aiškaus teisinio pagrindo ir apsaugos priemonių.
<!-- TEST-GDPR-P03 | ai-reviewable -->
*   Jei testuojami privatumo, prieigos ar duomenų subjektų teisių scenarijai, jie turi būti tikrinami kontroliuotai ir dokumentuotai.
<!-- TEST-GDPR-P04 | ai-reviewable -->
*   Loguose ir testų ataskaitose negali būti perteklinių jautrių duomenų.

REKOMENDUOJAMA:

<!-- TEST-GDPR-R01 | ai-reviewable -->
*   Privatumo scenarijus, tokius kaip sutikimų valdymas, duomenų trynimas ar eksportas, įtraukti į reguliarius testavimo rinkinius, jei tai taikoma sistemai.
<!-- TEST-GDPR-R02 | ai-reviewable -->
*   Testavimo duomenų gyvavimo ciklą rekomenduojama valdyti taip pat nuosekliai kaip ir produkcinių duomenų apsaugos priemones.

> Susiję skyriai: [6.3](06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5](03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [9.7](09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)

## 7.13. Atsparumo, DR ir atkūrimo testai

PRIVALOMA:

<!-- TEST-DR-P01 | ai-reviewable -->
*   Kritinėms sistemoms turi būti testuojamas atsarginių kopijų atkūrimas ir, kai taikoma, atkūrimo po sutrikimo scenarijai.
<!-- TEST-DR-P02 | ai-reviewable -->
*   Atkūrimo testai turi būti siejami su nustatytais RTO ir RPO tikslais.
<!-- TEST-DR-P03 | ai-reviewable -->
*   Netestuotas atkūrimo scenarijus nelaikomas pakankamu pasirengimo įrodymu.

REKOMENDUOJAMA:

<!-- TEST-DR-R01 | ai-reviewable -->
*   Reguliariai testuoti ne tik atsarginių kopijų sukūrimą, bet ir pilną atkūrimo eigą.
<!-- TEST-DR-R02 | ai-reviewable -->
*   Jei sistema priklauso nuo išorinių paslaugų ar kelių komponentų, rekomenduojama testuoti ir dalinio degradavimo bei failover scenarijus.
<!-- TEST-DR-R03 | ai-reviewable -->
*   Atsparumo testų rezultatus rekomenduojama naudoti koreguojant eksploatacijos dokumentaciją ir incidentų planus.

> Susiję skyriai: [3.6](03-architektura.md#36-patikimumas-ir-atsparumas) · [9.6](09-stebesena-logai.md#96-incidentų-valdymas) · [9.8](09-stebesena-logai.md#98-eksploatacijos-dokumentacija)
