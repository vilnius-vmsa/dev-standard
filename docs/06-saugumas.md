# 6. Saugumas (Security by Design)

Šis skyrius apibrėžia saugumo principus ir privalomus reikalavimus, taikomus visoms savivaldybės informacinėms sistemoms.

Saugumas laikomas ne papildomu funkcionalumu, o integralia sistemos architektūros, kūrimo, diegimo ir eksploatacijos dalimi nuo pirmos dienos.

Šio skyriaus reikalavimai taikomi visoms sistemoms, nepriklausomai nuo jų dydžio, o jų įgyvendinimo apimtis turi būti proporcinga sistemos kritiškumui, tvarkomiems duomenims ir grėsmių lygiui.

## 6.1. Bendrieji saugumo principai

PRIVALOMA:

*   Saugumas turi būti integruotas projektavimo etape ir negali būti paliekamas vėlyvam įgyvendinimui po funkcionalumo sukūrimo.
*   Pagal nutylėjimą sistema turi būti projektuojama saugiai, net jei papildomos konfigūracijos dar nėra pilnai užbaigtos.
*   Turi būti taikomas mažiausių privilegijų principas naudotojams, servisams ir automatizuotoms užduotims.
*   Saugumas turi būti įgyvendinamas keliais sluoksniais, apimant tinklą, aplikaciją, duomenis, prieigas ir eksploataciją.
*   Turi būti mažinamas atakos paviršius, išjungiant nereikalingus endpointus, paslaugas, administravimo funkcijas ir prieigas.
*   Saugumo požiūriu reikšmingi veiksmai turi būti atsekami per logus, audit trail ir incidentų valdymo procesus.

REKOMENDUOJAMA:

*   Reikšmingiems arba aukštos rizikos sprendimams atlikti grėsmių modeliavimą.
*   Sudėtingoms sistemoms saugumo rizikas vertinti ne tik projektavimo pradžioje, bet ir po esminių architektūrinių pokyčių.
*   Saugumo reikalavimus įtraukti į NFR ir priėmimo kriterijus, o ne laikyti atskira poimplementacine veikla.

> Susiję skyriai: [3.1.3 Security by Design ir Privacy by Design](03-architektura.md#313-security-by-design-ir-privacy-by-design) · [3.3.4 Apsauga ir prieiga](03-architektura.md#334-apsauga-ir-prieiga) · [3.6 Patikimumas ir atsparumas](03-architektura.md#36-patikimumas-ir-atsparumas) · [9 Stebėsena, logai ir eksploatacija](09-stebesena-logai.md)

## 6.2. Autentifikacija ir autorizacija

Šiame poskyryje apibrėžiami bendrieji tapatybės nustatymo ir prieigos kontrolės reikalavimai.

Autentifikacijos ir autorizacijos sprendimai turi būti derinami su sistemos paskirtimi, rizika ir organizacijos centralizuota tapatybės valdymo infrastruktūra.

### 6.2.1. Autentifikacija

PRIVALOMA:

*   Turi būti naudojama organizacijos patvirtinta centralizuota tapatybės valdymo sistema, kai tai įmanoma pagal sistemos paskirtį.
*   Šiuolaikiniai autentifikacijos standartai, tokie kaip OAuth 2.0 ir OpenID Connect, turi būti laikomi numatytuoju pasirinkimu naujoms sistemoms ir integracijoms.
*   Administratorių ir vidinių naudotojų prieigoms turi būti taikoma daugiafaktorė autentifikacija, kai tai techniškai įmanoma.
*   Jei naudojami slaptažodžiai, jie turi būti saugomi naudojant Argon2id (rekomenduojama) arba bcrypt algoritmą su salt.
*   Autentifikacijos mechanizmai turi būti dokumentuoti, atsekami ir nepriklausyti nuo vieno tiekėjo vidinių neperduodamų sprendimų.

REKOMENDUOJAMA:

*   Išorinėms prieigoms ir jautriems scenarijams daugiafaktorę autentifikaciją taikyti kaip numatytąją priemonę.
*   Autentifikacijos sprendimus projektuoti taip, kad būtų galima aiškiai atskirti naudotojų, servisų ir administracinių paskyrų tipus.

### 6.2.2. Autorizacija

PRIVALOMA:

*   Prieigos kontrolė turi būti įgyvendinta serverio pusėje, nepriklausomai nuo kliento ar UI logikos.
*   Prieigos teisės turi būti grindžiamos vaidmenimis, atsakomybėmis ar aiškiai apibrėžtais scope’ais.
*   Jautriems veiksmams, tokiems kaip duomenų trynimas, teisių keitimas ar administracinės funkcijos, turi būti taikomi aiškiai atskirti leidimai.
*   Teisių suteikimo, keitimo ir panaikinimo veiksmai turi būti registruojami audito žurnale.

REKOMENDUOJAMA:

*   Vengti individualių ir sunkiai prižiūrimų rankinių teisių rinkinių, jei tą patį galima įgyvendinti per roles ar politiką.
*   Aukštos rizikos veiksmams taikyti papildomas apsaugos priemones, pvz., papildomą autorizacijos patvirtinimą ar dviejų asmenų kontrolės principą, jei tai pagrįsta.

> Susiję skyriai: [3.3.4 Apsauga ir prieiga](03-architektura.md#334-apsauga-ir-prieiga) · [9.7 Audit trail (audito pėdsakas)](09-stebesena-logai.md#97-audit-trail-audito-pėdsakas) · [3.10.2 Suderinamumas su savivaldybės infrastruktūra](03-architektura.md#3102-suderinamumas-su-savivaldybės-infrastruktūra)

## 6.3. Duomenų apsauga (GDPR kontekstas)

Šiame poskyryje apibrėžiami bendrieji asmens duomenų apsaugos reikalavimai.

Konkretesni reikalavimai duomenų srautams ir integracijoms apibrėžti [#3.4.5](03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) skyriuje.

PRIVALOMA:

*   Turi būti taikomas duomenų minimizavimo principas – renkami ir tvarkomi tik tie duomenys, kurie būtini aiškiai apibrėžtam tikslui.
*   Duomenys turi būti klasifikuojami pagal jautrumą ir šis klasifikavimas turi būti naudojamas projektavimo, prieigos kontrolės ir eksploatacijos sprendimuose.
*   Asmens duomenys turi būti apsaugoti tiek perdavimo metu, tiek saugojimo metu.
*   Prieiga prie asmens duomenų turi būti suteikiama tik pagal pareigas ir būtinumą.
*   Sistemos turi sudaryti galimybę įgyvendinti duomenų subjektų teises, kai tai taikoma.
*   Turi būti apibrėžti ir techniškai užtikrinti duomenų saugojimo terminai bei trynimo logika.
*   Jei duomenų tvarkymas gali kelti didelę riziką, turi būti atliktas Duomenų apsaugos poveikio vertinimas.
<!-- SEC-GDPR-P01 | ai-reviewable -->
*   Asmens duomenų laukai persistencijos sluoksnyje (Eloquent models, Doctrine entities) turi būti pažymėti `#[PersonalData]` atributu, nurodant jautrumo lygį ir kategoriją. Sistema turi gebėti automatiškai sugeneruoti asmens duomenų inventorių iš kodo (žr. [C priedą](priedai/asmens-duomenu-inventorizacija.md)).

REKOMENDUOJAMA:

*   Projektavimo metu aiškiai dokumentuoti, kokie asmens duomenys tvarkomi, kur jie saugomi ir kas turi prieigą.
*   Aukštos rizikos scenarijuose taikyti papildomas priemones, tokias kaip pseudonimizacija ar laukų maskavimas.
<!-- SEC-GDPR-R01 | ai-reviewable -->
*   Asmens duomenų anotacijų spragų aptikimą (neanotuotus, bet įtartinus laukus) vykdyti CI aplinkoje kaip neblokuojantį įspėjimą (žr. [C.6 Spragų aptikimas](priedai/asmens-duomenu-inventorizacija.md#c6-spragų-aptikimas)).

> Susiję skyriai: [3.4.5 Asmens duomenų apsauga (BDAR / GDPR)](03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [3.10.1 Teisinė ir reguliacinė atitiktis](03-architektura.md#3101-teisinė-ir-reguliacinė-atitiktis) · [9.7 Audit trail (audito pėdsakas)](09-stebesena-logai.md#97-audit-trail-audito-pėdsakas) · [B priedas. BDAR įgyvendinimo šablonai](priedai/bdar-igyvendinimo-sabalonai.md) · [C priedas. Asmens duomenų inventorizacija](priedai/asmens-duomenu-inventorizacija.md)

## 6.4. Secrets management

Šiame poskyryje apibrėžiami bendrieji slaptųjų duomenų valdymo saugumo principai.

PRIVALOMA:

*   Draudžiama saugoti paslaptis programiniame kode, repozitorijose, build artefaktuose ar loguose.
*   Turi būti naudojama centralizuota ir saugi paslapčių saugykla.
*   Kiekviena aplinka turi turėti atskirus slaptuosius raktus.
*   Prieiga prie paslapčių turi būti ribojama pagal mažiausių privilegijų principą.
*   Paslapčių rotacija turi būti užtikrinta ne rečiau kaip kas 90 dienų ir nedelsiant (per 24 valandas) po galimo nutekėjimo.
*   Paslapčių naudojimas ir keitimas turi būti atsekamas.

REKOMENDUOJAMA:

*   Paslapčių naudojimo modelį dokumentuoti taip, kad būtų aišku, kokios paslaptys naudojamos, kur jos laikomos ir kas turi prieigą.
*   Neįprastą paslapčių naudojimą stebėti ir naudoti kaip saugumo signalą.

> Susiję skyriai: [3.5 Konfigūracija, slaptieji raktai ir aplinkos](03-architektura.md#35-konfigūracija-slaptieji-raktai-ir-aplinkos) · [8.6 DevSecOps (CI/CD kontrolė)](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) · [9.1 Logging (žurnalų) standartai](09-stebesena-logai.md#91-logging-žurnalų-standartai)

## 6.5. Saugumas naršyklėje

Šiame poskyryje apibrėžiami naršyklės lygmens saugumo reikalavimai web aplikacijoms (CSP, XSS, CSRF, slapukų atributai ir pan.). Jie papildo bendruosius saugumo principus ir OWASP Top 10 kontrolę, aprašytą [#6.6](#66-owasp-top-10) skyriuje „OWASP Top 10“.

PRIVALOMA:

*   Content Security Policy (CSP): naudoti nonce-based arba strict-dynamic strategiją; allowlist-based CSP be strict-dynamic nepatikima dėl trečiųjų šalių skriptų.
*   XSS prevencija: draudžiamas tiesioginis HTML injektavimas (innerHTML, dangerouslySetInnerHTML) be aiškios sanitizacijos; naudoti framework’o natyvų escaping.
*   CSRF apsauga: SameSite=Strict arba SameSite=Lax su Host- prefixu slapukams; papildomas CSRF token formos mutacijos veiksmams.
*   Slapukų atributai: HttpOnly (prieigai iš JS draudžiamas), Secure (tik HTTPS), SameSite – visi trys privalomi sesijos slapukams.
*   Trečiųjų šalių skriptai (analytics, žemėlapiai, chat widgetai) apribojami CSP ir audituojami.
*   CORS politika: Access-Control-Allow-Origin turi būti apribota iki aiškiai žinomų kilmės domenų; wildcard (`*`) draudžiamas autentifikuotoms API.
*   Subresource Integrity (SRI): visi iš CDN ar trečiųjų šalių įkeliami skriptai ir stilių failai turi turėti `integrity` atributą.
*   Transporto saugumas: visos jungtys turi naudoti TLS 1.2 arba aukštesnę versiją; TLS 1.0 ir 1.1 draudžiami. HSTS antraštė privaloma visuose viešuose endpointuose.

## 6.6. OWASP Top 10

Šiame poskyryje nustatoma, kad OWASP Top 10 laikomas minimaliu taikytinu saugumo kontrolės pagrindu web, API ir kitoms taikomosioms sistemoms.

PRIVALOMA:

*   Sistema turi būti projektuojama ir įgyvendinama taip, kad būtų mažinamos rizikos, susijusios bent su pagrindinėmis OWASP Top 10 kategorijomis.
*   Įvesties duomenys turi būti validuojami serverio pusėje.
*   Prieigos kontrolė turi būti aiški, testuojama ir taikoma nuosekliai.
*   Turi būti vengiama nesaugių kriptografinių sprendimų ir saugumo konfigūracijos klaidų.
*   Priklausomybės turi būti vertinamos dėl žinomų pažeidžiamumų ir palaikymo būklės.
*   Failų įkėlimo, injekcijų, autentifikacijos ir saugumo logavimo rizikos turi būti tiesiogiai įvertintos projektuojant ir testuojant sistemą.

REKOMENDUOJAMA:

*   OWASP Top 10 naudoti kaip kontrolinį sąrašą architektūrinėms peržiūroms ir saugumo testavimui.
*   Aukštos rizikos sistemoms periodiškai peržiūrėti, ar neatsirado naujų pažeidžiamumų scenarijų, kurie nebuvo aktualūs projekto pradžioje.

> Susiję skyriai: [6.5 Saugumas naršyklėje](#65-saugumas-naršyklėje) · [3.3.6 Input validacija ir užklausų apsauga](03-architektura.md#336-input-validacija-ir-užklausų-apsauga) · [4.6 Saugumas kodo lygmeniu](04-kodo-kurimo-gaires.md#46-saugumas-kodo-lygmeniu) · [6.7 Security testing](#67-security-testing)

## 6.7. Security testing

Šiame poskyryje apibrėžiami saugumo testavimo reikalavimai, taikomi sistemos kūrimo ir leidimo procese.

Bendrieji testavimo reikalavimai apibrėžti [#7](07-testavimas.md) skyriuje, o DevSecOps kontrolės – [#8.6](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) skyriuje.

PRIVALOMA:

*   SAST ir priklausomybių saugumo tikrinimas turi būti vykdomi kiekviename CI pipeline (PR/MR lygmeniu) ir integruoti į kūrimo arba leidimo procesą.
*   Kritinėms ar viešai pasiekiamoms sistemoms prieš produkcinį leidimą turi būti atliekami papildomi saugumo patikrinimai, proporcingi rizikai.
*   Saugumo testų rezultatai turi būti dokumentuojami ir naudojami sprendžiant, ar sistema gali būti leidžiama toliau.
*   Kritiniai pažeidžiamumai negali būti ignoruojami be aiškaus sprendimo plano ir rizikos priėmimo.

REKOMENDUOJAMA:

*   Kritinėms sistemoms planuoti periodinius penetracinius testus.
*   Saugumo testavimą derinti su architektūros peržiūra, grėsmių modeliavimu ir incidentų pamokomis.
*   Saugumo testavimo apimtį peržiūrėti po reikšmingų architektūrinių ar integracinių pokyčių.

> Susiję skyriai: [4.6 Saugumas kodo lygmeniu](04-kodo-kurimo-gaires.md#46-saugumas-kodo-lygmeniu) · [7 Testavimo reikalavimai ir principai](07-testavimas.md) · [8.6 DevSecOps (CI/CD kontrolė)](08-devops-ci-cd.md#86-devsecops-ci-cd-kontrolė) · [3.10 Atitiktis ir suderinamumas](03-architektura.md#310-atitiktis-ir-suderinamumas)
