# Lektion 2: Machine Learning Grundlagen

## Lernziele

Nach dieser Lektion wirst du:
- Die drei Hauptarten von Machine Learning verstehen
- Wissen, was ein ML-Modell ist und wie es trainiert wird
- Den Unterschied zwischen Training und Vorhersage kennen

## Was ist Machine Learning?

**Machine Learning (ML)** ist eine Methode, bei der Computer aus Daten lernen, Muster zu erkennen und Vorhersagen zu treffen - ohne explizit programmiert zu werden.

```
Traditionell:  Programmierer schreibt Regeln → Computer folgt Regeln
ML:            Computer analysiert Daten → Computer lernt Regeln selbst
```

## Die drei Arten von Machine Learning

### 1. Überwachtes Lernen (Supervised Learning)

Der Computer lernt aus **gelabelten Daten** - Beispiele mit bekannten Antworten.

**Beispiel: Spam-Filter**
```
E-Mail: "Gewinn 1 Million Euro!"     → Label: SPAM
E-Mail: "Meeting um 14 Uhr"          → Label: KEIN SPAM
E-Mail: "Klicke hier für Gratis..."  → Label: SPAM
```

Der Computer lernt Muster und kann dann neue E-Mails klassifizieren.

**Anwendungen:**
- Bildklassifikation (Hund vs. Katze)
- Preisvorhersagen (Immobilien, Aktien)
- Medizinische Diagnosen

### 2. Unüberwachtes Lernen (Unsupervised Learning)

Der Computer findet **selbst Muster** in Daten ohne Labels.

**Beispiel: Kundensegmentierung**
```
Kunde A: kauft oft, hohe Beträge, abends
Kunde B: kauft selten, niedrige Beträge, morgens
Kunde C: kauft oft, hohe Beträge, nachts
→ Computer gruppiert: A und C sind ähnlich
```

**Anwendungen:**
- Kundengruppen finden
- Anomalie-Erkennung (Betrug)
- Daten komprimieren

### 3. Verstärkendes Lernen (Reinforcement Learning)

Der Computer lernt durch **Versuch und Irrtum** mit Belohnungen.

**Beispiel: Spiele lernen**
```
Aktion: Nach links gehen → Belohnung: +10 Punkte
Aktion: Gegen Wand laufen → Bestrafung: -5 Punkte
→ Computer lernt: Links gehen ist besser
```

**Anwendungen:**
- Spiele (AlphaGo, Atari)
- Robotersteuerung
- Autonomes Fahren

## Der ML-Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DATEN     │ ──▶ │  TRAINING   │ ──▶ │   MODELL    │
│  sammeln    │     │  (lernen)   │     │  (Regeln)   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ERGEBNIS   │ ◀── │ VORHERSAGE  │ ◀── │ NEUE DATEN  │
│  (Antwort)  │     │  (nutzen)   │     │  (Eingabe)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Schritt 1: Daten sammeln
- Je mehr (gute) Daten, desto besser das Modell
- Daten müssen repräsentativ sein

### Schritt 2: Daten vorbereiten
- Fehler bereinigen
- Daten normalisieren
- In Training/Test aufteilen

### Schritt 3: Modell trainieren
- Algorithmus wählen
- Modell mit Trainingsdaten füttern
- Parameter optimieren

### Schritt 4: Modell evaluieren
- Mit Testdaten prüfen
- Genauigkeit messen
- Verbessern falls nötig

### Schritt 5: Modell einsetzen
- In Produktion bringen
- Neue Vorhersagen machen

## Wichtige Begriffe

| Begriff | Erklärung |
|---------|-----------|
| **Feature** | Eine Eigenschaft der Daten (z.B. Alter, Größe) |
| **Label** | Die Antwort/Kategorie (z.B. Spam/Nicht-Spam) |
| **Training** | Das Modell lernt aus Daten |
| **Inferenz** | Das Modell macht Vorhersagen |
| **Overfitting** | Modell lernt Trainingsdaten auswendig, versagt bei neuen Daten |
| **Underfitting** | Modell ist zu einfach, lernt nicht genug |

## Übung

Gehe zu `uebungen/02-ml-grundlagen/` und bearbeite die Aufgaben.

---

**Vorherige Lektion:** [Einführung in KI](../01-einfuehrung/)

**Nächste Lektion:** [Neuronale Netze](../03-neuronale-netze/)
