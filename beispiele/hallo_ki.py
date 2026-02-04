#!/usr/bin/env python3
"""
Erstes KI-Beispiel: Ein einfacher Chatbot mit Regeln

Dieses Beispiel zeigt, wie ein sehr einfacher "Chatbot" funktioniert.
Es ist KEINE echte KI, sondern nur Musterabgleich (Pattern Matching).
Echte KI-Chatbots wie ChatGPT funktionieren viel komplexer!
"""


def einfacher_chatbot(nachricht: str) -> str:
    """Ein regelbasierter Chatbot - keine echte KI!"""
    nachricht = nachricht.lower()

    # Einfache Regeln (kein Machine Learning)
    if "hallo" in nachricht or "hi" in nachricht:
        return "Hallo! Wie kann ich dir helfen?"

    elif "wie geht" in nachricht:
        return "Mir geht es gut, danke! Ich bin ein Computerprogramm."

    elif "was ist ki" in nachricht:
        return "KI steht für Künstliche Intelligenz - Computer, die 'intelligent' handeln können."

    elif "machine learning" in nachricht:
        return "Machine Learning ist eine Methode, bei der Computer aus Daten lernen."

    elif "tschüss" in nachricht or "bye" in nachricht:
        return "Auf Wiedersehen! Viel Spaß beim Lernen!"

    else:
        return "Das verstehe ich leider nicht. Frag mich etwas über KI!"


def main():
    print("=" * 50)
    print("Einfacher Chatbot (regelbasiert, keine echte KI)")
    print("Tippe 'tschüss' zum Beenden")
    print("=" * 50)
    print()

    while True:
        user_input = input("Du: ")
        if not user_input:
            continue

        antwort = einfacher_chatbot(user_input)
        print(f"Bot: {antwort}\n")

        if "tschüss" in user_input.lower() or "bye" in user_input.lower():
            break


if __name__ == "__main__":
    main()
