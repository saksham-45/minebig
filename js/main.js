/* ============================================================
   MineBig V2.0 — shared JS: broadcast clock, pages index, misc
   ============================================================ */

(function () {
  // ---- broadcast clock (top bar, cyan, blinking seconds) ----
  function clock() {
    const el = document.getElementById("tx-clock");
    if (!el) return;
    function tick() {
      const d = new Date();
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      el.innerHTML = `${days[d.getDay()]} ${hh}:${mm}<span class="sec">:${ss}</span>`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ---- pages index toggle (mobile) ----
  function pagesToggle() {
    const btn = document.getElementById("pages-toggle");
    const box = document.getElementById("tx-pages");
    if (!btn || !box) return;
    btn.addEventListener("click", () => {
      const open = box.classList.toggle("open");
      btn.textContent = open ? "✕ Close" : "☰ Menu";
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- nav active state ----
  function navState() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".tx-pages a[data-page]").forEach((a) => {
      a.classList.toggle("active", a.dataset.page === here);
    });
  }

  // ---- newsletter (demo) ----
  function newsletter() {
    const btn = document.getElementById("nl-submit");
    const input = document.getElementById("nl-email");
    const msg = document.getElementById("nl-msg");
    if (!btn || !input || !msg) return;
    btn.addEventListener("click", () => {
      const email = input.value.trim();
      if (!email.includes("@")) { msg.textContent = "INVALID EMAIL"; msg.style.color = "var(--red)"; return; }
      try {
        const subs = JSON.parse(localStorage.getItem("minebig_newsletter")) || [];
        subs.push({ email, at: Date.now() });
        localStorage.setItem("minebig_newsletter", JSON.stringify(subs));
      } catch (e) { /* preview */ }
      msg.textContent = "SUBSCRIBED — DRAW ALERTS ON THE WAY";
      msg.style.color = "var(--green)";
      input.value = "";
    });
  }

  // ---- keyword search panel ----
  function searchPanel() {
    const btn = document.getElementById("search-btn");
    const panel = document.getElementById("search-panel");
    if (!btn || !panel) return;
    function setOpen(open) {
      panel.classList.toggle("open", open);
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!panel.classList.contains("open"));
    });
    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== btn) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    clock();
    pagesToggle();
    navState();
    newsletter();
    searchPanel();
  });
})();
