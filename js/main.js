/* ============================================================
   MineBig V2.0 — shared JS: header, search, menu, misc
   ============================================================ */

(function () {
  // ---- mobile menu toggle ----
  function menuToggle() {
    const btn = document.getElementById("menu-toggle");
    const box = document.getElementById("mobile-nav");
    if (!btn || !box) return;
    function setOpen(open) {
      box.classList.toggle("open", open);
      btn.textContent = open ? "✕" : "☰";
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", () => setOpen(!box.classList.contains("open")));
    box.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // ---- nav active state ----
  function navState() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-page]").forEach((a) => {
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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = "INVALID EMAIL"; msg.style.color = "var(--red)"; return; }
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

  // ---- search panel ----
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

  // ---- language selector (demo) ----
  function languageSelect() {
    // header dropdown
    const wrap = document.getElementById("lang-wrap");
    if (wrap) {
      const btn = wrap.querySelector(".lang-btn");
      const opts = wrap.querySelectorAll(".lang-menu button");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          wrap.classList.toggle("open");
        });
        opts.forEach((b) => {
          b.addEventListener("click", () => {
            wrap.querySelectorAll(".lang-menu button").forEach((x) => x.classList.toggle("on", x === b));
            btn.textContent = b.textContent;
            wrap.classList.remove("open");
          });
        });
        document.addEventListener("click", (e) => {
          if (!wrap.contains(e.target)) wrap.classList.remove("open");
        });
      }
    }
    // mobile drawer options (demo: marks the selection, no i18n yet)
    document.querySelectorAll(".mobile-nav .lang-opt").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".mobile-nav .lang-opt").forEach((x) => x.classList.toggle("on", x === b));
      });
    });
  }

  // ---- back to top ----
  function backToTop() {
    const btn = document.getElementById("to-top");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("show", window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ---- banner slider (home) ----
  function bannerSlider() {
    const slider = document.querySelector(".banner-slider");
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll(".banner-slide"));
    const dots = Array.from(slider.querySelectorAll(".banner-dots button"));
    const prev = slider.querySelector(".banner-arrow.prev");
    const next = slider.querySelector(".banner-arrow.next");
    let i = 0;
    let timer = null;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("on", k === i));
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => show(i + 1), 7000);
    }
    prev && prev.addEventListener("click", () => show(i - 1));
    next && next.addEventListener("click", () => show(i + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
    // pause on hover / touch
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);
    slider.addEventListener("touchstart", () => clearInterval(timer), { passive: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clearInterval(timer);
    }
    show(0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    menuToggle();
    navState();
    newsletter();
    searchPanel();
    languageSelect();
    backToTop();
    bannerSlider();
  });
})();
