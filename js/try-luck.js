/* ============================================================
   Try Your Luck - game selector, availability check,
   selection clipboard, agent hand-off (demo, browser-only)
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  let game = "d4";

  function gameName(id) {
    const g = MINEBIG.GAMES.find((x) => x.id === id);
    return g ? g.name : id.toUpperCase();
  }

  function digitsFor(id) {
    const g = MINEBIG.GAMES.find((x) => x.id === id);
    return g ? g.digits : 4;
  }

  // ---- clipboard rendering ----
  function renderClipboard() {
    const list = MINEBIG.getClipboard();
    const items = byId("cb-items");
    const count = byId("cb-count");
    const empty = byId("cb-empty");
    const connect = byId("cb-connect");
    if (count) count.textContent = `${list.length} number${list.length === 1 ? "" : "s"}`;
    if (items) {
      items.innerHTML = list.map((x) =>
        `<span class="cb-item">${escapeHtml(x.num)} <small>${gameName(x.game)}</small>` +
        `<button type="button" data-game="${x.game}" data-num="${escapeHtml(x.num)}" aria-label="Remove ${escapeHtml(x.num)}">×</button></span>`
      ).join("");
    }
    if (empty) empty.style.display = list.length ? "none" : "block";
    if (connect) {
      connect.style.pointerEvents = list.length ? "auto" : "none";
      connect.style.opacity = list.length ? "1" : "0.45";
    }
    items && items.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        MINEBIG.removeFromClipboard(b.dataset.game, b.dataset.num);
        renderClipboard();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const sel = byId("game-selector");
    const input = byId("pick-number");
    const hint = byId("pick-hint");
    const result = byId("avail-result");

    // ---- game selector ----
    sel && sel.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-game]");
      if (!btn) return;
      game = btn.dataset.game;
      sel.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === btn));
      if (hint) hint.textContent = `Enter exactly ${digitsFor(game)} digits for ${gameName(game)}.`;
      input && (input.value = "");
      result && (result.className = "result");
    });

    // quick pick: fill with a random valid number
    const qp = byId("quick-pick");
    qp && qp.addEventListener("click", () => {
      const digits = digitsFor(game);
      let n = "";
      for (let i = 0; i < digits; i++) n += Math.floor(Math.random() * 10);
      input.value = n;
      if (hint) hint.textContent = `Quick pick for ${gameName(game)}: ${n}`;
      result && (result.className = "result");
    });

    // ---- availability check ----
    const btn = byId("check-avail");
    btn && btn.addEventListener("click", () => {
      const v = (input.value || "").trim();
      const digits = digitsFor(game);
      if (!/^\d+$/.test(v)) {
        result.className = "result show taken";
        result.innerHTML = `<h3>Digits only</h3><p>Enter a number made of digits - no letters or symbols.</p>`;
        return;
      }
      if (v.length !== digits) {
        result.className = "result show taken";
        result.innerHTML = `<h3>Wrong length</h3><p>${gameName(game)} needs exactly <strong>${digits} digits</strong> - you entered ${v.length}.</p>`;
        return;
      }
      if (MINEBIG.isNumberTaken(game, v)) {
        result.className = "result show taken";
        result.innerHTML = `<h3>This number has already been taken.</h3><p>Try another.</p>`;
        return;
      }
      const already = MINEBIG.getClipboard().some((x) => x.game === game && x.num === v);
      result.className = "result show ok";
      result.innerHTML =
        `<h3>This number is available!</h3>` +
        (already
          ? `<p>Already in your selection.</p>`
          : `<p style="margin-top:10px"><button class="btn btn-green" id="add-to-sel" type="button">Add to Selection</button></p>`);
      const add = byId("add-to-sel");
      if (add) {
        add.addEventListener("click", () => {
          MINEBIG.addToClipboard(game, v);
          renderClipboard();
          result.innerHTML = `<h3>Added to your selection.</h3>`;
          input.value = "";
        });
      }
    });
    input && input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btn && btn.click();
    });

    // ---- clipboard controls ----
    const clear = byId("cb-clear");
    clear && clear.addEventListener("click", () => {
      localStorage.removeItem("minebig_clipboard");
      renderClipboard();
    });

    renderClipboard();
  });
})();
