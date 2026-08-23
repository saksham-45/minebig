/* ============================================================
   Home (P100) - hero countdown, mascot stats, carousel, lucky
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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function homeSlip(el, board, game) {
    if (!el || !board || !game) return;
    const is6 = game.id === "d6";
    const chip = (n) => `<span class="home-slip__n">${escapeHtml(n)}</span>`;
    el.classList.toggle("is-6d", is6);
    el.innerHTML = `
      <div class="home-slip__head ${is6 ? "is-6d" : "is-4d"}">
        <img src="img/${is6 ? "dice-six.svg" : "dice-four.svg"}" alt="" aria-hidden="true">
        <h3>${escapeHtml(game.name)}</h3>
      </div>
      <div class="home-slip__prizes">
        <div><span>1st prize</span>${chip(board.first)}</div>
        <div><span>2nd prize</span>${chip(board.second)}</div>
        <div><span>3rd prize</span>${chip(board.third)}</div>
      </div>
      <div class="home-slip__cols">
        <div>
          <p>Special</p>
          <div class="home-slip__grid">${board.special.map(chip).join("")}</div>
        </div>
        <div>
          <p>Consolation</p>
          <div class="home-slip__grid">${board.consolation.map(chip).join("")}</div>
        </div>
      </div>
    `;
  }

  function paintLatest() {
    const boards4 = MINEBIG.getBoards("d4") || [];
    const boards6 = MINEBIG.getBoards("d6") || [];
    const latest4 = boards4[0];
    const latest6 = boards6[0];
    const dateEl = byId("home-latest-date");
    if (dateEl && latest4) {
      dateEl.textContent = MINEBIG.formatDrawDate(latest4.date) + " · " + MINEBIG.drawCode(latest4.date);
    }
    homeSlip(byId("home-latest-d4"), latest4, MINEBIG.GAMES[0]);
    homeSlip(byId("home-latest-d6"), latest6, MINEBIG.GAMES[1]);
  }

  document.addEventListener("DOMContentLoaded", () => {
    paintLatest();
    window.addEventListener("minebig:sheet-loaded", paintLatest);

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

    // ---- lucky numbers on the heritage banner ----
    const heritageLucky = byId("heritage-lucky");
    function roll() {
      const code = randomCode("d6", 6);
      if (heritageLucky) heritageLucky.innerHTML = digitChips(code);
    }
    if (heritageLucky) roll();
    window.addEventListener("minebig:sheet-loaded", roll);

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
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "Clear"].forEach((d) => {
          const b = document.createElement("button");
          b.type = "button";
          if (d === "Clear") {
            b.className = "clr";
            b.textContent = "Clear";
            b.setAttribute("aria-label", "Clear picked digits");
            b.addEventListener("click", () => { picked = []; renderPick(); });
          } else {
            b.textContent = d;
            b.setAttribute("aria-label", "Digit " + d);
            b.addEventListener("click", () => {
              if (picked.length >= 6) return;
              picked.push(d);
              renderPick();
            });
          }
          keypad.appendChild(b);
        });
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
            ? `<b style="color:var(--gold-deep)">★ Perfect match - you would have won 1st prize!</b>`
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
