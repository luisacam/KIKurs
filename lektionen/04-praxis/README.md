# Lektion 4: Praktische Anwendungen

## Lernziele

Nach dieser Lektion wirst du:
- Ein echtes ML-Modell mit Python trainieren können
- Die Bibliothek scikit-learn kennen
- Daten vorbereiten und ein Modell evaluieren können

## Voraussetzungen

Installiere die benötigten Bibliotheken:

```bash
pip install -r requirements.txt
```

Oder einzeln:
```bash
pip install scikit-learn pandas numpy matplotlib
```

## Scikit-learn: Die ML-Bibliothek

**Scikit-learn** ist die Standard-Bibliothek für Machine Learning in Python.

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
```

## Projekt 1: Iris-Blumen klassifizieren

Das klassische Anfänger-Projekt: Blumenarten anhand ihrer Maße erkennen.

### Die Daten

```
Iris-Datensatz (150 Blumen):
- 4 Features: Kelchblatt-Länge/Breite, Blütenblatt-Länge/Breite
- 3 Klassen: Setosa, Versicolor, Virginica
```

### Der Code

```python
# iris_klassifikation.py
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Daten laden
iris = load_iris()
X = iris.data      # Features (Maße)
y = iris.target    # Labels (Blumenart)

print(f"Anzahl Beispiele: {len(X)}")
print(f"Features pro Beispiel: {X.shape[1]}")
print(f"Klassen: {iris.target_names}")

# 2. Daten aufteilen (80% Training, 20% Test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Modell erstellen und trainieren
modell = DecisionTreeClassifier()
modell.fit(X_train, y_train)

# 4. Vorhersagen machen
vorhersagen = modell.predict(X_test)

# 5. Evaluieren
genauigkeit = accuracy_score(y_test, vorhersagen)
print(f"\nGenauigkeit: {genauigkeit:.2%}")
print("\nDetailierter Bericht:")
print(classification_report(y_test, vorhersagen, target_names=iris.target_names))
```

## Projekt 2: Zahlen erkennen

Handgeschriebene Ziffern (0-9) klassifizieren.

```python
# zahlen_erkennung.py
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

# 1. Daten laden
digits = load_digits()
X = digits.data    # 8x8 Pixel Bilder (als 64 Zahlen)
y = digits.target  # Die Ziffer (0-9)

# 2. Ein paar Beispiele anzeigen
fig, axes = plt.subplots(2, 5, figsize=(10, 4))
for i, ax in enumerate(axes.flat):
    ax.imshow(digits.images[i], cmap='gray')
    ax.set_title(f'Label: {y[i]}')
    ax.axis('off')
plt.tight_layout()
plt.savefig('beispiel_ziffern.png')
print("Beispielbilder gespeichert: beispiel_ziffern.png")

# 3. Trainieren
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

modell = RandomForestClassifier(n_estimators=100)
modell.fit(X_train, y_train)

# 4. Testen
genauigkeit = accuracy_score(y_test, modell.predict(X_test))
print(f"Genauigkeit: {genauigkeit:.2%}")
```

## Projekt 3: Spam-Erkennung (Text)

Text klassifizieren mit dem TF-IDF Verfahren.

```python
# spam_erkennung.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split

# Beispiel-Daten (in echt würde man mehr haben)
emails = [
    "Gewinn 1 Million Euro jetzt!",
    "Meeting morgen um 10 Uhr",
    "Klicke hier für kostenloses iPhone",
    "Bericht ist fertig, siehe Anhang",
    "Gratis Kredit ohne Schufa!!!",
    "Können wir den Termin verschieben?",
    "Du hast gewonnen! Klicke sofort!",
    "Projekt-Update: Alles läuft gut",
]
labels = [1, 0, 1, 0, 1, 0, 1, 0]  # 1=Spam, 0=Kein Spam

# Text in Zahlen umwandeln (TF-IDF)
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(emails)

# Modell trainieren
modell = MultinomialNB()
modell.fit(X, labels)

# Neue E-Mail testen
neue_email = ["Herzlichen Glückwunsch, Sie haben gewonnen!"]
neue_email_vec = vectorizer.transform(neue_email)
vorhersage = modell.predict(neue_email_vec)

print(f"E-Mail: '{neue_email[0]}'")
print(f"Vorhersage: {'SPAM' if vorhersage[0] == 1 else 'Kein Spam'}")
```

## Projekt 4: Video-Transkription 🎙️

Eine der bekanntesten KI-Anwendungen: gesprochene Sprache in Text umwandeln
(**Speech-to-Text**). Moderne Systeme wie OpenAI **Whisper** nutzen dafür
Transformer-Netzwerke, die auf riesigen Mengen Audio-Daten trainiert wurden.

**Wie es funktioniert (vereinfacht):**

1. Das Audio wird in kleine Zeitfenster zerlegt.
2. Jedes Fenster wird in ein Spektrogramm (Frequenz-Darstellung) umgewandelt.
3. Ein neuronales Netz sagt aus dem Spektrogramm Text-Tokens vorher.
4. Die Tokens werden zu einem Satz zusammengefügt.

**Benötigt:**

```bash
pip install openai-whisper
# sowie ffmpeg auf dem System
```

**Verwendung:**

```bash
python beispiele/video_transkription.py mein_video.mp4
python beispiele/video_transkription.py vorlesung.mp4 --modell small --sprache de --srt
```

Das Skript erzeugt eine `.txt`-Datei mit dem erkannten Text. Mit `--srt`
entsteht zusätzlich eine Untertitel-Datei mit Zeitstempeln.

Den kompletten Code findest du in `beispiele/video_transkription.py`.

## Der ML-Workflow in der Praxis

```
┌─────────────────────────────────────────────────────────────┐
│  1. PROBLEM VERSTEHEN                                       │
│     - Was soll vorhergesagt werden?                         │
│     - Welche Daten sind verfügbar?                          │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DATEN VORBEREITEN                                       │
│     - Daten laden und erkunden                              │
│     - Fehlende Werte behandeln                              │
│     - Features auswählen/erstellen                          │
│     - In Training/Test aufteilen                            │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. MODELL TRAINIEREN                                       │
│     - Algorithmus wählen                                    │
│     - modell.fit(X_train, y_train)                          │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. EVALUIEREN                                              │
│     - modell.predict(X_test)                                │
│     - Genauigkeit, Precision, Recall messen                 │
│     - Bei Bedarf: Parameter anpassen, wiederholen           │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  5. EINSETZEN                                               │
│     - Modell speichern                                      │
│     - In Anwendung integrieren                              │
└─────────────────────────────────────────────────────────────┘
```

## Wichtige Metriken

| Metrik | Bedeutung |
|--------|-----------|
| **Accuracy** | Anteil korrekter Vorhersagen |
| **Precision** | Von allen "positiv" Vorhersagen: wie viele waren richtig? |
| **Recall** | Von allen echten Positiven: wie viele wurden gefunden? |
| **F1-Score** | Harmonic Mean von Precision und Recall |

## Übung

Gehe zu `uebungen/04-praxis/` und bearbeite die Aufgaben.

Führe die Beispiele in `beispiele/` aus:
```bash
python beispiele/iris_klassifikation.py
```

---

**Vorherige Lektion:** [Neuronale Netze](../03-neuronale-netze/)
