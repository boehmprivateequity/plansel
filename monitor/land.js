/* Weinwelt, Seite 04: Was ein Hektar Weinberg kostet. Daten: data/land.json (von Hand gepflegt) */
export async function loadLand() { try { const r = await fetch(new URL("data/land.json", import.meta.url).href, { cache: "no-cache" }); return r.ok ? await r.json() : null; } catch (e) { return null; } }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/* k: { C, tr, card, src, chart, table, bars, D, WINE, BLUE, GOLD } aus welt.js */
export function land(host, L, k) {
  if (!L) { host.innerHTML = `<p>${k.tr("Die Daten sind gerade nicht erreichbar.")}</p>`; return; }
  const { C, tr, card, src, chart, table, bars, D, WINE, BLUE, GOLD } = k, n = C.n, kf = L.kf, fr = L.fr, it = L.it, es = L.es, pt = L.pt;
  const usd = v => v >= 1e6 ? n(v / 1e6, 2) + " " + C.t("mn") + " $" : n(v) + " $", eur = v => v >= 1e6 ? n(v / 1e6, 1) + " " + C.t("mn") + " €" : n(v) + " €";
  const K = src(kf.src, kf.url, kf.per), F = src(fr.src, fr.url), E = src(es.src, es.url), I = src(it.src, it.url, String(it.per));
  const tile = (h, v, u) => `<section class="c c3 k"><h3><span>${h}</span></h3><div class="v">${v}</div><div class="u">${u}</div></section>`;
  /* Balken um eine Nulllinie */
  const diff = rows => { const m = Math.max(...rows.map(r => Math.abs(r[1]))); return `<div class="ld-df">${rows.map(r => `<div><span>${esc(r[0])}</span><i class="${r[1] < 0 ? "neg" : r[1] > 0 ? "pos" : ""}" style="--w:${(Math.abs(r[1]) / m * 50).toFixed(1)}%"></i><b>${r[1] > 0 ? "▲ " : r[1] < 0 ? "▼ " : ""}${C.pct(r[1])}</b></div>`).join("")}</div>`; };
  /* Spannen von–bis */
  const span = (rows, f, max) => `<div class="ld-sp">${rows.map(r => `<div title="${esc(r[0])}: ${f(r[1])} – ${f(r[2])}"><span>${esc(r[0])}</span><em><i style="left:${(r[1] / max * 100).toFixed(1)}%;width:${Math.max(1, (r[2] - r[1]) / max * 100).toFixed(1)}%"></i></em><b>${f(r[1])} – ${f(r[2])}</b></div>`).join("")}</div>`;
  /* Flächen: was eine Million Dollar kauft */
  const buy = kf.rows.map(r => [r[0], 1e6 / r[2]]).filter((_, i) => [0, 1, 5, 7, 9, 11, 13, 14].includes(i)), bm = Math.max(...buy.map(b => b[1]));
  const squares = `<div class="ld-sq">${buy.map(b => `<div><em><i style="--s:${(Math.sqrt(b[1] / bm) * 100).toFixed(1)}%"></i></em><b>${n(b[1], b[1] < 1 ? 2 : 1)} ha</b><span>${esc(b[0])}</span></div>`).join("")}</div>`;
  const top = kf.rows[0], low = kf.rows.at(-1), cog = fr.chg.at(-1);
  let h = '<div class="g">';
  h += tile(tr("Teuerste Region"), usd(top[2]), esc(top[0]) + " · " + tr("je Hektar"));
  h += tile(tr("Günstigste Region im Vergleich"), usd(low[2]), esc(low[0]) + " · " + tr("je Hektar"));
  h += tile(tr("Größter Preissturz 2025"), `<span class="ch dn">▼ ${C.pct(cog[1])}</span>`, esc(cog[0]));
  h += tile(tr("Mittlerer Verkauf in Frankreich"), eur(fr.median), tr("Median 2025, der Durchschnitt liegt bei") + " " + eur(fr.mean));
  h += card("c7 ww-wide", tr("Weinberge weltweit: Preis je Hektar"), tr("US-Dollar, Ende 2025, Richtwerte"), bars(kf.rows.map(r => [r[0], r[2]]), usd).replace('class="br"', 'class="br ld-br"'), K + table([tr("Region"), "US$ / ha", tr("1 Jahr")], kf.rows.map(r => [esc(r[0]), n(r[2]), C.pct(r[3])])));
  h += card("c5 ww-wide", tr("Veränderung in einem Jahr"), kf.per, diff([...kf.rows].map(r => [r[0], r[3]]).sort((a, b) => b[1] - a[1])), K);
  h += card("c12", tr("Was eine Million Dollar kauft"), tr("Fläche in Hektar, maßstäblich"), squares, K);
  h += card("c6 ww-wide", tr("Frankreich: Durchschnitt und Bordeaux"), tr("Euro je Hektar, Appellationsweine (AOP)"), chart([{ name: "France AOP", color: BLUE, pts: fr.years.map((y, i) => [y, fr.aop[i]]) }, { name: "Gironde (Bordeaux)", color: WINE, pts: fr.years.map((y, i) => [y, fr.gironde[i]]) }], { fmt: v => n(v) + " €", axis: v => n(v / 1000) + "k", label: tr("Frankreich: Durchschnitt und Bordeaux") }), F + src(fr.src, fr.url2, "2017–2024") + table([tr("Jahr"), "France AOP", "Gironde"], fr.years.map((y, i) => [y, n(fr.aop[i]), n(fr.gironde[i])])));
  h += card("c6 ww-wide", tr("Frankreich: Gewinner und Verlierer 2025"), tr("Preis je Hektar, Veränderung zum Vorjahr"), diff(fr.chg), F + src(fr.chgSrc, fr.chgUrl));
  h += card("c6 ww-wide", tr("Italien: Preisspannen"), tr("Euro je Hektar, von der günstigsten bis zur teuersten Lage"), span(it.rows, eur, Math.max(...it.rows.map(r => r[2]))), I);
  h += card("c6 ww-wide", tr("Spanien: sechs Jahre"), tr("Euro je Hektar, ohne Bewässerung"), chart([{ name: "La Rioja", color: WINE, pts: es.years.map((y, i) => [y, es.rioja[i]]) }, { name: "España", color: BLUE, pts: es.years.map((y, i) => [y, es.nat[i]]) }, { name: "Extremadura", color: GOLD, pts: es.years.map((y, i) => [y, es.ext[i]]) }], { fmt: v => n(v) + " €", axis: v => n(v / 1000) + "k", zero: 1, label: tr("Spanien: sechs Jahre") }), E);
  h += card("c6 ww-wide", tr("Iberien: Preis je Hektar"), tr("Spanien 2025 ohne Bewässerung, amtlich"), bars(es.rows.map(r => [r[0], r[1], r[0] === "Extremadura"]), eur), E);
  h += `<section class="c c6 ww-wide ld-al"><h2>${tr("Und in Portugal?")}</h2><p>${tr("Eine amtliche Preisstatistik für Weinberge haben wir in Portugal nicht gefunden.")}</p><dl><dt>${tr("Douro und Vinho Verde")}</dt><dd>${eur(pt.lo)} – ${eur(pt.hi)}<small>${tr("Spanne je Hektar laut Maklern, 2025")}</small></dd><dt>Extremadura</dt><dd>${eur(12401)}<small>${tr("amtlicher Wert 2025, direkt neben dem Alentejo")}</small></dd><dt>Alentejo</dt><dd>≈ 800 ha<small>${tr("in einem Jahr gerodet, von rund 23.000 Hektar")}</small></dd></dl>${src(pt.src, pt.url)}${src(pt.altSrc, pt.altUrl)}</section>`;
  if (D) { const o = D.oiv; h += card("c12", tr("Rebfläche der größten Länder"), tr("Tausend Hektar") + " · " + o.years.at(-1), bars(Object.keys(o.area).map(c => [C.land(c), o.area[c].at(-1), c === "PT"]).sort((a, b) => b[1] - a[1]), v => n(v)), src(o.src, o.url)); }
  host.innerHTML = h + `</div><p class="ww-note" style="margin-top:16px">${tr("Richtwerte, keine Angebote. Einzelne Lagen weichen stark ab. Bei ganzen Weingütern entscheiden Gebäude, Keller und Marke über den Preis.")}</p>`;
}
