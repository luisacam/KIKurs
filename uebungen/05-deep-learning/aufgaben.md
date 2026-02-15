# Übungen: Lektion 5 - Deep Learning

## Voraussetzungen

```bash
pip install torch torchvision scikit-learn
```

---

## Aufgabe 1: PyTorch Basics

Führe den folgenden Code aus und beantworte die Fragen:

```python
import torch

# Tensoren erstellen
a = torch.tensor([1, 2, 3])
b = torch.tensor([4, 5, 6])

print(f"a = {a}")
print(f"b = {b}")
print(f"a + b = {a + b}")
print(f"a * b = {a * b}")
print(f"a.sum() = {a.sum()}")
```

**Fragen:**

1. Was ist ein Tensor?

   _Antwort:_

2. Was ist `a * b`? (Element-weise oder Matrix?)

   _Antwort:_

---

## Aufgabe 2: Deep Learning Demo ausführen

```bash
python beispiele/deep_learning_demo.py
```

**Fragen:**

1. Wie viele Epochen werden trainiert?

   _Antwort:_

2. Wie hoch ist die finale Genauigkeit?

   _Antwort:_

3. Was macht `optimizer.zero_grad()`?

   _Antwort:_

---

## Aufgabe 3: Netzwerk-Architektur ändern

Öffne `beispiele/deep_learning_demo.py` und ändere die Netzwerk-Architektur:

```python
# Original
self.netz = nn.Sequential(
    nn.Linear(4, 16),
    nn.ReLU(),
    nn.Linear(16, 8),
    nn.ReLU(),
    nn.Linear(8, 3)
)

# Version A: Größer
self.netz = nn.Sequential(
    nn.Linear(4, 32),
    nn.ReLU(),
    nn.Linear(32, 16),
    nn.ReLU(),
    nn.Linear(16, 3)
)

# Version B: Tiefer
self.netz = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 8),
    nn.ReLU(),
    nn.Linear(8, 8),
    nn.ReLU(),
    nn.Linear(8, 3)
)
```

**Dokumentiere deine Ergebnisse:**

| Version | Neuronen | Genauigkeit |
|---------|----------|-------------|
| Original | 16→8 | |
| Größer | 32→16 | |
| Tiefer | 8→8→8 | |

---

## Aufgabe 4: Learning Rate experimentieren

Ändere die Learning Rate:

```python
# Original
optimizer = optim.Adam(modell.parameters(), lr=0.01)

# Teste verschiedene Werte
optimizer = optim.Adam(modell.parameters(), lr=0.001)  # Kleiner
optimizer = optim.Adam(modell.parameters(), lr=0.1)    # Größer
```

**Ergebnisse:**

| Learning Rate | Finale Genauigkeit | Beobachtung |
|---------------|-------------------|-------------|
| 0.001 | | |
| 0.01 | | |
| 0.1 | | |

---

## Aufgabe 5: Eigenes Netz schreiben

Schreibe ein Netz für den Wine-Datensatz:

```python
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Daten laden
wine = load_wine()
X = StandardScaler().fit_transform(wine.data)
y = wine.target

# TODO: In Tensoren umwandeln
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
X_train = torch.FloatTensor(X_train)
# ... (vervollständige)

# TODO: Netz definieren (13 Features, 3 Klassen)
class WineNetz(nn.Module):
    def __init__(self):
        super().__init__()
        # Dein Code hier
        pass

    def forward(self, x):
        # Dein Code hier
        pass

# TODO: Trainieren
# ...

# Ziel: >90% Genauigkeit!
```

---

## Bonus: GPU nutzen

Falls du eine NVIDIA GPU hast:

```python
# Prüfe ob GPU verfügbar
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Nutze: {device}")

# Modell und Daten auf GPU
modell = MeinNetz().to(device)
X_train = X_train.to(device)
y_train = y_train.to(device)
```

**Frage:** Wie viel schneller ist Training auf GPU vs. CPU?

_Antwort:_
