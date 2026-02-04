#!/usr/bin/env python3
"""
Demonstration eines einfachen Neurons und neuronalen Netzes.

Dieses Beispiel zeigt die Grundkonzepte ohne externe Bibliotheken.
In der Praxis würde man PyTorch, TensorFlow oder ähnliches verwenden.
"""

import math
import random


# === Aktivierungsfunktionen ===

def relu(x: float) -> float:
    """ReLU: Gibt x zurück wenn positiv, sonst 0"""
    return max(0.0, x)


def sigmoid(x: float) -> float:
    """Sigmoid: Komprimiert Werte auf Bereich 0-1"""
    return 1.0 / (1.0 + math.exp(-x))


# === Einzelnes Neuron ===

def neuron(eingaben: list, gewichte: list, bias: float, aktivierung=relu) -> float:
    """
    Simuliert ein einzelnes Neuron.

    1. Berechne gewichtete Summe: Σ(xi * wi)
    2. Addiere Bias
    3. Wende Aktivierungsfunktion an
    """
    # Gewichtete Summe
    summe = sum(x * w for x, w in zip(eingaben, gewichte))

    # Bias addieren
    summe += bias

    # Aktivierung anwenden
    return aktivierung(summe)


# === Einfaches neuronales Netz ===

class EinfachesNetz:
    """
    Ein Mini-Netz mit:
    - 2 Eingaben
    - 2 versteckte Neuronen
    - 1 Ausgabe

    Struktur:
        x1 ──┬──▶ h1 ──┬──▶ out
             ╳        ╳
        x2 ──┴──▶ h2 ──┘
    """

    def __init__(self):
        # Zufällige Startgewichte
        random.seed(42)

        # Gewichte zur versteckten Schicht (2 Eingaben → 2 Neuronen)
        self.w_hidden = [
            [random.uniform(-1, 1), random.uniform(-1, 1)],  # Gewichte für h1
            [random.uniform(-1, 1), random.uniform(-1, 1)],  # Gewichte für h2
        ]
        self.b_hidden = [random.uniform(-1, 1), random.uniform(-1, 1)]

        # Gewichte zur Ausgabeschicht (2 versteckte → 1 Ausgabe)
        self.w_output = [random.uniform(-1, 1), random.uniform(-1, 1)]
        self.b_output = random.uniform(-1, 1)

    def forward(self, x1: float, x2: float) -> float:
        """Forward Pass: Berechne Ausgabe für gegebene Eingaben"""
        eingaben = [x1, x2]

        # Versteckte Schicht
        h1 = neuron(eingaben, self.w_hidden[0], self.b_hidden[0], relu)
        h2 = neuron(eingaben, self.w_hidden[1], self.b_hidden[1], relu)

        # Ausgabeschicht
        versteckt = [h1, h2]
        ausgabe = neuron(versteckt, self.w_output, self.b_output, sigmoid)

        return ausgabe


# === Demo ===

def demo_neuron():
    """Demonstriert ein einzelnes Neuron"""
    print("=" * 50)
    print("Demo: Einzelnes Neuron")
    print("=" * 50)

    eingaben = [1.0, 2.0, 3.0]
    gewichte = [0.5, -0.3, 0.8]
    bias = 0.1

    print(f"\nEingaben:  {eingaben}")
    print(f"Gewichte:  {gewichte}")
    print(f"Bias:      {bias}")

    # Manuelle Berechnung zeigen
    summe = sum(x * w for x, w in zip(eingaben, gewichte))
    print(f"\nBerechnung:")
    print(f"  Gewichtete Summe: {eingaben[0]}×{gewichte[0]} + {eingaben[1]}×{gewichte[1]} + {eingaben[2]}×{gewichte[2]}")
    print(f"                  = {summe:.2f}")
    print(f"  + Bias:         = {summe + bias:.2f}")

    ausgabe = neuron(eingaben, gewichte, bias, relu)
    print(f"  ReLU anwenden:  = {ausgabe:.2f}")
    print(f"\n→ Neuron-Ausgabe: {ausgabe:.2f}")


def demo_netz():
    """Demonstriert ein einfaches neuronales Netz"""
    print("\n" + "=" * 50)
    print("Demo: Einfaches Neuronales Netz")
    print("=" * 50)

    netz = EinfachesNetz()

    # Verschiedene Eingaben testen
    testfaelle = [
        (0, 0),
        (0, 1),
        (1, 0),
        (1, 1),
    ]

    print("\nEingabe  →  Ausgabe")
    print("-" * 25)
    for x1, x2 in testfaelle:
        ausgabe = netz.forward(x1, x2)
        print(f"({x1}, {x2})    →  {ausgabe:.4f}")

    print("\nHinweis: Die Ausgaben sind zufällig, da die Gewichte")
    print("zufällig initialisiert wurden. Durch Training würde")
    print("das Netz lernen, sinnvolle Ausgaben zu produzieren.")


def demo_aktivierungen():
    """Zeigt verschiedene Aktivierungsfunktionen"""
    print("\n" + "=" * 50)
    print("Demo: Aktivierungsfunktionen")
    print("=" * 50)

    werte = [-2, -1, -0.5, 0, 0.5, 1, 2]

    print("\n   x    │  ReLU  │ Sigmoid")
    print("────────┼────────┼────────")
    for x in werte:
        r = relu(x)
        s = sigmoid(x)
        print(f" {x:5.1f}  │ {r:5.2f}  │  {s:.4f}")


if __name__ == "__main__":
    demo_neuron()
    demo_netz()
    demo_aktivierungen()

    print("\n" + "=" * 50)
    print("Fertig! Experimentiere mit den Werten im Code.")
    print("=" * 50)
