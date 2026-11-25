/* Kleine eigene Diagramme als SVG: Linie, Säulen, Ring. Ohne Fremdbibliothek. */
const NS = "http://www.w3.org/2000/svg", el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (p) p.append(e); return e; };
export const COL = ["#6f1130", "#b3873f", "#3f5f8f", "#2f7a57", "#8c6bb1", "#c96a3a", "#4e8d99", "#9aa0a6"];
function box(host) { host.innerHTML = ""; host.className = "pl"; const tip = document.createElement("div"); tip.className = "tip"; host.append(tip); return tip; }
function ticks(lo, hi, n = 4) { const s = (hi - lo) / n || 1, m = Math.pow(10, Math.floor(Math.log10(s))), r = s / m, st = (r > 5 ? 10 : r > 2 ? 5 : r > 1 ? 2 : 1) * m, o = []; for (let v = Math.ceil(lo / st) * st; v <= hi + st / 1e6; v += st) o.push(v); return o; }
/* series: [{name, pts:[[x,y]], color}], o: {fmt, zero, bars, label} */
export function plot(host, series, o = {}) {
  const tip = box(host), W = Math.max(280, Math.round(host.clientWidth) || 440), H = o.h || (W > 700 ? 300 : 250), L = 58, R = 14, T = 12, B = 26, f = o.fmt || String;
  const xs = [...new Set(series.flatMap(s => s.pts.map(p => p[0])))].sort((a, b) => a > b ? 1 : -1); if (!xs.length) { host.textContent = "–"; return; }
  const ys = series.flatMap(s => s.pts.map(p => p[1])).filter(v => v != null); let lo = Math.min(...ys), hi = Math.max(...ys); if (o.zero || o.bars) lo = Math.min(0, lo); if (lo === hi) { hi += 1; lo -= 1; } const pad = (hi - lo) * .08; hi += pad; if (!(o.zero || o.bars)) lo -= pad; else if (lo < 0) lo -= pad;
  const X = i => o.bars ? L + (W - L - R) * (i + .5) / xs.length : xs.length < 2 ? (L + W - R) / 2 : L + (W - L - R) * i / (xs.length - 1), Y = v => T + (H - T - B) * (1 - (v - lo) / (hi - lo));
  const s = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": (o.label || "") + ": " + series.map(q => q.name + " " + q.pts.length).join(", ") }); host.append(s);
  ticks(lo, hi).forEach(v => { el("line", { x1: L, x2: W - R, y1: Y(v), y2: Y(v), stroke: "#e6e0d8" }, s); el("text", { x: L - 7, y: Y(v) + 4, "text-anchor": "end" }, s).textContent = (o.axis || f)(v); });
  const st = Math.max(1, Math.ceil(xs.length / Math.max(3, Math.floor((W - L - R) / 84)))); xs.forEach((x, i) => { if (i % st === 0 || i === xs.length - 1 && i % st > st * .8) el("text", { x: X(i), y: H - 7, "text-anchor": "middle" }, s).textContent = (o.xf || String)(x); });
  series.forEach((q, k) => { const c = q.color || COL[k], P = q.pts.filter(p => p[1] != null).map(p => [X(xs.indexOf(p[0])), Y(p[1])]);
    if (o.bars) { const w = Math.max(2, (W - L - R) / xs.length * .68); P.forEach(p => el("rect", { x: p[0] - w / 2, y: Math.min(p[1], Y(0)), width: w, height: Math.max(1, Math.abs(Y(0) - p[1])), fill: c, rx: 2 }, s)); return; }
    const dd = P.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(""); if (series.length === 1 && P.length > 1) el("path", { d: dd + `L${P[P.length - 1][0]} ${Y(lo)}L${P[0][0]} ${Y(lo)}Z`, fill: c, opacity: .1 }, s);
    el("path", { d: dd, fill: "none", stroke: c, "stroke-width": 2.2, "stroke-linejoin": "round" }, s); if (P.length < 32) P.forEach(p => el("circle", { cx: p[0], cy: p[1], r: 3, fill: c }, s)); });
  const gl = el("line", { y1: T, y2: H - B, stroke: "#6f1130", opacity: 0, "stroke-dasharray": "3 3" }, s);
  const show = cx => { const r = s.getBoundingClientRect(), u = (cx - r.left) / r.width * W; let i = 0, m = 1e9; xs.forEach((_, j) => { const q = Math.abs(X(j) - u); if (q < m) { m = q; i = j; } });
    const rows = series.map(q => { const p = q.pts.find(z => z[0] === xs[i]); return p && p[1] != null ? (series.length > 1 ? q.name + ": " : "") + f(p[1]) : ""; }).filter(Boolean); if (!rows.length) return; tip.textContent = ""; [(o.xf || String)(xs[i]), ...rows].forEach((x, j) => { if (j) tip.append(document.createElement("br")); tip.append(x); });
    gl.setAttribute("x1", X(i)); gl.setAttribute("x2", X(i)); gl.setAttribute("opacity", .5); const top = Math.min(...series.map(q => { const p = q.pts.find(z => z[0] === xs[i]); return p && p[1] != null ? Y(p[1]) : H; })); tip.style.left = Math.min(88, Math.max(12, X(i) / W * 100)) + "%"; tip.style.top = Math.max(40, top / H * r.height) + "px"; tip.classList.add("on"); };
  s.addEventListener("pointermove", e => show(e.clientX)); s.addEventListener("pointerdown", e => show(e.clientX)); s.addEventListener("pointerleave", () => { tip.classList.remove("on"); gl.setAttribute("opacity", 0); });
}
export function ring(host, parts, mid, sub) {
  box(host); const s = el("svg", { viewBox: "0 0 200 200", role: "img", "aria-label": parts.map(p => p[0] + " " + p[2]).join(", ") }); host.append(s); const sum = parts.reduce((a, p) => a + p[1], 0); let a = -Math.PI / 2;
  parts.forEach((p, i) => { const b = a + p[1] / sum * 2 * Math.PI, q = (r, w) => [100 + r * Math.cos(w), 100 + r * Math.sin(w)].map(v => v.toFixed(2)).join(" "), g = b - a > Math.PI ? 1 : 0; const e = el("path", { d: `M${q(96, a)}A96 96 0 ${g} 1 ${q(96, b)}L${q(58, b)}A58 58 0 ${g} 0 ${q(58, a)}Z`, fill: p[3] || COL[i], stroke: "#fff", "stroke-width": 1.5 }, s); el("title", {}, e).textContent = p[0] + " " + p[2]; a = b; });
  const t1 = el("text", { x: 100, y: 100, "text-anchor": "middle", style: "font:600 24px Figtree;fill:#1b1a1f" }, s); t1.textContent = mid; el("text", { x: 100, y: 120, "text-anchor": "middle" }, s).textContent = sub;
}
