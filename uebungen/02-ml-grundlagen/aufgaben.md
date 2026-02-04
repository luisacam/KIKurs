# Übungen: Lektion 2 - Machine Learning Grundlagen

## Aufgabe 1: ML-Arten zuordnen

Ordne die folgenden Anwendungen der richtigen ML-Art zu:

| Anwendung | Supervised | Unsupervised | Reinforcement |
|-----------|------------|--------------|---------------|
| Spam-Filter trainieren mit gelabelten E-Mails | | | |
| Kundengruppen automatisch finden | | | |
| Schach spielen lernen | | | |
| Hauspreis-Vorhersage | | | |
| Anomalie-Erkennung in Netzwerkverkehr | | | |
| Roboter lernt laufen | | | |

---

## Aufgabe 2: Features identifizieren

Du möchtest ein ML-Modell bauen, das vorhersagt, ob ein Student seine Prüfung besteht.

**Welche Features könnten relevant sein?** Nenne mindestens 5:

1.
2.
3.
4.
5.

**Welches wäre das Label?**

---

## Aufgabe 3: Overfitting erkennen

Ein Modell wurde mit Trainingsdaten trainiert und getestet:

```
Genauigkeit auf Trainingsdaten: 99%
Genauigkeit auf Testdaten:      52%
```

**Fragen:**
1. Liegt hier Overfitting oder Underfitting vor?

   _Antwort:_

2. Was könnte man tun, um das Problem zu beheben? (Nenne 2 Möglichkeiten)

   _Antwort:_

---

## Aufgabe 4: Der ML-Workflow

Bringe die folgenden Schritte in die richtige Reihenfolge (1-6):

| Schritt | Reihenfolge |
|---------|-------------|
| Modell evaluieren | |
| Daten sammeln | |
| Modell trainieren | |
| Modell in Produktion einsetzen | |
| Daten vorbereiten und bereinigen | |
| Algorithmus auswählen | |

---

## Aufgabe 5: Praktisch - Einfache Klassifikation

Führe das Beispiel `beispiele/ml_beispiel.py` aus (falls vorhanden) oder schreibe selbst eine einfache "Klassifikation" mit if-else:

```python
# mini_klassifikation.py
# Ein "Modell" das entscheidet, ob ein Tier ein Hund oder eine Katze ist

def klassifiziere_tier(gewicht_kg: float, bellt: bool) -> str:
    """
    Einfache regelbasierte Klassifikation.
    In echtem ML würde das Modell diese Regeln selbst lernen!
    """
    # TODO: Implementiere die Logik
    # Hinweis: Hunde bellen oft und sind oft schwerer
    pass

# Test
print(klassifiziere_tier(25, True))   # → sollte "Hund" sein
print(klassifiziere_tier(4, False))   # → sollte "Katze" sein
print(klassifiziere_tier(8, True))    # → ?
```

**Frage:** Warum ist diese regelbasierte Lösung KEIN echtes Machine Learning?

_Antwort:_

---

## Bonus: Reflexion

1. **Warum braucht ML viele Daten?**

   _Antwort:_

2. **Was passiert, wenn die Trainingsdaten verzerrt (biased) sind?**

   _Antwort:_

3. **Nenne ein Beispiel aus deinem Alltag, wo ML eingesetzt werden könnte:**

   _Antwort:_
