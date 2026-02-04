# Übungen: Lektion 1 - Einführung in KI

## Aufgabe 1: KI im Alltag erkennen

Notiere 5 Anwendungen in deinem Alltag, die KI verwenden. Beschreibe kurz, welche Art von KI-Technik sie vermutlich nutzen.

**Beispiel:**
- **Netflix Empfehlungen** - Nutzt Machine Learning, um basierend auf meinem Sehverhalten Filme vorzuschlagen.

**Deine Antworten:**
1.
2.
3.
4.
5.

---

## Aufgabe 2: Schwache vs. Starke KI

Ordne die folgenden Beispiele zu "Schwacher KI" oder "Starker KI" zu:

| Beispiel | Schwache KI | Starke KI |
|----------|-------------|-----------|
| Schachcomputer | | |
| Ein Roboter, der jede beliebige Aufgabe lernen kann | | |
| Spamfilter | | |
| Autonomes Fahren | | |
| Eine KI wie in Science-Fiction-Filmen | | |

---

## Aufgabe 3: Reflexion

Beantworte die folgenden Fragen in 2-3 Sätzen:

1. **Was unterscheidet Machine Learning von traditioneller Programmierung?**

   _Deine Antwort:_

2. **Warum ist "Starke KI" noch nicht Realität?**

   _Deine Antwort:_

3. **Welche Chancen und Risiken siehst du bei KI?**

   _Deine Antwort:_

---

## Bonus: Erstes Python-Experiment

Wenn du Python installiert hast, probiere dieses einfache Beispiel aus:

```python
# ki_quiz.py - Ein einfaches Quiz über KI

fragen = [
    ("Was bedeutet KI?", "Künstliche Intelligenz"),
    ("Was ist Machine Learning?", "Lernen aus Daten"),
    ("Existiert starke KI bereits?", "Nein"),
]

punkte = 0

print("=== KI Quiz ===\n")

for frage, antwort in fragen:
    user_antwort = input(f"{frage} ")
    if antwort.lower() in user_antwort.lower():
        print("Richtig!\n")
        punkte += 1
    else:
        print(f"Die Antwort war: {antwort}\n")

print(f"Du hast {punkte}/{len(fragen)} Punkte erreicht!")
```

Speichere den Code als `ki_quiz.py` und führe ihn mit `python ki_quiz.py` aus.
