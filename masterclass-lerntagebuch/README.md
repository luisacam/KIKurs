# Masterclass-Lerntagebuch

**Kurs:** Claude Code Masterclass (Leonard Schmedding / Everlast Consulting)
**Lernende:** Luisa Cameroni – Rossbacher GmbH, Lienz
**Rollen:** KI-Ansprechperson, TÜV SÜD AI Automation Manager

---

## Warum dieses Tagebuch existiert

Ich habe während des Kurses gemerkt: Wissen rutscht durch, weil ich nur konsumiere. Dieses Lerntagebuch zwingt mich zum **Bauen und Lehren** statt nur zum Zuhören.

**Ziel:** Claude Code flexibel einsetzen für
- Rossbacher-Workflows (Diesel, Tankkarten, Mails, Mahnwesen)
- eigene Apps (Zauberküche, Freebridge, Letizia-Buch)
- technisches Tiefenverständnis (MCP, Hooks, Sub-Agents)

---

## Die Lernmethode (5 Schritte pro Modul)

1. **Aktives Abrufen** – aus dem Gedächtnis erzählen, was das Modul war.
2. **Lücken-Check** – 3 Verständnisfragen, eine absichtlich knifflig.
3. **Anwendung** – Mini-Projekt (20–60 Min) auf einen echten Workflow.
4. **Feynman-Test** – dem IT-Kollegen Bernhard Zanon erklären.
5. **Spaced Repetition** – 3 Kernfragen, die in 7 Tagen wiederkommen.

---

## Struktur

```
masterclass-lerntagebuch/
├── README.md                    ← dieses Dokument
├── fortschritt.md               ← Modul-Tracker mit Check-Boxen
├── fragen-an-claude.md          ← offene Fragen, die ich noch klären will
├── module/
│   └── _template/               ← Vorlage für jedes neue Modul
│       ├── 01_notiz.md          ← Zusammenfassung in meinen Worten
│       ├── 02_mini-projekt/     ← praktische Anwendung
│       └── 03_lehrnotiz.md      ← Erklärung für Bernhard Zanon
└── ziel-projekt/
    └── rossbacher-tages-orchestrator.md  ← großes Abschlussprojekt
```

Pro Modul wird `_template/` kopiert und umbenannt, z.B. `module/01-hooks/`.

---

## Ziel-Projekt: Rossbacher-Tages-Orchestrator

Jedes Modul fließt in dieses eine Projekt ein. Details in
[`ziel-projekt/rossbacher-tages-orchestrator.md`](ziel-projekt/rossbacher-tages-orchestrator.md).

Am Ende des Kurses: ein echtes Produkt statt nur Notizen.

---

## Wiedereinstieg in eine neue Session

```
Wir setzen die Masterclass-Lernbegleitung fort. Lies bitte:
- masterclass-lerntagebuch/README.md
- masterclass-lerntagebuch/fortschritt.md
- das letzte Modul in masterclass-lerntagebuch/module/

Sag mir dann: (a) wo wir stehen, (b) ob eine Spaced-Repetition-Karte
heute fällig ist, (c) was wir jetzt machen.
```

## Wöchentlicher Wissens-Check

```
Wöchentlicher Wissens-Check. Geh in masterclass-lerntagebuch/module/
und such alle Spaced-Repetition-Karten, die älter als 7 Tage sind.
Stell mir daraus 5 Fragen – gemischt, nicht modulweise. Nach meinen
Antworten: ehrliches Feedback, welche Konzepte sitzen.
```
