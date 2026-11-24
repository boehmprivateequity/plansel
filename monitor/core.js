/* Daten laden, Zahlen formatieren, Zähler. Von Dashboard und Vorschau gemeinsam genutzt. */
import { tr, pick } from "./i18n.js";
const base = new URL(".", import.meta.url).href;
export async function load() {
  for (const p of ["live/data.json", "data/data.json"]) {
    try { const r = await fetch(base + p, { cache: "no-cache" }); if (r.ok) { const d = await r.json(); if (d && d.blocks && d.blocks.worldbank && d.oiv) return d; } } catch (e) {}
  }
  throw new Error("Keine Daten");
}
export const HL = 100 / 0.75;                       // 1 hl = 133,3 Flaschen
export const LOC = { de: "de-DE", en: "en-GB", pt: "pt-PT", fr: "fr-FR", es: "es-ES", it: "it-IT" };
export function ctx(lang) {
  const l = pick(lang), loc = LOC[l], t = tr(l);
  const n = (v, d = 0) => v == null ? "–" : new Intl.NumberFormat(loc, { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: "always" }).format(v);
  const big = (v, d = 1) => Math.abs(v) >= 1e9 ? n(v / 1e9, d) + " " + t("bn") : Math.abs(v) >= 1e6 ? n(v / 1e6, d) + " " + t("mn") : n(v);
  const eur = v => big(v, 1) + " €";
  const pct = v => (v > 0 ? "+" : "") + n(v, 1) + " %";
  const date = s => { const d = new Date(s); return isNaN(d) ? s : d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" }); };
  const reg = new Intl.DisplayNames([loc], { type: "region" });
  const land = c => { try { return reg.of(c); } catch (e) { return c; } };
  return { l, loc, t, n, big, eur, pct, date, land };
}
const YS = 365.25 * 86400;
export function counters(d) {
  const w = d.blocks.worldbank, o = d.oiv, li = o.years.length - 1, p = w.pop, g = p[p.length - 1][1] - p[p.length - 2][1];
  const mid = Date.UTC(p[p.length - 1][0], 6, 1), P = p[p.length - 1][1];
  const popNow = now => P + g * (now - mid) / 1000 / YS;
  const day = now => { const x = new Date(now); return (now - Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate())) / 1000; };
  const yr = now => { const y = new Date(now).getUTCFullYear(); return (now - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)); };
  const cx = d.blocks.comext, ex = cx ? cx.world[cx.world.length - 1][2] * HL : null;   // Menge in 100 kg, näherungsweise hl
  const tp = d.blocks.eurotour ? d.blocks.eurotour.arr[d.blocks.eurotour.arr.length - 1][1] : null;
  const wbS = { src: "World Bank", url: "https://data.worldbank.org/" }, oS = { src: o.src, url: o.url };
  return {
    pop: { f: popNow, ...wbS, per: p[p.length - 1][0], perMin: g / YS * 60 },
    births: { f: t => w.birth[1] / 1000 * popNow(t) / YS * day(t), ...wbS, per: w.birth[0] },
    deaths: { f: t => w.death[1] / 1000 * popNow(t) / YS * day(t), ...wbS, per: w.death[0] },
    cbot: { f: t => o.cons.World[li] * 1e6 * HL / YS * day(t), ...oS, per: o.years[li] },
    pbot: { f: t => o.outlook.mhl * 1e6 * HL * yr(t), src: o.outlook.src, url: o.outlook.url, per: o.outlook.year },
    ppbot: { f: t => o.prod.PT[li] * 1e6 * HL * yr(t), ...oS, per: o.years[li] },
    pebot: ex && { f: t => ex * yr(t), src: "Eurostat Comext", url: "https://ec.europa.eu/eurostat/comext/newxtweb/", per: cx.year },
    itour: { f: t => o.tourism.world * yr(t), src: o.tourism.src, url: o.tourism.url, per: o.tourism.year },
    tour: tp && { f: t => tp * yr(t), src: "Eurostat", url: "https://ec.europa.eu/eurostat/databrowser/view/tour_occ_arnat/default/table", per: d.blocks.eurotour.period }
  };
}
