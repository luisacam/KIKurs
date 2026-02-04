# Übungen: Lektion 3 - Neuronale Netze

## Aufgabe 1: Neuron-Berechnung

Ein einfaches Neuron hat:
- Eingaben: x1 = 2, x2 = 3
- Gewichte: w1 = 0.5, w2 = -0.3
- Bias: b = 0.1
- Aktivierung: ReLU (max(0, x))

**Berechne die Ausgabe:**

```
Schritt 1: Gewichtete Summe = w1·x1 + w2·x2 + b
         = ___ · ___ + ___ · ___ + ___
         = ___

Schritt 2: ReLU anwenden = max(0, ___)
         = ___

Ausgabe = ___
```

---

## Aufgabe 2: Schichten identifizieren

Gegeben ist folgendes neuronales Netz für Bildklassifikation:

```
Eingabe (784) → Schicht A (256) → Schicht B (128) → Schicht C (64) → Ausgabe (10)
```

**Fragen:**

1. Wie viele versteckte Schichten hat das Netz?

   _Antwort:_

2. Warum hat die Eingabeschicht 784 Neuronen? (Hinweis: 28×28 Pixel)

   _Antwort:_

3. Warum hat die Ausgabeschicht 10 Neuronen?

   _Antwort:_

---

## Aufgabe 3: Aktivierungsfunktionen

Berechne die Ausgabe für verschiedene Aktivierungsfunktionen:

### ReLU: f(x) = max(0, x)

| Eingabe | Ausgabe |
|---------|---------|
| 5 | |
| -3 | |
| 0 | |
| -0.5 | |

### Sigmoid: f(x) ≈ 0 wenn x << 0, ≈ 1 wenn x >> 0, = 0.5 wenn x = 0

| Eingabe | Ausgabe (ungefähr) |
|---------|-------------------|
| -10 | |
| 0 | |
| 10 | |

---

## Aufgabe 4: Lernprozess verstehen

Bringe den Lernprozess in die richtige Reihenfolge:

| Schritt | Reihenfolge (1-5) |
|---------|-------------------|
| Gewichte anpassen | |
| Fehler (Loss) berechnen | |
| Backpropagation durchführen | |
| Forward Pass (Vorhersage machen) | |
| Prozess wiederholen (nächste Epoche) | |

---

## Aufgabe 5: Netzwerk-Typ auswählen

Welchen Netzwerktyp würdest du für folgende Aufgaben verwenden?

| Aufgabe | MLP | CNN | RNN | Transformer |
|---------|-----|-----|-----|-------------|
| Gesichtserkennung in Fotos | | | | |
| Text übersetzen | | | | |
| Aktienkurse vorhersagen (Zeitreihe) | | | | |
| Spam-Klassifikation (einfach) | | | | |
| Chatbot wie ChatGPT | | | | |

---

## Aufgabe 6: Praktisch - Neuron simulieren

Implementiere ein einfaches Neuron in Python:

```python
# neuron.py

def relu(x: float) -> float:
    """ReLU Aktivierungsfunktion"""
    # TODO: implementieren
    pass

def neuron(eingaben: list, gewichte: list, bias: float) -> float:
    """
    Simuliert ein einzelnes Neuron.

    Args:
        eingaben: Liste von Eingabewerten [x1, x2, ...]
        gewichte: Liste von Gewichten [w1, w2, ...]
        bias: Bias-Wert

    Returns:
        Ausgabe nach ReLU-Aktivierung
    """
    # TODO:
    # 1. Berechne gewichtete Summe
    # 2. Addiere Bias
    # 3. Wende ReLU an
    pass

# Test
eingaben = [1.0, 2.0, 3.0]
gewichte = [0.2, 0.8, -0.5]
bias = 0.1

ergebnis = neuron(eingaben, gewichte, bias)
print(f"Neuron-Ausgabe: {ergebnis}")
# Erwartete Berechnung: 0.2*1 + 0.8*2 + (-0.5)*3 + 0.1 = 0.2 + 1.6 - 1.5 + 0.1 = 0.4
# ReLU(0.4) = 0.4
```

---

## Bonus: Deep Learning verstehen

1. **Was macht ein Netz "deep"?**

   _Antwort:_

2. **Warum können tiefere Netze komplexere Muster lernen?**

   _Antwort:_

3. **Was ist der Nachteil von sehr tiefen Netzen?**

   _Antwort:_
