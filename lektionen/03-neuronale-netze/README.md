# Lektion 3: Neuronale Netze

## Lernziele

Nach dieser Lektion wirst du:
- Verstehen, wie neuronale Netze aufgebaut sind
- Wissen, was Neuronen, Schichten und Gewichte sind
- Den Lernprozess (Backpropagation) grundlegend verstehen

## Inspiration: Das menschliche Gehirn

Neuronale Netze sind von der Funktionsweise des Gehirns inspiriert:

```
Gehirn:              Neuronales Netz:
- 86 Milliarden      - Hunderte bis Millionen
  Neuronen             künstliche Neuronen
- Synapsen           - Gewichtete Verbindungen
- Elektrische        - Mathematische
  Signale              Berechnungen
```

## Aufbau eines Neurons

Ein künstliches Neuron macht folgendes:

```
        Eingaben        Gewichte
           │               │
           ▼               ▼
    ┌──────────────────────────┐
    │  x1 ──(w1)──┐            │
    │             │            │
    │  x2 ──(w2)──┼──▶ Σ ──▶ f(x) ──▶ Ausgabe
    │             │            │
    │  x3 ──(w3)──┘            │
    └──────────────────────────┘
                   │       │
               Summe   Aktivierung
```

1. **Eingaben (x)** - Die Daten, die reinkommen
2. **Gewichte (w)** - Wie wichtig jede Eingabe ist
3. **Summe (Σ)** - Alle gewichteten Eingaben addieren
4. **Aktivierung f(x)** - Entscheidet, ob das Neuron "feuert"

### Mathematisch

```
Ausgabe = f(w1·x1 + w2·x2 + w3·x3 + bias)
```

## Schichten (Layers)

Neuronen werden in Schichten organisiert:

```
  Eingabe-     Versteckte      Ausgabe-
  schicht      Schichten       schicht
     │              │              │
     ▼              ▼              ▼

    (●)           (●)
                ↗     ↘
    (●) ──────(●)     (●)──────▶ (●) Ergebnis
                ↘     ↗
    (●)           (●)

   Input        Hidden          Output
   Layer        Layers          Layer
```

| Schicht | Funktion |
|---------|----------|
| **Eingabeschicht** | Nimmt die Rohdaten entgegen |
| **Versteckte Schichten** | Verarbeiten und transformieren die Daten |
| **Ausgabeschicht** | Liefert das Ergebnis |

## Wie lernt ein neuronales Netz?

### 1. Forward Pass (Vorwärts)
Daten fließen durch das Netz → Vorhersage wird gemacht

### 2. Fehler berechnen (Loss)
Vergleich: Vorhersage vs. richtige Antwort

```
Loss = (Vorhersage - Richtige Antwort)²
```

### 3. Backpropagation (Rückwärts)
Der Fehler wird zurück durch das Netz geschickt, um zu bestimmen, welche Gewichte schuld sind.

### 4. Gewichte anpassen
Gewichte werden leicht verändert, um den Fehler zu reduzieren.

```
Neues Gewicht = Altes Gewicht - (Lernrate × Gradient)
```

### 5. Wiederholen
Dieser Prozess wird tausende Male wiederholt (Epochen).

## Aktivierungsfunktionen

Aktivierungsfunktionen entscheiden, ob ein Neuron "feuert":

### ReLU (Rectified Linear Unit)
```
f(x) = max(0, x)

Eingang:  -2  -1   0   1   2   3
Ausgang:   0   0   0   1   2   3
```
→ Alles Negative wird 0, Rest bleibt gleich

### Sigmoid
```
f(x) = 1 / (1 + e^(-x))

Ausgang ist immer zwischen 0 und 1
→ Gut für Wahrscheinlichkeiten
```

### Softmax
```
Wandelt Zahlen in Wahrscheinlichkeiten um
→ Alle Ausgaben summieren sich zu 1
→ Gut für Klassifikation (Hund: 80%, Katze: 15%, Vogel: 5%)
```

## Deep Learning

**Deep Learning** = Neuronale Netze mit vielen versteckten Schichten

```
Shallow:    Input → Hidden → Output           (1 versteckte Schicht)
Deep:       Input → H1 → H2 → H3 → H4 → Output (viele Schichten)
```

Je tiefer das Netz:
- ✅ Kann komplexere Muster lernen
- ❌ Braucht mehr Daten
- ❌ Braucht mehr Rechenleistung

## Arten von neuronalen Netzen

| Typ | Anwendung |
|-----|-----------|
| **MLP** (Multi-Layer Perceptron) | Einfache Klassifikation |
| **CNN** (Convolutional NN) | Bilder, Computer Vision |
| **RNN** (Recurrent NN) | Sequenzen, Zeitreihen |
| **Transformer** | Sprache (GPT, BERT, Claude) |

## Praktisches Beispiel: Ziffernerkennung

```
Eingabe: 28×28 Pixel Bild einer handgeschriebenen Ziffer

    ████
   █    █
        █
      █
     █
    █
    █
    ████

Neuronales Netz:
- Eingabeschicht: 784 Neuronen (28×28 Pixel)
- Versteckte Schichten: 128 → 64 Neuronen
- Ausgabeschicht: 10 Neuronen (Ziffern 0-9)

Ausgabe: [0.01, 0.02, 0.95, 0.01, ...]
         → Ziffer ist wahrscheinlich eine "2"
```

## Übung

Gehe zu `uebungen/03-neuronale-netze/` und bearbeite die Aufgaben.

Im Ordner `beispiele/` findest du auch ein Python-Beispiel.

---

**Vorherige Lektion:** [Machine Learning Grundlagen](../02-ml-grundlagen/)

**Nächste Lektion:** [Praktische Anwendungen](../04-praxis/) *(coming soon)*
