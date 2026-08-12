/* ============================================================
   MineBig.com V2.0 — shared site JS: sparkles + nav state
   ============================================================ */

(function () {
  // ---- floating sparkle particles (gold / magenta / teal) ----
  function sparkles() {
    const canvas = document.getElementById("sparkles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    let W, H;
    const COLORS = ["255,209,102", "255,45,149", "34,211,238", "168,85,247"];
    const parts = [];

    function resize() {
      W = canvas.width = window.innerWidth * DPR;
      H = canvas.height = window.innerHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      parts.length = 0;
      const count = Math.min(70, Math.floor(window.innerWidth / 18));
      for (let i = 0; i < count; i++) parts.push(make(0, 0));
    }
    function make(_w, _h) {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.6 + Math.random() * 2.2,
        vy: -0.12 - Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: 0.2 + Math.random() * 0.55,
        tw: Math.random() * Math.PI * 2,
      };
    }
    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.03;
        if (p.y < -8 || p.x < -8 || p.x > window.innerWidth + 8) {
          Object.assign(p, make());
          p.y = window.innerHeight + 6;
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.c},0.9)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener("resize", resize);
    resize();
    tick();
  }

  // ---- nav active state ----
  function navState() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
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
      if (!email.includes("@")) { msg.textContent = "Enter a valid email."; msg.style.color = "var(--red)"; return; }
      try {
        const subs = JSON.parse(localStorage.getItem("minebig_newsletter")) || [];
        subs.push({ email, at: Date.now() });
        localStorage.setItem("minebig_newsletter", JSON.stringify(subs));
      } catch (e) { /* preview */ }
      msg.textContent = "Subscribed — draw alerts coming your way!";
      msg.style.color = "var(--green)";
      input.value = "";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    sparkles();
    navState();
    newsletter();
  });
})();
