/* Weinwelt (index4.html): Vergleich, Monitor, Aktien und Plansel Index */
import { load, ctx, counters, HL } from "./core.js";
import { plot } from "./chart.js";
import { mount, deep } from "./monitor.js";
const $ = i => document.getElementById(i), I18 = window.PLANSEL_I18N, tr = s => (I18 ? I18.tr(s) : s);
const lang = () => document.documentElement.dataset.staticLang || (I18 ? I18.lang : "de");
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const WINE = "#9b2a4e", BLUE = "#3f6fb0", GOLD = "#b3873f";
let D, S, CT, C, jobs = [], uid = 0;
async function stocks() { for (const p of ["live/stocks.json", "data/stocks.json"]) { try { const r = await fetch(new URL(p, import.meta.url).href, { cache: "no-cache" }); if (r.ok) { const j = await r.json(); if (j && j.index) return j; } } catch (e) {} } return null; }
const src = (n, u, p) => `<span class="src"><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a>${p ? " · " + esc(p) : ""}</span>`;
const card = (cls, h, sub, body, s) => `<section class="c ${cls}"><h2>${h}</h2><p class="sub">${sub}</p>${body}${s || ""}</section>`;
const lgd = a => `<div class="lgd">${a.map(s => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>`;
function chart(series, o = {}) {
  const id = "w" + (++uid), R = o.ranges; let cur = o.def || 0;
  jobs.push(() => { const h = $(id); if (!h) return; const btn = document.querySelectorAll(`[data-w=${id}] button`);
    const draw = () => { plot(h, series.map(s => ({ ...s, pts: cur ? s.pts.slice(-(cur * 12 + 1)) : s.pts })), o); btn.forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.r === cur))); };
    btn.forEach(b => b.onclick = () => { cur = +b.dataset.r; draw(); }); draw(); });
  return (R ? `<div class="rg" data-w="${id}">${R.map(r => `<button type="button" data-r="${r}">${r ? (r === 1 ? tr("1 Jahr") : r + " " + tr("Jahre")) : tr("10 Jahre")}</button>`).join("")}</div>` : "") + `<div id="${id}"></div>` + (series.length > 1 ? lgd(series) : "");
}
const table = (head, rows) => `<details class="src"><summary>${tr("Als Tabelle")}</summary><div class="ww-scroll"><table class="tb ww-num"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
const bars = (rows, f) => { const m = Math.max(...rows.map(r => r[1])); return `<div class="br">${rows.map(r => `<div class="${r[2] ? "pt" : ""}"><span>${esc(r[0])}</span><i style="--w:${(r[1] / m * 100).toFixed(1)}%"></i><b>${f(r[1])}</b></div>`).join("")}</div>`; };
const up = v => v == null ? "–" : `<span class="ch ${v >= 0 ? "up" : "dn"}">${v >= 0 ? "▲" : "▼"} ${C.pct(v)}</span>`;

/* ---------- Start: Live-Zähler ---------- */
function live() {
  const o = D.oiv, y = o.years.at(-1), e = tr("Schätzung, zählt live mit");
  $("ww-live").innerHTML = [["Menschen auf der Welt", "pop", "World Bank"], ["Heute getrunkene Flaschen Wein", "cbot", "OIV " + y], ["Dieses Jahr erzeugte Flaschen", "pbot", "OIV " + o.outlook.year]].map(x => `<div><small>${tr(x[0])}</small><b data-c="${x[1]}"></b><span>${e} · ${x[2]}</span></div>`).join("");
}

/* ---------- 02: Menschen und Wein im Vergleich ---------- */
function compare() {
  const o = D.oiv, li = o.years.length - 1, y = o.years[li], w = D.blocks.worldbank, pop = Object.fromEntries(w.pop), P = q => pop[q] || w.pop.at(-1)[1], f = D.blocks.fao, oS = src(o.src, o.url), n = C.n;
  const WB = p => src("World Bank", "https://data.worldbank.org/indicator/SP.POP.TOTL", p), FAO = src("FAO / Our World in Data", "https://ourworldindata.org/grapher/wine-production");
  const tile = (h, v, u) => `<section class="c c2 k"><h3><span>${h}</span></h3><div class="v">${v}</div><div class="u">${u}</div></section>`;
  let h = '<div class="g">';
  h += tile(tr("Konsum je Erdbewohner"), n(o.cons.World[li] * 1e8 / P(y), 1) + " l", tr("im Jahr") + " · " + y);
  h += tile(tr("Getrunken pro Sekunde"), n(o.cons.World[li] * 1e6 * HL / 31557600), tr("Flaschen") + " · " + y);
  h += tile(tr("Mehr erzeugt als getrunken"), n(o.prod.World[li] - o.cons.World[li]) + " mhl", "+" + n((o.prod.World[li] / o.cons.World[li] - 1) * 100, 1) + " % · " + y);
  h += tile(tr("Überquert eine Grenze"), n(o.world.expMhl / o.cons.World[li] * 100) + " %", tr("Export gemessen am Konsum") + " · " + y);
  h += tile(tr("Rebfläche je Mensch"), n(o.world.areaMha * 1e10 / P(y), 1) + " m²", y);
  h += tile(tr("Anteil Portugals"), n(o.prod.PT[li] / o.prod.World[li] * 100, 1) + " %", tr("der Weltproduktion") + " · " + y);
  if (f) {
    const fy = f.world.filter(a => pop[a[0]]), b = fy[0], z = fy.at(-1)[0], per = b[0] + "–" + z;
    const A = [{ name: tr("Weltbevölkerung"), color: BLUE, pts: fy.map(a => [a[0], pop[a[0]] / pop[b[0]] * 100]) }, { name: tr("Weinproduktion"), color: WINE, pts: fy.map(a => [a[0], a[1] / b[1] * 100]) }];
    h += card("c7 ww-wide", tr("Weltbevölkerung und Weinproduktion"), tr("Index") + ", " + b[0] + " = 100", chart(A, { fmt: v => n(v), label: tr("Weltbevölkerung und Weinproduktion"), zero: 1 }), FAO + WB(per) + table([tr("Jahr"), ...A.map(s => s.name)], A[0].pts.map((p, i) => [p[0], n(p[1]), n(A[1].pts[i][1])]).filter((_, i, a) => i % 5 === 0 || i === a.length - 1)));
    h += card("c5 ww-wide", tr("Wein je Erdbewohner"), tr("Erzeugte Menge in Kilogramm, ungefähr Liter"), chart([{ name: tr("Wein je Erdbewohner"), color: WINE, pts: fy.map(a => [a[0], a[1] * 1000 / pop[a[0]]]) }], { fmt: v => n(v, 1) + " kg", zero: 1, label: tr("Wein je Erdbewohner") }), FAO + WB(per));
  }
  const B3 = [{ name: tr("Weltbevölkerung"), color: BLUE, pts: o.years.map(q => [q, P(q) / P(o.years[0]) * 100]) }, { name: tr("Weinproduktion"), color: WINE, pts: o.years.map((q, i) => [q, o.prod.World[i] / o.prod.World[0] * 100]) }, { name: tr("Weinkonsum"), color: GOLD, pts: o.years.map((q, i) => [q, o.cons.World[i] / o.cons.World[0] * 100]) }];
  h += card("c6 ww-wide", tr("Bevölkerung, Produktion, Konsum"), tr("Index") + ", " + o.years[0] + " = 100", chart(B3, { fmt: v => n(v, 1), axis: v => n(v), label: tr("Bevölkerung, Produktion, Konsum") }), oS + WB(o.years[0] + "–" + y) + table([tr("Jahr"), ...B3.map(s => s.name)], o.years.map((q, i) => [q, ...B3.map(s => n(s.pts[i][1], 1))])));
  const pc = D.blocks.popc;
  if (pc) { const r = Object.keys(o.cons).filter(k => pc.c[k]).map(k => [C.land(k), o.cons[k][li] * 1e8 / pc.c[k][1], k === "PT"]).sort((a, b) => b[1] - a[1]); h += card("c6 ww-wide", tr("Wein pro Kopf"), tr("Liter im Jahr, alle Einwohner") + " · " + y, bars(r, v => n(v, 1) + " l"), oS + WB(pc.period)); }
  $("ww-cmp").innerHTML = h + "</div>";
}

/* ---------- 03: Aktien ---------- */
const G = { producers: "Weingüter", sparkling: "Champagner und Schaumwein", trading: "Weinhandel und Vertrieb", cork: "Kork und Verschlüsse", glass: "Flaschen und Glas", technology: "Keller- und Weinbautechnik", packaging: "Etiketten und Verpackung", groups: "Konzerne mit Weinsparte", more: "Weitere kleine Weinwerte", europe: "Europa", asia: "Asien" };
const EN = { producers: "Producers", sparkling: "Sparkling", trading: "Trading", cork: "Cork", glass: "Glass", technology: "Technology", packaging: "Packaging", europe: "Europe", asia: "Asia" };
const cap = v => v == null ? "–" : v >= 1000 ? C.n(v / 1000, v >= 1e5 ? 0 : 1) + " " + C.t("bn") + " €" : C.n(v, v < 10 ? 1 : 0) + " " + C.t("mn") + " €";
const rowsT = m => `<table class="tb ww-st"><thead><tr><th>${tr("Unternehmen")}</th><th>Yahoo</th><th>${tr("Börsenwert")}</th><th>${tr("1 Jahr")}</th></tr></thead><tbody>${m.map(x => `<tr><td>${esc(x.n)}<small>${esc(C.land(x.c))}</small></td><td><a href="https://finance.yahoo.com/quote/${encodeURIComponent(x.t)}" target="_blank" rel="noopener">${esc(x.t)}</a></td><td>${cap(x.cap)}</td><td>${up(x.y1)}</td></tr>`).join("")}</tbody></table>`;
function shares() {
  if (!S) { $("ww-stocks").innerHTML = `<p>${tr("Die Daten sind gerade nicht erreichbar.")}</p>`; return; }
  const day = S.groups.flatMap(g => g.m).map(x => x.capDay).filter(Boolean).sort().at(-1), more = S.groups.find(g => g.g === "more").m;
  $("ww-stocks").innerHTML = `<div class="ww-groups">${S.groups.filter(g => g.g !== "more").map(g => `<section class="c ww-g"><h2>${tr(G[g.g])}</h2><p class="sub">${g.idx ? tr("im Plansel Index") : tr("nicht im Index, Weinanteil zu klein oder unklar")}</p>${rowsT(g.m)}</section>`).join("")}</div>`
    + `<details class="ww-more"><summary>${tr(G.more)} (${more.length})</summary><div class="ww-groups">${[0, 1].map(k => `<section class="c ww-g">${rowsT(more.filter((_, i) => i % 2 === k))}</section>`).join("")}</div></details>`
    + `<p class="ww-note">${tr("Börsenwert in Euro umgerechnet, Veränderung über 12 Monate in Euro.")} ${tr("Quelle: ")}<a href="${esc(S.url)}" target="_blank" rel="noopener">${esc(S.src)}</a>, ${C.date(day || S.generated)}.</p>`;
}

/* ---------- 03: Plansel Global Wine Index ---------- */
function pgwi() {
  if (!S) return;
  const X = S.index, M = X.months, L = M.length - 1, n = C.n, mx = X.price.indexOf(Math.max(...X.price));
  const ch = (a, m) => { const b = a[L - m]; return b && a[L] ? (a[L] / b - 1) * 100 : null; };
  const ml = s => new Date(s + "-15T12:00Z").toLocaleDateString(C.loc, { month: "short", year: "numeric" });
  const line = (name, a, color) => ({ name, color, pts: M.map((m, i) => [m, a[i]]) });
  const se = [line("PGWI", X.price, WINE), line(tr("PGWI mit Dividenden"), X.total, GOLD)];
  if (X.world && X.world.length) se.push(line(tr("MSCI World (ETF IWDA, mit Dividenden)"), X.world, BLUE));
  const k = (h, v, u) => `<section class="c c3 k"><h3><span>${h}</span></h3><div class="v">${v}</div><div class="u">${u}</div></section>`;
  let h = `<div class="g">${k(tr("Aktueller Stand"), n(X.price[L]), tr("Punkte") + " · " + C.date(S.generated))}${k(tr("1 Jahr"), up(ch(X.price, 12)), tr("mit Dividenden") + " " + C.pct(ch(X.total, 12)))}${k(tr("10 Jahre"), up(ch(X.price, 120)), tr("mit Dividenden") + " " + C.pct(ch(X.total, 120)))}${k(tr("Höchster Monatsstand"), n(X.price[mx]), ml(M[mx]))}`;
  h += card("c12", "Plansel Global Wine Index", tr("Monatsstände, Punkte"), chart(se, { fmt: v => n(v), xf: ml, ranges: [1, 3, 5, 0], label: "PGWI" }), table([tr("Monat"), ...se.map(s => s.name)], M.map((m, i) => i).filter(i => i % 12 === 0 || i === L).map(i => [ml(M[i]), ...se.map(s => s.pts[i][1] == null ? "–" : n(s.pts[i][1]))])));
  const fam = [["PGWI Global", X.price, tr("Gesamte Weinwirtschaft")], ...Object.keys(G).filter(g => X.sub[g]).map(g => ["PGWI " + EN[g], X.sub[g], tr(G[g])])];
  h += `<section class="c c8"><h2>${tr("Die Index-Familie")}</h2><p class="sub">${tr("Ohne Dividenden, in Euro")}</p><div class="ww-scroll"><table class="tb ww-fam"><thead><tr><th>Index</th><th>${tr("Stand")}</th><th>${tr("1 Jahr")}</th><th>5 ${tr("Jahre")}</th><th>${tr("10 Jahre")}</th></tr></thead><tbody>${fam.map(x => `<tr><td><b>${x[0]}</b><small>${x[2]}</small></td><td>${n(x[1][L])}</td><td>${up(ch(x[1], 12))}</td><td>${up(ch(x[1], 60))}</td><td>${up(ch(x[1], 120))}</td></tr>`).join("")}</tbody></table></div></section>`;
  const gs = S.groups.filter(g => g.idx), tot = gs.reduce((a, g) => a + g.m.length, 0);
  h += card("c4", tr("Gewicht der Branchen"), tr("Aktien im Index") + ": " + S.members, bars(gs.map(g => [tr(G[g.g]), g.m.length / tot * 100]).sort((a, b) => b[1] - a[1]), v => n(v) + " %"), `<p class="sub" style="margin-top:12px">${tr("Alle Aktien zählen gleich viel, rund 2 %. Alle drei Monate wird neu gewichtet.")}</p>`);
  $("ww-index").innerHTML = h + `</div><div class="ww-method"><p><b>${tr("So wird gerechnet")}.</b> ${tr("Monatskurse in Euro, gleich gewichtet. Eine Aktie kommt dazu, sobald es Kurse von ihr gibt.")} ${tr("Die Rückrechnung nutzt die heutige Auswahl. Unternehmen, die inzwischen von der Börse verschwunden sind, fehlen. Das macht die Vergangenheit etwas schöner, als sie war.")}</p><p>${tr("Viele Mitglieder leben nur zum Teil vom Wein, zum Beispiel Glas-, Verpackungs- und Maschinenhersteller.")} <b>${tr("Der Index dient der Information. Er ist keine Anlageberatung und kein Angebot.")}</b></p></div>`;
}

function all() { jobs = []; uid = 0; C = ctx(lang()); if (D) { live(); compare(); mount($("ww-mon"), D, lang()); } if ($("ww-stocks")) { shares(); pgwi(); } jobs.forEach(j => j()); }
const tick = () => { if (document.hidden || !CT) return; const now = Date.now(); document.querySelectorAll("[data-c]").forEach(e => { const c = CT[e.dataset.c]; if (c) e.textContent = C.n(Math.floor(c.f(now))); }); };
const jump = () => { const e = $(deep() ? "monitor" : location.hash.slice(1)); if (e) e.scrollIntoView({ behavior: "instant" }); };
(async () => {
  [D, S] = await Promise.all([load().catch(() => null), $("ww-stocks") ? stocks() : null]);
  if (D) CT = counters(D); else { C = ctx(lang()); $("ww-cmp").textContent = tr("Die Daten sind gerade nicht erreichbar."); }
  all(); tick(); setInterval(tick, 1000); if (location.hash) jump();
  document.addEventListener("plansel:lang", () => { all(); tick(); });
  let w = innerWidth, z; addEventListener("resize", () => { clearTimeout(z); z = setTimeout(() => { if (Math.abs(innerWidth - w) > 80) { w = innerWidth; all(); tick(); } }, 250); });
})();
