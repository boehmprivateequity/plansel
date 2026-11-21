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

  /* ---------- Events (Guide) ----------
     Stand: 21.11.2026. Wo es keine sichere offizielle Adresse gibt, führt der Link zur Suche. */
  const g = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
  const map = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const QUINTA = "https://www.adega.plansel.com/enoturismo";
  const GUIDE = {
    "Portugal": [
      { when: "4.–6. Dez 2026 · Vila de Frades", t: "VITIFRADES", d: "Fest der Talha-Weine aus der Amphore, im Alentejo bei Vidigueira.", tag: "Weinfest", url: g("VITIFRADES Vila de Frades 2026"), start: "2026-12-04", end: "2026-12-06", place: "Vila de Frades", town: "Vidigueira" },
      { when: "16. Jan 2027 · Vidigueira", t: "Gala Europäische Weinstadt 2026", d: "Abschluss des Jahres als Europäische Weinstadt im Baixo Alentejo.", tag: "Gala", url: g("Cidade Europeia do Vinho 2026 Vidigueira gala encerramento"), start: "2027-01-16", end: "2027-01-16", place: "Vidigueira", town: "Vidigueira" },
      { when: "14.–21. Feb 2027 · Porto", t: "Wine & Travel Week", d: "Eine Woche Weintourismus mit Verkostungen in ganz Porto.", tag: "Verkostung", url: "https://www.winetravelweek.com/", start: "2027-02-14", end: "2027-02-21", place: "Porto", town: "Porto" },
      { when: "18.–21. Feb 2027 · Porto", t: "Essência do Vinho", d: "Portugals große Publikumsverkostung im Palácio da Bolsa.", tag: "Verkostung", url: "https://essenciadovinho.com/", start: "2027-02-18", end: "2027-02-21", place: "Palácio da Bolsa", town: "Porto" },
      { ad: "Anzeige · 300 × 250" },
      { when: "Ende Feb 2027 · Porto", t: "Simplesmente Vinho", d: "Kleine Produzenten und Naturweine. Termin noch offen.", tag: "Verkostung", url: g("Simplesmente Vinho Porto 2027") },
      { when: "30. Apr–2. Mai 2027 · Melgaço", t: "Festa do Alvarinho e do Fumeiro", d: "Alvarinho und Räucherwaren im Norden. Eintritt frei.", tag: "Weinfest", url: g("Festa do Alvarinho e do Fumeiro Melgaço 2027"), start: "2027-04-30", end: "2027-05-02", place: "Complexo Desportivo Melsport", town: "Melgaço" },
      { when: "29. Mai 2027 · Quinta da Plansel", t: "Plansel Rosé Party", d: "Rosé, Musik und Sonnenuntergang auf unserem Weingut. 19,95 €.", tag: "Plansel", url: QUINTA, own: true, start: "2027-05-29", end: "2027-05-29", place: "Quinta da Plansel", town: "Montemor-o-Novo" },
      { when: "2.–3. Jul 2027 · Lamego", t: "Douro & Porto Wine Festival", d: "Douro-Weine und Portwein im Herzen des Tals.", tag: "Weinfest", url: g("Douro & Porto Wine Festival Lamego 2027"), start: "2027-07-02", end: "2027-07-03", place: "Lamego", town: "Lamego" },
      { when: "13.–19. Jul 2027 · Ponte de Lima", t: "Festa do Vinho Verde", d: "Eine Woche Vinho Verde in der ältesten Stadt Portugals.", tag: "Weinfest", url: g("Festa do Vinho Verde Ponte de Lima 2027"), start: "2027-07-13", end: "2027-07-19", place: "Ponte de Lima", town: "Ponte de Lima" },
      { when: "Mitte Sept 2027 · Peso da Régua", t: "Festa das Vindimas do Douro", d: "Das Lesefest am Douro.", tag: "Weinfest", url: g("Festa das Vindimas Peso da Régua 2027") }
    ],
    "Restaurant-Tipps": [
      { when: "Évora", t: "Restaurante Fialho", d: "Die Institution der Alentejo-Küche, mit großer regionaler Weinkarte.", tag: "Tipp", url: map("Restaurante Fialho Évora") },
      { when: "Vila Nova de Milfontes", t: "Tasca do Celso", d: "Fisch von der Alentejo-Küste und ein tiefer Weinkeller.", tag: "Tipp", url: map("Tasca do Celso Vila Nova de Milfontes") },
      { when: "Lissabon", t: "Taberna da Rua das Flores", d: "Kleine Petiscos, gute Gläser, keine Reservierung.", tag: "Tipp", url: map("Taberna da Rua das Flores Lisboa") },
      { when: "Porto", t: "Prova", d: "Weinbar mit portugiesischen Weinen glasweise.", tag: "Tipp", url: map("Prova wine bar Porto") },
      { ad: "Anzeige · 300 × 250" },
      { when: "Montemor-o-Novo", t: "Wine & Dine auf der Quinta da Plansel", d: "Menü mit Weinbegleitung zwischen den Reben.", tag: "Plansel", url: QUINTA, own: true }
    ],
    "International": [
      { when: "Feb 2027 · Paris", t: "Wine Paris", d: "Internationale Fachmesse. Portugal mit großem Länderstand.", tag: "Messe", url: "https://www.wineparis.com/" },
      { when: "März 2027 · Düsseldorf", t: "ProWein", d: "Wichtigste Weinmesse für den deutschsprachigen Markt.", tag: "Messe", url: "https://www.prowein.com/" },
      { when: "Apr 2027 · Verona", t: "Vinitaly", d: "Italiens Leitmesse, viele Einkäufer aus Übersee.", tag: "Messe", url: "https://www.vinitaly.com/" },
      { when: "Frühjahr 2027 · Neustadt/Weinstr.", t: "Mundus Vini", d: "Internationaler Weinpreis des Meininger Verlags.", tag: "Award", url: "https://www.mundusvini.com/" },
      { when: "Mai 2027 · London", t: "London Wine Fair", d: "Treffpunkt des britischen Handels und der Sommeliers.", tag: "Messe", url: "https://www.londonwinefair.com/" }
    ],
    "Auf der Quinta": [
      { when: "29. Mai 2027", t: "Plansel Rosé Party", d: "Rosé, Musik und Sonnenuntergang auf unserem Weingut. 19,95 €.", tag: "Plansel", url: QUINTA, own: true },
      { when: "Sept 2027", t: "Vindima auf der Quinta da Plansel", d: "Lese mitmachen, Mittagessen zwischen den Reben.", tag: "Plansel", url: QUINTA, own: true },
      { when: "monatlich", t: "Masterclass Klone & Terroir", d: "Zwei Tage mit Rebschule, Labor und Keller.", tag: "Plansel", url: "mailto:info@planselwineschool.com", own: true },
      { when: "laufend", t: "WSET Level 1–3", d: "Sommelier-Kurse auf Portugiesisch und Englisch. Nächster Start auf Anfrage.", tag: "Wine School", url: "mailto:info@planselwineschool.com", own: true }
    ]
  };
  // Kompakter Kasten: links Portugal, rechts International und Restaurant-Tipps. Eine Zeile pro Eintrag.
  const LISTS = [["#ev-pt", "Portugal"], ["#ev-int", "International"], ["#ev-rest", "Restaurant-Tipps"]];
  function renderTabs() {
    LISTS.forEach(([sel, cat]) => {
      const ul = $(sel); if (!ul) return;
      ul.innerHTML = "";
      GUIDE[cat].forEach(e => {
        if (e.ad) return;
        const li = document.createElement("li"); li.className = "ev" + (e.own ? " ev--own" : "");
        const when = document.createElement("span"); when.className = "ev-when"; when.textContent = tr(e.when);
        const a = document.createElement("a"); a.className = "ev-t"; a.textContent = tr(e.t); a.href = e.url; a.title = tr(e.d);
        if (/^https?:/.test(e.url)) { a.target = "_blank"; a.rel = "noopener"; }
        li.append(when, a);
        ul.appendChild(li);
      });
    });
  }
  renderTabs();

  /* ---------- Event-Daten für Google (schema.org/Event), nur Termine mit festem Datum ---------- */
  function renderEventData() {
    const code = (window.PLANSEL_I18N && window.PLANSEL_I18N.lang) || "pt";
    const page = "https://www.plansel.com/" + code + "/";
    const events = GUIDE["Portugal"].filter(e => e.start).map(e => {
      const ev = {
        "@type": "Event", "name": tr(e.t), "description": tr(e.d),
        "startDate": e.start, "endDate": e.end || e.start,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": { "@type": "Place", "name": e.place, "address": { "@type": "PostalAddress", "addressLocality": e.town, "addressCountry": "PT" } },
        "url": /^https?:/.test(e.url) && !/google\./.test(e.url) ? e.url : page + "#events",
        "inLanguage": code
      };
      if (e.own) {
        ev.organizer = { "@type": "Organization", "name": "Quinta da Plansel", "url": "https://www.adega.plansel.com/" };
        const price = (e.d.match(/(\d+),(\d+)\s*€/) || []);
        if (price[0]) ev.offers = { "@type": "Offer", "price": price[1] + "." + price[2], "priceCurrency": "EUR", "url": e.url, "availability": "https://schema.org/InStock" };
      }
      return ev;
    });
    let s = document.getElementById("events-ld");
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "events-ld"; document.head.appendChild(s); }
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": events });
  }
  renderEventData();

  /* ---------- Event melden: Formular öffnet eine fertige E-Mail ---------- */
  const evForm = $("#ev-form");
  if (evForm) evForm.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(evForm);
    const body = [
      tr("Name des Events") + ": " + (d.get("name") || ""),
      tr("Datum") + ": " + (d.get("date") || ""),
      tr("Ort") + ": " + (d.get("place") || ""),
      tr("Link zum Event") + ": " + (d.get("link") || ""),
      tr("Ihre E-Mail") + ": " + (d.get("mail") || "")
    ].join("\n");
    location.href = "mailto:info@plansel.com?subject=" + encodeURIComponent(tr("Event für den Plansel Guide") + ": " + (d.get("name") || "")) + "&body=" + encodeURIComponent(body);
    const m = $("#ev-msg"); if (m) m.textContent = tr("Danke! Ihr E-Mail-Programm öffnet sich mit allen Angaben.");
  });

  /* ---------- Newsletter ---------- */
  let nlState = "";
  const NL = { bad: "Bitte eine gültige E-Mail-Adresse eingeben.", ok: "Entwurf: Hier würde jetzt die Bestätigungsmail (Double-Opt-in) verschickt." };
  $("#signup").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#nl-email"), msg = $("#nl-msg");
    if (!email.value || !email.checkValidity()) { nlState = "bad"; msg.style.color = "var(--gold)"; msg.textContent = tr(NL.bad); email.focus(); return; }
    nlState = "ok"; msg.style.color = ""; msg.textContent = tr(NL.ok);
  });

  /* ---------- Plansel Technology: KI-Karte tippt, was gerade erledigt wird ---------- */
  const AI_TASKS = [
    "Weinbeschreibung in 7 Sprachen übersetzt",
    "12 Gästeanfragen beantwortet",
    "Instagram-Beitrag aus 3 Fotos erstellt",
    "Belege für die Buchhaltung sortiert",
    "Newsletter für Donnerstag vorbereitet",
    "Weinempfehlung für einen Shop-Kunden"
  ];
  const aiLine = $("#ai-line"), aiBar = document.querySelector(".ai-bar");
  if (aiLine) {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ai = 0, aiTimer = null;
    const aiShow = () => {
      clearInterval(aiTimer);
      const text = "→ " + tr(AI_TASKS[ai % AI_TASKS.length]);
      aiBar.classList.remove("run"); void aiBar.offsetWidth; aiBar.classList.add("run");
      if (still) { aiLine.textContent = text; return; }
      let k = 0; aiLine.textContent = "";
      aiTimer = setInterval(() => { k += 1; aiLine.textContent = text.slice(0, k); if (k >= text.length) clearInterval(aiTimer); }, 32);
    };
    aiShow();
    // nur animieren, wenn die Karte sichtbar ist
    let aiLoop = null;
    const startLoop = () => { if (!aiLoop) aiLoop = setInterval(() => { ai++; aiShow(); }, 3600); };
    const stopLoop = () => { clearInterval(aiLoop); aiLoop = null; };
    if ("IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? startLoop() : stopLoop())).observe(aiLine);
    else startLoop();
    document.addEventListener("plansel:lang", aiShow);
  }

  /* ---------- Cookie-Hinweis: nur Information, keine Tracking-Cookies ---------- */
  let cookieOk = false;
  try { cookieOk = localStorage.getItem("plansel-cookie-ok") === "1"; } catch (e) {}
  let cookieBox = null;
  const renderCookie = () => {
    if (cookieOk) return;
    if (!cookieBox) { cookieBox = document.createElement("div"); cookieBox.className = "cookie-note"; cookieBox.setAttribute("role", "region"); cookieBox.setAttribute("aria-label", "Cookies"); cookieBox.dataset.dyn = ""; document.body.appendChild(cookieBox); }
    const priv = document.documentElement.dataset.staticLang ? "../privacidade.html" : "privacidade.html";
    cookieBox.innerHTML = "";
    const p = document.createElement("p"); p.style.margin = "0";
    p.append(tr("Wir verwenden keine Tracking-Cookies. Gespeichert wird nur Ihre Sprachwahl.") + " ");
    const a = document.createElement("a"); a.href = priv; a.textContent = tr("Mehr erfahren"); p.appendChild(a);
    const b = document.createElement("button"); b.type = "button"; b.textContent = tr("Verstanden");
    b.addEventListener("click", () => { cookieOk = true; try { localStorage.setItem("plansel-cookie-ok", "1"); } catch (e) {} cookieBox.remove(); });
    cookieBox.append(p, b);
  };
  renderCookie();

  /* ---------- Sprachwechsel: dynamische Teile neu zeichnen ---------- */
  document.addEventListener("plansel:lang", () => {
    renderQuestions();
    showAnswer(current, true);
    renderSomm();
    renderTabs();
    renderEventData();
    if (nlState) $("#nl-msg").textContent = tr(NL[nlState]);
    renderCookie();
  });

})();
