# 13. Standarto priežiūra ir atnaujinimas

Šis skyrius apibrėžia, kaip programinės įrangos kūrimo standartas yra prižiūrimas, keičiamas ir atnaujinamas, kad jis išliktų aktualus, taikomas praktikoje ir neprarastų ryšio su technologine, teisine bei organizacine realybe.

Standartas nėra nekintamas dokumentas; jis yra gyvas, tačiau keičiamas kontroliuojamai, atsekamai ir skaidriai.

## 13.1. Standarto keitimo principai

PRIVALOMA:

<!-- STD-CHANGE-P01 | process-level -->
*   Standartas neturi būti keičiamas dažnai ar impulsyviai; stabilumas laikomas prioritetu.
<!-- STD-CHANGE-P02 | process-level -->
*   Kiekvienas standarto pakeitimas turi būti dokumentuotas ir pagrįstas.
<!-- STD-CHANGE-P03 | ai-reviewable -->
*   Nedideli pakeitimai neturi sukelti neproporcingos naštos projektams, komandoms ar tiekėjams.

REKOMENDUOJAMA:

<!-- STD-CHANGE-R01 | process-level -->
*   Jei tai įmanoma, pakeitimai neturėtų laužyti galiojančių projektų ar jau patvirtintų darbo modelių.
<!-- STD-CHANGE-R02 | human-reviewable -->
*   Prieš tvirtinant reikšmingus pakeitimus rekomenduojama įvertinti jų poveikį ne tik naujiems, bet ir vykdomiems projektams.

## 13.2. Kas inicijuoja ir tvirtina pakeitimus

### 13.2.1. Iniciatoriai

PRIVALOMA:

<!-- STD-APPROVE-P01 | ai-reviewable -->
*   Pakeitimų siūlymai negali būti įgyvendinami tiesiogiai, apeinant nustatytą peržiūros ir tvirtinimo procesą.

REKOMENDUOJAMA:

<!-- STD-APPROVE-R01 | ai-reviewable -->
*   Pakeitimus gali inicijuoti vidinės IT komandos, Product Owneriai, analitikai, kibernetinio saugumo ar audito funkcija, pavaldžios įstaigos ir išoriniai tiekėjai per savivaldybės atsakingus asmenis.
<!-- STD-APPROVE-R02 | human-reviewable -->
*   Pakeitimų siūlymus rekomenduojama teikti taip, kad būtų aiškiai nurodyta problema, siūlomas pakeitimas, poveikis ir priežastis.

### 13.2.2. Atsakingi už priežiūrą

PRIVALOMA:

<!-- STD-APPROVE-P02 | process-level -->
*   Standarto savininkas turi būti aiškiai paskirtas.
<!-- STD-APPROVE-P03 | ai-reviewable -->
*   Standarto savininkas atsako už pasiūlymų rinkimą, poveikio vertinimą, sprendimų rengimą ir komunikaciją su suinteresuotomis šalimis.
<!-- STD-APPROVE-P04 | ai-reviewable -->
*   Jei standarto savininko funkcija paskirstyta keliems asmenims ar rolėms, jų atsakomybės turi būti aiškiai apibrėžtos.

REKOMENDUOJAMA:

<!-- STD-APPROVE-R03 | ai-reviewable -->
*   Standarto savininko funkciją rekomenduojama pavesti savivaldybės IT padaliniui arba kitai oficialiai paskirtai atsakingai institucijai.
<!-- STD-APPROVE-R04 | ai-reviewable -->
*   Reikšmingų pakeitimų vertinimui rekomenduojama įtraukti architektūros, saugumo, teisinės ar eksploatacijos atstovus, kai tai aktualu.

### 13.2.3. Pakeitimų tvirtinimas

PRIVALOMA:

<!-- STD-APPROVE-P05 | ai-reviewable -->
*   Nereikšmingi pakeitimai, tokie kaip redakciniai pataisymai ar paaiškinimai, turi būti tvirtinami standarto savininko lygiu.
<!-- STD-APPROVE-P06 | human-reviewable -->
*   Reikšmingi pakeitimai, tokie kaip nauji reikalavimai ar PRIVALOMA lygio pakeitimai, turi būti derinami su IT vadovybe.
<!-- STD-APPROVE-P07 | ai-reviewable -->
*   Jei pakeitimas turi teisinį, saugumo ar atitikties poveikį, turi būti įtraukiamos atitinkamos atsakingos funkcijos.

REKOMENDUOJAMA:

<!-- STD-APPROVE-R05 | process-level -->
*   Prieš tvirtinant reikšmingą pakeitimą rekomenduojama aiškiai įvertinti jo poveikį vykdomiems projektams, tiekėjams ir susijusioms vidaus tvarkoms.
<!-- STD-APPROVE-R06 | process-level -->
*   Jei pakeitimas yra ginčytinas arba turi plataus masto pasekmes, rekomenduojama jo svarstymą dokumentuoti atskiru sprendimo įrašu.

## 13.3. Standarto versijavimas

PRIVALOMA:

<!-- STD-VER-P01 | ai-reviewable -->
*   Standartas turi būti versijuojamas pagal SemVer principus: MAJOR.MINOR.PATCH.
<!-- STD-VER-P02 | human-reviewable -->
*   MAJOR versija reiškia esminius pakeitimus, galinčius turėti įtakos galiojantiems projektams ar taikymo logikai.
<!-- STD-VER-P03 | human-reviewable -->
*   MINOR versija reiškia naujus reikalavimus ar patikslinimus, neturinčius esminio atgalinio poveikio.
<!-- STD-VER-P04 | ai-reviewable -->
*   PATCH versija reiškia redakcinius pataisymus, klaidų ištaisymus ar paaiškinimus.
<!-- STD-VER-P05 | human-reviewable -->
*   Kiekviena standarto versija turi turėti datą, pakeitimų santrauką ir galiojimo aprašą.

REKOMENDUOJAMA:

<!-- STD-VER-R01 | human-reviewable -->
*   Pakeitimų santrauką pateikti taip, kad būtų aišku ne tik kas pasikeitė, bet ir kodėl pakeitimas padarytas.
<!-- STD-VER-R02 | process-level -->
*   Versijų istoriją išlaikyti lengvai randamą ir suprantamą tiek vidinėms komandoms, tiek tiekėjams.

## 13.4. Standarto taikymas laike (pereinamieji laikotarpiai)

PRIVALOMA:

<!-- STD-TRANS-P01 | human-reviewable -->
*   Nauji projektai turi taikyti naujausią galiojančią standarto versiją nuo pat pradžios.
<!-- STD-TRANS-P02 | human-reviewable -->
*   Vykdomi projektai taiko tą standarto versiją, kuri galiojo projekto pradžioje, nebent aiškiai nusprendžiama kitaip.
<!-- STD-TRANS-P03 | human-reviewable -->
*   Perėjimas prie naujesnės standarto versijos vykdomiems projektams turi būti vertinamas atskirai.
<!-- STD-TRANS-P04 | human-reviewable -->
*   MAJOR versijos atveju turi būti nustatytas pereinamasis laikotarpis ir aiškiai nurodyta, nuo kada senesnė versija nebegalioja.

REKOMENDUOJAMA:

<!-- STD-TRANS-R01 | ai-reviewable -->
*   Pereinamąjį laikotarpį nustatyti proporcingai pakeitimo mastui ir projektų brandai.
<!-- STD-TRANS-R02 | process-level -->
*   Jei vykdomas projektas pereina prie naujesnės standarto versijos, rekomenduojama tai dokumentuoti kaip atskirą sprendimą ar nukrypimą.

## 13.5. Komunikacija apie pakeitimus

PRIVALOMA:

<!-- STD-COMM-P01 | process-level -->
*   Visi standarto pakeitimai turi būti komunikuojami vidinėms komandoms, pavaldžioms įstaigoms ir aktyviems tiekėjams, kuriems jie aktualūs.
<!-- STD-COMM-P02 | ai-reviewable -->
*   Komunikacijoje turi būti aiškiai nurodyta:
<!-- STD-COMM-P03 | human-reviewable -->
*   kas pasikeitė
<!-- STD-COMM-P04 | human-reviewable -->
*   nuo kada pakeitimas taikomas
<!-- STD-COMM-P05 | human-reviewable -->
*   kam jis taikomas
<!-- STD-COMM-P06 | ai-reviewable -->
*   ar dėl jo reikia atlikti papildomus veiksmus

REKOMENDUOJAMA:

<!-- STD-COMM-R01 | ai-reviewable -->
*   Komunikaciją pateikti ne tik formaliai, bet ir praktiškai suprantamu formatu, kad komandos aiškiai matytų poveikį savo darbui.
<!-- STD-COMM-R02 | human-reviewable -->
*   Reikšmingiems pakeitimams rekomenduojama parengti trumpą santrauką arba palyginimą su ankstesne versija.

## 13.6. Atitikties palaikymas

PRIVALOMA:

<!-- STD-MAINT-P01 | ai-reviewable -->
*   Jei nustatoma, kad standartas tapo nebeadekvatus praktikai, technologijoms, teisiniams reikalavimams ar organizaciniam modeliui, turi būti inicijuojamas jo atnaujinimas.
<!-- STD-MAINT-P02 | process-level -->
*   Kol atnaujinimas nepatvirtintas, laikini nukrypimai turi būti dokumentuojami pagal bendrą nukrypimų valdymo tvarką.
<!-- STD-MAINT-P03 | ai-reviewable -->
*   Standarto pakeitimai negali būti taikomi atgaline data be aiškaus teisinio ar organizacinio pagrindo.

REKOMENDUOJAMA:

<!-- STD-MAINT-R01 | process-level -->
*   Standarto laikymąsi periodiškai peržiūrėti projektų peržiūrų, auditų ir sistemų perdavimo metu.
<!-- STD-MAINT-R02 | process-level -->
*   Jei tam tikri reikalavimai nuolat kelia praktinių problemų arba dažnai apeinami, rekomenduojama tai laikyti signalu standarto peržiūrai.
<!-- STD-MAINT-R03 | human-reviewable -->
*   Standarto priežiūrą organizuoti taip, kad jis ilgainiui išliktų valdomas, prognozuojamas ir patikimas.
