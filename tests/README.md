# Tests

Automatische Tests ohne Browser. Sie laden das gebaute `index.html` und simulieren viele Leben.

```
python3 build.py
node tests/simulation.js   # 300 Leben mit allen Apps, Aktionen und Einstellungen
node tests/geschaefte.js   # Filialen, Produkte, Konkurrenz, Bankfilialen
node tests/immobilien.js   # Kaufen, Vermieten, Ausbauen
node tests/leben.js        # Chats, Hobbys, Geschwister, Prüfungen, Stadt-Ereignisse
node tests/spielweisen.js 50   # 5 Spielweisen × 50 Leben, Auswertung in tests/spielweisen.json
```

Jeder Test endet mit `errors 0`, wenn alles in Ordnung ist.

- `korrekturen.js`: Gefängnis, Wärter, Arzt-Rabatt, Namen-Lader, Stadt-Marker
- `namen_export.js`: schreibt die eingebauten Namen neu nach `inhalte/namen.txt` (überschreibt!)
- `kindheit.js`: spielt 120 Leben ab Geburt, prüft Meilensteine, Minispiele, Prägungen, Rückkehrer und seelische Last
- `altersgerecht.js`: listet alle Nachrichten an Kinder und Jugendliche (0–17) zum Durchlesen
