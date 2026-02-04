#!/usr/bin/env python3
"""
YouTube Transcript Tool - KIKurs
Ein Tool zum Extrahieren von Transkripten aus YouTube-Videos.
"""

import re
import sys
import argparse
from typing import Optional

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import (
        TranscriptsDisabled,
        NoTranscriptFound,
        VideoUnavailable
    )
except ImportError:
    print("Fehler: youtube-transcript-api ist nicht installiert.")
    print("Installieren Sie es mit: pip install youtube-transcript-api")
    sys.exit(1)


def extract_video_id(url_or_id: str) -> Optional[str]:
    """
    Extrahiert die Video-ID aus einer YouTube-URL oder gibt die ID direkt zurueck.

    Unterstuetzte Formate:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - VIDEO_ID (direkt)
    """
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'
    ]

    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)

    return None


def get_transcript(video_id: str, language: str = 'de') -> dict:
    """
    Holt das Transkript fuer ein YouTube-Video.

    Args:
        video_id: Die YouTube Video-ID
        language: Bevorzugte Sprache (Standard: 'de')

    Returns:
        Dictionary mit Transkript-Daten
    """
    result = {
        'success': False,
        'video_id': video_id,
        'language': None,
        'transcript': [],
        'full_text': '',
        'error': None
    }

    try:
        # Erstelle API-Instanz
        ytt_api = YouTubeTranscriptApi()

        # Versuche zuerst die bevorzugte Sprache
        transcript_list = ytt_api.list(video_id)

        transcript = None

        # Versuche manuell erstellte Transkripte zuerst
        try:
            transcript = transcript_list.find_manually_created_transcript([language, 'en'])
        except NoTranscriptFound:
            pass

        # Falls nicht gefunden, versuche automatisch generierte
        if transcript is None:
            try:
                transcript = transcript_list.find_generated_transcript([language, 'en'])
            except NoTranscriptFound:
                pass

        # Falls immer noch nicht gefunden, nimm das erste verfuegbare
        if transcript is None:
            for t in transcript_list:
                transcript = t
                break

        if transcript is None:
            result['error'] = 'Kein Transkript verfuegbar'
            return result

        # Hole die Transkript-Daten
        transcript_data = transcript.fetch()

        result['success'] = True
        result['language'] = transcript.language_code
        result['transcript'] = list(transcript_data)
        result['full_text'] = ' '.join([entry.text for entry in transcript_data])

    except TranscriptsDisabled:
        result['error'] = 'Transkripte sind fuer dieses Video deaktiviert'
    except VideoUnavailable:
        result['error'] = 'Video nicht verfuegbar'
    except Exception as e:
        error_msg = str(e)
        if '403' in error_msg or 'Forbidden' in error_msg:
            result['error'] = (
                'YouTube blockiert die Anfrage (403 Forbidden). '
                'Dies kann an IP-Sperren liegen. '
                'Versuche es spaeter erneut oder nutze einen Proxy.'
            )
        else:
            result['error'] = f'Fehler: {error_msg}'

    return result


def format_transcript(transcript_data: list, include_timestamps: bool = True) -> str:
    """
    Formatiert das Transkript fuer die Ausgabe.

    Args:
        transcript_data: Liste von Transkript-Eintraegen
        include_timestamps: Ob Zeitstempel eingefuegt werden sollen

    Returns:
        Formatierter Transkript-Text
    """
    lines = []

    for entry in transcript_data:
        # Unterstuetze sowohl dict als auch Objekt-Format
        text = entry.text if hasattr(entry, 'text') else entry.get('text', '')
        start = entry.start if hasattr(entry, 'start') else entry.get('start', 0)

        if include_timestamps:
            # Konvertiere Sekunden zu MM:SS Format
            seconds = int(start)
            minutes = seconds // 60
            secs = seconds % 60
            timestamp = f"[{minutes:02d}:{secs:02d}]"
            lines.append(f"{timestamp} {text}")
        else:
            lines.append(text)

    return '\n'.join(lines)


def save_transcript(content: str, filename: str) -> bool:
    """
    Speichert das Transkript in eine Datei.

    Args:
        content: Der zu speichernde Inhalt
        filename: Dateiname

    Returns:
        True bei Erfolg, False bei Fehler
    """
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Fehler beim Speichern: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='YouTube Transcript Tool - Extrahiert Transkripte aus YouTube-Videos',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Beispiele:
  python transcript_tool.py https://youtu.be/A-Jo6zz8HUo
  python transcript_tool.py A-Jo6zz8HUo --language en
  python transcript_tool.py A-Jo6zz8HUo --output transcript.txt
  python transcript_tool.py A-Jo6zz8HUo --no-timestamps
        '''
    )

    parser.add_argument(
        'video',
        help='YouTube Video-URL oder Video-ID'
    )
    parser.add_argument(
        '-l', '--language',
        default='de',
        help='Bevorzugte Sprache (Standard: de)'
    )
    parser.add_argument(
        '-o', '--output',
        help='Ausgabedatei (optional)'
    )
    parser.add_argument(
        '--no-timestamps',
        action='store_true',
        help='Transkript ohne Zeitstempel ausgeben'
    )
    parser.add_argument(
        '--raw',
        action='store_true',
        help='Nur den reinen Text ohne Formatierung ausgeben'
    )

    args = parser.parse_args()

    # Video-ID extrahieren
    video_id = extract_video_id(args.video)
    if not video_id:
        print(f"Fehler: Ungueltige Video-URL oder ID: {args.video}")
        sys.exit(1)

    print(f"Hole Transkript fuer Video: {video_id}")
    print(f"Bevorzugte Sprache: {args.language}")
    print("-" * 50)

    # Transkript holen
    result = get_transcript(video_id, args.language)

    if not result['success']:
        print(f"Fehler: {result['error']}")
        sys.exit(1)

    print(f"Sprache: {result['language']}")
    print(f"Anzahl Segmente: {len(result['transcript'])}")
    print("-" * 50)

    # Formatierung
    if args.raw:
        output = result['full_text']
    else:
        output = format_transcript(
            result['transcript'],
            include_timestamps=not args.no_timestamps
        )

    # Ausgabe
    if args.output:
        if save_transcript(output, args.output):
            print(f"Transkript gespeichert in: {args.output}")
        else:
            sys.exit(1)
    else:
        print("\nTranskript:\n")
        print(output)


if __name__ == '__main__':
    main()
