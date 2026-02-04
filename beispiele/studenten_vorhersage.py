#!/usr/bin/env python3
"""
Studenten-Erfolg Vorhersage

Sagt vorher, ob ein Student seine Prüfung bestehen wird,
basierend auf Lerngewohnheiten.

Nutzt den Datensatz: daten/studenten.csv
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report


def main():
    print("=" * 60)
    print("Studenten-Erfolg Vorhersage")
    print("=" * 60)

    # Pfad zum Datensatz (relativ zum Projektordner)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    csv_path = os.path.join(project_dir, 'daten', 'studenten.csv')

    # 1. Daten laden
    print("\n1. Daten laden...")
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        # Fallback: versuche relativen Pfad
        df = pd.read_csv('daten/studenten.csv')

    print(f"   Geladene Datensätze: {len(df)}")
    print(f"\n   Erste 5 Zeilen:")
    print(df.head().to_string(index=False))

    # 2. Features und Label trennen
    print("\n2. Features und Label trennen...")
    X = df.drop('bestanden', axis=1)
    y = df['bestanden']

    print(f"   Features: {list(X.columns)}")
    print(f"   Label: bestanden (0=Nein, 1=Ja)")

    # 3. Daten aufteilen
    print("\n3. Daten aufteilen...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )
    print(f"   Training: {len(X_train)} Beispiele")
    print(f"   Test: {len(X_test)} Beispiele")

    # 4. Modell trainieren
    print("\n4. Decision Tree trainieren...")
    modell = DecisionTreeClassifier(max_depth=3, random_state=42)
    modell.fit(X_train, y_train)

    # Feature-Wichtigkeit anzeigen
    print("\n   Feature-Wichtigkeit:")
    for feature, wichtigkeit in zip(X.columns, modell.feature_importances_):
        balken = "█" * int(wichtigkeit * 20)
        print(f"   {feature:20} {balken} {wichtigkeit:.2%}")

    # 5. Evaluieren
    print("\n5. Ergebnisse:")
    vorhersagen = modell.predict(X_test)
    genauigkeit = accuracy_score(y_test, vorhersagen)
    print(f"   Genauigkeit: {genauigkeit:.2%}")

    print("\n   Klassifikationsbericht:")
    print(classification_report(
        y_test, vorhersagen,
        target_names=['Durchgefallen', 'Bestanden']
    ))

    # 6. Neue Vorhersagen
    print("\n6. Neue Studenten vorhersagen:")
    print("-" * 60)

    neue_studenten = pd.DataFrame([
        {'lernstunden': 8, 'uebungen_abgegeben': 9, 'vorlesung_besucht': 90, 'schlafstunden': 7},
        {'lernstunden': 2, 'uebungen_abgegeben': 1, 'vorlesung_besucht': 30, 'schlafstunden': 4},
        {'lernstunden': 5, 'uebungen_abgegeben': 5, 'vorlesung_besucht': 60, 'schlafstunden': 6},
    ])

    for i, student in neue_studenten.iterrows():
        vorhersage = modell.predict([student])[0]
        ergebnis = "Bestanden ✓" if vorhersage == 1 else "Durchgefallen ✗"
        print(f"\n   Student {i+1}:")
        print(f"   - Lernstunden/Woche: {student['lernstunden']}")
        print(f"   - Übungen abgegeben: {student['uebungen_abgegeben']}")
        print(f"   - Vorlesung besucht: {student['vorlesung_besucht']}%")
        print(f"   - Schlaf/Nacht: {student['schlafstunden']}h")
        print(f"   → Vorhersage: {ergebnis}")

    print("\n" + "=" * 60)
    print("Fertig! Ändere die Studentendaten und experimentiere.")
    print("=" * 60)


if __name__ == "__main__":
    main()
