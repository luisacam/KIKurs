# Lektion 5: Deep Learning mit PyTorch

## Lernziele

Nach dieser Lektion wirst du:
- Den Unterschied zwischen ML und Deep Learning kennen
- PyTorch installieren und nutzen können
- Ein einfaches neuronales Netz trainieren

## Was ist Deep Learning?

**Deep Learning** = Machine Learning mit tiefen neuronalen Netzen (viele Schichten)

```
Machine Learning:     Einfache Modelle (Decision Tree, SVM)
Deep Learning:        Neuronale Netze mit 10, 100 oder 1000+ Schichten
```

### Wann Deep Learning?

| Verwende ML wenn... | Verwende Deep Learning wenn... |
|---------------------|-------------------------------|
| Wenig Daten (<1000) | Viele Daten (>10.000) |
| Einfache Muster | Komplexe Muster |
| Erklärbarkeit wichtig | Genauigkeit wichtig |
| Begrenzte Rechenpower | GPU verfügbar |

## PyTorch vs. TensorFlow

Die zwei großen Deep Learning Frameworks:

| PyTorch | TensorFlow |
|---------|------------|
| Von Meta/Facebook | Von Google |
| Einfacher für Anfänger | Besser für Produktion |
| Dynamische Graphen | Statische Graphen |
| Beliebt in Forschung | Beliebt in Industrie |

**Wir nutzen PyTorch** - es ist intuitiver!

## Installation

```bash
# CPU-Version (für Anfänger)
pip install torch torchvision

# GPU-Version (wenn du eine NVIDIA GPU hast)
# Siehe: https://pytorch.org/get-started/locally/
```

## Dein erstes PyTorch-Programm

```python
import torch

# Tensor erstellen (wie ein NumPy Array)
x = torch.tensor([1.0, 2.0, 3.0])
print(f"Tensor: {x}")
print(f"Form: {x.shape}")
print(f"Datentyp: {x.dtype}")

# Rechnen mit Tensoren
y = x * 2
print(f"x * 2 = {y}")

# Summe
print(f"Summe: {x.sum()}")
```

## Ein einfaches neuronales Netz

```python
import torch
import torch.nn as nn

# Netz definieren
class MeinNetz(nn.Module):
    def __init__(self):
        super().__init__()
        self.schicht1 = nn.Linear(4, 8)    # 4 Eingaben → 8 Neuronen
        self.schicht2 = nn.Linear(8, 3)    # 8 Neuronen → 3 Ausgaben
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.schicht1(x)
        x = self.relu(x)
        x = self.schicht2(x)
        return x

# Netz erstellen
netz = MeinNetz()
print(netz)

# Beispiel-Eingabe
eingabe = torch.tensor([5.1, 3.5, 1.4, 0.2])
ausgabe = netz(eingabe)
print(f"Ausgabe: {ausgabe}")
```

## Training Loop

Der typische Ablauf beim Training:

```python
import torch.optim as optim

# 1. Daten vorbereiten
X_train = torch.tensor([...])  # Eingaben
y_train = torch.tensor([...])  # Labels

# 2. Netz, Loss und Optimizer
netz = MeinNetz()
loss_fn = nn.CrossEntropyLoss()
optimizer = optim.Adam(netz.parameters(), lr=0.01)

# 3. Training Loop
for epoche in range(100):
    # Forward Pass
    vorhersage = netz(X_train)
    loss = loss_fn(vorhersage, y_train)

    # Backward Pass
    optimizer.zero_grad()  # Gradienten zurücksetzen
    loss.backward()        # Gradienten berechnen
    optimizer.step()       # Gewichte aktualisieren

    if epoche % 10 == 0:
        print(f"Epoche {epoche}, Loss: {loss.item():.4f}")
```

## Der komplette Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  1. DATEN LADEN                                             │
│     - torch.utils.data.DataLoader                           │
│     - Batches erstellen                                     │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  2. MODELL DEFINIEREN                                       │
│     - class MeinModell(nn.Module)                           │
│     - Schichten definieren                                  │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  3. TRAINING                                                │
│     - Forward Pass: vorhersage = modell(x)                  │
│     - Loss berechnen: loss = loss_fn(vorhersage, y)         │
│     - Backward Pass: loss.backward()                        │
│     - Update: optimizer.step()                              │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  4. EVALUIEREN                                              │
│     - modell.eval()                                         │
│     - Testdaten durchlaufen                                 │
│     - Genauigkeit messen                                    │
└─────────────────────────────────────────────────────────────┘
```

## Übung

Gehe zu `uebungen/05-deep-learning/` und bearbeite die Aufgaben.

Führe das Beispiel aus:
```bash
python beispiele/deep_learning_demo.py
```

---

**Vorherige Lektion:** [Praktische Anwendungen](../04-praxis/)

**Nächste:** [Abschlussprojekt](../../projekte/)
