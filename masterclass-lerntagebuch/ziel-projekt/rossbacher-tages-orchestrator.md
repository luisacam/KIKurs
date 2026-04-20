# Rossbacher-Tages-Orchestrator

**Das große Ziel-Projekt des Masterclass-Kurses.**

Statt nur Module zu konsumieren, fließt jeder gelernte Baustein in dieses
eine Projekt ein. Am Ende hältst du etwas Echtes in der Hand.

---

## Vision in einem Satz

Jeden Morgen um 07:30 liefert Claude Code mir ein Briefing im Luisa-Stil:
Mails getriggert, Termine sortiert, KI-News gefiltert, Preisprotokoll
kontrolliert – in 90 Sekunden lesbar.

---

## Bausteine

| # | Baustein | Modul-Bezug | Technik | Status |
|---|---|---|---|---|
| 1 | Gmail-Triage | MCP-Modul | MCP-Server Gmail | ☐ offen |
| 2 | Google Calendar-Check | MCP-Modul | MCP-Server Calendar | ☐ offen |
| 3 | KI-News-Recherche | Web-Tool-Modul | WebSearch / WebFetch | ☐ offen |
| 4 | Preisprotokoll-Check | Sub-Agents-Modul | eigener Sub-Agent | ☐ offen |
| 5 | Morgen-Briefing im Luisa-Stil | Hooks / Slash-Commands | Hook + Prompt | ☐ offen |

---

## Architektur-Skizze (wächst mit dem Kurs)

```
[Cron / Hook 07:30]
        │
        ▼
[Orchestrator-Agent]
        │
        ├── Sub-Agent: Gmail-Triage ────► MCP Gmail
        ├── Sub-Agent: Kalender-Check ──► MCP Calendar
        ├── Sub-Agent: News-Scout ──────► WebSearch
        ├── Sub-Agent: Preis-Wächter ───► interne Daten
        │
        ▼
[Briefing im Luisa-Stil: Markdown / Mail / Notion]
```

---

## Entscheidungen (werden festgehalten, sobald sie fallen)

| Frage | Entscheidung | Datum | Begründung |
|---|---|---|---|
| Wo läuft das Ding? | offen | – | – |
| Wohin geht das Briefing? (Mail / Notion / Obsidian) | offen | – | – |
| Welche Modelle? | offen | – | – |

---

## Risiken / Hürden

- ☐ MCP-Zugriff auf Gmail & Calendar braucht saubere OAuth-Einrichtung.
- ☐ Datenschutz: keine Kundenmails ungefiltert an externe Modelle.
- ☐ Täglicher Lauf muss robust sein, auch wenn eine Quelle ausfällt.

---

## Mein Stil – was "Luisa-Stil" im Briefing heißt

- Österreichisches Hochdeutsch.
- Kein Konjunktiv-Brei, klare Verben.
- Prioritäten zuerst, Details danach.
- Humor erlaubt, aber nicht gezwungen.
- Emojis nur, wenn sie wirklich helfen – nicht dekorativ.
