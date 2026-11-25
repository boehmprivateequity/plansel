/* Weinwelt, Startbereich 00: die wichtigsten Asset-Klassen als kompakte Tabelle. Daten: data/assets.json (scripts/assets.pl) */
export async function loadAssets() { for (const p of ["live/assets.json", "data/assets.json"]) { try { const r = await fetch(new URL(p, import.meta.url).href, { cache: "no-cache" }); if (r.ok) { const j = await r.json(); if (j && j.rows && j.rows.some(x => x.id === "cash")) return j; } } catch (e) {} } return null; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TEN = { oil: "Erdöl", bonds: "Anleihen", stocks: "Aktien", cash: "Cash (Fiat)", coal: "Kohle", gas: "Erdgas", gold: "Gold", btc: "Bitcoin" };
const KIND = { wealth: ["Vermögen", "#e58aa3"], money: ["Geldmenge", "#8fc1ec"], metal: ["Gold und Krypto", "#e3bd6a"], res: ["Bodenschatz", "#83c9a4"] };
const COLS = [["US", "USA"], ["CN", "China"], ["IN", "Indien"], ["EU", "EU"], ["JP", "Japan"]];
/* k: { C, tr } aus welt.js */
export function assets(host, A, k) {
  const { C, tr } = k, n = C.n;
  if (!A) { host.innerHTML = `<p>${tr("Die Daten sind gerade nicht erreichbar.")}</p>`; return; }
  const rows = A.rows.filter(r => TEN[r.id]).sort((a, b) => b.v - a.v), name = r => tr(TEN[r.id]);
  const num = v => { const x = v / 1e12; return x >= 100 ? n(x) : x >= 1 ? n(x, 1) : x >= .005 ? n(x, 2) : "<" + n(.01, 2); };
  const per = s => { const m = /^(\d{4})-(\d\d)/.exec(s); return m ? m[2] + "/" + m[1] : String(s).replace(".", "/"); };
  const cell = (r, c) => { const v = r.reg && r.reg[c]; if (!v) return '<td class="no">–</td>'; const s = v / r.v; return `<td style="--a:${(Math.min(1, s) * .55).toFixed(3)}" title="${esc(name(r))}: ${n(s * 100, s < .1 ? 1 : 0)} % ${tr("der Welt")}">${num(v)}</td>`; };
  host.innerHTML = `<p class="as-l">${Object.values(KIND).map(x => `<span><i style="background:${x[1]}"></i>${tr(x[0])}</span>`).join("")}</p>
    <div class="as-w" tabindex="0" role="region" aria-label="${tr("Asset-Klassen")}"><table class="as"><thead><tr><th class="as-k" scope="col">${tr("Asset-Klassen")}<small>${tr("Bio.")} US-$</small></th><th scope="col">${tr("Die Welt")}</th>${COLS.map(c => `<th scope="col">${tr(c[1])}</th>`).join("")}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr><th class="as-k" scope="row" style="--c:${KIND[r.k][1]}"><span>${i + 1}</span><i></i>${esc(name(r))}</th><td class="as-0">${num(r.v)}</td>${COLS.map(c => cell(r, c[0])).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="ww-note">${tr("Je heller ein Feld, desto größer der Anteil an der Welt. Ein Strich heißt: kein vergleichbarer Wert.")} ${tr("Öl, Gas und Kohle: bekannte Reserve mal aktuellem Preis, Förderkosten nicht abgezogen. Gold je Land: Reserven der Zentralbank, EU als Euroraum.")} ${tr("Cash (Fiat): Geldmenge M2, also Bargeld und Bankguthaben. Wert der Welt von")} ${esc((rows.find(r => r.id === "cash") || {}).per || "–")}, ${tr("die Länder sind aktueller.")}</p>
    <details class="src as-q"><summary>${tr("Quellen und Stand")}</summary><ul>${rows.map((r, i) => `<li>${i + 1} ${esc(name(r))}: <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.src)}</a>, ${esc(per(r.per))}${r.price ? " · " + n(r.price, r.price < 100 ? 2 : 0) + " $/" + r.pu : ""}${(r.more || []).map(m => ` · ${tr(m[0])}: <a href="${esc(m[2])}" target="_blank" rel="noopener">${esc(m[1])}</a> ${esc(per(m[3]))}`).join("")}</li>`).join("")}<li>${tr("Aktien")}, ${tr("Indien")}: BSE, 11/2026</li></ul></details>`;
}
