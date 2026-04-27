# 9. Stebėsena, logai ir eksploatacija

Šis skyrius apibrėžia **sistemų eksploatacijos po „go‑live“** reikalavimus. Tikslas - užtikrinti patikimą sistemų veikimą, savalaikį incidentų aptikimą ir reagavimą, teisinį atsekamumą bei audituojamumą, kuris yra **ypač svarbus savivaldybei ir viešajam sektoriui**.

## 9.1. Logging (žurnalų) standartai

Šiame skyriuje apibrėžiami sistemų žurnalų formatavimo, turinio, koreliacijos ir saugojimo reikalavimai. Visi logavimo sprendimai turi užtikrinti techninių įvykių atsekamumą, diagnostiką ir auditui reikalingą informacijos vientisumą.

PRIVALOMA:

*   Visi aplikacijų, API, infrastruktūros ir saugumo logai siunčiami į centralizuotą logų sistemą. Vietiniai logų failai gali būti naudojami tik kaip laikina techninė priemonė, bet nelaikomi pagrindiniu stebėsenos šaltiniu.
*   Logai turi būti struktūruoti ir mašiniškai apdorojami (pvz., JSON arba lygiavertis formatas).
*   Kiekvienas logų įrašas turi turėti bent šiuos laukus:
    *   timestamp (UTC, ISO 8601 formatu)
    *   level
    *   service arba application
    *   environment
    *   traceId arba correlationId
    *   message
*   Papildomi kontekstiniai laukai (context) gali būti naudojami tik tada, kai jie padeda diagnostikai ir nepažeidžia duomenų apsaugos reikalavimų.
*   Asmens ir kiti jautrūs duomenys loguose draudžiami, išskyrus atvejus, kai tai būtina teisėtam tikslui; tokiais atvejais taikoma pseudonimizacija arba maskavimas.
*   Log lygiai naudojami nuosekliai:
    *   DEBUG – diagnostikai ir kūrimui; produkcinėje aplinkoje išjungtas pagal nutylėjimą
    *   INFO – normalūs verslo ir sistemos įvykiai
    *   WARN – neįprastos, bet valdomos situacijos
    *   ERROR – klaidos, reikalaujančios dėmesio
    *   FATAL – kritinės būsenos, kai servisas nebegali tęsti darbo
*   Logų siuntimas į centralizuotą platformą turi būti asinchroninis; logų sistemos neprieinamumas neturi blokuoti pagrindinės sistemos veikimo.
*   Logų saugojimo terminai apibrėžiami pagal duomenų tipą ir teisinius reikalavimus:
    *   operaciniai logai – trumpesnio saugojimo
    *   klaidų ir įspėjimų logai – ilgesnio saugojimo
    *   saugumo ir audito logai – pagal teisės aktų ir vidaus taisyklių reikalavimu
*   Logų valymas turi būti automatizuotas pagal nustatytą retention politiką.

REKOMENDUOJAMA:

*   Naudoti vieningą laukų pavadinimų schemą visose sistemose, kad būtų paprasta koreliuoti logus tarp skirtingų servisų.
*   Logų platformos sveikata turėtų būti stebima atskirai nuo pagrindinių sistemų.
*   Produkcinėje aplinkoje DEBUG lygis įjungiamas tik laikinai diagnostikai, su aiškiu valdymu ir auditu.

## 9.2. Monitoring ir metrikos

Šiame skyriuje apibrėžiami sistemų techninių ir aplikacinių metrikų rinkimo, stebėsenos ir naudojimo principai. Monitoringas laikomas ne papildomu funkcionalumu, o būtina eksploatacijos dalimi, leidžiančia laiku nustatyti degradaciją, klaidas ir patikimumo rizikas.

Alerting taisyklės apibrėžtos [#9.3](#93-alerting-principai) skyriuje, o klaidų apdorojimo principai – [#9.4](#94-klaidos-ir-error-handling) skyriuje.

PRIVALOMA:

*   Kiekviena sistema privalo turėti technines ir aplikacines metrikas nuo pirmos dienos.
*   Techninės metrikos turi apimti bent:
    *   CPU naudojimą,
    *   atminties naudojimą,
    *   disko būseną,
    *   tinklo būseną,
    *   pod / serviso būklę.
*   Kiekvienam servisui turi būti stebimi keturi auksiniai signalai:
    *   Latency – užklausų atsakymo laikas (p50, p95, p99, ne tik vidurkis),
    *   Traffic – užklausų srautas (pvz., RPS, pranešimų/s),
    *   Errors – klaidų dažnis ir tipai,
    *   Saturation – resursų išnaudojimas (pvz., CPU, atmintis, DB jungtys, eilių gylis)
*   Jei sistema teikia verslui svarbias funkcijas, turi būti stebimos ir aplikacinės / verslo metrikos (pvz., dokumentų apdorojimo sparta, integracijos vėlavimas, užklausų kiekiai pagal paslaugą)
*   Monitoringas turi būti integruotas taip, kad metrikos būtų agreguojamos bent pagal:
    *   servisą,
    *   aplinką,
    *   versiją (jei taikoma).

REKOMENDUOJAMA:

*   Stebėsenos modelį organizuoti remiantis „keturiais auksiniais signalais“ kaip pagrindiniu operaciniu pjūviu. Tai leidžia atskirti apkrovos, našumo, klaidų ir resursų ribų problemas.
*   Metrikų rinkimas neturėtų ženkliai didinti sistemos apkrovos; scraping intervalai ir metrikų raiška turi būti kalibruojami pagal sistemos kritiškumą.
*   Verslo ir techniniai dashboardai turėtų būti prieinami atsakingiems asmenims be specialių įrankių žinių.
*   Jei naudojamas distribucinis sekimas (distributed tracing), jo signalai turėtų būti derinami su metrikomis ir logais per bendrą koreliacijos identifikatorių.

## 9.3. Alerting principai

Šiame skyriuje apibrėžiami aliarmų (alerts) kūrimo, kokybės ir reagavimo principai. Alerting tikslas – ne informuoti apie kiekvieną techninį įvykį, o laiku identifikuoti realų poveikį naudotojams, duomenims ar paslaugų lygiui ir inicijuoti aiškų veiksmą.

Stebėsenos signalai ir metrikos apibrėžti [#9.2](#92-monitoring-ir-metrikos) skyriuje, o incidentų valdymo procesas – [#9.6](#96-incidentų-valdymas) skyriuje.

PRIVALOMA:

*   Alertai turi būti kuriami pagal poveikį, o ne pagal vien techninį įvykį. Aliarmas turi reikšti realų arba tikėtiną poveikį naudotojams, duomenims arba paslaugų lygiui.
*   Kiekvienas alertas privalo turėti aiškiai apibrėžtą reagavimo veiksmą arba nuorodą į runbook / veiksmų instrukciją.
*   Kritiniai alertai turi būti grindžiami patikimais signalais, tokiais kaip:
    *   paslaugos nepasiekiamumas,
    *   reikšmingas klaidų šuolis,
    *   SLO pažeidimo rizika,
    *   duomenų praradimo ar saugumo rizika.
*   Alertų kanalai turi būti centralizuoti ir valdomi per organizacijos pasirinktus pranešimų / incidentų kanalus.
*   Alertų konfigūracija turi būti suderinta su sistemos kritiškumu ir stebėsenos modeliu.

REKOMENDUOJAMA:

*   Alertus skirstyti bent į dvi kategorijas:
    *   nedelsiant reaguotini (pvz., kritinis sutrikimas, duomenų praradimo rizika, reikšmingas paslaugos sutrikimas),
    *   atidėti / peržiūrėti darbo metu (pvz., artėjantis resursų išnaudojimas, degradacijos pradžia, neefektyvūs retry scenarijai).
*   Vengti alertų triukšmo („alert fatigue“) – per daug neveiksmingų alertų mažina reagavimo kokybę ir didina riziką praleisti kritinius signalus.
*   Alertų skaičius, kokybė ir suveikimo pagrįstumas turėtų būti periodiškai peržiūrimi; neveiksmingi ar nuolat klaidingai suveikiantys alertai turi būti taisomi arba šalinami.
*   Alertus rekomenduojama testuoti periodiškai (pvz., per testinius scenarijus ar „game day“ tipo patikras), kad būtų patvirtinta jų veiksmingumas ir reagavimo proceso aktualumas.

## 9.4. Klaidos ir „error handling“

Šiame skyriuje apibrėžiami klaidų **apdorojimo, klasifikavimo ir eskalavimo** principai eksploatacijos metu. API klaidų struktūra, formatas ir kontraktas apibrėžti [#3.3.8](03-architektura.md#338-standartizuotos-klaidos) skyriuje.

PRIVALOMA:

*   Visos klaidos turi būti klasifikuojamos bent į dvi kategorijas:
    *   **verslo (business) klaidos** – korektiškai apdorotos situacijos, paprastai grąžinamos kaip 4xx;
    *   **techninės (system) klaidos** – nenumatyti sistemos sutrikimai, paprastai grąžinami kaip 5xx
*   Visos 5xx klaidos registruojamos kaip ERROR lygio logai
*   4xx klaidos registruojamos kaip WARN arba INFO, jei jos atspindi korektiškai apdorotą vartotojo veiksmą
*   Kiekvienas klaidos logas privalo turėti traceId, sutampantį su API atsakyme grąžintu traceId
*   5xx klaidos laikomos kritiniais signalais ir turi būti įtrauktos į stebėsenos bei alerting mechanizmus
*   4xx klaidos (išskyrus 429) automatiškai nekartojamos; 5xx ir tinklo klaidos gali būti kartojamos tik pagal apibrėžtą retry politiką
*   Pasikartojančios, masinės arba ilgiau trunkančios klaidos turi būti eskaluojamos kaip incidentai

REKOMENDUOJAMA:

*   Klaidų metrikas agreguoti pagal:
    *   Servisą
    *   API endpoint’ą
    *   aplinką
    *   klaidos kodą
*   Eskalavimo kriterijus apibrėžti stebėsenos ir alerting konfigūracijoje pagal sistemos kritiškumą
*   Vartotojo sąsaja neturėtų remtis vien HTTP statuso kodais verslo logikai; rekomenduojama naudoti klaidos kodą (code) ir API specifikaciją, apibrėžtą [#3.8](03-architektura.md#38-diagramos-ir-dokumentavimas) skyriuje.

## 9.5. SLA, SLO ir SLI

Šiame skyriuje apibrėžiami paslaugų lygio įsipareigojimai, tikslai ir matavimo rodikliai, naudojami sistemos patikimumui ir kokybei vertinti eksploatacijos metu.

Stebėsenos signalai ir metrikos apibrėžti [#9.2](#92-monitoring-ir-metrikos) skyriuje, alerting principai – [#9.3](#93-alerting-principai) skyriuje, o incidentų valdymas – [#9.6](#96-incidentų-valdymas) skyriuje.

PRIVALOMA:

*   Kritinėms ir viešosioms sistemoms turi būti apibrėžti SLO (Service Level Objectives), susiję bent su:
    *   Pasiekiamumu
    *   atsako laiku
    *   klaidų lygiu
*   Kiekvienai sistemai turi būti priskirtas SLO lygis (tier) projekto pradžioje, remiantis sistemos kritiškumu ir paskirtimi.
*   SLI (Service Level Indicators) turi būti aiškiai susieti su stebimomis metrikomis ir apskaičiuojami objektyviai, remiantis [#9.2](#92-monitoring-ir-metrikos) skyriuje apibrėžtu monitoringu
*   Jei sistemai taikomi išoriniai ar sutartiniai paslaugų lygio įsipareigojimai, jie turi būti dokumentuoti kaip SLA (Service Level Agreement).
*   SLO ir SLI turi būti dokumentuoti taip, kad būtų aišku:
    *   kas matuojama
    *   kokiu laikotarpiu
    *   kokia yra priimtina riba
    *   kas laikoma pažeidimu
*   SLO pažeidimo arba reikšmingos degradacijos rizika turi būti susieta su alerting mechanizmais

### 9.5.1. Numatytieji SLO lygiai (tiers)

Šioje lentelėje pateikiami numatytieji SLO tikslai pagal sistemos kritiškumo lygį. Tai yra pradiniai orientyrai, kuriuos kiekvienas projektas gali koreguoti pagal nefunkcinius reikalavimus ir infrastruktūros galimybes.

| Lygis | Sistemų tipai | Pasiekiamumas | p95 atsako laikas | Klaidų lygis (5xx) | Matavimo laikotarpis |
|---|---|---|---|---|---|
| **1 lygis — Kritinės viešosios** | Piliečiams skirti portalai, e. paslaugos, savitarna | ≥ 99,9 % | ≤ 500 ms | ≤ 0,1 % | 30 dienų slankusis langas |
| **2 lygis — Vidinės verslo** | Administracinės sistemos, bylų valdymas, vidinės API | ≥ 99,5 % | ≤ 1 s | ≤ 0,5 % | 30 dienų slankusis langas |
| **3 lygis — Pagalbinės** | Ataskaitų generavimas, batch procesai, kūrimo įrankiai | ≥ 99,0 % | ≤ 3 s | ≤ 1,0 % | 30 dienų slankusis langas |

*   1 lygio sistemoms error budget principas rekomenduojamas kaip numatytoji patikimumo valdymo priemonė.
*   Konkretūs SLO tikslai turi būti patvirtinti Product Owner ir techninio vadovo projekto pradžioje.

REKOMENDUOJAMA:

*   Kritinėms sistemoms naudoti error budget principą – leistiną nuokrypį nuo SLO, po kurio prioritetas teikiamas stabilumui ir patikimumui, o ne naujų funkcijų diegimui.
*   SLO turėtų būti peržiūrimi periodiškai (pvz., kartą per ketvirtį) arba po reikšmingų incidentų, remiantis faktiniais stebėsenos duomenimis.
*   SLO reikšmes rekomenduojama apibrėžti taip, kad jos atspindėtų realų naudotojo patyrimą, o ne vien infrastruktūros būklę.
*   SLA, jei taikoma, turėtų būti suderinta su realiomis techninėmis galimybėmis ir stebimais SLI.

## 9.6. Incidentų valdymas

Šiame skyriuje apibrėžiami incidentų identifikavimo, klasifikavimo, eskalavimo, komunikacijos ir uždarymo principai.

Incidentų valdymas taikomas tiek techniniams, tiek saugumo, tiek paslaugų prieinamumo sutrikimams, kurie turi arba gali turėti poveikį naudotojams, duomenims ar paslaugų lygiui.

Alerting principai apibrėžti [#9.3](#93-alerting-principai) skyriuje, klaidų operacinis apdorojimas – [#9.4](#94-klaidos-ir-error-handling) skyriuje, o audit trail reikalavimai – [#9.7](#97-audit-trail-audito-pėdsakas) skyriuje.

Jei organizacijoje galioja atskiri incidentų ar kibernetinių incidentų valdymo planai, šis skyrius taikomas kartu su jais ir jų neperrašo.

PRIVALOMA:

*   Incidentas laikomas bet koks sutrikimas ar degradacija, kuris:
    *   daro poveikį naudotojams ar paslaugų teikimui;
    *   kelia riziką duomenų vientisumui, konfidencialumui ar prieinamumui;
    *   rodo, kad sistema nebeatitinka sutartų SLO / SLA tikslų.
*   Incidentai turi būti klasifikuojami pagal poveikį ir skubumą. Klasifikavimo schema turi būti vienoda visos sistemos ar organizacijos mastu.
*   Kiekvienam incidentui turi būti užregistruota bent:
    *   identifikatorius;
    *   pradžios laikas;
    *   paveikta sistema / paslauga;
    *   poveikio aprašymas;
    *   prioritetas / kritiškumas;
    *   atsakingas asmuo arba komanda;
    *   dabartinis statusas.
*   Kritiniams incidentams turi būti aiškiai apibrėžti:
    *   reagavimo laikas (kritiniams – ne daugiau kaip 30 min darbo metu);
    *   eskalavimo kelias;
    *   komunikacijos kanalai;
    *   atsakomybės.
*   Incidento metu turi būti užtikrintas techninis atsekamumas: incidentas turi būti susietas su logais, metrikomis, alertais ir, jei taikoma, traceId / kitais koreliacijos identifikatoriais.
*   Po kiekvieno reikšmingo incidento turi būti atliekama post-mortem analizė per 5 darbo dienas, kuri apima bent:
    *   priežastį;
    *   poveikį;
    *   identifikuotas spragas;
    *   prevencinius veiksmus.

Post-mortem išvados turi būti sekamos kaip konkrečios užduotys, o ne tik archyvuojamos dokumentuose.

REKOMENDUOJAMA:

Incidentus skirstyti bent į kelis kritiškumo lygius (pvz., kritinis, aukštas, vidutinis, žemas), kad būtų aiškūs reagavimo prioritetai.

Naudoti „blameless post-mortem“ principą – incidentų analizė orientuojama į priežastis ir tobulinimą, o ne į kaltųjų paiešką.

Incidentų istoriją ir tendencijas periodiškai peržiūrėti, naudojant jas SLO, alerting ir architektūrinių prioritetų korekcijai.

Reikšmingų incidentų atvejais rekomenduojama turėti iš anksto parengtus komunikacijos šablonus naudotojams ir vidinėms komandoms.

## 9.7. Audit trail (audito pėdsakas)

Šiame skyriuje apibrėžiami audituojamų veiksmų, audito įrašų turinio, nekintamumo ir prieigos reikalavimai.

Audit trail skirtas užtikrinti teisinį atsekamumą, incidentų tyrimą, saugumo kontrolę ir veiksmų atsekimą kritinėse sistemose.

Bendrieji logavimo reikalavimai apibrėžti [#9.1](#91-logging-žurnalų-standartai) skyriuje, incidentų valdymas – [#9.6](#96-incidentų-valdymas) skyriuje, o duomenų apsaugos reikalavimai – [#6](06-saugumas.md) skyriuje

PRIVALOMA:

*   Audit trail privalomas visoms sistemoms, kuriose atliekami bent vieni iš šių veiksmų:
    *   autentifikacija ar autorizacija
    *   duomenų peržiūra, kūrimas, keitimas ar trynimas
    *   teisių ir vaidmenų keitimas
    *   administraciniai veiksmai
    *   integraciniai ar automatizuoti veiksmai, turintys poveikį duomenims ar procesams
*   Audito įrašai turi apimti bent šiuos laukus:
    *   kas atliko veiksmą (userId, sistemos identifikatorius arba serviso paskyra)
    *   kada veiksmas atliktas (timestamp, UTC)
    *   koks veiksmas atliktas (action)
    *   kokiam objektui ar resursui veiksmas taikytas (resource)
    *   rezultatas (success / denied / failed)
*   Jei techniškai ir teisiškai pagrįsta, audito įrašai papildomai gali apimti:
    *   kilmės IP adresą
    *   kliento ar sistemos tipą
    *   sesijos ar koreliacijos identifikatorių (traceId / correlationId)
*   Audito įrašai turi būti saugomi taip, kad jų nebūtų galima nepastebimai pakeisti ar ištrinti.
*   Prieiga prie audito įrašų suteikiama tik aiškiai autorizuotiems asmenims pagal pareigas ir būtinumą.
*   Audito duomenys turi būti saugomi pagal taikomus teisės aktus, vidaus taisykles ir duomenų apsaugos reikalavimus.
*   Kritiniai audito įvykiai turi būti susiejami su incidentų tyrimui reikalingais logais ir kitais stebėsenos duomenimis.

REKOMENDUOJAMA:

*   Audituojamus veiksmus klasifikuoti pagal kritiškumą (pvz., saugumo, administraciniai, verslo duomenų pokyčiai), kad būtų paprasčiau taikyti paiešką, retention ir peržiūros taisykles.
*   Naudoti vieningą audito įrašų schemą visose sistemose, kad būtų galima koreliuoti veiksmus tarp skirtingų servisų ir integracijų.
*   Audit trail peržiūrą periodiškai atlikti kartu su saugumo ir incidentų valdymo procesais.
*   Jei sistema turi aukštą teisinę ar reputacinę riziką, rekomenduojama audito įrašus saugoti atskiroje, nuo pagrindinės aplikacijos nepriklausomoje saugykloje.

## 9.8. Eksploatacijos dokumentacija

Šiame skyriuje apibrėžiami minimalūs eksploatacijos dokumentacijos reikalavimai, būtini tam, kad sistema galėtų būti patikimai valdoma, palaikoma ir perduodama kitai komandai ar tiekėjui.

Išsamūs dokumentacijos valdymo, saugojimo ir atnaujinimo reikalavimai apibrėžti [#10](10-dokumentacija.md) skyriuje, o diegimo ir eksploatacijos instrukcijos kaip dokumentacijos artefaktas – [#2.3](02-paskirtis-ir-taikymo-sritis.md#23-kokioms-sistemoms-taikomas-standartas) skyriuje.

PRIVALOMA:

*   Turi būti parengti ir palaikomi runbook’ai bent dažniausiems eksploataciniams scenarijams:
    *   paslaugos perkrovimas (restart)
    *   rollback / grįžimas į ankstesnę versiją
    *   reagavimas į incidentą
    *   pagrindinių priklausomybių sutrikimo scenarijai
*   Turi būti aiškiai nurodyta on-call / atsakingų asmenų informacija ir eskalavimo keliai, jei sistemai taikomas eksploatacinis palaikymas ar budėjimo modelis.

REKOMENDUOJAMA:

*   Turi būti palaikoma aktuali architektūros ir stebėsenos schema, leidžianti suprasti:
    *   pagrindinius sistemos komponentus
    *   jų tarpusavio ryšius
    *   pagrindinius stebėsenos taškus ir priklausomybes
*   Eksploatacijos dokumentacijoje rekomenduojama pateikti nuorodas į susijusius dashboardus, alerting taisykles, incidentų valdymo procedūras ir diegimo instrukcijas.

> Susiję skyriai: [10 Dokumentacija](10-dokumentacija.md) · [8.3 CD](08-devops-ci-cd.md#83-cd-continuous-delivery-deployment) · [F priedas. Runbook šablonas](priedai/runbook-sablonas.md)
