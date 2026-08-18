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

  // ---- language selector: free on-the-fly Google Translate widget ----
  const MB_LANGS = {
    en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", kn: "Kannada",
    ml: "Malayalam", es: "Spanish", fr: "French", de: "German", it: "Italian",
  };

  function setLang(code) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) return;
    combo.value = code === "en" ? "" : code;
    combo.dispatchEvent(new Event("change"));
  }

  function languageSelect() {
    const wrap = document.getElementById("lang-wrap");
    if (wrap) {
      const menu = wrap.querySelector(".lang-menu");
      if (menu) menu.innerHTML = '<div id="google_translate_element" aria-label="Choose language"></div>';
      const btn = wrap.querySelector(".lang-btn");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          wrap.classList.toggle("open");
        });
        document.addEventListener("click", (e) => {
          if (!wrap.contains(e.target)) wrap.classList.remove("open");
        });
      }
    }
    // mobile drawer options drive the same widget
    document.querySelectorAll(".mobile-nav .lang-sub").forEach((sub) => {
      sub.innerHTML = Object.entries(MB_LANGS).map(([code, name]) =>
        `<button type="button" class="lang-opt${code === "en" ? " on" : ""}" data-lang="${code}">${name}</button>`).join("");
    });
    document.querySelectorAll(".mobile-nav .lang-opt").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".mobile-nav .lang-opt").forEach((x) => x.classList.toggle("on", x === b));
        setLang(b.dataset.lang);
      });
    });

    window.googleTranslateElementInit = function () {
      if (window.__mbTranslateInit) return;
      window.__mbTranslateInit = true;
      /* global google */
      new google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: Object.keys(MB_LANGS).join(","),
        layout: google.translate.TranslateElement.InlineLayout.VERTICAL,
        autoDisplay: false,
      }, "google_translate_element");
    };
    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(s);
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

  // ---- banner 2: 4-step SVG slideshow ----
  function stepShow() {
    const show = document.querySelector(".step-show");
    if (!show) return;
    const arts = Array.from(show.querySelectorAll(".step-art"));
    const labels = Array.from(show.querySelectorAll(".step-show__labels span"));
    const dots = Array.from(show.querySelectorAll(".step-show__dots i"));
    if (!arts.length) return;
    let i = 0;
    function go(n) {
      i = (n + arts.length) % arts.length;
      arts.forEach((a, k) => a.classList.toggle("on", k === i));
      labels.forEach((l, k) => l.classList.toggle("on", k === i));
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
    }
    const timer = setInterval(() => go(i + 1), 2600);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(timer);
    go(0);
  }

  // ---- banner slider (home): scroll-snap swipe + confetti price reveal ----
  function burstPrizes() {
    const stage = document.querySelector(".prize-stage");
    if (!stage) return;
    const wrap = stage.querySelector(".confetti-wrap");
    if (wrap && !wrap.childElementCount) {
      const colors = ["#ffc000", "#ffd54f", "#00a3e3", "#f58220", "#eb2020", "#7b2ff7", "#0ea864"];
      for (let p = 0; p < 26; p++) {
        const c = document.createElement("i");
        c.style.setProperty("--dx", (Math.random() * 260 - 130).toFixed(0) + "px");
        c.style.setProperty("--dy", (Math.random() * -220 - 40).toFixed(0) + "px");
        c.style.setProperty("--rot", (Math.random() * 720 - 360).toFixed(0) + "deg");
        c.style.setProperty("--delay", (Math.random() * 0.35).toFixed(2) + "s");
        c.style.background = colors[p % colors.length];
        wrap.appendChild(c);
      }
    }
    stage.classList.remove("burst");
    void stage.offsetWidth; // restart the animation
    stage.classList.add("burst");
  }

  function bannerSlider() {
    const slider = document.querySelector(".banner-slider");
    if (!slider) return;
    const track = slider.querySelector(".banner-track");
    const slides = Array.from(slider.querySelectorAll(".banner-slide"));
    const dots = Array.from(slider.querySelectorAll(".banner-dots button"));
    const prev = slider.querySelector(".banner-arrow.prev");
    const next = slider.querySelector(".banner-arrow.next");
    let i = 0;
    let timer = null;

    function activate(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("on", k === i));
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
    }
    function go(n) {
      activate(n);
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
      if (i === 0) burstPrizes();
      restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(i + 1), 8000);
    }
    let scrollTimer = null;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const at = track.scrollLeft;
        let idx = 0;
        for (let k = 0; k < slides.length; k++) {
          if (slides[k].offsetLeft - track.offsetLeft <= at + 20) idx = k;
        }
        if (idx !== i) { activate(idx); if (idx === 0) burstPrizes(); restart(); }
      }, 80);
    }, { passive: true });
    prev && prev.addEventListener("click", () => go(i - 1));
    next && next.addEventListener("click", () => go(i + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
    slider.addEventListener("mouseleave", restart);
    slider.addEventListener("touchstart", () => clearInterval(timer), { passive: true });
    slider.addEventListener("touchend", restart, { passive: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(timer);
    go(0);
  }

  document.addEventListener("DOMContentLoaded", () => {
    menuToggle();
    navState();
    newsletter();
    searchPanel();
    languageSelect();
    backToTop();
    stepShow();
    bannerSlider();
  });
})();
