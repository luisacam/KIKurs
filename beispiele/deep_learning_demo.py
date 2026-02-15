#!/usr/bin/env python3
"""
Deep Learning Demo mit PyTorch

Trainiert ein einfaches neuronales Netz zur Iris-Klassifikation.

Installation: pip install torch scikit-learn
"""

try:
    import torch
    import torch.nn as nn
    import torch.optim as optim
except ImportError:
    print("PyTorch nicht installiert!")
    print("Installiere mit: pip install torch")
    exit(1)

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np


# === 1. Neuronales Netz definieren ===

class IrisNetz(nn.Module):
    """Ein einfaches Netz für Iris-Klassifikation"""

    def __init__(self):
        super().__init__()
        self.netz = nn.Sequential(
            nn.Linear(4, 16),      # 4 Features → 16 Neuronen
            nn.ReLU(),
            nn.Linear(16, 8),      # 16 → 8 Neuronen
            nn.ReLU(),
            nn.Linear(8, 3)        # 8 → 3 Klassen
        )

    def forward(self, x):
        return self.netz(x)


def main():
    print("=" * 60)
    print("Deep Learning Demo: Iris-Klassifikation mit PyTorch")
    print("=" * 60)

    # === 2. Daten laden ===
    print("\n1. Daten laden...")
    iris = load_iris()
    X = iris.data
    y = iris.target

    # Daten normalisieren (wichtig für Neural Networks!)
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Aufteilen
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # In PyTorch Tensoren umwandeln
    X_train = torch.FloatTensor(X_train)
    X_test = torch.FloatTensor(X_test)
    y_train = torch.LongTensor(y_train)
    y_test = torch.LongTensor(y_test)

    print(f"   Training: {len(X_train)} Beispiele")
    print(f"   Test: {len(X_test)} Beispiele")

    # === 3. Modell erstellen ===
    print("\n2. Modell erstellen...")
    modell = IrisNetz()
    print(modell)

    # === 4. Training Setup ===
    loss_fn = nn.CrossEntropyLoss()
    optimizer = optim.Adam(modell.parameters(), lr=0.01)

    # === 5. Training ===
    print("\n3. Training...")
    epochen = 100

    for epoche in range(epochen):
        # Forward Pass
        modell.train()
        vorhersagen = modell(X_train)
        loss = loss_fn(vorhersagen, y_train)

        # Backward Pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        # Fortschritt anzeigen
        if (epoche + 1) % 20 == 0:
            modell.eval()
            with torch.no_grad():
                test_pred = modell(X_test)
                test_loss = loss_fn(test_pred, y_test)
                _, predicted = torch.max(test_pred, 1)
                accuracy = (predicted == y_test).sum().item() / len(y_test)

            print(f"   Epoche {epoche+1:3d}/{epochen} | "
                  f"Train Loss: {loss.item():.4f} | "
                  f"Test Loss: {test_loss.item():.4f} | "
                  f"Accuracy: {accuracy:.1%}")

    # === 6. Finale Evaluation ===
    print("\n4. Ergebnis:")
    modell.eval()
    with torch.no_grad():
        test_pred = modell(X_test)
        _, predicted = torch.max(test_pred, 1)
        korrekt = (predicted == y_test).sum().item()
        total = len(y_test)

    print(f"   Genauigkeit: {korrekt}/{total} = {korrekt/total:.1%}")

    # === 7. Neue Vorhersage ===
    print("\n5. Neue Blume klassifizieren:")
    neue_blume = torch.FloatTensor(scaler.transform([[5.1, 3.5, 1.4, 0.2]]))

    modell.eval()
    with torch.no_grad():
        ausgabe = modell(neue_blume)
        wahrscheinlichkeiten = torch.softmax(ausgabe, dim=1)
        _, klasse = torch.max(ausgabe, 1)

    print(f"   Eingabe: [5.1, 3.5, 1.4, 0.2]")
    print(f"   Wahrscheinlichkeiten: {wahrscheinlichkeiten[0].numpy()}")
    print(f"   Vorhersage: {iris.target_names[klasse.item()]}")

    print("\n" + "=" * 60)
    print("Fertig! Du hast gerade ein neuronales Netz trainiert!")
    print("=" * 60)


if __name__ == "__main__":
    main()
