/* Kopfzeile, auf allen index-Seiten gleich. Einträge stehen in _tmp/werkzeuge/kopf.pl */
(function () {
  const head = document.querySelector(".site-head.gn"), nav = head && head.querySelector(".gn-nav"), wrap = head && head.querySelector(".wrap"); if (!nav || !wrap) return;
  const wide = matchMedia("(min-width: 1000px)"), items = [...nav.querySelectorAll(".gn-list > li")];
  /* Seiten ohne Übersetzung (Styleguide): gleiche Sprachwahl, führt zur Startseite der Sprache */
  const box = document.getElementById("lang");
  if (box && !box.firstChild) {
    const L = [["en", "EN", "English"], ["pt", "PT", "Português"], ["de", "DE", "Deutsch"], ["fr", "FR", "Français"], ["es", "ES", "Español"], ["pl", "PL", "Polski"], ["it", "IT", "Italiano"], ["zh", "中文", "中文"]], cur = (document.documentElement.lang || "de").slice(0, 2);
    box.innerHTML = '<button type="button" class="lang-toggle" aria-expanded="false" aria-controls="lang-menu" aria-label="Sprache / Language"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c-5.5 5.5-5.5 12.5 0 18M12 3c5.5 5.5 5.5 12.5 0 18"/></svg><span class="lang-now">' + cur.toUpperCase() + '</span><i class="lang-chev" aria-hidden="true"></i></button><div class="lang-menu" id="lang-menu">' + L.map(l => '<button type="button" lang="' + l[0] + '" data-lang="' + l[0] + '" title="' + l[2] + '" aria-pressed="' + (l[0] === cur) + '"><span class="lc">' + l[1] + '</span><span class="ln">' + l[2] + "</span></button>").join("") + "</div>";
    const t = box.querySelector(".lang-toggle"), op = on => { box.classList.toggle("open", on); t.setAttribute("aria-expanded", String(on)); };
    t.addEventListener("click", () => op(!box.classList.contains("open"))); document.addEventListener("click", e => { if (!box.contains(e.target)) op(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("open")) { op(false); t.focus(); } });
    box.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => { op(false); if (b.dataset.lang === cur) return; try { localStorage.setItem("plansel-lang", b.dataset.lang); } catch (e) {} location.href = b.dataset.lang + "/index.html"; }));
  }
  const dim = document.createElement("div"); dim.className = "gn-dim"; document.body.append(dim);
  const tog = document.createElement("button"); tog.type = "button"; tog.className = "gn-toggle"; nav.id = nav.id || "site-nav"; tog.setAttribute("aria-controls", nav.id); tog.setAttribute("aria-expanded", "false"); tog.setAttribute("aria-label", "Menu"); tog.innerHTML = "<i></i><i></i>"; wrap.append(tog);
  let openLi = null, tIn, tOut;
  /* Computer: Untermenü unter der Leiste */
  function fly(li) {
    clearTimeout(tIn); clearTimeout(tOut); if (openLi === li) return;
    items.forEach(x => { const on = x === li, b = x.querySelector(".gn-x"); x.classList.toggle("on", on); if (b) b.setAttribute("aria-expanded", String(on)); });
    head.classList.toggle("gn-open", !!li); if (wide.matches) dim.classList.toggle("on", !!li); openLi = li;
  }
  const has = li => !!li.querySelector(".gn-fly");
  items.forEach(li => {
    const a = li.querySelector(":scope > a"), b = li.querySelector(".gn-x");
    li.addEventListener("pointerenter", e => { if (!wide.matches || e.pointerType === "touch") return; clearTimeout(tOut); clearTimeout(tIn); tIn = setTimeout(() => fly(has(li) ? li : null), openLi ? 60 : 140); });
    li.addEventListener("pointerleave", e => { if (!wide.matches || e.pointerType === "touch") return; clearTimeout(tIn); tOut = setTimeout(() => fly(null), 220); });
    let touch = false; a.addEventListener("pointerdown", e => { touch = e.pointerType === "touch"; });
    /* Tablet: erster Tipp öffnet, zweiter folgt dem Link */
    a.addEventListener("click", e => { if (wide.matches && touch && has(li) && openLi !== li) { e.preventDefault(); fly(li); } });
    if (b) b.addEventListener("click", () => fly(openLi === li ? null : li));
  });
  /* Handy: Menü über die ganze Seite */
  function menu(on) { head.classList.toggle("gn-full", on); tog.setAttribute("aria-expanded", String(on)); document.documentElement.style.overflow = on ? "hidden" : ""; if (!on) fly(null); }
  tog.addEventListener("click", () => menu(!head.classList.contains("gn-full")));
  nav.addEventListener("click", e => { const a = e.target.closest("a"); if (a && !e.defaultPrevented) { menu(false); fly(null); } });
  document.addEventListener("click", e => { if (!head.contains(e.target)) { fly(null); if (head.classList.contains("gn-full")) menu(false); } });
  head.addEventListener("focusout", e => { if (wide.matches && openLi && e.relatedTarget && !openLi.contains(e.relatedTarget)) fly(null); });
  document.addEventListener("keydown", e => { if (e.key !== "Escape") return; if (openLi) { const b = openLi.querySelector(".gn-x"), f = openLi.contains(document.activeElement); fly(null); if (f && b) b.focus(); } else if (head.classList.contains("gn-full")) { menu(false); tog.focus(); } });
  wide.addEventListener("change", () => { menu(false); dim.classList.remove("on"); });
  addEventListener("pageshow", () => { menu(false); fly(null); dim.classList.remove("on"); });
  const lt = head.querySelector(".lang-toggle"); if (lt) lt.addEventListener("click", () => { fly(null); menu(false); });
})();

/* Ankommen von einer anderen Seite (z. B. index.html#weine): sofort an die Stelle, ohne langes Durchrollen */
(function () {
  const id = decodeURIComponent(location.hash.slice(1)), r = document.documentElement; if (!id || !document.getElementById(id)) return;
  r.style.scrollBehavior = "auto"; let touched = false; ["wheel", "touchstart", "keydown"].forEach(t => addEventListener(t, () => { touched = true; }, { once: true, passive: true }));
  const go = () => { if (!touched) document.getElementById(id).scrollIntoView(); };
  go(); addEventListener("load", () => { go(); setTimeout(() => { go(); r.style.scrollBehavior = ""; }, 400); });
})();
