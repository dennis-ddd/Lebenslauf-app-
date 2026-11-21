# Tests

Automatische Tests ohne Browser. Sie laden das gebaute `index.html` und simulieren viele Leben.

```
python3 build.py
node tests/simulation.js   # 300 Leben mit allen Apps, Aktionen und Einstellungen
node tests/geschaefte.js   # Filialen, Produkte, Konkurrenz, Bankfilialen
node tests/immobilien.js   # Kaufen, Vermieten, Ausbauen
node tests/leben.js        # Chats, Hobbys, Geschwister, Prüfungen, Stadt-Ereignisse
```

Jeder Test endet mit `errors 0`, wenn alles in Ordnung ist.
