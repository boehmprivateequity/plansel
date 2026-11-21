/* Sprachumschalter: EN · DE · PT · FR · ES · 中文 · PL
   Überschriften mit Schlüsseln (data-i18n) stehen hier, alle übrigen Texte in i18n-texts.js.
   Dynamische Teile (Sommelier, Archiv, Guide) übersetzt app.js über PLANSEL_I18N.tr(). */
window.PLANSEL_I18N = (function () {
  const LANGS = [
    ["en", "EN", "English"], ["de", "DE", "Deutsch"], ["pt", "PT", "Português"], ["fr", "FR", "Français"],
    ["es", "ES", "Español"], ["zh", "中文", "中文"], ["pl", "PL", "Polski"]
  ];
  const T = {
    en: {
      "nav.wines": "Wines", "nav.exp": "Experiences", "nav.academy": "Academy", "nav.science": "Science", "nav.guide": "Guide", "cta.shop": "Shop",
      "hero.eyebrow": "Alentejo · Portugal · since 1975",
      "hero.title": "Wines from the vines <em>Portugal grows on.</em>",
      "hero.text": "Every second winery in Portugal plants vines selected by Plansel. We make wine from the very best of them: fine Alentejo wines, backed by 50 years of research.",
      "hero.buy": "Discover the wines", "hero.book": "Visit the estate",
      "wine.eyebrow": "Quinta da Plansel · Wines", "wine.title": "Fine Portuguese wine. Traceable down to the vine.",
      "wine.lede": "Dorina, a Geisenheim-trained winemaker, has made wine from her father's vines since 1993. For every bottle we know which clone it came from.",
      "wine.shop": "View in shop →", "somm.title": "Which Plansel suits today?",
      "exp.title": "Top experiences, one hour from Lisbon.", "exp.lede": "Cellar tastings, wine & dine among the vines, stays at the quinta and the Plansel Gin Experience.", "exp.cta": "Book an experience",
      "acad.title": "Sommeliers learn where the wine is made.", "acad.lede": "Official WSET courses to the London standard, taught by WSET educator Wilmy Matton, winemaker Dorina Lindemann and visiting professors. Between nursery, lab and cellar.", "acad.cta": "Ask for course dates",
      "sci.eyebrow": "Plansel Science · The Böhm Archive", "sci.title": "The science behind every bottle.",
      "sci.lede": "Plansel stands for “Plantas Seleccionadas”. Behind the name is a research programme that works with universities and prepares Portugal's grape varieties for tomorrow's climate.",
      "sci.caption": "Appointed Comendador by the President of the Portuguese Republic in 2006",
      "guide.eyebrow": "Plansel Guide · new every week", "guide.title": "Where wine is happening now.", "guide.lede": "Fairs, tastings, wineries, restaurants and hotels. Curated by our team, sorted with AI, updated every Thursday.",
      "letter.eyebrow": "The Plansel Wine Letter · every Thursday", "letter.title": "Five minutes that expand your wine knowledge.", "letter.text": "Free, in your language. With content from the Wine School and the Böhm Archive.", "letter.submit": "Subscribe for free",
      "partner.title": "Who we work with.", "wine.dorina": "The wine visionary", "wine.wa": "Message Dorina"
    },
    pt: {
      "nav.wines": "Vinhos", "nav.exp": "Experiências", "nav.academy": "Academia", "nav.science": "Ciência", "nav.guide": "Guia", "cta.shop": "Loja",
      "hero.eyebrow": "Alentejo · Portugal · desde 1975",
      "hero.title": "Vinhos das videiras que <em>fazem Portugal.</em>",
      "hero.text": "Uma em cada duas adegas em Portugal planta videiras selecionadas pela Plansel. Com as melhores fazemos o nosso vinho: vinhos alentejanos de gama alta, apoiados por 50 anos de investigação.",
      "hero.buy": "Descobrir os vinhos", "hero.book": "Visitar a Quinta",
      "wine.eyebrow": "Quinta da Plansel · Vinhos", "wine.title": "Vinho português de gama alta. Rastreável até à videira.",
      "wine.lede": "Dorina, enóloga formada em Geisenheim, faz vinho a partir das videiras do pai desde 1993. Sabemos de que clone vem cada garrafa.",
      "wine.shop": "Ver na loja →", "somm.title": "Que Plansel combina hoje?",
      "exp.title": "Experiências de topo, a uma hora de Lisboa.", "exp.lede": "Provas na adega, Wine & Dine entre as vinhas, alojamento na Quinta e a Plansel Gin Experience.", "exp.cta": "Reservar experiência",
      "acad.title": "Os sommeliers aprendem onde o vinho nasce.", "acad.lede": "Cursos oficiais WSET segundo o padrão de Londres, com a formadora WSET Wilmy Matton, a enóloga Dorina Lindemann e professores convidados. Entre viveiro, laboratório e adega.", "acad.cta": "Pedir datas dos cursos",
      "sci.eyebrow": "Plansel Science · O Arquivo Böhm", "sci.title": "A ciência por trás de cada garrafa.",
      "sci.lede": "Plansel significa «Plantas Seleccionadas». Por trás do nome está um programa de investigação que trabalha com universidades e prepara as castas portuguesas para o clima de amanhã.",
      "sci.caption": "Nomeado Comendador pelo Presidente da República Portuguesa em 2006",
      "guide.eyebrow": "Guia Plansel · novo todas as semanas", "guide.title": "Onde o vinho está a acontecer.", "guide.lede": "Feiras, provas, adegas, restaurantes e hotéis. Selecionados pela nossa equipa, organizados com IA, atualizados todas as quintas-feiras.",
      "letter.eyebrow": "The Plansel Wine Letter · todas as quintas-feiras", "letter.title": "Cinco minutos que alargam o seu conhecimento de vinho.", "letter.text": "Gratuito, na sua língua. Com conteúdos da Wine School e do Arquivo Böhm.", "letter.submit": "Subscrever grátis",
      "partner.title": "Com quem trabalhamos.", "wine.dorina": "A visionária do vinho", "wine.wa": "Escrever à Dorina"
    },
    fr: {
      "nav.wines": "Vins", "nav.exp": "Expériences", "nav.academy": "Académie", "nav.science": "Science", "nav.guide": "Guide", "cta.shop": "Boutique",
      "hero.eyebrow": "Alentejo · Portugal · depuis 1975",
      "hero.title": "Des vins issus des vignes qui <em>font le Portugal.</em>",
      "hero.text": "Un domaine sur deux au Portugal plante des vignes sélectionnées par Plansel. Avec les meilleures, nous faisons notre propre vin : des vins haut de gamme de l'Alentejo, fondés sur 50 ans de recherche.",
      "hero.buy": "Découvrir les vins", "hero.book": "Visiter le domaine",
      "wine.eyebrow": "Quinta da Plansel · Vins", "wine.title": "Vin portugais haut de gamme. Traçable jusqu'au cep.",
      "wine.lede": "Dorina, œnologue formée à Geisenheim, vinifie les vignes de son père depuis 1993. Pour chaque bouteille, nous savons de quel clone elle provient.",
      "wine.shop": "Voir en boutique →", "somm.title": "Quel Plansel pour aujourd'hui ?",
      "exp.title": "Des expériences d'exception, à une heure de Lisbonne.", "exp.lede": "Dégustations en cave, Wine & Dine entre les vignes, séjours à la Quinta et la Plansel Gin Experience.", "exp.cta": "Réserver une expérience",
      "acad.title": "Les sommeliers apprennent là où naît le vin.", "acad.lede": "Cours officiels WSET selon le standard de Londres, avec la formatrice WSET Wilmy Matton, l'œnologue Dorina Lindemann et des professeurs invités. Entre pépinière, laboratoire et cave.", "acad.cta": "Demander les dates",
      "sci.eyebrow": "Plansel Science · Les archives Böhm", "sci.title": "La science derrière chaque bouteille.",
      "sci.lede": "Plansel signifie « Plantas Seleccionadas ». Derrière ce nom se trouve un programme de recherche mené avec des universités, qui prépare les cépages portugais au climat de demain.",
      "sci.caption": "Nommé Comendador par le Président de la République portugaise en 2006",
      "guide.eyebrow": "Guide Plansel · nouveau chaque semaine", "guide.title": "Là où le vin se passe.", "guide.lede": "Salons, dégustations, domaines, restaurants et hôtels. Sélectionnés par notre équipe, triés avec l'IA, mis à jour chaque jeudi.",
      "letter.eyebrow": "The Plansel Wine Letter · chaque jeudi", "letter.title": "Cinq minutes pour enrichir votre culture du vin.", "letter.text": "Gratuit, dans votre langue. Avec des contenus de la Wine School et des archives Böhm.", "letter.submit": "S'abonner gratuitement",
      "partner.title": "Nos partenaires.", "wine.dorina": "La visionnaire du vin", "wine.wa": "Écrire à Dorina"
    },
    es: {
      "nav.wines": "Vinos", "nav.exp": "Experiencias", "nav.academy": "Academia", "nav.science": "Ciencia", "nav.guide": "Guía", "cta.shop": "Tienda",
      "hero.eyebrow": "Alentejo · Portugal · desde 1975",
      "hero.title": "Vinos de las cepas que <em>hacen Portugal.</em>",
      "hero.text": "Una de cada dos bodegas de Portugal planta cepas seleccionadas por Plansel. Con las mejores elaboramos nuestro propio vino: vinos alentejanos de alta gama, respaldados por 50 años de investigación.",
      "hero.buy": "Descubrir los vinos", "hero.book": "Visitar la Quinta",
      "wine.eyebrow": "Quinta da Plansel · Vinos", "wine.title": "Vino portugués de alta gama. Trazable hasta la cepa.",
      "wine.lede": "Dorina, enóloga formada en Geisenheim, elabora vino con las cepas de su padre desde 1993. De cada botella sabemos de qué clon procede.",
      "wine.shop": "Ver en la tienda →", "somm.title": "¿Qué Plansel va con hoy?",
      "exp.title": "Experiencias únicas, a una hora de Lisboa.", "exp.lede": "Catas en bodega, Wine & Dine entre viñedos, alojamiento en la Quinta y la Plansel Gin Experience.", "exp.cta": "Reservar experiencia",
      "acad.title": "Los sumilleres aprenden donde nace el vino.", "acad.lede": "Cursos oficiales WSET según el estándar de Londres, con la formadora WSET Wilmy Matton, la enóloga Dorina Lindemann y profesores invitados. Entre vivero, laboratorio y bodega.", "acad.cta": "Consultar fechas",
      "sci.eyebrow": "Plansel Science · El archivo Böhm", "sci.title": "La ciencia detrás de cada botella.",
      "sci.lede": "Plansel significa «Plantas Seleccionadas». Detrás del nombre hay un programa de investigación que trabaja con universidades y prepara las variedades portuguesas para el clima de mañana.",
      "sci.caption": "Nombrado Comendador por el Presidente de la República Portuguesa en 2006",
      "guide.eyebrow": "Guía Plansel · novedades cada semana", "guide.title": "Donde el vino está pasando.", "guide.lede": "Ferias, catas, bodegas, restaurantes y hoteles. Seleccionados por nuestro equipo, ordenados con IA, actualizados cada jueves.",
      "letter.eyebrow": "The Plansel Wine Letter · cada jueves", "letter.title": "Cinco minutos que amplían su conocimiento del vino.", "letter.text": "Gratis, en su idioma. Con contenidos de la Wine School y del archivo Böhm.", "letter.submit": "Suscribirse gratis",
      "partner.title": "Con quién trabajamos.", "wine.dorina": "La visionaria del vino", "wine.wa": "Escribir a Dorina"
    },
    zh: {
      "nav.wines": "葡萄酒", "nav.exp": "体验", "nav.academy": "学院", "nav.science": "科学", "nav.guide": "指南", "cta.shop": "商店",
      "hero.eyebrow": "阿连特茹 · 葡萄牙 · 始于1975年",
      "hero.title": "源自<em>成就葡萄牙</em>的葡萄藤",
      "hero.text": "葡萄牙每两家酒庄中就有一家种植Plansel选育的葡萄藤。我们用其中最好的酿造自己的葡萄酒：来自阿连特茹的高端葡萄酒，以50年的研究为基础。",
      "hero.buy": "探索葡萄酒", "hero.book": "参观酒庄",
      "wine.eyebrow": "Quinta da Plansel · 葡萄酒", "wine.title": "葡萄牙高端葡萄酒，可追溯至每一株葡萄藤。",
      "wine.lede": "毕业于盖森海姆大学的酿酒师Dorina自1993年起用父亲的葡萄藤酿酒。每一瓶酒，我们都知道它来自哪个克隆品系。",
      "wine.shop": "在商店查看 →", "somm.title": "今天适合哪款Plansel？",
      "exp.title": "顶级体验，距里斯本仅一小时。", "exp.lede": "酒窖品鉴、葡萄园晚宴、酒庄住宿以及Plansel金酒体验。", "exp.cta": "预订体验",
      "acad.title": "侍酒师在葡萄酒诞生的地方学习。", "acad.lede": "按伦敦标准开设的WSET官方课程，由WSET讲师Wilmy Matton、酿酒师Dorina Lindemann及客座教授授课，课堂就在苗圃、实验室和酒窖之间。", "acad.cta": "咨询课程日期",
      "sci.eyebrow": "Plansel Science · Böhm档案", "sci.title": "每一瓶酒背后的科学。",
      "sci.lede": "Plansel意为“精选植物”（Plantas Seleccionadas）。这个名字背后是一项与大学合作的研究计划，为葡萄牙的葡萄品种应对未来气候做准备。",
      "sci.caption": "2006年由葡萄牙共和国总统授予Comendador勋衔",
      "guide.eyebrow": "Plansel指南 · 每周更新", "guide.title": "葡萄酒世界正在发生什么。", "guide.lede": "展会、品鉴会、酒庄、餐厅和酒店。由我们的团队精选，借助AI整理，每周四更新。",
      "letter.eyebrow": "Plansel葡萄酒周刊 · 每周四", "letter.title": "五分钟，拓展您的葡萄酒知识。", "letter.text": "免费，使用您的语言。内容来自葡萄酒学校和Böhm档案。", "letter.submit": "免费订阅",
      "partner.title": "我们的合作伙伴。", "wine.dorina": "葡萄酒远见者", "wine.wa": "给Dorina发消息"
    },
    pl: {
      "nav.wines": "Wina", "nav.exp": "Doświadczenia", "nav.academy": "Akademia", "nav.science": "Nauka", "nav.guide": "Przewodnik", "cta.shop": "Sklep",
      "hero.eyebrow": "Alentejo · Portugalia · od 1975",
      "hero.title": "Wina z winorośli, na których <em>rośnie Portugalia.</em>",
      "hero.text": "Co druga winnica w Portugalii sadzi winorośl wyselekcjonowaną przez Plansel. Z najlepszych robimy własne wino: wina z Alentejo z wyższej półki, oparte na 50 latach badań.",
      "hero.buy": "Odkryj wina", "hero.book": "Odwiedź winnicę",
      "wine.eyebrow": "Quinta da Plansel · Wina", "wine.title": "Portugalskie wino z wyższej półki. Z pochodzeniem aż do krzewu.",
      "wine.lede": "Dorina, enolożka wykształcona w Geisenheim, od 1993 roku robi wino z winorośli swojego ojca. O każdej butelce wiemy, z jakiego klonu pochodzi.",
      "wine.shop": "Zobacz w sklepie →", "somm.title": "Który Plansel pasuje na dziś?",
      "exp.title": "Wyjątkowe doświadczenia, godzinę od Lizbony.", "exp.lede": "Degustacje w piwnicy, Wine & Dine wśród winorośli, nocleg w Quinta i Plansel Gin Experience.", "exp.cta": "Zarezerwuj",
      "acad.title": "Sommelierzy uczą się tam, gdzie powstaje wino.", "acad.lede": "Oficjalne kursy WSET według londyńskiego standardu, prowadzone przez edukatorkę WSET Wilmy Matton, enolożkę Dorinę Lindemann i wykładowców gościnnych. Między szkółką, laboratorium a piwnicą.", "acad.cta": "Zapytaj o terminy",
      "sci.eyebrow": "Plansel Science · Archiwum Böhma", "sci.title": "Nauka stojąca za każdą butelką.",
      "sci.lede": "Plansel oznacza „Plantas Seleccionadas”. Za nazwą stoi program badawczy prowadzony z uniwersytetami, który przygotowuje portugalskie odmiany na klimat jutra.",
      "sci.caption": "Mianowany Comendadorem przez Prezydenta Republiki Portugalskiej w 2006 r.",
      "guide.eyebrow": "Przewodnik Plansel · co tydzień nowy", "guide.title": "Gdzie dzieje się wino.", "guide.lede": "Targi, degustacje, winnice, restauracje i hotele. Wybrane przez nasz zespół, uporządkowane z pomocą AI, aktualizowane w każdy czwartek.",
      "letter.eyebrow": "The Plansel Wine Letter · w każdy czwartek", "letter.title": "Pięć minut, które poszerzą Twoją wiedzę o winie.", "letter.text": "Bezpłatnie, w Twoim języku. Z treściami z Wine School i Archiwum Böhma.", "letter.submit": "Subskrybuj za darmo",
      "partner.title": "Z kim współpracujemy.", "wine.dorina": "Wizjonerka wina", "wine.wa": "Napisz do Doriny"
    }
  };

  // Deutsch = Originaltext im HTML
  const DE = {};
  document.querySelectorAll("[data-i18n]").forEach(el => { DE[el.dataset.i18n] = el.textContent; });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { DE[el.dataset.i18nHtml] = el.innerHTML; });

  // Alle übrigen Texte: Wörterbuch mit dem deutschen Text als Schlüssel (i18n-texts.js)
  const COLS = ["de", "en", "pt", "fr", "es", "zh", "pl"];
  const norm = s => s.replace(/\s+/g, " ").trim();
  const TX = {};
  COLS.forEach(c => { TX[c] = {}; });
  (window.PLANSEL_TEXTS || []).forEach(row => { COLS.forEach((c, i) => { if (row[i]) TX[c][norm(row[0])] = row[i]; }); });
  let lang = "de";
  // Übersetzt einen deutschen Text in die aktive Sprache (auch für app.js)
  const tr = s => (lang === "de" ? s : (TX[lang][norm(s)] ?? s));

  const SKIP = "script,style,#lang,select,[data-i18n],[data-i18n-html],[data-dyn]";
  const origText = new WeakMap();
  const ATTRS = ["alt", "placeholder", "aria-label", "title"];
  function translateDom() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (!n.parentElement || n.parentElement.closest(SKIP) || !n.textContent.trim()) ? 2 : 1
    });
    let n;
    while ((n = walker.nextNode())) {
      if (!origText.has(n)) origText.set(n, n.textContent);
      const src = origText.get(n), lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0];
      n.textContent = lang === "de" ? src : lead + tr(src) + trail;
    }
    document.querySelectorAll(ATTRS.map(a => "[" + a + "]").join(",")).forEach(el => {
      if (el.closest("#lang,[data-dyn]")) return;
      ATTRS.forEach(a => {
        if (!el.hasAttribute(a)) return;
        const key = "orig" + a.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, m => m.toUpperCase());
        if (!(key in el.dataset)) el.dataset[key] = el.getAttribute(a);
        el.setAttribute(a, tr(el.dataset[key]));
      });
    });
  }

  const box = document.getElementById("lang");
  function apply(code) {
    lang = code;
    const dict = code === "de" ? DE : Object.assign({}, DE, T[code]);
    document.querySelectorAll("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.textContent = v; });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { const v = dict[el.dataset.i18nHtml]; if (v) el.innerHTML = v; });
    translateDom();
    document.documentElement.lang = code === "zh" ? "zh-Hans" : code;
    document.dispatchEvent(new CustomEvent("plansel:lang", { detail: code }));
    box.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === code)));
    const sel = document.getElementById("nl-lang"); if (sel) sel.value = code;
    try { localStorage.setItem("plansel-lang", code); } catch (e) {}
  }
  // Feste Sprachseiten (/pt/, /en/ …) sind schon fertig übersetzt; der Umschalter wechselt dort die Seite.
  const staticLang = document.documentElement.dataset.staticLang || "";
  const save = code => { try { localStorage.setItem("plansel-lang", code); } catch (e) {} };
  LANGS.forEach(([code, label, name]) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.lang = code; b.textContent = label; b.title = name; b.lang = code;
    b.addEventListener("click", () => {
      if (staticLang) { if (code !== staticLang) { save(code); location.href = "../" + code + "/" + location.hash; } return; }
      apply(code);
    });
    box.appendChild(b);
  });

  if (staticLang) {
    lang = staticLang;
    box.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    const sel = document.getElementById("nl-lang"); if (sel) sel.value = lang;
  } else {
    // Quellseite: Portugiesisch ist Standard, sonst die zuletzt gewählte Sprache
    let start = "pt";
    try { start = localStorage.getItem("plansel-lang") || start; } catch (e) {}
    if (!T[start] && start !== "de") start = "pt";
    apply(start);
  }
  return { apply, tr, get lang() { return lang; }, LANGS: LANGS.map(l => l[0]) };
})();
