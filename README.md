# KIKurs

Ein Kurs über Künstliche Intelligenz mit praktischen Tools.

## YouTube Transcript Tool

Ein Python-Tool zum Extrahieren von Transkripten aus YouTube-Videos.

### Installation

```bash
pip install -r requirements.txt
```

### Verwendung

```bash
# Mit YouTube-URL
python transcript_tool.py https://youtu.be/A-Jo6zz8HUo

# Mit Video-ID
python transcript_tool.py A-Jo6zz8HUo

# Mit bestimmter Sprache
python transcript_tool.py A-Jo6zz8HUo --language en

# In Datei speichern
python transcript_tool.py A-Jo6zz8HUo --output transcript.txt

# Ohne Zeitstempel
python transcript_tool.py A-Jo6zz8HUo --no-timestamps

# Nur reiner Text
python transcript_tool.py A-Jo6zz8HUo --raw
```

### Optionen

| Option | Beschreibung |
|--------|--------------|
| `-l, --language` | Bevorzugte Sprache (Standard: de) |
| `-o, --output` | Ausgabedatei |
| `--no-timestamps` | Ohne Zeitstempel ausgeben |
| `--raw` | Nur reiner Text ohne Formatierung |

### Unterstützte URL-Formate

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direkte Video-ID

### Hinweise

- **IP-Sperre**: YouTube kann Anfragen blockieren (403 Forbidden). In diesem Fall später erneut versuchen oder einen Proxy verwenden.
- **Transkript nicht verfügbar**: Nicht alle Videos haben Transkripte. Das Tool versucht automatisch generierte und manuell erstellte Untertitel zu finden.
