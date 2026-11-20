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
