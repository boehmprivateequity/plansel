/* Plansel Styleguide: Downloads, Farbwerte kopieren, Mindestgröße, Einblenden */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Downloads. Neue Dateien hier eintragen: [Datei, Titel, Angabe, Gruppe] */
  const LOGOS = [
    ["plansel-wappen-gold.svg", "Wappen Gold", "SVG"], ["plansel-wappen-schwarz.svg", "Wappen Schwarz", "SVG"],
    ["plansel-wappen-weiss.svg", "Wappen Weiß", "SVG", "dark"], ["plansel-wappen-klein-gold.svg", "Wappen kräftig", "SVG, kleine Größen"],
    ["plansel-logo-farbe.png", "Logo Farbe", "PNG, transparent"], ["plansel-logo-schwarz.png", "Logo Schwarz", "PNG, transparent"],
    ["plansel-logo-weiss.png", "Logo Weiß", "PNG, transparent", "dark"], ["plansel-wappen-klein-weiss.svg", "Wappen kräftig weiß", "SVG, kleine Größen", "dark"]
  ];
  const PHOTOS = [
    ["plansel-quinta-luftbild.jpg", "Luftbild der Quinta", "1800 × 1198 px", "quinta"], ["plansel-weinberg-herbst.jpg", "Weinberg im Herbst", "1800 × 1350 px", "reben"],
    ["plansel-landschaft-quinta.jpg", "Quinta in der Landschaft", "1800 × 1199 px", "quinta"], ["plansel-gutshaus.jpg", "Gutshaus", "1800 × 1199 px", "quinta"],
    ["plansel-einfahrt-quinta.jpg", "Einfahrt mit Palmen", "1422 × 1800 px", "quinta"], ["plansel-rebzeile.jpg", "Rebzeile", "1800 × 1200 px", "reben"],
    ["plansel-lese-detail.jpg", "Trauben im Bottich", "1800 × 1200 px", "wein"], ["plansel-pfropfreben.jpg", "Pfropfreben", "1600 × 1066 px", "reben"],
    ["plansel-flasche-tinto.png", "Flasche Tinta Barroca", "1000 × 1000 px, Ausschnitt", "wein", "c"], ["plansel-flasche-branco.png", "Flasche Branco", "1000 × 1000 px, Ausschnitt", "wein", "c"],
    ["plansel-flasche-rose.png", "Flasche Rosé", "999 × 992 px, Ausschnitt", "wein", "c"]
  ];
  const item = (dir, f, t, info, cls, grp) => `<div class="sg-item"${grp ? ` data-g="${grp}"` : ""}><div class="pv ${cls || ""}"><img src="marke/${dir}/${f}" alt="${t}" loading="lazy"></div><div class="tx"><span>${t}<small>${info}</small></span><a href="marke/${dir}/${f}" download aria-label="${t} herunterladen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 11l4.5 4.5L16.5 11M5 20h14"/></svg></a></div></div>`;
  $("#sg-logos").innerHTML = LOGOS.map(([f, t, i, c]) => item("logo", f, t, i, c)).join("");
  $("#sg-photos").innerHTML = PHOTOS.map(([f, t, i, g, c]) => item("fotos", f, t, i, c, g)).join("");
  $$(".sg-filter button").forEach(b => b.addEventListener("click", () => {
    $$(".sg-filter button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    $$("#sg-photos .sg-item").forEach(x => { x.hidden = b.dataset.f !== "alle" && x.dataset.g !== b.dataset.f; });
  }));
  $$("[data-size]").forEach(async el => {
    try { const r = await fetch(el.dataset.size, { method: "HEAD" }); const n = +r.headers.get("content-length"); if (r.ok && n) el.textContent = "ZIP · " + (n / 1048576).toFixed(1).replace(".", ",") + " MB"; } catch (e) {}
  });
  $("#sg-print").addEventListener("click", () => print());
  addEventListener("beforeprint", () => { $$(".sg-sheet").forEach(s => s.classList.add("in")); $$("img[loading=lazy]").forEach(i => { i.loading = "eager"; }); });

  /* Farbwert kopieren */
  const toast = $(".sg-toast"); let t0;
  const say = m => { toast.textContent = m; toast.classList.add("on"); clearTimeout(t0); t0 = setTimeout(() => toast.classList.remove("on"), 1600); };
  $$(".sg-col button").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.hex); say(b.dataset.hex + " kopiert"); } catch (e) { say(b.dataset.hex); }
  }));

  /* Mindestgröße: ab 35 mm mit Zusatz, ab 20 mm ohne Zusatz, darunter nur das Wappen */
  const rng = $("#sg-in"), lk = $("#sg-size");
  const size = () => {
    const mm = +rng.value; $("#sg-out").textContent = mm + " mm";
    lk.classList.toggle("nozusatz", mm < 35 && mm >= 20); lk.classList.toggle("nurwappen", mm < 20);
    lk.style.fontSize = (mm * 96 / 25.4 / (mm < 20 ? 4 : mm < 35 ? 8.4 : 9.1)) + "px";
  };
  rng.addEventListener("input", size); size();

  $(".sg-bc").addEventListener("click", e => e.currentTarget.classList.toggle("flip"));

  /* Einblenden, Fortschritt, aktives Kapitel */
  const sheets = $$(".sg-sheet");
  if (!("IntersectionObserver" in window) || still) sheets.forEach(s => s.classList.add("in"));
  else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -12% 0px" }); sheets.forEach(s => io.observe(s)); }
  const bar = $(".sg-progress"), links = $$(".sg-nav a"), head = $(".site-head"); let tick = false;
  const upd = () => {
    tick = false; bar.style.top = head.offsetHeight + "px";
    bar.style.setProperty("--pr", Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4));
    let cur = ""; sheets.forEach(s => { if (s.id && s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    links.forEach(a => a.classList.toggle("on", a.hash === "#" + cur));
  };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); addEventListener("resize", upd); upd();
})();
