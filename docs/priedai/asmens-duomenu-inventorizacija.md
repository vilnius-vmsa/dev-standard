# C priedas. Asmens duomenų inventorizacija ir anotavimas

> **Statusas:** gyvas dokumentas — atnaujinamas pagal [13 Standarto priežiūra](../13-standarto-prieziura.md).
> **Susiję skyriai:** [6.3 Duomenų apsauga (GDPR kontekstas)](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5 Asmens duomenų apsauga (BDAR / GDPR)](../03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [B priedas. BDAR įgyvendinimo šablonai](bdar-igyvendinimo-sabalonai.md) · [9.7 Audit trail](../09-stebesena-logai.md#97-audit-trail-audito-pėdsakas)

Šis priedas apibrėžia, kaip sistemose **automatiškai ir pakartojamai** aptikti, kokie asmens duomenys tvarkomi, kur jie saugomi ir koks jų jautrumas. Priedas įgyvendina [6.3](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) skyriaus reikalavimą `SEC-GDPR-P01` ir remiasi [B.1 Duomenų klasifikacija](bdar-igyvendinimo-sabalonai.md#b1-duomenų-klasifikacija) jautrumo lygiais.

Priedas nustato **konvenciją ir privalomą rezultatą**, bet neteikia bendro įrankio — kiekviena komanda įgyvendina skenavimą savo kodų bazėje pagal čia aprašytą kontraktą.

---

## C.1. Paskirtis ir taikymo sritis

Tikslas — padaryti asmens duomenų aptikimą standartizuota, kodu grįsta veikla, atsakančia į pagrindinį BDAR klausimą:

> **Kokius asmens duomenis turime, kur jie saugomi ir koks jų jautrumas?**

Reikalavimas `SEC-GDPR-P01` yra **stack-agnostinis**: asmens duomenų laukai persistencijos sluoksnyje turi būti pažymėti natyviu kalbai žymeniu (atributu, dekoratoriumi ar laukų metaduomenimis), nurodant jautrumo lygį ir duomenų kategoriją. Šio priedo skyriai C.2–C.5 aprašo konkrečią įgyvendinimo formą kiekvienai palaikomai technologijai.

**Šios (pirmos) versijos apimtis (audito prioritetas, žema įėjimo kaina):**

*   Taikoma **persistencijos sluoksniui** — ORM modeliams ir entitetams, nepriklausomai nuo technologijos.
*   Anotavimas yra **PRIVALOMAS**; inventorius generuojamas iš anotacijų.
*   Skenavimas turi turėti **spragų aptikimą** — pažymėti laukus, kurie atrodo kaip asmens duomenys, bet nėra anotuoti (žr. [C.6 Spragų aptikimas](#c6-spragų-aptikimas)).

**Kol kas neįtraukiama** (žr. [C.8 Diegimo fazės](#c8-diegimo-fazės)): DTO / API resursų anotavimas, tvarkymo tikslo ir saugojimo terminų laukai atribute, CI blokavimas, tarpsisteminis agregavimas.

---

## C.2. PHP (Laravel / Symfony)

Asmens duomenų laukai persistencijos sluoksnyje žymimi PHP 8 atributu `#[PersonalData]`, nurodant du privalomus parametrus — jautrumo lygį ir duomenų kategoriją.

### C.2.1. Anotacijos sintaksė

```php
use App\Privacy\Attribute\PersonalData;
use App\Privacy\Enum\Sensitivity;
use App\Privacy\Enum\DataCategory;

#[PersonalData(
    level: Sensitivity::Confidential,   // privaloma — jautrumo lygis
    category: DataCategory::Contact     // privaloma — duomenų kategorija
)]
private string $email;
```

### C.2.2. `Sensitivity` — jautrumo lygiai

Lygiai atitinka 1:1 [B.1.1](bdar-igyvendinimo-sabalonai.md#b11-rekomenduojami-jautrumo-lygiai) klasifikaciją. Kodo identifikatoriai — angliški; lietuviški pavadinimai lieka žmogui skirtais terminais B.1.1 lentelėje.

| `Sensitivity` reikšmė (kode) | B.1.1 lygis (LT) |
|---|---|
| `Sensitivity::Public` | Viešas |
| `Sensitivity::Internal` | Vidinis |
| `Sensitivity::Confidential` | Konfidencialus |
| `Sensitivity::Special` | Ypatingas |

### C.2.3. `DataCategory` — duomenų kategorijos

Nedidelis fiksuotas rinkinys, kad ataskaitą būtų galima prasmingai grupuoti:

`Identity`, `Contact`, `Financial`, `Health`, `Location`, `Online`, `Other`.

| Kategorija | Paaiškinimas | Pavyzdžiai |
|---|---|---|
| `Identity` | Tapatybę identifikuojantys duomenys | vardas, pavardė, asmens kodas |
| `Contact` | Kontaktiniai duomenys | el. paštas, telefonas, adresas |
| `Financial` | Finansiniai duomenys | IBAN, sąskaitos, mokėjimai |
| `Health` | Sveikatos duomenys (BDAR str. 9) | diagnozės, negalios žymos |
| `Location` | Vietos / geografiniai duomenys | koordinatės, buvimo vieta |
| `Online` | Internetiniai identifikatoriai | IP adresas, įrenginio ID, slapukų ID |
| `Other` | Kiti asmens duomenys, netelpantys aukščiau | — |

> **Pastaba:** kategorija `Health` beveik visada reiškia „Ypatingų kategorijų duomenis“ (žr. [B.5 DPIA](bdar-igyvendinimo-sabalonai.md#b5-dpia-duomenų-apsaugos-poveikio-vertinimas--kontrolinis-sąrašas)) ir paprastai žymima `Sensitivity::Special`.

---

### C.2.4. Referencinės klasės (copy-paste)

Standartas apibrėžia **atributo signatūrą ir semantiką**, o ne tiekiamą klasę. Kiekvienas repozitorijus pas save deklaruoja identišką `#[PersonalData]` atributą ir abu enum tipus. Bendras Composer paketas šioje versijoje nenumatytas (žr. [C.8](#c8-diegimo-fazės)).

**Atributas:**

```php
namespace App\Privacy\Attribute;

use App\Privacy\Enum\DataCategory;
use App\Privacy\Enum\Sensitivity;
use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
final class PersonalData
{
    public function __construct(
        public readonly Sensitivity $level,
        public readonly DataCategory $category,
    ) {
    }
}
```

**Enum tipai:**

```php
namespace App\Privacy\Enum;

enum Sensitivity: string
{
    case Public = 'public';             // Viešas
    case Internal = 'internal';         // Vidinis
    case Confidential = 'confidential'; // Konfidencialus
    case Special = 'special';           // Ypatingas
}

enum DataCategory: string
{
    case Identity = 'identity';
    case Contact = 'contact';
    case Financial = 'financial';
    case Health = 'health';
    case Location = 'location';
    case Online = 'online';
    case Other = 'other';
}
```

**Taikymas — Laravel (Eloquent):**

```php
class User extends Model
{
    #[PersonalData(level: Sensitivity::Confidential, category: DataCategory::Identity)]
    protected string $name;

    #[PersonalData(level: Sensitivity::Confidential, category: DataCategory::Contact)]
    protected string $email;
}
```

**Taikymas — Symfony (Doctrine):**

```php
#[ORM\Entity]
class Citizen
{
    #[ORM\Column(length: 11)]
    #[PersonalData(level: Sensitivity::Special, category: DataCategory::Identity)]
    private string $personalCode;

    #[ORM\Column]
    #[PersonalData(level: Sensitivity::Confidential, category: DataCategory::Contact)]
    private string $phone;
}
```

---

### C.2.5. `#[NotPersonalData]` — sąmoningos išimtys (PHP)

Kad spragų aptikimo (žr. [C.6](#c6-spragų-aptikimas)) klaidingi teigiami rezultatai konverguotų į nulį, laukui, kuris pagal pavadinimą atrodo kaip asmens duomenys, bet jais **nėra**, taikomas aiškus žymuo su priežastimi:

```php
namespace App\Privacy\Attribute;

use Attribute;

#[Attribute(Attribute::TARGET_PROPERTY)]
final class NotPersonalData
{
    public function __construct(
        public readonly string $reason,
    ) {
    }
}
```

```php
#[NotPersonalData(reason: 'Sisteminis pavadinimas, ne fizinio asmens vardas')]
private string $name;
```

---

## C.3. TypeScript / Node.js

> **Statusas: bus papildyta.** Šis skyrius bus detalizuotas pagal poreikį, kai Node.js / TypeScript projektai pradės taikyti šį standartą.
>
> Preliminariai numatyta forma: TypeScript dekoratorius `@PersonalData({ level, category })` ant ORM entiteto klasės savybių (TypeORM, MikroORM ar kt.), su atitinkamomis `Sensitivity` ir `DataCategory` enum reikšmėmis (identiška semantika kaip C.2.2–C.2.3). Klaidingų teigiamų rezultatų išlygai numatytas `@NotPersonalData({ reason })` dekoratorius.

---

## C.4. Python

> **Statusas: bus papildyta.** Šis skyrius bus detalizuotas pagal poreikį, kai Python projektai pradės taikyti šį standartą.
>
> Preliminariai numatyta forma: Pydantic `Field` metaduomenys (`json_schema_extra={"personal_data": {"level": ..., "category": ...}}`) arba custom dekoratorius ant dataclass / SQLAlchemy modelio lauko, su identiška `Sensitivity` / `DataCategory` semantika.

---

## C.5. .NET (C#)

> **Statusas: bus papildyta.** Šis skyrius bus detalizuotas pagal poreikį, kai .NET projektai pradės taikyti šį standartą.
>
> Preliminariai numatyta forma: C# atributas `[PersonalData(Sensitivity.Confidential, DataCategory.Contact)]` ant EF Core entiteto savybės, su identiška `Sensitivity` / `DataCategory` semantika.

---

## C.6. Spragų aptikimas

Spragų aptikimas yra **vienas reikalavimas visiems stackams** — taikomas nepriklausomai nuo C.2–C.5 konkrečios formos. Skenavimas pereina visas persistencijos klases ir kiekvieną lauką priskiria vienam iš trijų segmentų:

1.  **Anotuotas** (turi `PersonalData` žymenį, nepriklausomai nuo stack) → įtraukiamas į inventorių.
2.  **Įtartinas, bet neanotuotas** → registruojamas kaip audito radinys („tikėtini asmens duomenys — pridėkite `PersonalData` anotaciją arba aiškų `NotPersonalData` išlygos žymenį").
3.  **Nei viena** → ignoruojamas.

### C.6.1. Bazinis įtartinų laukų pavadinimų sąrašas

Skenavimas naudoja bazinį pavadinimų šablonų sąrašą (lietuviškų ir angliškų). Šis sąrašas yra versijuojamas pagal [13 Standarto priežiūra](../13-standarto-prieziura.md) ir gali būti papildomas komandos pagal sistemos specifiką (tik plečiamas, ne siaurinamas):

```text
vardas, pavarde, name, surname, fullname,
email, el_pastas, elpastas,
telefonas, telefono_nr, phone, mobile,
asmens_kodas, asmenskodas, personal_code, ssn,
adresas, address, gatve, city, miestas,
gimimo_data, birth_date, dob,
iban, saskaita, account_no, card_number,
ip, ip_address, device_id, cookie_id
```

Atitikimas turi būti nejautrus raidžių dydžiui ir aptikti šablonus tiek kaip atskirus laukus, tiek kaip pavadinimo dalį (pvz., `user_email`, `contactPhone`).

### C.6.2. CI integracija

Šioje versijoje spragų aptikimas CI aplinkoje veikia kaip **neblokuojantis įspėjimas** (warning), o ne kaip klaidą grąžinantis žingsnis (žr. [C.8 Diegimo fazės](#c8-diegimo-fazės) dėl vėlesnio griežtinimo).

---

## C.7. Inventoriaus ataskaita

Standartas nustato **ataskaitos turinį, ne įrankį**. Reikalaujami du išvedimai:

*   **Žmogui skaitoma Markdown** ataskaita — saugoma repozitorijuje (pvz., `docs/asmens-duomenys.md`).
*   **Mašinai skaitomas JSON** — sudaro galimybę ateityje agreguoti tarp sistemų (nėra šios versijos dalis).

Abu išvedimai turi būti **atkuriami iš kodo** (pergeneruojami pagal poreikį), o ne pildomi rankiniu būdu.

Minimalūs privalomi stulpeliai (angliškos antraštės):

| Class / Table | Field | Sensitivity | Category | Source (annotated / flagged) |
|---|---|---|---|---|
| `App\Models\User` | `email` | Confidential | Contact | annotated |
| `App\Models\User` | `legacy_pin` | — | — | flagged |

Stulpelio `Source` reikšmės: `annotated` (turi `PersonalData` anotaciją) arba `flagged` (spragų aptikimo radinys, žr. [C.6](#c6-spragų-aptikimas)).

---

## C.8. Diegimo fazės

Standartas įgyvendinamas laipsniškai, kad nereikėtų visko įdiegti iš karto:

| Fazė | Apimtis |
|---|---|
| **1 fazė (ši versija)** | Anotuoti persistencijos sluoksnį, generuoti inventorių, spragų aptikimas kaip įspėjimas. PHP (Laravel / Symfony) detaliai aprašyta C.2; kiti stackai — C.3–C.5. |
| **2 fazė (ateityje)** | Kategorijos → saugojimo terminų / tikslo susiejimas (jungtis su [B.2](bdar-igyvendinimo-sabalonai.md#b2-saugojimo-terminai-ir-trynimas)); CI griežtinimas (blokavimas); TypeScript / Python / .NET skyrių (C.3–C.5) pildymas pagal poreikį. |
| **3 fazė (ateityje)** | DTO / duomenų srautų anotavimas + tarpsisteminis agreguotas registras. |

---

> **Pastaba:** šis priedas yra gairė kūrėjams ir projektuotojams. Konkretūs teisiniai reikalavimai priklauso nuo sistemos konteksto ir turi būti vertinami su DPO.
>
> Susiję skyriai: [6.3 Duomenų apsauga](../06-saugumas.md#63-duomenų-apsauga-gdpr-kontekstas) · [3.4.5 Asmens duomenų apsauga](../03-architektura.md#345-asmens-duomenų-apsauga-bdar-gdpr) · [B priedas. BDAR įgyvendinimo šablonai](bdar-igyvendinimo-sabalonai.md) · [7.12 Duomenų apsauga (BDAR/GDPR) testuose](../07-testavimas.md#712-duomenų-apsauga-bdar-gdpr-testuose)
