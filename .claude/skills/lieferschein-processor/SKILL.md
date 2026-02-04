---
name: lieferschein-processor
description: >
  Digitizes German delivery notes (Lieferscheine) from scanned PDFs into
  structured Excel data. Use when processing fuel delivery documents,
  heating oil receipts, diesel delivery confirmations, or any document
  containing delivery quantities, dates, customer signatures, and
  handwritten annotations. Supports multi-page documents with OCR and
  Claude Vision for handwritten content.
allowed-tools: Read, Write, Bash
---

# Lieferschein-Digitalisierung

Dieses Skill verarbeitet handschriftliche und gescannte Lieferscheine von Rossbacher GmbH
und extrahiert strukturierte Daten in Excel-Format.

## Workflow

1. **Klassifizieren** - PDF-Typ bestimmen (digital vs. gescannt/handschriftlich)
2. **Vorverarbeiten** - Bilder entzerren, entrauschen, binarisieren bei 300 DPI
3. **Extrahieren** - Text mittels OCR-Pipeline oder Claude Vision extrahieren
4. **Zuordnen** - Extrahierte Daten dem Rossbacher-Feldschema zuordnen
5. **Validieren** - Gegen Geschäftsregeln prüfen (siehe [validation-rules.md](references/validation-rules.md))
6. **Exportieren** - Nach Excel mit Standardformatierung exportieren

## Feldschema (Rossbacher GmbH)

| Feld | Deutsches Label | Typ | Pflicht |
|------|-----------------|-----|---------|
| document_number | Lieferschein-Nr. | string | Ja |
| delivery_date | Lieferdatum | date | Ja |
| customer_name | Kundenname | string | Ja |
| customer_address | Lieferadresse | string | Ja |
| product_type | Produkt | enum | Ja |
| quantity_liters | Menge (L) | decimal | Ja |
| tank_level_before | Tankstand vorher | decimal | Nein |
| tank_level_after | Tankstand nachher | decimal | Nein |
| driver_name | Fahrer | string | Nein |
| customer_signature | Unterschrift | boolean | Ja |
| handwritten_notes | Bemerkungen | string | Nein |

Vollständige Feldzuordnungen inkl. Regex-Muster siehe [field-mappings.md](references/field-mappings.md).

## Verarbeitungsbefehl

```bash
# Einzelne Datei verarbeiten
python .claude/skills/lieferschein-processor/scripts/extract_fields.py "$INPUT_PDF" --output "$OUTPUT_EXCEL"

# Mit PaddleOCR statt Claude Vision (offline)
python .claude/skills/lieferschein-processor/scripts/extract_fields.py "$INPUT_PDF" --output "$OUTPUT_EXCEL" --no-claude

# Nur Vorverarbeitung (Bilder optimieren)
python .claude/skills/lieferschein-processor/scripts/preprocess_pdf.py "$INPUT_PDF" --output-dir "./preprocessed/"
```

## Strategie für handschriftliche Inhalte

Für Dokumente mit signifikanter Handschrift:

1. Vorverarbeitungs-Pipeline ausführen (`scripts/preprocess_pdf.py`)
2. Mit PaddleOCR für initialen Text extrahieren
3. Claude Vision API für kontextbewusste Interpretation verwenden
4. Mengen gegen erwartete Bereiche kreuzvalidieren

## Ausgabeformat

Excel-Datei mit Spalten:
- Dokument-Nr.
- Lieferdatum
- Kunde
- Lieferadresse
- Produkt
- Menge (L)
- Tankstand Vorher
- Tankstand Nachher
- Fahrer
- Unterschrift
- Bemerkungen
- Konfidenz-Score
- Prüfung erforderlich

## Qualitätsschwellenwerte

| Konfidenz | Aktion |
|-----------|--------|
| > 0.95 | Auto-Freigabe, keine manuelle Prüfung nötig |
| 0.70 - 0.95 | Schnelle manuelle Verifizierung empfohlen |
| < 0.70 | Manuelle Dateneingabe erforderlich, OCR unzuverlässig |

## Abhängigkeiten

Python-Pakete (via pip installieren):
```
pdf2image
paddleocr
opencv-python-headless
pandas
openpyxl
anthropic
numpy
```

System-Abhängigkeiten:
- **Ubuntu/Debian**: `apt-get install poppler-utils`
- **macOS**: `brew install poppler`
- **Windows**: Poppler für Windows installieren und zu PATH hinzufügen

## Beispielaufruf

```bash
# Lieferschein verarbeiten
claude "Verarbeite den Lieferschein unter ./dokumente/ls-2024-001.pdf und exportiere nach Excel"

# Oder direkt das Skript aufrufen
python .claude/skills/lieferschein-processor/scripts/extract_fields.py \
    ./dokumente/ls-2024-001.pdf \
    --output ./export/ls-2024-001.xlsx
```

## Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| Niedrige OCR-Genauigkeit | Bildqualität prüfen, ggf. DPI erhöhen |
| Handschrift nicht erkannt | Claude Vision aktivieren (Standard) |
| Mengen falsch interpretiert | Regex-Muster in field-mappings.md anpassen |
| PDF kann nicht geöffnet werden | Poppler-Installation prüfen |
