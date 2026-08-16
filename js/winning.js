/* ============================================================
   Results — draw ticket board
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function numBtn(n) {
    return `<button type="button" class="mb-num" data-num="${escapeHtml(n)}">${escapeHtml(n)}</button>`;
  }

  function renderBoard(el, board, game) {
    if (!el || !board || !game) return;
    const is6 = game.id === "d6";
    el.innerHTML = `
      <div class="mb-ticket__head ${is6 ? "is-6d" : "is-4d"}">
        <img class="mb-ticket__mark" src="img/${is6 ? "dice-six.svg" : "dice-four.svg"}" alt="" aria-hidden="true">
        <div class="mb-ticket__titles">
          <h2 class="mb-ticket__name">${escapeHtml(game.name)}</h2>
          <p class="mb-ticket__hint">Tap a number to see its meaning.</p>
        </div>
      </div>
      <div class="mb-ticket__top">
        <div class="mb-prize">
          <div class="mb-prize__label"><span class="mb-sym" aria-hidden="true">🥇</span> 1st prize</div>
          ${numBtn(board.first)}
        </div>
        <div class="mb-prize">
          <div class="mb-prize__label"><span class="mb-sym" aria-hidden="true">🥈</span> 2nd Prize</div>
          ${numBtn(board.second)}
        </div>
        <div class="mb-prize">
          <div class="mb-prize__label"><span class="mb-sym" aria-hidden="true">🥉</span> 3rd Prize</div>
          ${numBtn(board.third)}
        </div>
      </div>
      <div class="mb-ticket__split">
        <div class="mb-col">
          <div class="mb-col__label"><span class="mb-sym" aria-hidden="true">⭐</span> Special</div>
          <div class="mb-grid">${board.special.map(numBtn).join("")}</div>
        </div>
        <div class="mb-col">
          <div class="mb-col__label"><span class="mb-sym" aria-hidden="true">🎁</span> Consolation</div>
          <div class="mb-grid">${board.consolation.map(numBtn).join("")}</div>
        </div>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    let boards4 = MINEBIG.getBoards("d4");
    let boards6 = MINEBIG.getBoards("d6");
    let dates = boards4.map((b) => b.date);
    const tabs = byId("draw-tabs");
    const dateField = byId("draw-date-field");
    const cal = byId("draw-cal");
    const calLabel = byId("draw-cal-label");
    const calGrid = byId("draw-cal-grid");
    const meaning = byId("num-meaning");
    const ticket4 = byId("ticket-d4");
    const ticket6 = byId("ticket-d6");
    let selected = dates[0];
    let calCursor = new Date(selected + "T12:00:00");

    function boardOn(list, date) {
      return list.find((b) => b.date === date) || list[0];
    }

    function closeCal() {
      if (!cal) return;
      cal.hidden = true;
      const btn = byId("draw-date-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }

    function paint() {
      renderBoard(ticket4, boardOn(boards4, selected), MINEBIG.GAMES[0]);
      renderBoard(ticket6, boardOn(boards6, selected), MINEBIG.GAMES[1]);
      if (dateField) dateField.textContent = MINEBIG.formatShortDate(selected);
      if (tabs) {
        tabs.querySelectorAll(".mb-tab").forEach((btn) => {
          const on = btn.dataset.date === selected;
          btn.classList.toggle("is-on", on);
          if (on) btn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        });
      }

      if (meaning) {
        meaning.hidden = true;
        meaning.textContent = "";
      }
    }

    function choose(date) {
      if (!dates.includes(date)) return;
      selected = date;
      calCursor = new Date(date + "T12:00:00");
      paint();
      closeCal();
    }

    function rebuildTabs() {
      if (!tabs) return;
      const slice = dates.slice(0, 5).reverse();
      tabs.innerHTML = slice.map((date) =>
        `<button type="button" class="mb-tab" data-date="${date}">
          <span class="mb-tab__code">${escapeHtml(MINEBIG.drawCode(date))}</span>
          <span class="mb-tab__date">${escapeHtml(MINEBIG.formatDrawDate(date))}</span>
        </button>`
      ).join("");
    }

    if (tabs) {
      rebuildTabs();
      tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".mb-tab");
        if (btn) choose(btn.dataset.date);
      });
    }

    function paintCal() {
      if (!calLabel || !calGrid) return;
      const y = calCursor.getFullYear();
      const m = calCursor.getMonth();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      calLabel.textContent = `${months[m]} ${y}`;
      const first = new Date(y, m, 1);
      const start = (first.getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      const drawSet = new Set(dates);
      let html = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) =>
        `<span class="mb-cal__dow">${d}</span>`
      ).join("");
      for (let i = 0; i < start; i += 1) html += `<span class="mb-cal__pad"></span>`;
      for (let day = 1; day <= days; day += 1) {
        const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const on = drawSet.has(iso);
        const current = iso === selected;
        html += `<button type="button" class="mb-cal__day${on ? " is-draw" : ""}${current ? " is-on" : ""}" data-date="${iso}" ${on ? "" : "disabled"}>${day}</button>`;
      }
      calGrid.innerHTML = html;
    }

    const dateBtn = byId("draw-date-btn");
    if (dateBtn && cal) {
      dateBtn.addEventListener("click", () => {
        const open = cal.hidden;
        if (open) {
          paintCal();
          cal.hidden = false;
          dateBtn.setAttribute("aria-expanded", "true");
        } else {
          closeCal();
        }
      });
      cal.addEventListener("click", (e) => {
        if (e.target.id === "draw-cal-prev") {
          calCursor.setMonth(calCursor.getMonth() - 1);
          paintCal();
        } else if (e.target.id === "draw-cal-next") {
          calCursor.setMonth(calCursor.getMonth() + 1);
          paintCal();
        } else {
          const day = e.target.closest(".mb-cal__day");
          if (day && !day.disabled) choose(day.dataset.date);
        }
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".mb-datepicker")) closeCal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCal();
      });
    }

    const body = byId("draw-boards");
    if (body) {
      body.addEventListener("click", (e) => {
        const btn = e.target.closest(".mb-num");
        if (!btn || !meaning) return;
        const n = btn.dataset.num;
        meaning.hidden = false;
        meaning.innerHTML = `<strong>${escapeHtml(n)}</strong> — ${escapeHtml(MINEBIG.meaningFor(n))} <a href="star-numbers.html#dictionary">Open dictionary →</a>`;
      });
    }

    // ---- draw results editor (single entry point for all values) ----
    const editor = byId("draw-editor");
    const editBtn = byId("draw-edit-btn");
    const closeBtn = byId("draw-editor-close");
    const applyBtn = byId("draw-editor-apply");
    const resetBtn = byId("draw-editor-reset");
    const ta4 = byId("draw-editor-d4");
    const ta6 = byId("draw-editor-d6");
    const status = byId("draw-editor-status");

    function openEditor() {
      if (!editor) return;
      ta4.value = MINEBIG.serializeBoards("d4");
      ta6.value = MINEBIG.serializeBoards("d6");
      if (status) { status.textContent = ""; status.className = "draw-editor__status"; }
      editor.hidden = false;
      editor.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    function reloadBoards() {
      boards4 = MINEBIG.getBoards("d4");
      boards6 = MINEBIG.getBoards("d6");
      dates = boards4.map((b) => b.date);
      selected = dates[0] || null;
      calCursor = selected ? new Date(selected + "T12:00:00") : new Date();
      rebuildTabs();
      if (cal && cal.hidden === false) paintCal();
      paint();
    }

    if (editBtn) editBtn.addEventListener("click", openEditor);
    if (closeBtn) closeBtn.addEventListener("click", () => { editor.hidden = true; });
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const r4 = MINEBIG.parseBoardText("d4", ta4.value);
        const r6 = MINEBIG.parseBoardText("d6", ta6.value);
        const errs = [...r4.errors, ...r6.errors];
        if (!status) return;
        if (errs.length) {
          status.textContent = errs.slice(0, 4).join(" ");
          status.className = "draw-editor__status is-err";
          return;
        }
        MINEBIG.saveBoardOverrides(ta4.value, ta6.value);
        status.textContent = "Applied — the boards, tabs and calendar updated.";
        status.className = "draw-editor__status is-ok";
        reloadBoards();
        editor.hidden = true;
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        MINEBIG.clearBoardOverrides();
        ta4.value = MINEBIG.serializeBoards("d4");
        ta6.value = MINEBIG.serializeBoards("d6");
        if (status) { status.textContent = "Default boards restored."; status.className = "draw-editor__status is-ok"; }
        reloadBoards();
      });
    }

    paint();
  });
})();
