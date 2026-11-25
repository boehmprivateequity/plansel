/* Kopfzeile, auf allen index-Seiten gleich. Menü-Einträge stehen in _tmp/werkzeuge/kopf.pl */
(function () {
  const head = document.querySelector(".site-head"), nav = head && head.querySelector(".nav"), wrap = head && head.querySelector(".wrap"); if (!nav || !wrap) return;
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
  /* Handy-Menü */
  nav.id = nav.id || "site-nav";
  const b = document.createElement("button"); b.type = "button"; b.className = "nav-toggle"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", nav.id); b.setAttribute("aria-label", "Menu"); b.innerHTML = "<i></i><i></i>"; wrap.append(b);
  const open = on => { head.classList.toggle("nav-open", on); b.setAttribute("aria-expanded", String(on)); };
  b.addEventListener("click", () => open(!head.classList.contains("nav-open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) open(false); });
  document.addEventListener("click", e => { if (!head.contains(e.target)) open(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && head.classList.contains("nav-open")) { open(false); b.focus(); } });
  const lt = head.querySelector(".lang-toggle"); if (lt) lt.addEventListener("click", () => open(false));
})();

/* Ankommen von einer anderen Seite (z. B. index.html#weine): sofort an die Stelle, ohne langes Durchrollen */
(function () {
  const id = decodeURIComponent(location.hash.slice(1)), r = document.documentElement; if (!id || !document.getElementById(id)) return;
  r.style.scrollBehavior = "auto"; let touched = false; ["wheel", "touchstart", "keydown"].forEach(t => addEventListener(t, () => { touched = true; }, { once: true, passive: true }));
  const go = () => { if (!touched) document.getElementById(id).scrollIntoView(); };
  go(); addEventListener("load", () => { go(); setTimeout(() => { go(); r.style.scrollBehavior = ""; }, 400); });
})();
