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
  // Sprachseiten liegen in /de/, /en/ … und brauchen deshalb ../ vor dem Bildpfad
  const IMG = (document.documentElement.dataset.staticLang ? "../" : "") + "img/";
  const WINES = {
    tinto: { name: "Plansel Tinta Barroca", img: IMG + "garrafa-tinto.webp", type: "Tinto" },
    branco: { name: "Plansel Branco", img: IMG + "garrafa-branco.webp", type: "Branco" },
    rose: { name: "Plansel Rosé", img: IMG + "garrafa-rose.webp", type: "Rosé" }
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
     Stand: 25.11.2026. Wo es keine sichere offizielle Adresse gibt, führt der Link zur Suche. */
  const g = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
  const map = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const QUINTA = "https://www.adega.plansel.com/enoturismo";
  const MADEIRA = "https://visitmadeira.com/media/xxzmwfqk/calend%C3%A1rio-de-anima%C3%A7%C3%A3o-turistica_2026-2029_pt.pdf";
  const GUIDE = {
    "Portugal": [
      { start: "2026-11-25", t: "Prova e Jantar Vínico Quinta do Vesúvio", de: "Verkostung von vier Weinen aus mehreren Jahrgängen, danach Dinner.", tag: "Weindinner", h: "19:00", place: "Matriarca", town: "Porto", url: "https://www.matriarca.pt/events/prova-jantar-quinta-do-vesuvio" },
      { start: "2026-11-25", end: "2026-11-26", t: "Welcome Drink Quinta do Noval", de: "Am 25. in der Filiale Santa Justa, am 26. in der Filiale Conceição. Eintritt frei.", tag: "Verkostung", h: "16:00–20:00", place: "Garrafeira Nacional", town: "Lissabon", url: "https://pt.linkedin.com/posts/garrafeira-nacional_garrafeiranacional-welcomedrink-quintadonoval-activity-7528849623453437952-HkqO" },
      { start: "2026-11-26", t: "Prats & Symington: Chryseia", top: true, de: "Prats & Symington stellt die neuen Jahrgänge vor, darunter Chryseia und Post Scriptum 2024.", tag: "Verkostung", h: "19:00", place: "Imperial Botânico", town: "Lissabon", url: "https://garrafeiraimperial.com/event/ps-chryseia-imperial-botanico/" },
      { start: "2026-11-26", t: "Prova Comentada com Tiago Cabaço", de: "Sechs Weine aus Estremoz, vorgestellt vom Winzer selbst.", tag: "Verkostung", h: "18:30", place: "Arinto & Touriga", town: "Santarém", url: "https://vivaovinho.pt/eventos/prova-comentada-com-tiago-cabaco/" },
      { start: "2026-11-26", t: "Jantar Vínico Quinta da Vineadouro", de: "Douro-Weine zum Dinner, die Winzer sind dabei.", tag: "Weindinner", h: "19:30", place: "Olissippo Lapa Palace", town: "Lissabon", url: "https://vivaovinho.pt/eventos/jantar-vinico-quinta-da-vineadouro-7/" },
      { start: "2026-11-26", end: "2026-11-28", t: "Essência do Vinho Madeira", de: "Weinmesse mit Erzeugern und Önologen aus Madeira und ganz Portugal.", tag: "Verkostung", place: "Pestana Casino Park", town: "Funchal", url: "https://vivaovinho.pt/eventos/essencia-do-vinho-madeira-2026/" },
      { start: "2026-11-26", end: "2026-11-29", t: "Cozinha dos Ganhões", de: "Gastronomiefestival mit der Küche des Alentejo.", tag: "Gastronomie-Festival", place: "Parque de Feiras", town: "Estremoz", url: "https://cm-estremoz.pt/noticias/inscricoes-para-a-cozinha-dos-ganhoes2026" },
      { start: "2026-11-26", end: "2026-11-27", unsure: "26./27.", t: "Prova de Vinhos Fundação ADFP", de: "Zwei Quellen nennen verschiedene Tage. Bitte beim Lokal prüfen.", tag: "Verkostung", h: "18:00–20:30", place: "Binho Wine Bar", town: "Praia da Barra", url: "https://vivaovinho.pt/eventos/prova-de-vinhos-fundacao-adfp/" },
      { start: "2026-11-27", t: "Bonjardim Boutique Wines", de: "Sechs Weine mit kleinen Speisen.", tag: "Verkostung", h: "16:00–20:00", place: "República 14", town: "Olhão", url: "https://vivaovinho.pt/eventos/prova-de-vinhos-bonjardim-boutique-wines/" },
      { start: "2026-11-27", t: "Menin Douro Estates", de: "Die Douro-Weine des Hauses und seine alten Reben.", tag: "Masterclass", h: "18:30", place: "Garrafeira Nacional, Rua das Flores", town: "Porto", url: "https://vivaovinho.pt/eventos/masterclasses-gn-menin-douro-estates/" },
      { start: "2026-11-27", t: "José Maria da Fonseca: Cave da Bassaqueira", de: "Erster Abend einer neuen Dinnerreihe im Weinkeller, fünf Gänge.", tag: "Weindinner", h: "19:00", place: "Cave da Bassaqueira", town: "Azeitão", url: "https://diariodistrito.sapo.pt/jose-maria-da-fonseca-estreia-jantares-vinicos-na-cave-da-bassaqueira/" },
      { start: "2026-11-27", end: "2026-12-01", t: "Feira do Montado", top: true, de: "Fünf Tage rund um Kork und Korkeichen, mit Vorträgen, Gastronomie und Musik.", tag: "Kork", place: "Portel", town: "Portel", url: "https://odigital.sapo.pt/feira-montado-portel-2026-programa-completo/" },
      { start: "2026-11-28", t: "Provar é Saber: Enchidos e Presunto", de: "Weine des Alentejo mit Schinken und Wurst.", tag: "Verkostung", h: "10:00–13:00", place: "Sala Ogival, ViniPortugal", town: "Lissabon", url: "https://3cket.com/pt/event/provar-e-saber-sessao-azeite" },
      { start: "2026-11-28", t: "Enóphilo por um Dia", de: "Verkostungen, Workshops und Spiele rund um Wein.", tag: "Verkostung", h: "14:00–19:00", place: "Lagar de São Vicente", town: "Lissabon", url: "https://vivaovinho.pt/eventos/enophilo-por-um-dia/" },
      { start: "2026-11-28", t: "Wines & Spirits", de: "Große Verkostung von Weinen und Spirituosen.", tag: "Verkostung", h: "14:30–20:30", place: "Pousada de Viseu", town: "Viseu", url: "https://vivaovinho.pt/eventos/wines-spirits-2026/" },
      { start: "2026-11-28", t: "Enologia no Pico: vinhos brancos", de: "Vortrag des Weinbauinstituts der Azoren zur Weißweinbereitung.", tag: "Vortrag", place: "Pico, Açores", town: "Madalena", url: "https://www.radiopico.com/noticia/read/21356/instituto-da-vinha-e-do-vinho-dos-aores-promove-um-ciclo-de-quatro" },
      { start: "2026-11-28", t: "4 Estações", de: "Winterdinner mit Gastköchin Angelica Salvador.", tag: "Weindinner", h: "19:30", place: "Quinta do Paral", town: "Vidigueira", url: "https://pt.linkedin.com/posts/quinta-do-paral_no-dia-28-de-novembro-recebemos-quatro-convidados-activity-7524809280563298304-XPQV" },
      { start: "2026-11-28", t: "Voz, Vinho e Histórias", de: "Wein, Musik und Geschichten zum Abschluss des Weinmonats.", tag: "Musik", h: "21:30", place: "Taberna dos Arcos", town: "Vila de Frades", url: "https://bebida.pt/wine-events/feiras-de-vinho/mes-do-vinho-vidigueira-2026/" },
      { start: "2026-11-28", end: "2026-11-29", t: "Vinhos no Mercado: Especial de Natal", de: "Mehr als 30 Erzeuger aus zehn portugiesischen Regionen.", tag: "Verkostung", place: "Mercado Ferreira Borges", town: "Porto", url: "https://shtgn.live/pt-pt/festivals/vinhos-no-mercado-especial-de-natal" },
      { start: "2026-11-28", end: "2026-12-01", t: "Lisboa Wines Festival", de: "Erste Ausgabe, mit Weinen und Spezialitäten aus der Region Lissabon.", tag: "Weinfest", place: "Time Out Market", town: "Lissabon", url: "https://www.timeout.pt/time-out-market-lisboa/pt/coisas-para-fazer/lisboa-wines-festival" },
      { when: "4.–6. Dez 2026 · Vila de Frades", t: "VITIFRADES", top: true, d: "Fest der Talha-Weine aus der Amphore, im Alentejo bei Vidigueira.", tag: "Weinfest", url: "https://viladefrades.pt/index.php/component/content/article/1401-vitifrades-2026-a-grande-festa-do-vinho-de-talha?catid=8", start: "2026-12-04", end: "2026-12-06", place: "Vila de Frades", town: "Vidigueira" },
      { start: "2026-12-04", end: "2026-12-06", t: "Festa do Espumante de Melgaço", de: "21 Erzeuger und über 40 Schaumweine.", tag: "Weinfest", place: "Melgaço", town: "Melgaço", url: "https://www.radiovaledominho.com/melgaco-eis-os-produtores-que-vao-estar-na-festa-do-espumante-veja-como-tudo-vai-ficar/" },
      { start: "2026-12-05", t: "Enologia no Pico: vinhos licorosos", de: "Vortrag des Weinbauinstituts der Azoren zu Likörweinen.", tag: "Vortrag", place: "Pico, Açores", town: "Madalena", url: "https://www.radiopico.com/noticia/read/21356/instituto-da-vinha-e-do-vinho-dos-aores-promove-um-ciclo-de-quatro" },
      { start: "2026-12-05", end: "2026-12-06", t: "Festa do Vinho Independente: Xmas Edition", de: "20 unabhängige Erzeuger aus ganz Portugal.", tag: "Weinfest", h: "11:00–17:00", place: "Praça Beato", town: "Lissabon", url: "https://vivaovinho.pt/eventos/festa-do-vinho-independente-xmas-edition-26/" },
      { start: "2026-12-12", t: "Enologia no Pico: vinhos tintos", de: "Vortrag des Weinbauinstituts der Azoren zur Rotweinbereitung.", tag: "Vortrag", place: "Pico, Açores", town: "Madalena", url: "https://www.radiopico.com/noticia/read/21356/instituto-da-vinha-e-do-vinho-dos-aores-promove-um-ciclo-de-quatro" },
      { start: "2026-12-19", t: "Provar é Saber: Açordas", de: "Weine des Alentejo mit Açorda, der Brotsuppe der Region.", tag: "Verkostung", h: "10:00–13:00", place: "Sala Ogival, ViniPortugal", town: "Lissabon", url: "https://3cket.com/pt/event/provar-e-saber-sessao-azeite" },
      { start: "2026-12-19", t: "Feira de Natal Garrafeira Imperial", de: "Ausgewählte Erzeuger im Imperial Botânico.", tag: "Verkostung", h: "16:00–20:00", place: "Imperial Botânico", town: "Lissabon", url: "https://vivaovinho.pt/eventos/feira-de-natal-2026-garrafeira-imperial/" },
      { when: "16. Jan 2027 · Vidigueira", t: "Gala Europäische Weinstadt 2026", d: "Abschluss des Jahres als Europäische Weinstadt im Baixo Alentejo.", tag: "Gala", url: g("Cidade Europeia do Vinho 2026 Vidigueira gala encerramento"), start: "2027-01-16", end: "2027-01-16", place: "Vidigueira", town: "Vidigueira" },
      { start: "2027-01-29", end: "2027-01-30", unsure: "29./30.", t: "Provar é Saber: Carne de Porco", de: "Das Ticket nennt den 30., der Begleittext den 29. Januar. Bitte vor der Buchung prüfen.", tag: "Verkostung", h: "10:00–13:00", place: "Sala Ogival, ViniPortugal", town: "Lissabon", url: "https://3cket.com/pt/event/provar-e-saber-sessao-azeite" },
      { start: "2027-02-05", t: "Os Melhores do Ano 2026", de: "Preisverleihung der Revista de Vinhos.", tag: "Gala", place: "Alfândega do Porto", town: "Porto", url: "https://essenciadovinho.com/" },
      { when: "14.–21. Feb 2027 · Porto", t: "Wine & Travel Week", d: "Eine Woche Weintourismus mit Verkostungen in ganz Porto.", tag: "Messe", url: "https://www.winetravelweek.com/", start: "2027-02-14", end: "2027-02-21", place: "Porto", town: "Porto" },
      { start: "2027-02-15", end: "2027-02-17", t: "Lisbon Food Affair", de: "Fachmesse für Lebensmittel, Getränke, Gastronomie und Hotellerie.", tag: "Messe", place: "FIL", town: "Lissabon", url: "https://lisbonfoodaffair.fil.pt/" },
      { when: "18.–21. Feb 2027 · Porto", t: "Essência do Vinho", d: "Portugals große Publikumsverkostung im Palácio da Bolsa.", tag: "Verkostung", url: "https://thebluehub.pt/event/essencia-do-vinho-porto-2027", start: "2027-02-18", end: "2027-02-21", place: "Palácio da Bolsa", town: "Porto" },
      { when: "Ende Feb 2027 · Porto", sort: "2027-02-28", t: "Simplesmente Vinho", d: "Kleine Produzenten und Naturweine. Termin noch offen.", tag: "Verkostung", url: g("Simplesmente Vinho Porto 2027") },
      { start: "2027-03-03", end: "2027-03-07", t: "BTL Better Tourism Lisbon", de: "Tourismusmesse. Évora ist 2027 Gastgemeinde.", tag: "Messe", place: "FIL", town: "Lissabon", url: "https://www.turismodeportugal.pt/pt/agenda/Paginas/btl.aspx" },
      { start: "2027-04-05", end: "2027-04-07", t: "SAGALEXPO", de: "Exportmesse für portugiesische Produkte, auch Wein. Nur für Fachbesucher.", tag: "Messe", place: "FIL", town: "Lissabon", url: "https://exposalao.pt/pt/visitar/sagal_expo/lisboa2027" },
      { start: "2027-04-21", end: "2027-04-25", t: "Ovibeja", de: "Große Landwirtschaftsmesse des Alentejo.", tag: "Messe", place: "Beja", town: "Beja", url: "https://www.ovibeja.pt/index.php?categoria=1&go=home" },
      { when: "30. Apr–2. Mai 2027 · Melgaço", t: "Festa do Alvarinho e do Fumeiro", d: "Alvarinho und Räucherwaren im Norden. Eintritt frei.", tag: "Weinfest", url: g("Festa do Alvarinho e do Fumeiro Melgaço 2027"), start: "2027-04-30", end: "2027-05-02", place: "Complexo Desportivo Melsport", town: "Melgaço" },
      { when: "29. Mai 2027 · Quinta da Plansel", t: "Plansel Rosé Party", d: "Rosé, Musik und Sonnenuntergang auf unserem Weingut. 19,95 €.", tag: "Plansel", url: QUINTA, own: true, start: "2027-05-29", end: "2027-05-29", place: "Quinta da Plansel", town: "Montemor-o-Novo" },
      { when: "2.–3. Jul 2027 · Lamego", t: "Douro & Porto Wine Festival", d: "Douro-Weine und Portwein im Herzen des Tals.", tag: "Weinfest", url: g("Douro & Porto Wine Festival Lamego 2027"), start: "2027-07-02", end: "2027-07-03", place: "Lamego", town: "Lamego" },
      { when: "13.–19. Jul 2027 · Ponte de Lima", t: "Festa do Vinho Verde", d: "Eine Woche Vinho Verde in der ältesten Stadt Portugals.", tag: "Weinfest", url: g("Festa do Vinho Verde Ponte de Lima 2027"), start: "2027-07-13", end: "2027-07-19", place: "Ponte de Lima", town: "Ponte de Lima" },
      { start: "2027-08-22", end: "2027-09-12", t: "Festa do Vinho da Madeira", de: "Drei Wochen Weinfest rund um die Lese.", tag: "Weinfest", place: "Madeira", town: "Funchal", url: "https://www.visitmadeira.com/pt/a-acontecer/eventos/festa-do-vinho/" },
      { start: "2027-08-26", end: "2027-09-12", t: "Madeira Wine Lounge", de: "Wein-Lounge im Rahmen der Festa do Vinho.", tag: "Weinfest", place: "Madeira", town: "Madeira", url: MADEIRA },
      { start: "2027-09-04", end: "2027-09-12", days: [4, 5, 11, 12], t: "Concertos nas Vinhas", de: "Vier Konzerttage in den Weinbergen.", tag: "Musik", place: "Madeira", town: "Madeira", url: MADEIRA },
      { start: "2027-09-11", t: "Vindima ao Vivo", de: "Traditionelle Weinlese als eigener Programmtag.", tag: "Weinlese", place: "Madeira", town: "Estreito de Câmara de Lobos", url: MADEIRA },
      { when: "Mitte Sept 2027 · Peso da Régua", sort: "2027-09-20", t: "Festa das Vindimas do Douro", d: "Das Lesefest am Douro.", tag: "Weinfest", url: g("Festa das Vindimas Peso da Régua 2027") }
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
    "Weingläser & Kork": [
      { when: "Vila Nova de Gaia", t: "The Bridge Collection, WOW", d: "Sammlung historischer Trinkgefäße.", url: "https://www.wow.pt/en/" },
      { when: "São Brás de Alportel", t: "Besuch einer Korkfabrik", d: "Führung durch eine Korkfabrik an der Algarve.", url: "https://www.civitatis.com/pt/sao-bras-de-alportel/visita-fabrica-cortica/" }
    ],
    "Auf der Quinta": [
      { when: "29. Mai 2027", t: "Plansel Rosé Party", d: "Rosé, Musik und Sonnenuntergang auf unserem Weingut. 19,95 €.", tag: "Plansel", url: QUINTA, own: true },
      { when: "Sept 2027", t: "Vindima auf der Quinta da Plansel", d: "Lese mitmachen, Mittagessen zwischen den Reben.", tag: "Plansel", url: QUINTA, own: true },
      { when: "monatlich", t: "Masterclass Klone & Terroir", d: "Zwei Tage mit Rebschule, Labor und Keller.", tag: "Plansel", url: "mailto:info@planselwineschool.com", own: true },
      { when: "laufend", t: "WSET Level 1–3", d: "Sommelier-Kurse auf Portugiesisch und Englisch. Nächster Start auf Anfrage.", tag: "Wine School", url: "mailto:info@planselwineschool.com", own: true }
    ]
  };
  // Kompakter Kasten: links Portugal, rechts International, Restaurant-Tipps und Glas & Kork. Vergangene Termine fallen von selbst heraus.
  const LISTS = [["#ev-pt", "Portugal"], ["#ev-int", "International"], ["#ev-rest", "Restaurant-Tipps"], ["#ev-cork", "Weingläser & Kork"]];
  const SHOW = 9; let evAll = false;
  const langCode = () => (window.PLANSEL_I18N && window.PLANSEL_I18N.lang) || "de";
  const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Lisbon" });
  const key = e => e.start || e.sort || "9999";
  const upcoming = l => l.filter(e => (e.end || e.start || e.sort || "9999") >= today()).sort((a, b) => key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
  // Datum je Sprache aus start/end, z. B. „26.–28. Nov 2026“
  function when(e) {
    if (e.when) return tr(e.when);
    const l = langCode(), p = s => s.split("-").map(Number), [y, m, d] = p(e.start), [, m2, d2] = p(e.end || e.start), zh = l === "zh", dot = l === "de" ? "." : "";
    const mon = n => zh ? n + "月" : new Date(Date.UTC(2027, n - 1, 1)).toLocaleDateString(l === "en" ? "en-GB" : l, { month: "short", timeZone: "UTC" }).replace(l === "de" ? "." : /^$/, "");
    let s;
    const day = e.unsure ? (l === "de" ? e.unsure : e.unsure.replace(/\./g, "")) : e.days ? e.days.join(dot + (zh ? "、" : ", ")) + dot : m === m2 && d2 !== d ? d + dot + "–" + d2 + dot : m === m2 ? d + dot : "";
    if (day) s = zh ? y + "年" + mon(m) + day + "日" : day + " " + mon(m) + " " + y;
    else s = zh ? y + "年" + mon(m) + d + "日–" + mon(m2) + d2 + "日" : d + dot + " " + mon(m) + "–" + d2 + dot + " " + mon(m2) + " " + y;
    return s + " · " + tr(e.town);
  }
  const desc = e => e.d ? tr(e.d) : langCode() === "de" ? e.de : tr(e.tag) + " · " + e.place;
  function renderTabs() {
    LISTS.forEach(([sel, cat]) => {
      const ul = $(sel); if (!ul) return;
      const pt = cat === "Portugal", list = pt ? upcoming(GUIDE[cat]) : GUIDE[cat].filter(e => !e.ad);
      ul.innerHTML = "";
      list.forEach((e, i) => {
        const li = document.createElement("li"); li.className = "ev" + (e.own ? " ev--own" : "") + (pt && i >= SHOW ? " ev--more" : "");
        const w = document.createElement("span"); w.className = "ev-when"; w.textContent = when(e);
        const a = document.createElement("a"); a.className = "ev-t"; a.textContent = tr(e.t); a.href = e.url; a.title = desc(e);
        if (/^https?:/.test(e.url)) { a.target = "_blank"; a.rel = "noopener"; }
        const box = document.createElement("span"); box.append(a);
        if (pt && !e.own) {
          const sub = document.createElement("span"); sub.className = "ev-sub";
          if (e.top) { const b = document.createElement("b"); b.textContent = tr("Tipp"); sub.append(b, " · "); }
          sub.append([tr(e.tag), e.place && e.place !== e.town && !(e.when || "").includes(e.place) ? e.place : "", e.h, e.unsure ? tr("Datum bitte prüfen") : ""].filter(Boolean).join(" · "));
          box.append(sub);
        }
        li.append(w, box);
        ul.appendChild(li);
      });
      if (!pt) return;
      ul.classList.toggle("ev-list--all", evAll);
      const b = $("#ev-more"); if (!b) return;
      b.hidden = list.length <= SHOW; b.setAttribute("aria-expanded", String(evAll));
      b.textContent = evAll ? tr("Weniger Termine zeigen") : tr("Alle Termine zeigen") + " (" + list.length + ")";
    });
  }
  const evMore = $("#ev-more");
  if (evMore) evMore.addEventListener("click", () => { evAll = !evAll; renderTabs(); if (!evAll) $("#events").scrollIntoView(); });
  renderTabs();

  /* ---------- Event-Daten für Google (schema.org/Event), nur Termine mit festem Datum ---------- */
  function renderEventData() {
    const code = (window.PLANSEL_I18N && window.PLANSEL_I18N.lang) || "pt";
    const page = "https://www.plansel.com/" + code + "/";
    const events = upcoming(GUIDE["Portugal"]).filter(e => e.start && !e.days && !e.unsure).map(e => {
      const ev = {
        "@type": "Event", "name": tr(e.t), "description": desc(e),
        "startDate": e.start, "endDate": e.end || e.start,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": { "@type": "Place", "name": e.place, "address": { "@type": "PostalAddress", "addressLocality": e.town === "Lissabon" ? "Lisboa" : e.town, "addressCountry": "PT" } },
        "url": /^https?:/.test(e.url) && !/google\./.test(e.url) ? e.url : page + "#events",
        "inLanguage": code
      };
      if (e.own) {
        ev.organizer = { "@type": "Organization", "name": "Quinta da Plansel", "url": "https://www.adega.plansel.com/" };
        const price = ((e.d || "").match(/(\d+),(\d+)\s*€/) || []);
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

/* Sanftes Einblenden von Elementen mit Klasse .rv */
(function () {
  const els = document.querySelectorAll(".rv");
  if (!els.length) return;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach(e => io.observe(e));
})();

/* Einstieg im Apple-Stil: Scrollfortschritt als CSS-Variable --p (0 bis 1) */
(function () {
  const sec = document.querySelector(".ah");
  if (!sec || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const update = () => {
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / (span || 1)));
    sec.style.setProperty("--p", p.toFixed(4)); const hd = document.querySelector(".site-head"); if (hd) sec.style.setProperty("--hh", hd.offsetHeight + "px"); ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update); update();
})();

/* Zahlen zählen beim Hinscrollen hoch (Jahreszahlen bleiben stehen) */
(function () {
  const els = [...document.querySelectorAll(".facts .tnum")];
  if (!els.length || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const run = el => {
    const txt = el.textContent, m = txt.match(/\d[\d.,\s]*/);
    if (!m) return;
    const raw = m[0].trim(), digits = raw.replace(/[^\d]/g, ""), n = parseInt(digits, 10);
    if (!n || (digits.length === 4 && n >= 1900 && n <= 2100)) return;
    const sep = (raw.match(/[.,\s](?=\d{3}\b)/) || [""])[0];
    const fmt = v => sep ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(v);
    const pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length) || (m[0].endsWith(" ") ? " " : "");
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = k < 1 ? pre + fmt(Math.round(n * e)) + (m[0].endsWith(" ") ? " " : "") + post.trimStart() : txt;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
  els.forEach(e => io.observe(e));
})();

/* Global Wine Monitor: Vorschau erst laden, wenn sie in die Nähe kommt */
(function () {
  const g = document.getElementById("gwm"); if (!g) return;
  const go = () => import(new URL((document.documentElement.dataset.staticLang ? "../" : "") + "monitor/preview.js", location.href).href).then(m => m.mount(g)).catch(() => { g.hidden = true; });
  if (!("IntersectionObserver" in window)) return go();
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: "500px" }); io.observe(g);
})();
