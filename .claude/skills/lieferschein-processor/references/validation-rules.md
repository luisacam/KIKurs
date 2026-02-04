# Validierungsregeln für Lieferschein-Verarbeitung

Dieses Dokument definiert die Geschäftsregeln zur Validierung extrahierter
Lieferschein-Daten für Rossbacher GmbH.

## Pflichtfelder

Folgende Felder müssen für eine gültige Lieferschein-Erfassung vorhanden sein:

| Feld | Deutsches Label | Fehlercode | Aktion bei Fehlen |
|------|-----------------|------------|-------------------|
| document_number | Lieferschein-Nr. | E001 | Export blockieren |
| delivery_date | Lieferdatum | E001 | Export blockieren |
| customer_name | Kundenname | E001 | Export blockieren |
| quantity_liters | Menge (L) | E001 | Export blockieren |
| customer_signature | Unterschrift | E001 | Zur Prüfung markieren |

## Mengenbeschränkungen nach Produkt

### Heizöl (HEL)

| Grenzwert | Wert (Liter) | Aktion |
|-----------|--------------|--------|
| Minimum | 500 | Fehler E002 |
| Maximum | 10.000 | Fehler E002 |
| Warnschwelle | > 5.000 | Warnung W002 |
| Typisch | 1.500 - 3.000 | OK |

### Diesel

| Grenzwert | Wert (Liter) | Aktion |
|-----------|--------------|--------|
| Minimum | 100 | Fehler E002 |
| Maximum | 30.000 | Fehler E002 |
| Warnschwelle | > 15.000 | Warnung W002 |
| Typisch | 500 - 10.000 | OK |

### Validierungslogik

```python
QUANTITY_RANGES = {
    'heizöl': {'min': 500, 'max': 10000, 'warn': 5000},
    'hel': {'min': 500, 'max': 10000, 'warn': 5000},
    'diesel': {'min': 100, 'max': 30000, 'warn': 15000},
    'ago': {'min': 100, 'max': 30000, 'warn': 15000},
}

DEFAULT_RANGE = {'min': 50, 'max': 30000, 'warn': 10000}

def validate_quantity(quantity: float, product: str) -> list[str]:
    """Validiert Liefermenge gegen Produktgrenzen."""
    errors = []
    product_key = product.lower() if product else ''
    limits = QUANTITY_RANGES.get(product_key, DEFAULT_RANGE)

    if quantity < limits['min']:
        errors.append(f"E002: Menge {quantity}L unter Minimum ({limits['min']}L)")
    elif quantity > limits['max']:
        errors.append(f"E002: Menge {quantity}L über Maximum ({limits['max']}L)")
    elif quantity > limits['warn']:
        errors.append(f"W002: Ungewöhnlich hohe Menge ({quantity}L)")

    return errors
```

## Datumsvalidierungen

### Regeln

1. **Zukunftsdatum**: Lieferdatum darf nicht in der Zukunft liegen
2. **Alter**: Dokumente älter als 30 Tage erfordern Vorgesetzten-Freigabe
3. **Wochenende**: Wochenend-Lieferungen werden zur Prüfung markiert

### Implementierung

```python
from datetime import datetime, timedelta

def validate_date(delivery_date: str) -> list[str]:
    """Validiert Lieferdatum."""
    errors = []

    try:
        dt = datetime.strptime(delivery_date, '%Y-%m-%d')
        today = datetime.now()

        # Zukunftsdatum
        if dt > today:
            errors.append("E003: Lieferdatum liegt in der Zukunft")

        # Dokumentalter
        days_old = (today - dt).days
        if days_old > 30:
            errors.append(f"W003: Dokument ist {days_old} Tage alt (> 30 Tage)")

        # Wochenende
        if dt.weekday() >= 5:  # Samstag = 5, Sonntag = 6
            errors.append("W004: Wochenend-Lieferung")

    except ValueError:
        errors.append("E003: Ungültiges Datumsformat")

    return errors
```

## Kreuzfeld-Validierungen

### Tankstand-Plausibilität

Wenn sowohl `tank_level_before` als auch `tank_level_after` vorhanden sind:

```
Erwarteter_Nachher = Tankstand_Vorher + Liefermenge
Toleranz = 100 Liter (für Messungenauigkeiten)

|Erwarteter_Nachher - Tatsächlicher_Nachher| <= Toleranz
```

```python
def validate_tank_levels(
    before: float,
    after: float,
    quantity: float,
    tolerance: float = 100
) -> list[str]:
    """Validiert Tankstand-Logik."""
    errors = []

    if before is not None and after is not None and quantity is not None:
        expected_after = before + quantity
        difference = abs(expected_after - after)

        if difference > tolerance:
            errors.append(
                f"E004: Tankstand-Differenz ({after - before}L) "
                f"entspricht nicht der Liefermenge ({quantity}L)"
            )

        # Zusätzliche Plausibilitätsprüfungen
        if after < before:
            errors.append("E004: Tankstand nach Lieferung niedriger als vorher")

        if after > 50000:  # Unrealistisch großer Tank
            errors.append("W005: Tankstand nach Lieferung unplausibel hoch")

    return errors
```

### Kundenvalidierung

Optional: Abgleich mit Kundendatenbank

```python
def validate_customer(customer_name: str, customer_db: dict) -> list[str]:
    """Prüft Kunden gegen Datenbank (falls verfügbar)."""
    errors = []

    if customer_db:
        # Fuzzy-Matching für Tippfehler
        matches = find_similar_customers(customer_name, customer_db, threshold=0.8)

        if not matches:
            errors.append(f"W006: Kunde '{customer_name}' nicht in Datenbank gefunden")
        elif len(matches) > 1:
            errors.append(f"W006: Mehrere ähnliche Kunden gefunden: {matches}")

    return errors
```

## Konfidenz-Bewertung

### Schwellenwerte

| Konfidenz | Kategorie | Aktion |
|-----------|-----------|--------|
| ≥ 0.95 | Hoch | Auto-Freigabe |
| 0.70 - 0.94 | Mittel | Schnelle manuelle Prüfung |
| < 0.70 | Niedrig | Vollständige manuelle Eingabe |

### Berechnung

Die Gesamt-Konfidenz wird aus mehreren Faktoren berechnet:

```python
def calculate_confidence(
    ocr_confidence: float,
    field_completeness: float,
    validation_passed: bool
) -> float:
    """
    Berechnet Gesamt-Konfidenzscore.

    Args:
        ocr_confidence: Durchschnittliche OCR-Konfidenz (0-1)
        field_completeness: Anteil gefundener Pflichtfelder (0-1)
        validation_passed: Ob alle Validierungen bestanden

    Returns:
        Gesamt-Konfidenz zwischen 0 und 1
    """
    # Gewichtung
    weights = {
        'ocr': 0.4,
        'completeness': 0.4,
        'validation': 0.2
    }

    score = (
        ocr_confidence * weights['ocr'] +
        field_completeness * weights['completeness'] +
        (1.0 if validation_passed else 0.5) * weights['validation']
    )

    return round(score, 2)
```

## Fehlercodes

### Fehler (E) - Blockieren Export oder erfordern Korrektur

| Code | Beschreibung | Behebung |
|------|--------------|----------|
| E001 | Pflichtfeld fehlt | Manuell eingeben |
| E002 | Menge außerhalb des Bereichs | Prüfen und korrigieren |
| E003 | Datumsvalidierung fehlgeschlagen | Datum korrigieren |
| E004 | Tankstand-Logik inkonsistent | Werte prüfen |

### Warnungen (W) - Zur Kenntnisnahme, kein Blocker

| Code | Beschreibung | Hinweis |
|------|--------------|---------|
| W001 | Niedriger Konfidenzscore | Daten verifizieren |
| W002 | Ungewöhnliche Menge für Produkt | Plausibilität prüfen |
| W003 | Dokument älter als 30 Tage | Vorgesetzten informieren |
| W004 | Wochenend-Lieferung | Prüfen ob korrekt |
| W005 | Tankstand unplausibel | Werte verifizieren |
| W006 | Kunde nicht in Datenbank | Kundendaten prüfen |

## Validierungs-Workflow

```
┌─────────────────┐
│ Daten extrahiert │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pflichtfelder   │──── Fehlt? ──── E001
│ prüfen          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Mengen-         │──── Außerhalb? ──── E002/W002
│ validierung     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Datums-         │──── Invalid? ──── E003/W003/W004
│ validierung     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tankstand-      │──── Inkonsistent? ──── E004/W005
│ prüfung         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Konfidenz       │
│ berechnen       │
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │ ≥ 0.95? │
    └────┬────┘
     Ja  │  Nein
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────────┐
│ Auto- │ │ Zur Prüfung│
│ gabe  │ │ markieren  │
└───────┘ └────────────┘
```

## Beispiel-Validierung

```python
def validate_lieferschein(data: dict) -> dict:
    """Vollständige Validierung eines Lieferscheins."""
    errors = []

    # Pflichtfelder
    required = ['document_number', 'delivery_date', 'customer_name',
                'quantity_liters', 'customer_signature']
    for field in required:
        if not data.get(field):
            errors.append(f"E001: Pflichtfeld '{field}' fehlt")

    # Mengenvalidierung
    if data.get('quantity_liters'):
        errors.extend(validate_quantity(
            data['quantity_liters'],
            data.get('product_type')
        ))

    # Datumsvalidierung
    if data.get('delivery_date'):
        errors.extend(validate_date(data['delivery_date']))

    # Tankstand-Logik
    errors.extend(validate_tank_levels(
        data.get('tank_level_before'),
        data.get('tank_level_after'),
        data.get('quantity_liters')
    ))

    # Ergebnis
    has_errors = any(e.startswith('E') for e in errors)
    return {
        'valid': not has_errors,
        'errors': errors,
        'needs_review': has_errors or data.get('confidence_score', 0) < 0.95
    }
```
