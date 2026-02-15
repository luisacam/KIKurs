# Übungen: Lektion 4 - Praktische Anwendungen

## Voraussetzungen

Stelle sicher, dass die Bibliotheken installiert sind:
```bash
pip install -r requirements.txt
```

---

## Aufgabe 1: Iris-Beispiel ausführen

1. Führe das Beispiel aus:
   ```bash
   python beispiele/iris_klassifikation.py
   ```

2. Beantworte:
   - Wie hoch ist die Genauigkeit des Modells?

     _Antwort:_

   - Welche Blumenart wird am besten erkannt (höchster F1-Score)?

     _Antwort:_

---

## Aufgabe 2: Parameter ändern

Öffne `beispiele/iris_klassifikation.py` und ändere den Parameter `max_depth`:

```python
# Probiere verschiedene Werte
modell = DecisionTreeClassifier(max_depth=1)  # Sehr einfach
modell = DecisionTreeClassifier(max_depth=5)  # Komplexer
modell = DecisionTreeClassifier(max_depth=10) # Noch komplexer
```

**Dokumentiere deine Ergebnisse:**

| max_depth | Genauigkeit |
|-----------|-------------|
| 1 | |
| 3 | |
| 5 | |
| 10 | |
| None (unbegrenzt) | |

**Frage:** Ab welcher Tiefe verbessert sich das Ergebnis nicht mehr wesentlich?

_Antwort:_

---

## Aufgabe 3: Anderen Algorithmus testen

Ersetze den DecisionTreeClassifier durch einen anderen Algorithmus:

```python
# Option A: Random Forest (mehrere Bäume)
from sklearn.ensemble import RandomForestClassifier
modell = RandomForestClassifier(n_estimators=100)

# Option B: K-Nearest Neighbors
from sklearn.neighbors import KNeighborsClassifier
modell = KNeighborsClassifier(n_neighbors=3)

# Option C: Support Vector Machine
from sklearn.svm import SVC
modell = SVC()
```

**Teste mindestens 2 Algorithmen und vergleiche:**

| Algorithmus | Genauigkeit |
|-------------|-------------|
| DecisionTree | |
| RandomForest | |
| KNeighbors | |
| SVC | |

---

## Aufgabe 4: Eigenes Klassifikationsprojekt

Erstelle ein eigenes Skript, das den Wein-Datensatz klassifiziert:

```python
# wein_klassifikation.py
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
# TODO: Importiere einen Klassifikator deiner Wahl

# 1. Daten laden
wein = load_wine()
X = wein.data
y = wein.target

print(f"Features: {wein.feature_names}")
print(f"Klassen: {wein.target_names}")

# 2. Daten aufteilen
# TODO

# 3. Modell trainieren
# TODO

# 4. Evaluieren
# TODO
```

**Ziel:** Erreiche mindestens 90% Genauigkeit!

---

## Aufgabe 5: Daten erkunden mit Pandas

```python
# daten_erkunden.py
import pandas as pd
from sklearn.datasets import load_iris

# Daten als DataFrame laden
iris = load_iris()
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['species'] = iris.target

# Erkunden
print("Erste 5 Zeilen:")
print(df.head())

print("\nStatistiken:")
print(df.describe())

print("\nKorrelationen:")
print(df.corr())
```

**Fragen:**

1. Welches Feature hat den größten Wertebereich (max - min)?

   _Antwort:_

2. Welche zwei Features korrelieren am stärksten?

   _Antwort:_

---

## Bonus: Visualisierung

Erstelle ein Streudiagramm der Iris-Daten:

```python
# visualisierung.py
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

iris = load_iris()

# Zwei Features auswählen
feature_x = 0  # sepal length
feature_y = 2  # petal length

plt.figure(figsize=(10, 6))
for i, name in enumerate(iris.target_names):
    mask = iris.target == i
    plt.scatter(
        iris.data[mask, feature_x],
        iris.data[mask, feature_y],
        label=name
    )

plt.xlabel(iris.feature_names[feature_x])
plt.ylabel(iris.feature_names[feature_y])
plt.legend()
plt.title('Iris Datensatz')
plt.savefig('iris_plot.png')
print("Grafik gespeichert: iris_plot.png")
```

**Frage:** Welche Blumenart lässt sich am leichtesten von den anderen unterscheiden?

_Antwort:_
