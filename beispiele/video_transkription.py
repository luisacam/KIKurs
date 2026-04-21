#!/usr/bin/env python3
"""
Video-Transkription mit KI (OpenAI Whisper)

Dieses Beispiel zeigt, wie man gesprochenen Text aus Videos automatisch
in geschriebenen Text umwandelt - eine klassische KI-Anwendung aus dem
Bereich "Speech-to-Text" (Spracherkennung).

Whisper ist ein Open-Source Modell von OpenAI, das auf vielen Sprachen
(inkl. Deutsch) trainiert wurde. Es ist ein neuronales Netz, das:
  1. Audio-Signale in kleine Zeitfenster zerlegt
  2. Diese durch ein Transformer-Netzwerk verarbeitet
  3. Daraus Text-Tokens vorhersagt

Installation:
    pip install openai-whisper

Zusätzlich wird ffmpeg benötigt (für die Audio-Extraktion):
    # Linux:   sudo apt install ffmpeg
    # Mac:     brew install ffmpeg
    # Windows: https://ffmpeg.org/download.html

Verwendung:
    python beispiele/video_transkription.py mein_video.mp4
    python beispiele/video_transkription.py vorlesung.mp4 --modell small --sprache de
"""

import argparse
import sys
from pathlib import Path


def pruefe_abhaengigkeiten() -> None:
    """Prüft ob Whisper installiert ist und gibt sonst eine Anleitung aus."""
    try:
        import whisper  # noqa: F401
    except ImportError:
        print("Whisper ist nicht installiert!")
        print("Installiere mit: pip install openai-whisper")
        print("Außerdem wird ffmpeg benötigt (siehe Docstring oben).")
        sys.exit(1)


def transkribiere_video(
    video_pfad: Path,
    modell_name: str = "base",
    sprache: str | None = None,
) -> dict:
    """
    Transkribiert ein Video mit Whisper.

    Args:
        video_pfad: Pfad zur Video- oder Audio-Datei
        modell_name: Whisper-Modell (tiny, base, small, medium, large)
                     Größere Modelle sind genauer, aber langsamer.
        sprache: Sprachcode (z.B. "de" für Deutsch, "en" für Englisch).
                 None = automatische Erkennung.

    Returns:
        Dictionary mit 'text' (gesamter Text) und 'segments' (Zeitstempel).
    """
    import whisper

    print(f"Lade Modell '{modell_name}'...")
    modell = whisper.load_model(modell_name)

    print(f"Transkribiere '{video_pfad.name}'...")
    print("(Das kann je nach Videolänge und Modellgröße etwas dauern.)")

    ergebnis = modell.transcribe(
        str(video_pfad),
        language=sprache,
        verbose=False,
    )
    return ergebnis


def speichere_transkription(ergebnis: dict, ausgabe_pfad: Path) -> None:
    """Speichert die Transkription als einfache Text-Datei."""
    ausgabe_pfad.write_text(ergebnis["text"].strip() + "\n", encoding="utf-8")
    print(f"Transkription gespeichert: {ausgabe_pfad}")


def speichere_untertitel_srt(ergebnis: dict, ausgabe_pfad: Path) -> None:
    """Speichert die Transkription als SRT-Untertitel-Datei (mit Zeitstempeln)."""
    zeilen = []
    for i, segment in enumerate(ergebnis["segments"], start=1):
        start = formatiere_zeit(segment["start"])
        ende = formatiere_zeit(segment["end"])
        text = segment["text"].strip()
        zeilen.append(f"{i}\n{start} --> {ende}\n{text}\n")

    ausgabe_pfad.write_text("\n".join(zeilen), encoding="utf-8")
    print(f"Untertitel gespeichert: {ausgabe_pfad}")


def formatiere_zeit(sekunden: float) -> str:
    """Formatiert Sekunden als SRT-Zeitstempel (HH:MM:SS,mmm)."""
    stunden = int(sekunden // 3600)
    minuten = int((sekunden % 3600) // 60)
    sek = int(sekunden % 60)
    ms = int((sekunden - int(sekunden)) * 1000)
    return f"{stunden:02d}:{minuten:02d}:{sek:02d},{ms:03d}"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Transkribiert ein Video mit OpenAI Whisper."
    )
    parser.add_argument("video", type=Path, help="Pfad zur Video- oder Audio-Datei")
    parser.add_argument(
        "--modell",
        default="base",
        choices=["tiny", "base", "small", "medium", "large"],
        help="Whisper-Modellgröße (Standard: base)",
    )
    parser.add_argument(
        "--sprache",
        default=None,
        help="Sprachcode, z.B. 'de' oder 'en' (Standard: automatisch erkennen)",
    )
    parser.add_argument(
        "--srt",
        action="store_true",
        help="Zusätzlich SRT-Untertitel-Datei erzeugen",
    )
    args = parser.parse_args()

    if not args.video.exists():
        print(f"Datei nicht gefunden: {args.video}")
        sys.exit(1)

    pruefe_abhaengigkeiten()

    print("=" * 60)
    print("Video-Transkription mit Whisper")
    print("=" * 60)

    ergebnis = transkribiere_video(
        args.video,
        modell_name=args.modell,
        sprache=args.sprache,
    )

    print("\n--- Erkannter Text ---")
    print(ergebnis["text"].strip())
    print("----------------------\n")

    txt_pfad = args.video.with_suffix(".txt")
    speichere_transkription(ergebnis, txt_pfad)

    if args.srt:
        srt_pfad = args.video.with_suffix(".srt")
        speichere_untertitel_srt(ergebnis, srt_pfad)

    print("\nFertig!")


if __name__ == "__main__":
    main()
