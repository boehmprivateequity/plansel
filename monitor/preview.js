/* Kleine Vorschau für die Startseite. Ein Klick führt zu index4.html, Seite 02. */
import { load, ctx, counters, HL } from "./core.js";
const page = "index4.html#statistik";
export async function mount(host) {
  const lang = () => document.documentElement.dataset.staticLang || (window.PLANSEL_I18N ? window.PLANSEL_I18N.lang : "de");
  let D; try { D = await load(); } catch (e) { host.hidden = true; return; }
  const CT = counters(D), o = D.oiv, li = o.years.length - 1, p = D.blocks.ipma, h = p && p.hours.at(-1);
  let C, t, timer;
  const ch = v => `<i class="${v >= 0 ? "u" : "d"}">${v >= 0 ? "▲" : "▼"} ${C.pct(v)}</i>`;
  function draw() {
    C = ctx(lang()); t = C.t;
    host.innerHTML = `<a class="gwm-b" href="${page}" aria-label="PLANSEL Global Wine Monitor: ${t("open")}">
      <span class="gwm-h"><b>Global Wine Monitor</b><small>${t("claim")}</small></span>
      <span class="gwm-k"><span><small>${t("pop")}</small><b data-c="pop"></b></span><span><small>${t("wprod")}</small><b>${C.n(o.prod.World[li] * HL / 1e3, 1)} ${t("bn")}</b>${ch(o.world.prodChg)}</span><span><small>${t("wcons")}</small><b>${C.n(o.cons.World[li] * HL / 1e3, 1)} ${t("bn")}</b>${ch(o.world.consChg)}</span>${h ? `<span class="gwm-w"><small>Montemor-o-Novo</small><b>${C.n(h[1], 1)} °C</b>${D.status.ipma.state === "ok" ? "<em>LIVE</em>" : ""}</span>` : ""}</span>
      <span class="gwm-o">${t("open")} →</span></a>`;
  }
  const tick = () => { if (document.hidden) return; const n = Date.now(); host.querySelectorAll("[data-c]").forEach(e => { e.textContent = C.n(Math.floor(CT[e.dataset.c].f(n))); }); };
  const start = () => { draw(); tick(); clearInterval(timer); timer = setInterval(tick, 1000); };
  start(); document.addEventListener("plansel:lang", start);
}
