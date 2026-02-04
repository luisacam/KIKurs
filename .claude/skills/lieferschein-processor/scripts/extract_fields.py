#!/usr/bin/env python3
"""
Lieferschein Field Extraction Script

Extracts structured data from German delivery notes (Lieferscheine) using
OCR and/or Claude Vision API. Optimized for handwritten content common
in fuel delivery documents from Rossbacher GmbH.

Usage:
    python extract_fields.py input.pdf --output output.xlsx
    python extract_fields.py input.pdf --output output.xlsx --no-claude
"""

import argparse
import base64
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import pandas as pd
from pdf2image import convert_from_path

# Optional imports with graceful degradation
try:
    from paddleocr import PaddleOCR
    PADDLEOCR_AVAILABLE = True
except ImportError:
    PADDLEOCR_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


@dataclass
class LieferscheinData:
    """Structured representation of delivery note data."""
    document_number: Optional[str] = None
    delivery_date: Optional[str] = None
    customer_name: Optional[str] = None
    customer_address: Optional[str] = None
    product_type: Optional[str] = None
    quantity_liters: Optional[float] = None
    tank_level_before: Optional[float] = None
    tank_level_after: Optional[float] = None
    driver_name: Optional[str] = None
    customer_signature: bool = False
    handwritten_notes: Optional[str] = None
    confidence_score: float = 0.0
    validation_errors: list = field(default_factory=list)
    needs_review: bool = True


class ImagePreprocessor:
    """Preprocessing pipeline for scanned document images."""

    DPI = 300

    def __init__(self):
        pass

    def preprocess(self, pil_image) -> np.ndarray:
        """Apply full preprocessing chain for improved OCR accuracy."""
        # Convert PIL to OpenCV format
        img = np.array(pil_image)
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Denoise while preserving edges
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

        # Adaptive binarization for varying lighting conditions
        binary = cv2.adaptiveThreshold(
            denoised, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            11, 2
        )

        # Correct document skew
        deskewed = self._deskew(binary)

        return deskewed

    def _deskew(self, image: np.ndarray) -> np.ndarray:
        """Correct rotation/skew in scanned documents."""
        coords = np.column_stack(np.where(image > 0))
        if len(coords) < 100:
            return image

        # Find minimum bounding rectangle
        angle = cv2.minAreaRect(coords)[-1]

        # Normalize angle
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # Skip if angle is negligible
        if abs(angle) < 0.5:
            return image

        # Rotate image
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            image, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )

        return rotated


class OCRExtractor:
    """Extract text using PaddleOCR."""

    def __init__(self):
        if not PADDLEOCR_AVAILABLE:
            raise ImportError("PaddleOCR is not installed. Run: pip install paddleocr")
        self.ocr = PaddleOCR(use_angle_cls=True, lang='german', use_gpu=False)

    def extract(self, image: np.ndarray) -> list[dict]:
        """Run OCR and return structured results with confidence scores."""
        results = self.ocr.ocr(image, cls=True)
        extracted = []

        for line in (results[0] or []):
            bbox, (text, conf) = line
            extracted.append({
                'text': text,
                'confidence': conf,
                'bbox': bbox
            })

        return extracted


class ClaudeVisionExtractor:
    """Extract data using Claude Vision API for intelligent document understanding."""

    def __init__(self):
        if not ANTHROPIC_AVAILABLE:
            raise ImportError("Anthropic SDK not installed. Run: pip install anthropic")
        self.client = anthropic.Anthropic()

    def extract(self, pdf_path: str) -> dict:
        """Use Claude Vision for context-aware document extraction."""
        with open(pdf_path, 'rb') as f:
            pdf_data = base64.standard_b64encode(f.read()).decode('utf-8')

        extraction_prompt = """
Analysiere diesen deutschen Lieferschein (Delivery Note) und extrahiere alle Daten.

Gib ein JSON-Objekt mit exakt diesen Feldern zurück:
{
    "document_number": "Lieferschein-Nummer als String",
    "delivery_date": "Datum im Format YYYY-MM-DD",
    "customer_name": "Vollständiger Kundenname",
    "customer_address": "Vollständige Lieferadresse",
    "product_type": "Heizöl|Diesel|Sonstiges",
    "quantity_liters": Numerischer Wert ohne Einheit,
    "tank_level_before": Numerischer Wert oder null,
    "tank_level_after": Numerischer Wert oder null,
    "driver_name": "Fahrername oder null",
    "customer_signature": true wenn Unterschrift vorhanden sonst false,
    "handwritten_notes": "Handschriftliche Anmerkungen oder null",
    "confidence_score": Zahl zwischen 0.0 und 1.0
}

Wichtige Hinweise:
- Analysiere handschriftliche Einträge sorgfältig
- Typische Heizöl-Liefermengen: 500-5000 Liter
- Typische Diesel-Liefermengen: 100-30000 Liter
- Deutsche Zahlenformate beachten (1.234,56 = 1234.56)
- Bei unleserlichen Stellen confidence_score entsprechend reduzieren

Antworte NUR mit dem JSON-Objekt, keine zusätzlichen Erklärungen.
"""

        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {"type": "text", "text": extraction_prompt}
                ]
            }]
        )

        # Parse JSON response
        response_text = response.content[0].text.strip()

        # Handle potential markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1])

        return json.loads(response_text)


class FieldMapper:
    """Map OCR text to structured fields using regex patterns."""

    # Regex patterns for German delivery notes
    PATTERNS = {
        'document_number': [
            r'(?:LS|Lieferschein)[- ]?[Nn]r\.?\s*[:\s]?\s*(\d{4,10})',
            r'(?:Beleg|Dokument)[- ]?[Nn]r\.?\s*[:\s]?\s*(\d{4,10})',
            r'[Nn]r\.?\s*[:\s]?\s*(\d{6,10})'
        ],
        'delivery_date': [
            r'(?:Liefer)?[Dd]atum\s*[:\s]?\s*(\d{1,2}[./]\d{1,2}[./]\d{2,4})',
            r'(\d{1,2}[./]\d{1,2}[./]\d{4})'
        ],
        'quantity_liters': [
            r'(?:Menge|Liter|Geliefert)\s*[:\s]?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)\s*(?:L|l|Liter|Ltr)?',
            r'(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\s*(?:L|l|Liter|Ltr)'
        ],
        'product_type': [
            r'(Heizöl|HEL|Diesel|AGO|Kraftstoff)',
        ],
        'customer_name': [
            r'(?:Kunde|Empfänger|An)\s*[:\s]?\s*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)',
        ],
        'driver_name': [
            r'(?:Fahrer|Ausgeliefert durch)\s*[:\s]?\s*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)',
        ]
    }

    def map_fields(self, ocr_results: list[dict]) -> LieferscheinData:
        """Map OCR text results to structured fields."""
        data = LieferscheinData()
        full_text = " ".join([r['text'] for r in ocr_results])
        avg_confidence = sum(r['confidence'] for r in ocr_results) / len(ocr_results) if ocr_results else 0

        # Extract each field using patterns
        for field_name, patterns in self.PATTERNS.items():
            for pattern in patterns:
                match = re.search(pattern, full_text, re.IGNORECASE)
                if match:
                    value = match.group(1)

                    # Post-process based on field type
                    if field_name == 'quantity_liters':
                        value = self._parse_german_number(value)
                    elif field_name == 'delivery_date':
                        value = self._parse_german_date(value)

                    setattr(data, field_name, value)
                    break

        # Check for signature (look for signature-related keywords)
        signature_keywords = ['unterschrift', 'signatur', 'empfangen', 'erhalten']
        data.customer_signature = any(kw in full_text.lower() for kw in signature_keywords)

        data.confidence_score = avg_confidence
        return data

    def _parse_german_number(self, value: str) -> Optional[float]:
        """Convert German number format to float."""
        if not value:
            return None
        # German: 1.234,56 -> 1234.56
        value = value.replace('.', '').replace(',', '.')
        try:
            return float(value)
        except ValueError:
            return None

    def _parse_german_date(self, value: str) -> Optional[str]:
        """Convert German date format to ISO format."""
        if not value:
            return None

        # Try common German date formats
        for fmt in ['%d.%m.%Y', '%d.%m.%y', '%d/%m/%Y', '%d/%m/%y']:
            try:
                dt = datetime.strptime(value, fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue

        return value


class DataValidator:
    """Validate extracted data against Rossbacher business rules."""

    # Product-specific quantity ranges
    QUANTITY_RANGES = {
        'heizöl': (500, 10000),
        'hel': (500, 10000),
        'diesel': (100, 30000),
        'ago': (100, 30000),
    }

    DEFAULT_RANGE = (50, 30000)

    def validate(self, data: LieferscheinData) -> LieferscheinData:
        """Apply all validation rules and populate errors."""
        errors = []

        # Required fields check
        required_fields = [
            ('document_number', 'Lieferschein-Nummer'),
            ('delivery_date', 'Lieferdatum'),
            ('customer_name', 'Kundenname'),
            ('quantity_liters', 'Menge'),
            ('customer_signature', 'Unterschrift'),
        ]

        for field_name, label in required_fields:
            value = getattr(data, field_name, None)
            if value is None or (isinstance(value, bool) and not value and field_name == 'customer_signature'):
                if field_name != 'customer_signature' or not value:
                    errors.append(f"E001: Pflichtfeld fehlt - {label}")

        # Quantity range validation
        if data.quantity_liters is not None:
            product = (data.product_type or '').lower()
            min_qty, max_qty = self.QUANTITY_RANGES.get(product, self.DEFAULT_RANGE)

            if data.quantity_liters < min_qty or data.quantity_liters > max_qty:
                errors.append(
                    f"E002: Menge {data.quantity_liters}L außerhalb des erwarteten "
                    f"Bereichs ({min_qty}-{max_qty}L)"
                )

        # Date validation
        if data.delivery_date:
            try:
                delivery_dt = datetime.strptime(data.delivery_date, '%Y-%m-%d')
                today = datetime.now()

                if delivery_dt > today:
                    errors.append("E003: Lieferdatum liegt in der Zukunft")

                days_old = (today - delivery_dt).days
                if days_old > 30:
                    errors.append(f"W002: Dokument ist {days_old} Tage alt (> 30 Tage)")

            except ValueError:
                errors.append("E003: Ungültiges Datumsformat")

        # Tank level logic validation
        if (data.tank_level_before is not None and
            data.tank_level_after is not None and
            data.quantity_liters is not None):

            expected_after = data.tank_level_before + data.quantity_liters
            difference = abs(expected_after - data.tank_level_after)

            if difference > 100:  # Allow 100L variance
                errors.append(
                    f"E004: Tankstandänderung ({data.tank_level_after - data.tank_level_before}L) "
                    f"entspricht nicht der Liefermenge ({data.quantity_liters}L)"
                )

        # Set validation results
        data.validation_errors = errors

        # Determine if review is needed
        has_errors = any(e.startswith('E') for e in errors)
        low_confidence = data.confidence_score < 0.95
        data.needs_review = has_errors or low_confidence

        return data


class ExcelExporter:
    """Export validated data to formatted Excel."""

    COLUMN_MAP = {
        'document_number': 'Dokument-Nr.',
        'delivery_date': 'Lieferdatum',
        'customer_name': 'Kunde',
        'customer_address': 'Lieferadresse',
        'product_type': 'Produkt',
        'quantity_liters': 'Menge (L)',
        'tank_level_before': 'Tankstand Vorher',
        'tank_level_after': 'Tankstand Nachher',
        'driver_name': 'Fahrer',
        'customer_signature': 'Unterschrift',
        'handwritten_notes': 'Bemerkungen',
        'confidence_score': 'Konfidenz',
        'needs_review': 'Prüfung erforderlich',
        'validation_errors': 'Validierungsfehler'
    }

    def export(self, data: LieferscheinData, output_path: str) -> None:
        """Export to formatted Excel file."""
        # Convert to dict, handling list fields
        data_dict = asdict(data)
        data_dict['validation_errors'] = "; ".join(data_dict.get('validation_errors', []))
        data_dict['customer_signature'] = 'Ja' if data_dict.get('customer_signature') else 'Nein'
        data_dict['needs_review'] = 'Ja' if data_dict.get('needs_review') else 'Nein'

        # Create DataFrame
        df = pd.DataFrame([data_dict])

        # Rename columns to German headers
        df = df.rename(columns=self.COLUMN_MAP)

        # Reorder columns
        ordered_columns = [self.COLUMN_MAP.get(k, k) for k in self.COLUMN_MAP.keys() if self.COLUMN_MAP.get(k, k) in df.columns]
        df = df[ordered_columns]

        # Export
        df.to_excel(output_path, index=False, engine='openpyxl')


class LieferscheinProcessor:
    """
    Main processor class that orchestrates the full extraction pipeline.

    Processes German delivery notes from PDF to structured Excel data.
    Optimized for handwritten content common in fuel delivery documents.
    """

    def __init__(self, use_claude_vision: bool = True):
        self.use_claude = use_claude_vision and ANTHROPIC_AVAILABLE
        self.preprocessor = ImagePreprocessor()
        self.validator = DataValidator()
        self.exporter = ExcelExporter()
        self.mapper = FieldMapper()

        if self.use_claude:
            self.claude_extractor = ClaudeVisionExtractor()

        if PADDLEOCR_AVAILABLE:
            self.ocr_extractor = OCRExtractor()

    def process(self, pdf_path: str, output_excel: str) -> LieferscheinData:
        """
        Full pipeline: PDF -> Validated Data -> Excel

        Args:
            pdf_path: Path to input PDF file
            output_excel: Path for output Excel file

        Returns:
            LieferscheinData with extracted and validated data
        """
        pdf_path = str(Path(pdf_path).resolve())
        output_excel = str(Path(output_excel).resolve())

        print(f"Processing: {pdf_path}")

        if self.use_claude:
            # Claude Vision handles intelligent extraction
            print("Using Claude Vision for extraction...")
            raw_data = self.claude_extractor.extract(pdf_path)
            data = self._dict_to_lieferschein(raw_data)
        else:
            # Fallback: PaddleOCR with manual field mapping
            print("Using PaddleOCR for extraction...")
            if not PADDLEOCR_AVAILABLE:
                raise RuntimeError("PaddleOCR not available and Claude Vision disabled")

            images = convert_from_path(pdf_path, dpi=self.preprocessor.DPI)
            all_ocr_results = []

            for i, img in enumerate(images):
                print(f"  Processing page {i + 1}/{len(images)}...")
                preprocessed = self.preprocessor.preprocess(img)
                ocr_results = self.ocr_extractor.extract(preprocessed)
                all_ocr_results.extend(ocr_results)

            data = self.mapper.map_fields(all_ocr_results)

        # Validate extracted data
        print("Validating data...")
        validated_data = self.validator.validate(data)

        # Export to Excel
        print(f"Exporting to: {output_excel}")
        self.exporter.export(validated_data, output_excel)

        # Print summary
        self._print_summary(validated_data)

        return validated_data

    def _dict_to_lieferschein(self, raw_dict: dict) -> LieferscheinData:
        """Convert raw dictionary to LieferscheinData object."""
        return LieferscheinData(
            document_number=raw_dict.get('document_number'),
            delivery_date=raw_dict.get('delivery_date'),
            customer_name=raw_dict.get('customer_name'),
            customer_address=raw_dict.get('customer_address'),
            product_type=raw_dict.get('product_type'),
            quantity_liters=raw_dict.get('quantity_liters'),
            tank_level_before=raw_dict.get('tank_level_before'),
            tank_level_after=raw_dict.get('tank_level_after'),
            driver_name=raw_dict.get('driver_name'),
            customer_signature=raw_dict.get('customer_signature', False),
            handwritten_notes=raw_dict.get('handwritten_notes'),
            confidence_score=raw_dict.get('confidence_score', 0.0)
        )

    def _print_summary(self, data: LieferscheinData) -> None:
        """Print extraction summary to console."""
        print("\n" + "=" * 50)
        print("EXTRACTION SUMMARY")
        print("=" * 50)
        print(f"Document Number: {data.document_number or 'Not found'}")
        print(f"Delivery Date:   {data.delivery_date or 'Not found'}")
        print(f"Customer:        {data.customer_name or 'Not found'}")
        print(f"Product:         {data.product_type or 'Not found'}")
        print(f"Quantity:        {data.quantity_liters or 'Not found'} L")
        print(f"Confidence:      {data.confidence_score:.2%}")
        print(f"Needs Review:    {'Yes' if data.needs_review else 'No'}")

        if data.validation_errors:
            print("\nValidation Issues:")
            for error in data.validation_errors:
                print(f"  - {error}")

        print("=" * 50)


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Extract data from German delivery notes (Lieferscheine)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s invoice.pdf --output data.xlsx
  %(prog)s invoice.pdf --output data.xlsx --no-claude
        """
    )

    parser.add_argument(
        'input_pdf',
        help='Path to input PDF file'
    )

    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Path for output Excel file'
    )

    parser.add_argument(
        '--no-claude',
        action='store_true',
        help='Disable Claude Vision, use PaddleOCR only'
    )

    args = parser.parse_args()

    # Validate input file
    if not Path(args.input_pdf).exists():
        print(f"Error: Input file not found: {args.input_pdf}", file=sys.stderr)
        sys.exit(1)

    # Create output directory if needed
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Process
    processor = LieferscheinProcessor(use_claude_vision=not args.no_claude)

    try:
        result = processor.process(args.input_pdf, args.output)

        if result.needs_review:
            print("\nNote: This document has been flagged for manual review.")
            sys.exit(2)  # Exit code 2 indicates review needed

        sys.exit(0)

    except Exception as e:
        print(f"Error processing document: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
