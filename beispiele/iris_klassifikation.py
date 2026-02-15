#!/usr/bin/env python3
"""
Iris-Blumen Klassifikation mit scikit-learn

Das klassische Anfänger-Projekt im Machine Learning:
Blumenarten anhand ihrer Maße erkennen.

Voraussetzung: pip install scikit-learn
"""

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report


def main():
    print("=" * 60)
    print("Iris-Blumen Klassifikation")
    print("=" * 60)

    # 1. Daten laden
    print("\n1. Daten laden...")
    iris = load_iris()
    X = iris.data      # Features (Maße der Blumen)
    y = iris.target    # Labels (Blumenart: 0, 1 oder 2)

    print(f"   Anzahl Beispiele: {len(X)}")
    print(f"   Features pro Beispiel: {X.shape[1]}")
    print(f"   Feature-Namen: {iris.feature_names}")
    print(f"   Klassen: {list(iris.target_names)}")

    # Beispiel anzeigen
    print(f"\n   Beispiel-Blume:")
    print(f"   Features: {X[0]}")
    print(f"   Label: {y[0]} ({iris.target_names[y[0]]})")

    # 2. Daten aufteilen
    print("\n2. Daten aufteilen (80% Training, 20% Test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42  # Für reproduzierbare Ergebnisse
    )
    print(f"   Training: {len(X_train)} Beispiele")
    print(f"   Test: {len(X_test)} Beispiele")

    # 3. Modell erstellen und trainieren
    print("\n3. Modell trainieren (Decision Tree)...")
    modell = DecisionTreeClassifier(max_depth=3)  # Begrenzte Tiefe gegen Overfitting
    modell.fit(X_train, y_train)
    print("   Training abgeschlossen!")

    # 4. Vorhersagen machen
    print("\n4. Vorhersagen auf Testdaten...")
    vorhersagen = modell.predict(X_test)

    # 5. Evaluieren
    print("\n5. Ergebnisse:")
    genauigkeit = accuracy_score(y_test, vorhersagen)
    print(f"   Genauigkeit: {genauigkeit:.2%}")

    print("\n   Detaillierter Bericht:")
    print("-" * 60)
    print(classification_report(
        y_test,
        vorhersagen,
        target_names=iris.target_names
    ))

    # 6. Neue Vorhersage machen
    print("\n6. Neue Blume klassifizieren:")
    neue_blume = [[5.1, 3.5, 1.4, 0.2]]  # Beispielmaße
    vorhersage = modell.predict(neue_blume)
    print(f"   Maße: {neue_blume[0]}")
    print(f"   Vorhersage: {iris.target_names[vorhersage[0]]}")

    print("\n" + "=" * 60)
    print("Fertig! Experimentiere mit verschiedenen Parametern.")
    print("=" * 60)


if __name__ == "__main__":
    main()
