/* Kleine Vorschau für die Startseite. Das volle Dashboard lädt erst beim Anklicken. */
import { load, ctx, counters, HL } from "./core.js";
const base = new URL(".", import.meta.url).href;
export async function mount(host) {
  const lang = () => document.documentElement.dataset.staticLang || (window.PLANSEL_I18N ? window.PLANSEL_I18N.lang : "de");
  let D; try { D = await load(); } catch (e) { host.hidden = true; return; }
  const CT = counters(D), o = D.oiv, li = o.years.length - 1, p = D.blocks.ipma, h = p && p.hours.at(-1);
  let C, t, timer;
  const ch = v => `<i class="${v >= 0 ? "u" : "d"}">${v >= 0 ? "▲" : "▼"} ${C.pct(v)}</i>`;
  function draw() {
    C = ctx(lang()); t = C.t;
    host.innerHTML = `<button type="button" class="gwm-b" aria-haspopup="dialog" aria-label="PLANSEL Global Wine Monitor: ${t("open")}">
      <span class="gwm-h"><b>Global Wine Monitor</b><small>${t("claim")}</small></span>
      <span class="gwm-k"><span><small>${t("pop")}</small><b data-c="pop"></b></span><span><small>${t("wprod")}</small><b>${C.n(o.prod.World[li] * HL / 1e3, 1)} ${t("bn")}</b>${ch(o.world.prodChg)}</span><span><small>${t("wcons")}</small><b>${C.n(o.cons.World[li] * HL / 1e3, 1)} ${t("bn")}</b>${ch(o.world.consChg)}</span>${h ? `<span class="gwm-w"><small>Montemor-o-Novo</small><b>${C.n(h[1], 1)} °C</b>${D.status.ipma.state === "ok" ? "<em>LIVE</em>" : ""}</span>` : ""}</span>
      <span class="gwm-o">${t("open")} ⤢</span></button>`;
    host.querySelector("button").onclick = open;
  }
  const tick = () => { if (document.hidden) return; const n = Date.now(); host.querySelectorAll("[data-c]").forEach(e => { e.textContent = C.n(Math.floor(CT[e.dataset.c].f(n))); }); };
  function open() {
    const back = document.activeElement, d = document.createElement("div"); d.className = "gwm-x"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", "PLANSEL Global Wine Monitor");
    d.innerHTML = `<div class="gwm-bar"><button type="button" data-a="full">⛶ <span>${t("full")}</span></button><button type="button" data-a="close">✕ <span>${t("close")}</span></button></div><iframe title="PLANSEL Global Wine Monitor" src="${base}index.html?embed=1&lang=${C.l}"></iframe>`;
    document.body.append(d); document.documentElement.style.overflow = "hidden"; requestAnimationFrame(() => d.classList.add("on")); const x = d.querySelector("[data-a=close]"), f = d.querySelector("[data-a=full]"); x.focus();
    const key = e => { if (e.key === "Escape" && !document.fullscreenElement) close(); };
    function close() { if (document.fullscreenElement) document.exitFullscreen(); d.classList.remove("on"); removeEventListener("keydown", key); document.documentElement.style.overflow = ""; setTimeout(() => d.remove(), 350); if (back) back.focus(); }
    x.onclick = close; addEventListener("keydown", key); d.querySelector("iframe").onload = e => { try { e.target.contentWindow.addEventListener("keydown", key); } catch (err) {} };
    if (d.requestFullscreen) f.onclick = () => document.fullscreenElement ? document.exitFullscreen() : d.requestFullscreen(); else f.hidden = true;
  }
  const start = () => { draw(); tick(); clearInterval(timer); timer = setInterval(tick, 1000); };
  start(); document.addEventListener("plansel:lang", start);
}
