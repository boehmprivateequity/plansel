/* Plansel – Entwurf. Alle Inhalte hier sind statische Beispiele;
   in der Live-Version kommen Archiv-Antworten und Guide-Einträge aus einem CMS/LLM-Backend. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  // Übersetzung aus i18n.js; Deutsch ist der Originaltext
  const tr = s => (window.PLANSEL_I18N ? window.PLANSEL_I18N.tr(s) : s);

  /* ---------- Böhm-Archiv (KI-Prototyp) ---------- */
  const QA = [
    {
      q: "Was ist ein Klon bei Reben?",
      a: "Ein Klon ist die Nachkommenschaft eines einzigen, besonders guten Rebstocks. Alle Pflanzen eines Klons sind genetisch gleich. Plansel sucht solche Stöcke in alten Weinbergen, prüft sie über Jahre auf Gesundheit, Ertrag und Weinqualität und vermehrt nur die besten.",
      src: "Livro Branco das Castas Vitícolas, Kap. Klonselektion (Beispielverweis)"
    },
    {
      q: "Warum braucht Portugal resistente Sorten?",
      a: "Böhm warnt, dass der hohe Pestizideinsatz in Portugals Weinbergen kurzfristig zum Problem für Branche und Verbraucher wird. Resistente Sorten brauchen deutlich weniger Pflanzenschutz. Dafür fordert er mehr Forschung und mehr Offenheit für neue Sorten.",
      src: "Vorstellung des Buches, Essência do Vinho Lissabon, Nov. 2026"
    },
    {
      q: "Welche Sorten sind typisch für Plansel?",
      a: "Die Quinta da Plansel arbeitet vor allem mit Touriga Nacional, Touriga Franca und Tinta Barroca. Dazu kommen alte, fast vergessene portugiesische Sorten aus dem Selektionsprogramm.",
      src: "Plansel, Firmenangaben"
    },
    {
      q: "Wie verändert der Klimawandel den Alentejo?",
      a: "Heißere Sommer und weniger Wasser verschieben Reifezeiten und erhöhen den Stress für die Rebe. Pflanzmaterial, das an diese Bedingungen angepasst ist, wird deshalb wichtiger als die Wahl der Sorte allein.",
      src: "Plansel Science, Forschungsschwerpunkt Klima (Beispielverweis)"
    }
  ];
  const qs = $("#qs"), ans = $("#answer");
  let current = 0;
  function showAnswer(i, instant) {
    current = i;
    qs.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(i === j)));
    const item = QA[i];
    const text = tr(item.a);
    let k = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = () => { ans.textContent = text; const s = document.createElement("small"); s.textContent = tr("Quelle: ") + tr(item.src); ans.appendChild(s); };
    clearInterval(showAnswer.t);
    if (reduce || instant) return done();
    ans.textContent = "";
    showAnswer.t = setInterval(() => { k += 4; ans.textContent = text.slice(0, k); if (k >= text.length) { clearInterval(showAnswer.t); done(); } }, 16);
  }
  function renderQuestions() {
    qs.innerHTML = "";
    QA.forEach((item, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = tr(item.q); b.setAttribute("aria-pressed", String(i === current));
      b.addEventListener("click", () => showAnswer(i));
      qs.appendChild(b);
    });
  }
  // Ruhezustand: erste Antwort sofort sichtbar
  renderQuestions();
  showAnswer(0, true);

  /* ---------- KI-Sommelier ---------- */
  const WINES = {
    tinto: { name: "Plansel Tinta Barroca", img: "img/garrafa-tinto.png", type: "Tinto" },
    branco: { name: "Plansel Branco", img: "img/garrafa-branco.png", type: "Branco" },
    rose: { name: "Plansel Rosé", img: "img/garrafa-rose.png", type: "Rosé" }
  };
  function recommend(o, f, s) {
    if (f === "meat" || (s === "full" && f !== "fish")) return ["tinto", "Tinta Barroca bringt dunkle Frucht und weiche Tannine. Das trägt Fleisch und kräftige Saucen.", f === "meat" ? "Kräftig + Fleisch → Rotwein mit Struktur" : "Kräftig + Anlass → Rotwein mit Struktur"];
    if (f === "fish" || (o === "summer" && s === "fresh" && f === "veg")) return [o === "summer" ? "rose" : "branco", o === "summer" ? "Der Rosé ist trocken und frisch, ideal gekühlt auf der Terrasse und zu Meeresfrüchten." : "Der Branco hat lebendige Säure und Frucht aus dem Alentejo. Er passt zu Fisch und hellen Gerichten.", f === "fish" ? "Frisch + Fisch → heller, säurebetonter Stil" : "Frisch + Sommer → heller, säurebetonter Stil"];
    if (o === "gift") return ["tinto", "Als Geschenk empfehlen wir den Roten: eine Flasche mit Geschichte, aus Reben, die Hans Jörg Böhm selbst selektiert hat.", "Geschenk → Wein mit Herkunftsgeschichte"];
    if (o === "summer") return ["rose", "Gekühlt und unkompliziert. Passt zu Gemüse vom Grill und langen Abenden.", "Sommerabend → Rosé"];
    return ["branco", "Frisch und vielseitig. Ein guter Begleiter für Gemüse und leichte Küche.", "Frisch + leichte Küche → Weißwein"];
  }
  const form = $("#somm-form"), out = $("#somm-out");
  function renderSomm() {
    const d = new FormData(form);
    const [key, why, rule] = recommend(d.get("occ"), d.get("food"), d.get("style"));
    const w = WINES[key];
    out.innerHTML = "";
    const img = document.createElement("img"); img.src = w.img; img.alt = tr("Flasche " + w.name);
    const box = document.createElement("div");
    const badge = document.createElement("span"); badge.className = "badge-ai"; badge.textContent = tr("KI-Empfehlung"); box.appendChild(badge);
    const h = document.createElement("h3"); h.textContent = w.name;
    const p = document.createElement("p"); p.textContent = tr(why);
    const r = document.createElement("p"); r.className = "why"; r.textContent = tr("Begründung: ") + tr(rule);
    const a = document.createElement("a"); a.className = "btn"; a.style.marginTop = "18px"; a.href = "https://loja.plansel.com/collections"; a.target = "_blank"; a.rel = "noopener"; a.textContent = tr("Im Shop bestellen");
    box.append(h, p, r, a);
    out.append(img, box);
  }
  form.addEventListener("change", renderSomm);
  renderSomm();

  /* ---------- Guide ---------- */
  const GUIDE = {
    "Events weltweit": [
      { when: "Feb 2027 · Paris", t: "Wine Paris", d: "Internationale Fachmesse. Portugal mit großem Länderstand.", tag: "Messe" },
      { when: "März 2027 · Düsseldorf", t: "ProWein", d: "Wichtigste Weinmesse für den deutschsprachigen Markt.", tag: "Messe" },
      { when: "Apr 2027 · Verona", t: "Vinitaly", d: "Italiens Leitmesse, viele Einkäufer aus Übersee.", tag: "Messe" },
      { when: "Frühjahr 2027 · Neustadt/Weinstr.", t: "Mundus Vini", d: "Internationaler Weinpreis des Meininger Verlags.", tag: "Award" },
      { when: "Mai 2027 · London", t: "London Wine Fair", d: "Treffpunkt des britischen Handels und der Sommeliers.", tag: "Messe" },
      { ad: "Anzeige · 300 × 250" }
    ],
    "Events Portugal": [
      { when: "Feb 2027 · Porto", t: "Essência do Vinho", d: "Große Publikumsverkostung mit Hunderten Produzenten.", tag: "Verkostung" },
      { when: "Sept 2027 · Montemor-o-Novo", t: "Vindima auf der Quinta da Plansel", d: "Lese mitmachen, Mittagessen zwischen den Reben.", tag: "Plansel" },
      { when: "monatlich · Quinta da Plansel", t: "Masterclass Klone & Terroir", d: "Zwei Tage mit Rebschule, Labor und Keller.", tag: "Plansel" },
      { when: "Nov 2027 · Lissabon", t: "Encontro com o Vinho e Sabores", d: "Wein und Gastronomie, organisiert von Revista de Vinhos.", tag: "Verkostung" },
      { ad: "Anzeige · 300 × 250" },
      { when: "laufend · Quinta da Plansel", t: "WSET Level 2", d: "Nächster Kursstart auf Anfrage.", tag: "Wine School" }
    ],
    "Weingüter": [
      { when: "Alentejo", t: "Quinta da Plansel", d: "Rebschule, Weingut und Wine School an einem Ort.", tag: "Plansel" },
      { when: "Douro · Beispiel", t: "Weingut der Woche", d: "Platz für ein Partnerweingut, das mit Plansel-Klonen arbeitet.", tag: "Beispiel", must: true },
      { when: "Dão · Beispiel", t: "Weingut der Woche", d: "Porträt mit Interview, Karte und Besuchstipps.", tag: "Beispiel", must: true }
    ],
    "Restaurants": [
      { when: "Lissabon · Beispiel", t: "Restaurant mit Plansel auf der Karte", d: "Weinkarte, Küche und die Plansel-Empfehlung des Sommeliers.", tag: "Beispiel", must: true },
      { when: "Évora · Beispiel", t: "Alentejo-Küche", d: "Lokale Gerichte zu Touriga Nacional.", tag: "Beispiel", must: true },
      { ad: "Anzeige · 300 × 250" }
    ],
    "Hotels": [
      { when: "Quinta da Plansel", t: "Alojamento auf dem Weingut", d: "Übernachten zwischen den Reben, Verkostung inklusive.", tag: "Plansel" },
      { when: "Algarve · Beispiel", t: "Partnerhotel", d: "Hier trinken Sie Plansel. Verifiziertes Partnerprofil.", tag: "Beispiel", must: true },
      { when: "Porto · Beispiel", t: "Partnerhotel", d: "Weinbar mit Plansel-Flight.", tag: "Beispiel", must: true }
    ]
  };
  const tabs = $("#tabs"), grid = $("#guide-grid");
  let activeCat = Object.keys(GUIDE)[0];
  function renderGuide(cat) {
    activeCat = cat;
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.cat === cat)));
    grid.innerHTML = "";
    GUIDE[cat].forEach(e => {
      if (e.ad) { const d = document.createElement("div"); d.className = "ad"; d.textContent = tr(e.ad); grid.appendChild(d); return; }
      const a = document.createElement("article"); a.className = "entry";
      a.innerHTML = '<span class="when"></span><h3></h3><p></p><span class="tag"></span>';
      a.querySelector(".when").textContent = tr(e.when);
      a.querySelector("h3").textContent = tr(e.t);
      a.querySelector("p").textContent = tr(e.d);
      const tg = a.querySelector(".tag"); tg.textContent = tr(e.tag); if (e.must) tg.classList.add("tag--must");
      grid.appendChild(a);
    });
  }
  function renderTabs() {
    tabs.innerHTML = "";
    Object.keys(GUIDE).forEach(cat => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.dataset.cat = cat; b.textContent = tr(cat);
      b.addEventListener("click", () => renderGuide(cat));
      tabs.appendChild(b);
    });
    renderGuide(activeCat);
  }
  renderTabs();

  /* ---------- Newsletter ---------- */
  let nlState = "";
  const NL = { bad: "Bitte eine gültige E-Mail-Adresse eingeben.", ok: "Entwurf: Hier würde jetzt die Bestätigungsmail (Double-Opt-in) verschickt." };
  $("#signup").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#nl-email"), msg = $("#nl-msg");
    if (!email.value || !email.checkValidity()) { nlState = "bad"; msg.style.color = "var(--gold)"; msg.textContent = tr(NL.bad); email.focus(); return; }
    nlState = "ok"; msg.style.color = ""; msg.textContent = tr(NL.ok);
  });

  /* ---------- Sprachwechsel: dynamische Teile neu zeichnen ---------- */
  document.addEventListener("plansel:lang", () => {
    renderQuestions();
    showAnswer(current, true);
    renderSomm();
    renderTabs();
    if (nlState) $("#nl-msg").textContent = tr(NL[nlState]);
  });

})();
