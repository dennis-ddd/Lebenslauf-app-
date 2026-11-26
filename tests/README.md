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
- `node tests/kinderwelt.js`: Spielzeugkiste (0–5), Schulranzen, Sparschwein, Ereignis „Erstes Handy“ und der Schalter in den Einstellungen.
- `node tests/fuehrerschein_influencer.js`: alle vier Führerscheine (Stunden, Theorie, Praxis, Fahrzeuge) und die Influencer-Systeme (Deals, Shitstorm, Collabs, Merch, Agentur, Award).
- `node tests/stadt.js`: Stadtplanung (alle Orte im passenden Viertel, Seed reproduzierbar), Stadtwandel über ein ganzes Leben, eigene Firmen und Immobilien auf der Karte.
- `node tests/ruhm_wirtschaft.js`: Arbeitslosigkeit, Immobilienmarkt und Lohnrunden über viele Leben, Bekanntheit mit Promi-Ereignissen, Stadtanzeiger mit allen Rubriken und Bürgermeisterwahlen.
- `node tests/clown_chats.js`: Klassenclown über ganze Schulzeiten, alle neuen Chat-Nachrichten mit passenden Antworten (inklusive witziger Antwort), Gruppenchat-Optionen und die neuen Einstellungs-Tabs.
- `node tests/schicksal.js`: zentrales Ereignissystem, alle Lebenslage-Ereignisse und Spätfolgen (frühere Entscheidungen kommen zurück), Wendepunkte in der Lebensmitte.
- `node tests/wiederkehr.js`: Lebensfilm, Lebensalbum mit Erinnerungsstücken über alle Leben und die Zweite Chance.
- `node tests/zusammen_alter.js`: Freundeskreis (Hochzeiten, Krisen, Umzüge, Abschiede), Haustiere mit Tricks und Bindung (auch beim Weiterspielen), Gesundheit und Wohnen im Alter.
- `node tests/avatar.js`: lebendiger Avatar in allen Altersstufen, Stimmungen und Kombinationen, Kleiderschrank, Friseur, Altersgrenzen und klassischer Avatar.
- `node tests/politik.js`: Politik-Karriere mit Programm, Vorlagen im Amt, Wahlkampf mit TV-Duell, Lobby und Skandal, Koalition und Kanzleramt.
- `node tests/einstieg_suche.js`: Erste Schritte im ersten Leben, Zeitraffer der Babyjahre und die Suche (Treffer und Navigation).
- `node tests/fehlerprotokoll.js`: zehn ganze Leben inklusive Generationswechsel; im Fehlerprotokoll darf kein Spielfehler stehen, und kein Ereignis darf öfter als 3,5-mal pro Leben vorkommen.
- `node tests/verbindung.js`: Freunde im Chat, Lebensfilm mit Freunden, Tieren und Amt, Generationswechsel mit Elternhaus, Onkel/Tante, Erbstück und Erinnerungen der Eltern.
- `node tests/jugend_traeume.js`: zehn Jugend-Entscheidungen (Häufigkeit und alle Antworten), Lebensträume, Lebenslinie und die späte Folge der Zivilcourage.
- `node tests/chats_vielfalt.js`: Chat-Nachrichten passen zur Lebenslage und wiederholen sich nicht, Antworten wechseln, kein „[object Object]“ im Übernahmeangebot.
- `node tests/welt_zeit.js`: Szenen je Kategorie, Handy-Zeitalter mit Jahreszahl, Schmetterlingskarte (erst später freigeschaltet), Denkmäler und Friedhof in der Stadt.
