/* ============================================================
   Home (P100) — hero countdown, mascot stats, carousel, lucky
   single-digit numbers, and the interactive how-to-draw tutorial
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  // random available digit code (single digits 0-9 only)
  function randomCode(gameId, digits) {
    let code = "";
    for (let i = 0; i < digits; i++) code += Math.floor(Math.random() * 10);
    return MINEBIG.isNumberTaken(gameId, code) ? randomCode(gameId, digits) : code;
  }

  function digitChips(code) {
    return String(code).split("").map((d, i) =>
      `<span class="ball${i % 2 ? " teal" : ""}">${d}</span>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ---- next winner date + countdown ----
    const nwDate = byId("nw-date");
    const nwCd = byId("home-countdown");
    if (nwDate && nwCd) {
      function fmt(n) { return String(n).padStart(2, "0"); }
      function render() {
        const target = MINEBIG.nextSundayNoon(new Date());
        const d = new Date(target);
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        nwDate.textContent = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        const diff = Math.max(0, target - Date.now());
        const hh = Math.floor((diff % 864e5) / 36e5);
        const mm = Math.floor((diff % 36e5) / 6e4);
        const ss = Math.floor((diff % 6e4) / 1e3);
        nwCd.innerHTML =
          `<div class="unit"><div class="num">${fmt(Math.floor(diff / 864e5))}</div><div class="lbl">Days</div></div>` +
          `<div class="unit"><div class="num">${fmt(hh)}</div><div class="lbl">Hours</div></div>` +
          `<div class="unit"><div class="num">${fmt(mm)}</div><div class="lbl">Min</div></div>` +
          `<div class="unit"><div class="num sec">${fmt(ss)}</div><div class="lbl">Sec</div></div>`;
      }
      render();
      setInterval(render, 1000);
    }

    // ---- mascot strip stats ----
    const winners = MINEBIG.WINNERS.length * 7;
    const tk1 = byId("tk-winners");
    if (tk1) tk1.textContent = winners;

    // ---- carousel: winners slide ----
    const carWinners = byId("car-winners");
    if (carWinners) {
      const latest = MINEBIG.WINNERS[0];
      const quotes = [
        [latest.winners.first, "1ST", "Winning with MineBig felt personal — my agent walked me through everything, right up to the handover."],
        [latest.winners.special, "SPECIAL PRIZE", "I checked my code on Sunday night and could not believe it. The agent came the next day."],
        [latest.winners.c1, "CONSOLATION 1", "Even a consolation win felt like a celebration. Same trust, better than ever."],
      ];
      carWinners.innerHTML = quotes.map(([name, tier, q]) =>
        `<p class="quote">“${q}”</p>` +
        `<p class="who"><span class="tier-chip ${tier === "1ST" ? "" : tier === "SPECIAL PRIZE" ? "mag" : "teal"}">${tier}</span> ${name} — draw of ${latest.date}</p>` +
        `<div class="tx-rule"></div>`
      ).join("");
    }

    // ---- lucky numbers (single digits, home carousel + heritage banner) ----
    const carLucky = byId("car-lucky");
    const heritageLucky = byId("heritage-lucky");
    function roll() {
      const code = randomCode("d6", 6);
      if (carLucky) carLucky.innerHTML = digitChips(code);
      if (heritageLucky) heritageLucky.innerHTML = digitChips(code);
    }
    const rb = byId("car-lucky-refresh");
    if (rb) rb.addEventListener("click", roll);
    if (carLucky || heritageLucky) roll();
    window.addEventListener("minebig:sheet-loaded", roll);

    // ---- carousel arrows + dots ----
    const track = byId("car-track");
    if (track) {
      const slides = track.children.length;
      const dotsWrap = byId("car-dots");
      const dots = [];
      for (let i = 0; i < slides; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Slide " + (i + 1));
        if (i === 0) b.classList.add("on");
        b.addEventListener("click", () => {
          track.scrollTo({ left: track.children[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
        });
        dotsWrap.appendChild(b);
        dots.push(b);
      }
      function sync() {
        const at = track.scrollLeft;
        let idx = 0;
        for (let i = 0; i < slides; i++) {
          if (track.children[i].offsetLeft - track.offsetLeft <= at + 20) idx = i;
        }
        dots.forEach((d, i) => d.classList.toggle("on", i === idx));
      }
      track.addEventListener("scroll", sync, { passive: true });
      byId("car-prev").addEventListener("click", () => {
        const at = track.scrollLeft;
        let idx = 0;
        for (let i = 0; i < slides; i++) {
          if (track.children[i].offsetLeft - track.offsetLeft <= at + 20) idx = i;
        }
        const prev = Math.max(0, idx - 1);
        track.scrollTo({ left: track.children[prev].offsetLeft - track.offsetLeft, behavior: "smooth" });
      });
      byId("car-next").addEventListener("click", () => {
        const at = track.scrollLeft;
        let idx = 0;
        for (let i = 0; i < slides; i++) {
          if (track.children[i].offsetLeft - track.offsetLeft <= at + 20) idx = i;
        }
        const next = Math.min(slides - 1, idx + 1);
        track.scrollTo({ left: track.children[next].offsetLeft - track.offsetLeft, behavior: "smooth" });
      });
    }

    // ---- interactive how-to-draw tutorial ----
    const tut = byId("draw-tutorial");
    if (tut) {
      const panes = Array.from(tut.querySelectorAll(".tut-pane"));
      const tabs = Array.from(tut.querySelectorAll(".tut-tab"));
      const keypad = byId("tut-keypad");
      const pick = byId("tut-pick");
      const nextBtn = byId("tut-next");
      const ticketCode = byId("tut-ticket-code");
      const winning = byId("tut-winning");
      const verdict = byId("tut-verdict");
      let picked = [];

      function renderPick() {
        if (!pick) return;
        pick.innerHTML = picked.map((d) => `<span class="ball">${d}</span>`).join("") +
          Array.from({ length: 6 - picked.length }).map(() => `<span class="ball ghost">·</span>`).join("");
        if (nextBtn) nextBtn.disabled = picked.length !== 6;
      }
      if (keypad) {
        for (let d = 0; d <= 9; d++) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = d;
          b.setAttribute("aria-label", "Digit " + d);
          b.addEventListener("click", () => {
            if (picked.length >= 6) return;
            picked.push(d);
            renderPick();
          });
          keypad.appendChild(b);
        }
        const clr = document.createElement("button");
        clr.type = "button";
        clr.className = "clr";
        clr.textContent = "CLR";
        clr.setAttribute("aria-label", "Clear picked digits");
        clr.addEventListener("click", () => { picked = []; renderPick(); });
        keypad.appendChild(clr);
      }
      function go(step) {
        panes.forEach((p) => p.classList.toggle("on", p.dataset.step === String(step)));
        tabs.forEach((t) => t.classList.toggle("on", t.dataset.step === String(step)));
      }
      tabs.forEach((t) => t.addEventListener("click", () => go(t.dataset.step)));
      if (nextBtn) nextBtn.addEventListener("click", () => {
        if (ticketCode) ticketCode.textContent = picked.join("");
        go(2);
      });
      const next2 = byId("tut-next2");
      if (next2) next2.addEventListener("click", () => {
        const boards = MINEBIG.BOARDS && MINEBIG.BOARDS.d6;
        const win = boards && boards.length ? String(boards[0].first) : "482196";
        if (winning) winning.innerHTML = String(win).split("").map((d) => `<span class="ball mag">${d}</span>`).join("");
        const got = String(win).split("").reduce((n, d, i) => n + (d === picked[i] ? 1 : 0), 0);
        if (verdict) {
          verdict.innerHTML = got === 6
            ? `<b style="color:var(--gold-deep)">★ Perfect match — you would have won 1st prize!</b>`
            : `You matched <b>${got}</b> of 6 digits.${got >= 4 ? " That's a prize tier!" : " Better luck next Sunday."}`;
        }
        go(3);
      });
      const next3 = byId("tut-next3");
      if (next3) next3.addEventListener("click", () => go(4));
      renderPick();
    }
  });
})();
