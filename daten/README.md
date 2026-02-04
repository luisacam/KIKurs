# Datensätze

Dieser Ordner enthält Beispiel-Datensätze für die Übungen.

## studenten.csv

Ein synthetischer Datensatz zum Üben von Klassifikation.

**Aufgabe:** Vorhersagen, ob ein Student die Prüfung besteht.

### Features (Eingaben)

| Spalte | Beschreibung | Wertebereich |
|--------|--------------|--------------|
| lernstunden | Lernstunden pro Woche | 1-10 |
| uebungen_abgegeben | Anzahl abgegebener Übungen | 0-10 |
| vorlesung_besucht | Anwesenheit in % | 0-100 |
| schlafstunden | Durchschnittlicher Schlaf pro Nacht | 3-9 |

### Label (Ausgabe)

| Spalte | Beschreibung | Werte |
|--------|--------------|-------|
| bestanden | Prüfung bestanden? | 0 = Nein, 1 = Ja |

### Beispiel-Nutzung

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Daten laden
df = pd.read_csv('daten/studenten.csv')

# Features und Label trennen
X = df.drop('bestanden', axis=1)
y = df['bestanden']

# Aufteilen und trainieren
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

modell = DecisionTreeClassifier()
modell.fit(X_train, y_train)

print(f"Genauigkeit: {modell.score(X_test, y_test):.2%}")
```

## Weitere Datensätze

Für mehr Übungsdaten kannst du auch die eingebauten Datensätze von scikit-learn verwenden:

```python
from sklearn.datasets import load_iris       # Blumen-Klassifikation
from sklearn.datasets import load_wine       # Wein-Klassifikation
from sklearn.datasets import load_digits     # Ziffern-Erkennung
from sklearn.datasets import load_diabetes   # Diabetes-Regression
```
