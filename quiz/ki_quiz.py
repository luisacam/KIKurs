#!/usr/bin/env python3
"""
KI-Kurs Quiz

Teste dein Wissen aus allen 5 Lektionen!

Ausführen: python quiz/ki_quiz.py
"""

import random


def frage_stellen(frage: str, optionen: list, richtig: int) -> bool:
    """Stellt eine Frage und gibt zurück ob richtig."""
    print(f"\n{frage}")
    for i, opt in enumerate(optionen, 1):
        print(f"  {i}. {opt}")

    try:
        antwort = int(input("\nDeine Antwort (1-4): "))
        if antwort == richtig:
            print("✓ Richtig!")
            return True
        else:
            print(f"✗ Falsch! Richtig war: {richtig}. {optionen[richtig-1]}")
            return False
    except (ValueError, IndexError):
        print("Ungültige Eingabe!")
        return False


def lektion1_fragen():
    """Fragen zu Lektion 1: Einführung in KI"""
    return [
        {
            "frage": "Was bedeutet KI?",
            "optionen": ["Kluge Idee", "Künstliche Intelligenz", "Kein Internet", "Komplexe Information"],
            "richtig": 2
        },
        {
            "frage": "Was ist ein Beispiel für schwache KI?",
            "optionen": ["Ein Mensch", "Spamfilter", "Das Internet", "Ein Buch"],
            "richtig": 2
        },
        {
            "frage": "Existiert starke KI (General AI) bereits?",
            "optionen": ["Ja, seit 2020", "Nein, noch nicht", "Ja, aber geheim", "Nur in Japan"],
            "richtig": 2
        },
    ]


def lektion2_fragen():
    """Fragen zu Lektion 2: Machine Learning"""
    return [
        {
            "frage": "Was ist Supervised Learning?",
            "optionen": [
                "Lernen ohne Daten",
                "Lernen aus gelabelten Daten",
                "Lernen durch Belohnung",
                "Lernen im Schlaf"
            ],
            "richtig": 2
        },
        {
            "frage": "Was ist ein 'Feature' im ML?",
            "optionen": [
                "Ein Fehler im Code",
                "Eine Eingabe-Eigenschaft",
                "Das Ergebnis",
                "Der Algorithmus"
            ],
            "richtig": 2
        },
        {
            "frage": "Was ist Overfitting?",
            "optionen": [
                "Modell ist zu klein",
                "Modell lernt Trainingsdaten auswendig",
                "Modell trainiert zu kurz",
                "Modell hat keine Daten"
            ],
            "richtig": 2
        },
    ]


def lektion3_fragen():
    """Fragen zu Lektion 3: Neuronale Netze"""
    return [
        {
            "frage": "Was macht ReLU?",
            "optionen": [
                "Gibt x zurück wenn positiv, sonst 0",
                "Multipliziert alle Eingaben",
                "Berechnet den Durchschnitt",
                "Zählt die Neuronen"
            ],
            "richtig": 1
        },
        {
            "frage": "Was ist Backpropagation?",
            "optionen": [
                "Daten rückwärts laden",
                "Fehler zurück durchs Netz schicken",
                "Neuronen löschen",
                "Training stoppen"
            ],
            "richtig": 2
        },
        {
            "frage": "Was macht ein Netz 'deep'?",
            "optionen": [
                "Viele Parameter",
                "Viele Daten",
                "Viele versteckte Schichten",
                "Lange Laufzeit"
            ],
            "richtig": 3
        },
    ]


def lektion4_fragen():
    """Fragen zu Lektion 4: Praxis"""
    return [
        {
            "frage": "Welche Bibliothek nutzen wir für ML in Python?",
            "optionen": ["pandas", "numpy", "scikit-learn", "matplotlib"],
            "richtig": 3
        },
        {
            "frage": "Was macht train_test_split?",
            "optionen": [
                "Daten in Training und Test aufteilen",
                "Modell trainieren",
                "Fehler berechnen",
                "Daten laden"
            ],
            "richtig": 1
        },
        {
            "frage": "Was misst Accuracy?",
            "optionen": [
                "Geschwindigkeit",
                "Anteil korrekter Vorhersagen",
                "Anzahl der Features",
                "Größe des Modells"
            ],
            "richtig": 2
        },
    ]


def lektion5_fragen():
    """Fragen zu Lektion 5: Deep Learning"""
    return [
        {
            "frage": "Welches Framework nutzen wir für Deep Learning?",
            "optionen": ["scikit-learn", "pandas", "PyTorch", "numpy"],
            "richtig": 3
        },
        {
            "frage": "Was ist ein Tensor?",
            "optionen": [
                "Ein Fehler",
                "Ein mehrdimensionales Array",
                "Ein Algorithmus",
                "Ein Neuron"
            ],
            "richtig": 2
        },
        {
            "frage": "Wann ist Deep Learning besser als klassisches ML?",
            "optionen": [
                "Bei wenigen Daten",
                "Bei einfachen Problemen",
                "Bei vielen Daten und komplexen Mustern",
                "Immer"
            ],
            "richtig": 3
        },
    ]


def main():
    print("=" * 60)
    print("    KI-KURS QUIZ - Teste dein Wissen!")
    print("=" * 60)

    print("\nWähle eine Option:")
    print("  1. Lektion 1: Einführung in KI")
    print("  2. Lektion 2: Machine Learning")
    print("  3. Lektion 3: Neuronale Netze")
    print("  4. Lektion 4: Praxis")
    print("  5. Lektion 5: Deep Learning")
    print("  6. ALLE Lektionen (Abschlusstest)")

    try:
        wahl = int(input("\nDeine Wahl (1-6): "))
    except ValueError:
        wahl = 6

    # Fragen sammeln
    alle_fragen = {
        1: lektion1_fragen(),
        2: lektion2_fragen(),
        3: lektion3_fragen(),
        4: lektion4_fragen(),
        5: lektion5_fragen(),
    }

    if wahl in [1, 2, 3, 4, 5]:
        fragen = alle_fragen[wahl]
        titel = f"Lektion {wahl}"
    else:
        fragen = []
        for f in alle_fragen.values():
            fragen.extend(f)
        random.shuffle(fragen)
        titel = "Abschlusstest"

    # Quiz durchführen
    print(f"\n{'=' * 60}")
    print(f"    {titel.upper()}")
    print(f"{'=' * 60}")

    punkte = 0
    for i, f in enumerate(fragen, 1):
        print(f"\n--- Frage {i}/{len(fragen)} ---")
        if frage_stellen(f["frage"], f["optionen"], f["richtig"]):
            punkte += 1

    # Ergebnis
    prozent = punkte / len(fragen) * 100
    print(f"\n{'=' * 60}")
    print(f"    ERGEBNIS: {punkte}/{len(fragen)} ({prozent:.0f}%)")
    print(f"{'=' * 60}")

    if prozent >= 90:
        print("\n🏆 Ausgezeichnet! Du bist ein KI-Experte!")
    elif prozent >= 70:
        print("\n👍 Gut gemacht! Du hast die Grundlagen verstanden.")
    elif prozent >= 50:
        print("\n📚 Nicht schlecht, aber wiederhole noch einmal die Lektionen.")
    else:
        print("\n💪 Übe weiter! Lies die Lektionen nochmal durch.")


if __name__ == "__main__":
    main()
