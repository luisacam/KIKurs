#!/usr/bin/env python3
"""
PDF Preprocessing Script for Lieferschein Processing

Converts PDF pages to optimized images for OCR processing.
Applies deskewing, denoising, and binarization.

Usage:
    python preprocess_pdf.py input.pdf --output-dir ./preprocessed/
    python preprocess_pdf.py input.pdf --output-dir ./preprocessed/ --dpi 400
"""

import argparse
import sys
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from pdf2image import convert_from_path


class PDFPreprocessor:
    """
    Preprocesses PDF documents for optimal OCR accuracy.

    Applies a series of image processing steps optimized for
    scanned documents with handwritten content.
    """

    DEFAULT_DPI = 300

    def __init__(self, dpi: int = DEFAULT_DPI):
        self.dpi = dpi

    def process_pdf(
        self,
        pdf_path: str,
        output_dir: str,
        output_format: str = 'png'
    ) -> list[str]:
        """
        Process a PDF file and save preprocessed images.

        Args:
            pdf_path: Path to input PDF
            output_dir: Directory to save processed images
            output_format: Output image format (png, jpg, tiff)

        Returns:
            List of paths to processed images
        """
        pdf_path = Path(pdf_path)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        print(f"Converting PDF to images at {self.dpi} DPI...")
        images = convert_from_path(str(pdf_path), dpi=self.dpi)

        output_paths = []

        for i, pil_image in enumerate(images):
            print(f"Processing page {i + 1}/{len(images)}...")

            # Convert to OpenCV format
            img = np.array(pil_image)
            img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

            # Apply preprocessing pipeline
            processed = self._preprocess_pipeline(img)

            # Save processed image
            output_filename = f"{pdf_path.stem}_page_{i + 1:03d}.{output_format}"
            output_path = output_dir / output_filename
            cv2.imwrite(str(output_path), processed)
            output_paths.append(str(output_path))

            print(f"  Saved: {output_path}")

        return output_paths

    def _preprocess_pipeline(self, image: np.ndarray) -> np.ndarray:
        """
        Apply full preprocessing pipeline.

        Steps:
        1. Convert to grayscale
        2. Denoise
        3. Deskew
        4. Adaptive binarization
        5. Remove borders/noise
        """
        # Step 1: Grayscale conversion
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # Step 2: Denoise while preserving edges
        denoised = cv2.fastNlMeansDenoising(gray, None, h=10, templateWindowSize=7, searchWindowSize=21)

        # Step 3: Deskew
        deskewed = self._deskew(denoised)

        # Step 4: Adaptive binarization
        binary = cv2.adaptiveThreshold(
            deskewed, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=15,
            C=8
        )

        # Step 5: Clean up noise
        cleaned = self._remove_noise(binary)

        return cleaned

    def _deskew(self, image: np.ndarray) -> np.ndarray:
        """Correct document skew using Hough line detection."""
        # Find all non-zero points
        coords = np.column_stack(np.where(image > 0))

        if len(coords) < 100:
            return image

        # Find minimum area rectangle
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]

        # Normalize angle
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # Skip if angle is negligible
        if abs(angle) < 0.3:
            return image

        # Limit rotation to reasonable range
        angle = max(-15, min(15, angle))

        # Rotate
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)

        rotated = cv2.warpAffine(
            image, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )

        return rotated

    def _remove_noise(self, image: np.ndarray) -> np.ndarray:
        """Remove small noise particles and smooth edges."""
        # Morphological opening to remove small noise
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        opened = cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

        # Slight closing to connect broken characters
        kernel_close = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 1))
        closed = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel_close)

        return closed

    def process_image(self, image_path: str, output_path: Optional[str] = None) -> np.ndarray:
        """
        Process a single image file.

        Args:
            image_path: Path to input image
            output_path: Optional path to save processed image

        Returns:
            Processed image as numpy array
        """
        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(f"Could not read image: {image_path}")

        processed = self._preprocess_pipeline(image)

        if output_path:
            cv2.imwrite(str(output_path), processed)

        return processed


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Preprocess PDF documents for OCR',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s document.pdf --output-dir ./processed/
  %(prog)s document.pdf --output-dir ./processed/ --dpi 400
  %(prog)s document.pdf --output-dir ./processed/ --format tiff
        """
    )

    parser.add_argument(
        'input_pdf',
        help='Path to input PDF file'
    )

    parser.add_argument(
        '--output-dir', '-o',
        required=True,
        help='Directory to save processed images'
    )

    parser.add_argument(
        '--dpi',
        type=int,
        default=300,
        help='DPI for PDF conversion (default: 300)'
    )

    parser.add_argument(
        '--format', '-f',
        choices=['png', 'jpg', 'tiff'],
        default='png',
        help='Output image format (default: png)'
    )

    args = parser.parse_args()

    # Validate input
    if not Path(args.input_pdf).exists():
        print(f"Error: Input file not found: {args.input_pdf}", file=sys.stderr)
        sys.exit(1)

    # Process
    preprocessor = PDFPreprocessor(dpi=args.dpi)

    try:
        output_paths = preprocessor.process_pdf(
            args.input_pdf,
            args.output_dir,
            args.format
        )

        print(f"\nProcessed {len(output_paths)} page(s)")
        print(f"Output directory: {args.output_dir}")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
