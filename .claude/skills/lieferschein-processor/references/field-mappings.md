# Rossbacher GmbH - Feldzuordnungen

Dieses Dokument definiert die Feldzuordnungen für die Lieferschein-Verarbeitung,
inklusive Regex-Muster, Formatierungsregeln und Validierungskriterien.

## Produkttypen (Produkt)

| Code | Beschreibung | Varianten in Dokumenten |
|------|--------------|-------------------------|
| HEL | Heizöl EL (Extra Leicht) | "Heizöl", "HEL", "Öl", "Heating Oil", "Heizöl EL" |
| DIESEL | Diesel | "Diesel", "AGO", "Kraftstoff", "Dieselkraftstoff" |
| TANKK | Tankkarte | "Tankkarte", "Fuel Card", "TK" |
| SCHM | Schmierstoffe | "Schmierstoff", "Motoröl", "Getriebeöl" |

## Kundennummer-Muster

Rossbacher-Kundennummern folgen dem Format: `RB-XXXXX`

- `RB` = Rossbacher-Präfix (konstant)
- `XXXXX` = 5-stellige alphanumerische ID
- Erste zwei Ziffern = Regionscode

```regex
customer_id_pattern = r'RB-[A-Z0-9]{5}'
```

### Regionscodes

| Code | Region |
|------|--------|
| 01-19 | Niederösterreich |
| 20-39 | Wien |
| 40-59 | Oberösterreich |
| 60-79 | Steiermark |
| 80-99 | Sonstige |

## Mengenextraktion

### Deutsches Zahlenformat

Standard: `1.234,56` (Tausenderpunkt, Dezimalkomma)

```regex
# Grundmuster für deutsche Zahlen mit optionaler Einheit
quantity_pattern = r'(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:L|Liter|l|Ltr\.?)?'

# Alternatives Muster für Ganzzahlen
quantity_simple = r'(\d{3,5})\s*(?:L|Liter|l)'
```

### Häufige handschriftliche Varianten

| Geschrieben | Interpretation |
|-------------|----------------|
| "1500 L" | 1500 Liter |
| "1.500,00 Ltr" | 1500.00 Liter |
| "1500L" | 1500 Liter |
| "1,5 m³" | 1500 Liter (1 m³ = 1000 L) |
| "15 hl" | 1500 Liter (1 hl = 100 L) |

### Konvertierungsfunktion

```python
def parse_german_quantity(text: str) -> float:
    """
    Konvertiert deutsches Zahlenformat zu Float.

    Examples:
        "1.234,56" -> 1234.56
        "1234" -> 1234.0
        "1.500" -> 1500.0
    """
    # Entferne Leerzeichen und Einheiten
    text = re.sub(r'[^\d.,]', '', text)

    # Deutsches Format: Punkt als Tausendertrennzeichen
    if ',' in text:
        text = text.replace('.', '').replace(',', '.')
    elif text.count('.') > 1:
        # Mehrere Punkte = Tausendertrennzeichen
        text = text.replace('.', '')

    return float(text)
```

## Dokumentnummer-Muster

```regex
# Lieferschein-Nummer
lieferschein_pattern = r'(?:LS|Lieferschein)[- ]?(?:Nr\.?)?[:\s]*(\d{4,10})'

# Belegnummer allgemein
beleg_pattern = r'(?:Beleg|Dokument)[- ]?(?:Nr\.?)?[:\s]*(\d{4,10})'

# Nur Nummer (Fallback)
number_only = r'(?:Nr\.?|Nummer)[:\s]*(\d{6,10})'
```

### Dokumentnummer-Formate

| Format | Beispiel | Beschreibung |
|--------|----------|--------------|
| LS-YYYYNNNN | LS-20240001 | Jahr + laufende Nummer |
| YYYYMMDDNNN | 20240115001 | Datum + Tagesnummer |
| NNNNNN | 123456 | Reine laufende Nummer |

## Datumsmuster

### Eingabeformate (zu erkennen)

```regex
# Deutsches Standardformat
date_de = r'(\d{1,2})[./](\d{1,2})[./](\d{2,4})'

# ISO-Format
date_iso = r'(\d{4})-(\d{2})-(\d{2})'

# Ausgeschrieben
date_text = r'(\d{1,2})\.\s*(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s*(\d{4})'
```

### Ausgabeformat

Immer ISO-8601: `YYYY-MM-DD`

### Datumskonvertierung

```python
MONTH_MAP = {
    'januar': 1, 'februar': 2, 'märz': 3, 'april': 4,
    'mai': 5, 'juni': 6, 'juli': 7, 'august': 8,
    'september': 9, 'oktober': 10, 'november': 11, 'dezember': 12
}

def parse_german_date(text: str) -> str:
    """Konvertiert deutsches Datum zu ISO-Format."""
    # Versuche verschiedene Formate
    for fmt in ['%d.%m.%Y', '%d.%m.%y', '%d/%m/%Y', '%Y-%m-%d']:
        try:
            dt = datetime.strptime(text, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue

    # Ausgeschriebenes Datum
    match = re.search(r'(\d{1,2})\.\s*(\w+)\s*(\d{4})', text)
    if match:
        day, month_name, year = match.groups()
        month = MONTH_MAP.get(month_name.lower())
        if month:
            return f"{year}-{month:02d}-{int(day):02d}"

    return None
```

## Adressmuster

### Komponenten

```regex
# Straße + Hausnummer
street_pattern = r'([A-ZÄÖÜ][a-zäöüß]+(?:straße|gasse|weg|platz|allee))\s*(\d+[a-z]?)'

# PLZ + Ort
plz_ort_pattern = r'(\d{4,5})\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)'

# Vollständige Adresse
full_address = r'(.+?),?\s*(\d{4,5})\s+([A-Za-zäöüÄÖÜß\s]+)'
```

### Adressnormalisierung

```python
def normalize_address(raw: str) -> str:
    """Normalisiert Adressformat."""
    # Entferne mehrfache Leerzeichen
    normalized = re.sub(r'\s+', ' ', raw.strip())

    # Standardisiere Abkürzungen
    replacements = {
        'Str.': 'Straße',
        'str.': 'straße',
        'Pl.': 'Platz',
        'pl.': 'platz',
    }
    for old, new in replacements.items():
        normalized = normalized.replace(old, new)

    return normalized
```

## Unterschriftserkennung

### Keywords

```python
SIGNATURE_KEYWORDS = [
    'unterschrift', 'signatur', 'empfangen', 'erhalten',
    'bestätigt', 'quittiert', 'signature', 'received'
]
```

### Bildbasierte Erkennung

Bei Verwendung von Claude Vision wird die Unterschrift visuell erkannt.
Kriterien:
- Handschriftlicher Text im Unterschriftsfeld
- Kritzeleien/Schriftzüge im unteren Dokumentbereich
- "X" oder Initialen im Signaturfeld

## Fahreridentifikation

### Muster

```regex
# Mit Label
driver_labeled = r'(?:Fahrer|Ausgeliefert\s+durch|Zusteller)[:\s]+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)'

# Fahrercode
driver_code = r'(?:Fahrer|Driver)[- ]?(?:Nr\.?|ID)?[:\s]*([A-Z]{2,3}\d{2,4})'
```

### Bekannte Fahrer (Rossbacher)

| Code | Name |
|------|------|
| HS01 | Hans Schmidt |
| MW02 | Max Weber |
| TM03 | Thomas Müller |
| AK04 | Andreas Koch |

## Bemerkungen/Notizen

### Typische Positionen

- Unterer Rand des Dokuments
- Separates "Bemerkungen"-Feld
- Handschriftliche Ergänzungen neben Feldern

### Extraktion

Alle Texte, die keinem strukturierten Feld zugeordnet werden können,
werden als Bemerkungen erfasst.

```python
def extract_notes(ocr_results: list, mapped_fields: dict) -> str:
    """Extrahiert unmapped Text als Bemerkungen."""
    mapped_texts = set(str(v) for v in mapped_fields.values() if v)

    notes = []
    for result in ocr_results:
        text = result['text'].strip()
        if text and text not in mapped_texts:
            # Prüfe ob es sich um strukturierte Daten handelt
            if not re.match(r'^[\d.,]+$', text):  # Keine reinen Zahlen
                notes.append(text)

    return ' | '.join(notes) if notes else None
```
