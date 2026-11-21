/* Bild anklicken: bildschirmfüllend anzeigen; nochmal klicken: stärker vergrößern zum Lesen; Esc oder × schließt */
(function () {
  function open(img) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<button class="lb-close" type="button" aria-label="×">×</button><img alt="">';
    var big = box.querySelector("img");
    big.src = img.currentSrc || img.src; big.alt = img.alt;
    function close() { box.remove(); document.documentElement.style.overflow = ""; document.removeEventListener("keydown", key); img.focus(); }
    function key(e) { if (e.key === "Escape") close(); }
    big.addEventListener("click", function (e) {
      e.stopPropagation();
      var r = big.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      box.classList.toggle("lb-zoom");
      if (box.classList.contains("lb-zoom")) { box.scrollLeft = fx * big.offsetWidth - box.clientWidth / 2; box.scrollTop = fy * big.offsetHeight - box.clientHeight / 2; }
    });
    box.addEventListener("click", close);
    box.querySelector(".lb-close").addEventListener("click", close);
    document.addEventListener("keydown", key);
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(box);
    box.querySelector(".lb-close").focus();
  }
  document.querySelectorAll("img.zoomable").forEach(function (img) {
    img.addEventListener("click", function () { open(img); });
    img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); } });
  });
})();
