# Abschlussprojekt: Dein eigenes ML-Projekt

Herzlichen Glückwunsch! Du hast alle Lektionen abgeschlossen. Jetzt ist es Zeit für dein eigenes Projekt!

## Projektauswahl

Wähle eines der folgenden Projekte:

---

### Projekt A: Spam-Detektor 📧

**Schwierigkeit:** ⭐⭐ Mittel

Baue einen Klassifikator, der Spam-E-Mails erkennt.

**Aufgaben:**
1. Lade einen E-Mail-Datensatz (z.B. von Kaggle)
2. Bereite die Textdaten vor (TF-IDF)
3. Trainiere verschiedene Modelle
4. Evaluiere und vergleiche
5. Erstelle eine einfache Demo

**Technologien:** scikit-learn, pandas

---

### Projekt B: Bildklassifikation 🖼️

**Schwierigkeit:** ⭐⭐⭐ Fortgeschritten

Trainiere ein Netz, das Bilder klassifiziert (z.B. Hunde vs. Katzen).

**Aufgaben:**
1. Lade CIFAR-10 oder einen eigenen Datensatz
2. Baue ein CNN (Convolutional Neural Network)
3. Trainiere mit Data Augmentation
4. Erreiche >80% Genauigkeit
5. Visualisiere Fehlklassifikationen

**Technologien:** PyTorch, torchvision

---

### Projekt C: Preisvorhersage 💰

**Schwierigkeit:** ⭐⭐ Mittel

Sage Hauspreise oder Autopreise vorher.

**Aufgaben:**
1. Lade einen Preis-Datensatz
2. Führe explorative Datenanalyse durch
3. Trainiere Regressionsmodelle
4. Optimiere Hyperparameter
5. Erstelle Vorhersage-Funktion

**Technologien:** scikit-learn, pandas, matplotlib

---

### Projekt D: Sentiment-Analyse 😊😠

**Schwierigkeit:** ⭐⭐⭐ Fortgeschritten

Analysiere, ob Texte positiv oder negativ sind.

**Aufgaben:**
1. Lade Rezensionen (Amazon, Filme, etc.)
2. Bereite Text vor (Tokenisierung)
3. Trainiere ein Modell
4. Teste mit eigenen Texten
5. Baue eine interaktive Demo

**Technologien:** scikit-learn oder PyTorch

---

## Projektstruktur

Erstelle einen Ordner für dein Projekt:

```
projekte/
└── mein_projekt/
    ├── README.md           # Projektbeschreibung
    ├── daten/              # Datensätze
    ├── notebooks/          # Jupyter Notebooks
    │   ├── 01_exploration.ipynb
    │   ├── 02_training.ipynb
    │   └── 03_evaluation.ipynb
    ├── src/                # Python Code
    │   ├── model.py
    │   └── utils.py
    └── requirements.txt    # Abhängigkeiten
```

## Bewertungskriterien

| Kriterium | Punkte |
|-----------|--------|
| **Funktionalität** - Modell trainiert und funktioniert | 30 |
| **Code-Qualität** - Sauber, kommentiert, strukturiert | 20 |
| **Dokumentation** - README erklärt das Projekt | 20 |
| **Evaluation** - Metriken, Visualisierungen | 15 |
| **Kreativität** - Eigene Ideen, Erweiterungen | 15 |
| **Gesamt** | **100** |

## Abgabe

1. Erstelle ein GitHub Repository
2. Pushe deinen Code
3. Schreibe eine gute README.md
4. Teile den Link!

---

## Beispiel: Mini-Projekt Vorlage

```python
# mein_projekt/src/model.py
"""
Mein ML-Projekt: [TITEL]
Autor: [DEIN NAME]
Datum: [DATUM]
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report


def laden_daten(pfad):
    """Lädt und bereitet Daten vor."""
    df = pd.read_csv(pfad)
    # TODO: Datenbereinigung
    return df


def trainieren(X, y):
    """Trainiert das Modell."""
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    modell = RandomForestClassifier(n_estimators=100)
    modell.fit(X_train, y_train)

    # Evaluieren
    vorhersagen = modell.predict(X_test)
    print(classification_report(y_test, vorhersagen))

    return modell


def vorhersage(modell, eingabe):
    """Macht eine Vorhersage."""
    return modell.predict([eingabe])


if __name__ == "__main__":
    # Hauptprogramm
    print("Mein ML-Projekt startet...")

    # TODO: Dein Code hier
```

---

**Viel Erfolg bei deinem Projekt!** 🚀
