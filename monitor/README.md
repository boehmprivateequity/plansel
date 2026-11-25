# PLANSEL Global Wine Monitor

Teil von `index4.html` (Weinwelt), Seite 02. Vorschau auf der Startseite: `preview.js`. Status: `monitor/admin.html`. `monitor/index.html` leitet nur noch weiter.

- `welt.js`, `welt.css`: Vergleich, Aktien und Plansel Index auf `index4.html`. `monitor.js`: die Monitor-Ansicht.
- `data/aktien.json`: Auswahl der Aktien von Hand, einmal im Quartal prüfen. `scripts/stocks.pl` rechnet daraus `stocks.json` (einmal am Tag). Anderer Kursanbieter: nur `hist()` und `mcap()` ändern.

## Aufbau
- `scripts/update.pl`: Datenimport (Perl-Kernmodule und curl, keine Schlüssel). 3 Versuche je Abfrage, Plausibilitätsgrenzen, bei Ausfall bleibt der letzte gültige Stand.
- `.github/workflows/wine-monitor.yml`: läuft stündlich und legt `data.json` und `history.json` im Zweig `wine-data` ab.
- `vercel.json`: liefert diese Dateien unter `/monitor/live/` aus, ohne neuen Build. `data/` ist der mitgelieferte Ersatzstand.
- `history.json`: ein Eintrag je Tag, daraus wächst die eigene Datenbank.
- `data/oiv.json`: OIV und UN Tourism, von Hand. Nach jeder neuen Veröffentlichung ergänzen.
- `data/land.json`: Hektarpreise für Seite 04, von Hand. Knight Frank (Frühjahr), SAFER (Mai), MAPA (Oktober), CREA (November).

## Lokal
`perl monitor/scripts/update.pl monitor/data` (mit `FORCE=1` ohne Zwischenspeicher).

## Quellen und Rechte
World Bank (CC BY 4.0), FAO über Our World in Data (CC BY), Eurostat/Comext, UN Comtrade (öffentliche Vorschau, begrenzt), EZB, IPMA, MET Norway (CC BY 4.0), NASA POWER, GISCO (© EuroGeographics). Nachrichten: nur Überschrift und Link.
Nicht verwendet: Open-Meteo (frei nur für nicht kommerzielle Nutzung).

## Noch offen
- Kein offener Zugang gefunden: OIV-Datenbank, FAOSTAT direkt, UN WPP, IVV je Region, Zahl der Weingüter, alkoholfreier Wein, Google Trends. Turismo de Portugal, INE und ViniPortugal sind nicht geprüft.
- KI-Zusammenfassung der Nachrichten und AI FORECAST: braucht einen KI-Schlüssel als GitHub-Secret und kostet nach Verbrauch. Bisher Einteilung über Stichwörter.
- Eigene Wetterstation und Bodensensoren: als weiterer `block(...)` in `update.pl`.
- `admin.html` ist öffentlich, aber ohne vertrauliche Angaben.
