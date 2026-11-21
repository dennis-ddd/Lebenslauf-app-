# Lebenslauf – Lebenssimulator

Ein Lebenssimulator für das Handy: Lebe ein ganzes Leben in einer zufällig erzeugten 3D-Stadt – mit Schule, Ausbildung, Studium, 23 Berufen, Liebe, Familie, Haustieren, Wohnungen, Autos, Börse, Kriminalität und der Social-Media-App „Klick“ samt Influencer-Karriere.

## Spielen und installieren

1. Auf GitHub: **Settings → Pages → Build and deployment → Source: „Deploy from a branch“**, Branch **main**, Ordner **/ (root)**, speichern.
2. Nach 1–2 Minuten ist das Spiel unter `https://dennis-ddd.github.io/Lebenslauf-app-/` erreichbar.
3. Auf dem Handy öffnen:
   - **Android (Chrome):** Menü (drei Punkte) → **App installieren** bzw. **Zum Startbildschirm hinzufügen**.
   - **iPhone (Safari):** Teilen-Knopf → **Zum Home-Bildschirm**.

## Updates

Neue Versionen landen automatisch in der App: Beim nächsten Öffnen mit Internet wird die neueste Version geladen. Ohne Internet startet die zuletzt geladene Version.

Der Spielstand wird nur auf dem jeweiligen Gerät gespeichert.

## Dateien

- `index.html` – das komplette Spiel
- `manifest.webmanifest` – App-Name, Symbol und Farben für die Installation
- `sw.js` – sorgt für Offline-Start und Updates
- `icons/` – App-Symbole

## Aufbau des Codes

Das Spiel wird aus Modulen in `src/` gebaut. `index.html` ist das fertige Ergebnis und wird nicht direkt bearbeitet.

```
src/shell.html    HTML-Grundgerüst
src/css/          Design
src/js/00–33      Spielmodule, z. B. 05_geschaefte.js, 11_immobilien.js, 23_kinder_generationen.js
build.py          setzt alles zu index.html zusammen
tests/            automatische Tests (siehe tests/README.md)
```

Nach jeder Änderung: `python3 build.py`, dann die Tests laufen lassen.
