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

  function magnumTicket(el, board) {
    if (!el || !board) return;
    const n = (num) => `<button type="button" class="mg-n mb-num" data-num="${escapeHtml(num)}">${escapeHtml(num)}</button>`;
    el.innerHTML = `
      <div class="mg-ticket__head">
        <img src="img/dice-four.svg" alt="">
        <span>Tap a number to see its meaning.</span>
      </div>
      <div class="mg-ticket__top">
        <div><span>1st prize</span>${n(board.first)}</div>
        <div><span>2nd Prize</span>${n(board.second)}</div>
        <div><span>3rd Prize</span>${n(board.third)}</div>
      </div>
      <div class="mg-ticket__split">
        <div>
          <p>Special</p>
          <div class="mg-grid">${(board.special || []).map(n).join("")}</div>
        </div>
        <div>
          <p>Consolation</p>
          <div class="mg-grid">${(board.consolation || []).map(n).join("")}</div>
        </div>
      </div>
      <p class="mg-meaning" hidden></p>
    `;
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-num]");
        if (!btn) return;
        const num = btn.getAttribute("data-num");
        const hit = (MINEBIG.DICTIONARY || []).find((d) => (d.nums || []).includes(num));
        const line = el.querySelector(".mg-meaning");
        if (!line) return;
        line.hidden = false;
        line.textContent = hit ? num + ": " + hit.word : num + ": no match in the MineBig Dictionary.";
      });
    }
  }

  function paintLatest() {
    const boards4 = MINEBIG.getBoards("d4") || [];
    const latest4 = boards4[0];
    const dateEl = byId("home-latest-date");
    if (dateEl && latest4) {
      dateEl.textContent = MINEBIG.formatDrawDate(latest4.date) + " · " + MINEBIG.drawCode(latest4.date);
    }
    magnumTicket(byId("home-latest-d4"), latest4);
  }

  document.addEventListener("DOMContentLoaded", () => {
    paintLatest();
    window.addEventListener("minebig:sheet-loaded", paintLatest);

    // ---- next winner date + countdown ----
    const ndDay = byId("nd-day");
    const ndDow = byId("nd-dow");
    const nwCd = byId("home-countdown");
    if (ndDay && nwCd) {
      function fmt(n) { return String(n).padStart(2, "0"); }
      function render() {
        const target = MINEBIG.nextSundayNoon(new Date());
        const d = new Date(target);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        ndDay.textContent = `${d.getDate()} ${months[d.getMonth()]}`;
        if (ndDow) ndDow.textContent = `(${days[d.getDay()]})`;
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
    const ndToggle = byId("nd-toggle");
    const ndPanel = byId("nd-panel");
    if (ndToggle && ndPanel) {
      ndToggle.addEventListener("click", () => {
        const open = ndToggle.getAttribute("aria-expanded") === "true";
        ndToggle.setAttribute("aria-expanded", String(!open));
        ndPanel.hidden = open;
        const wrap = ndToggle.closest(".nd-wrap");
        if (wrap) wrap.classList.toggle("is-open", !open);
      });
    }

    const luckyBox = byId("lucky-digits");
    function paintLucky() {
      if (!luckyBox) return;
      const code = randomCode("d4", 4);
      luckyBox.dataset.code = code;
      luckyBox.innerHTML = String(code).split("").map((d) => `<span>${d}</span>`).join("");
    }
    paintLucky();
    const luckyRefresh = byId("lucky-refresh");
    if (luckyRefresh) luckyRefresh.addEventListener("click", paintLucky);
    const luckyCopy = byId("lucky-copy");
    if (luckyCopy) luckyCopy.addEventListener("click", () => {
      const code = luckyBox && luckyBox.dataset.code;
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code).then(() => {
        luckyCopy.textContent = "Copied";
        setTimeout(() => { luckyCopy.textContent = "Copy number"; }, 1400);
      });
    });

    // ---- MineBig Dictionary ----
    const decoderOut = byId("home-decoder-out");
    const decoderQ = byId("home-decoder-q");
    const decoderEmpty = byId("home-decoder-empty");
    function dictArt(d) {
      const slug = String(d.word || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "default";
      const src = d.image || ("img/dict/" + slug + ".jpg");
      return `<span class="dict-art-wrap"><img class="dict-art" src="${escapeHtml(src)}" alt="" loading="lazy"></span>`;
    }
    function paintDecoder(filter) {
      if (!decoderOut) return;
      const q = (filter || "").trim().toLowerCase();
      if (!q) {
        decoderOut.innerHTML = "";
        if (decoderEmpty) {
          decoderEmpty.style.display = "block";
          decoderEmpty.textContent = "Type a dream, a symbol, or a number.";
        }
        return;
      }
      const rows = (MINEBIG.DICTIONARY || []).filter((d) => {
        const codes = d.nums || [];
        return d.word.toLowerCase().includes(q) || codes.some((n) => n.includes(q));
      }).slice(0, 8);
      decoderOut.innerHTML = rows.map((d) => {
        const codes = d.nums || [];
        return `<div class="dict-item">
          ${dictArt(d)}
          <div class="dict-body">
            <span class="word">${escapeHtml(d.word)}</span>
            <span class="nums">${codes.map((n) => `<span>${escapeHtml(n)}</span>`).join("")}</span>
          </div>
        </div>`;
      }).join("");
      if (decoderEmpty) {
        decoderEmpty.style.display = rows.length ? "none" : "block";
        decoderEmpty.textContent = rows.length ? "" : "No symbols match. Try another word.";
      }
    }
    if (decoderQ) {
      decoderQ.addEventListener("input", () => paintDecoder(decoderQ.value));
      paintDecoder("");
    }

    // ---- lucky numbers on the heritage banner ----
    const heritageLucky = byId("heritage-lucky");
    function roll() {
      const code = randomCode("d4", 4);
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
          Array.from({ length: 4 - picked.length }).map(() => `<span class="ball ghost">·</span>`).join("");
        if (nextBtn) nextBtn.disabled = picked.length !== 4;
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
              if (picked.length >= 4) return;
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
        const boards = MINEBIG.BOARDS && MINEBIG.BOARDS.d4;
        const win = boards && boards.length ? String(boards[0].first) : "4821";
        if (winning) winning.innerHTML = String(win).split("").map((d) => `<span class="ball mag">${d}</span>`).join("");
        const got = String(win).split("").reduce((n, d, i) => n + (d === picked[i] ? 1 : 0), 0);
        if (verdict) {
          verdict.innerHTML = got === 4
            ? `<b style="color:var(--gold-deep)">★ Perfect match. You would have won 1st prize.</b>`
            : `You matched <b>${got}</b> of 4 digits.${got >= 3 ? " That is a prize tier." : " Better luck next Sunday."}`;
        }
        go(3);
      });
      const next3 = byId("tut-next3");
      if (next3) next3.addEventListener("click", () => go(4));
      renderPick();
    }
  });
})();
