# plansel.com – Neuentwurf

Statische Website (HTML/CSS/JS, kein Build nötig).

- `index.html` – Website-Entwurf

- `styles.css`, `app.js` – Design und Interaktion (KI-Sommelier, Böhm-Archiv, Guide, Newsletter)
- `llms.txt`, `robots.txt`, `ads.txt` – Auffindbarkeit für KI-Suche und Werbung
- `img/` – Bilder aus plansel.com / adega.plansel.com

Lokal ansehen: `powershell -File serve.ps1`, dann http://localhost:5173
GitHub Pages: Repository-Root = dieser Ordner, Pages auf Branch `main` / Root.

## Deployment
Vercel ist mit diesem Repository verbunden: jeder Push auf `main` geht automatisch live (plansel.vercel.app).
Das interne Konzept mit Umsatzzahlen liegt bewusst nicht in diesem öffentlichen Repository.

## Sprachseiten (ab Version 1.1)
- `index.html` ist die deutsche **Quellseite**. Ohne `?quelle` leitet sie sofort auf `/pt/`, `/en/` … weiter (Browsersprache, sonst Portugiesisch).
- `pt/ en/ de/ fr/ es/ zh/ pl/` sind **fertig übersetzte Kopien**, damit Google jede Sprache lesen kann. Sie werden aus der Quellseite erzeugt und dürfen nicht von Hand bearbeitet werden.
- Nach jeder Änderung an `index.html` oder `i18n-texts.js`: Quellseite mit `?quelle` öffnen und die Sprachseiten neu erzeugen.
- Rechtsseiten: `privacidade.html` (Datenschutz) und `ficha-tecnica.html` (Impressum, Livro de Reclamações). Gelb markierte Felder müssen noch ausgefüllt werden.

## Zweite Seite: Viveiros Plansel (index2.html)
- `index2.html` ist die Seite der Rebschule Viveiros Plansel (Unterfirma der Plansel Group), deutsche Quellseite wie `index.html`.
- Sprachfassungen liegen daneben als `pt/index2.html`, `en/index2.html` …; sie werden genauso erzeugt wie die Startseite.
- Links: Alles zu Reben kaufen und Rebschule auf `index.html` führt zu `index2.html`; von `index2.html` führen Logo, Navigation und mehrere Links zurück.
- Die alte Adresse `/viveiros/` leitet auf `/<sprache>/index2.html` weiter.
