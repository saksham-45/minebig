/* ============================================================
   Check Status — ticket status lookup + number availability.
   Codes are single digits (0-9): 4 digits (4D) or 6 digits (6D).
   ============================================================ */

(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function digitChips(code) {
    return String(code).split("").map((d) => `<span class="ball">${escapeHtml(d)}</span>`).join("");
  }

  // ---- teletext keypad: keyed digits are the whole input ----
  const keypad = document.getElementById("keypad");
  const ticketInput = document.getElementById("ticket-code");
  if (keypad && ticketInput) {
    keypad.addEventListener("click", (e) => {
      const k = e.target.dataset.k;
      if (!k) return;
      if (k === "CLR") { ticketInput.value = ""; ticketInput.focus(); return; }
      if (k === "ENT") { document.getElementById("check-ticket").click(); return; }
      ticketInput.value += k;
      ticketInput.focus();
    });
    // physical digit keys work too when not typing in an input
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (/^[0-9]$/.test(e.key)) ticketInput.value += e.key;
      if (e.key === "Enter") document.getElementById("check-ticket").click();
    });
  }

  // ---- ticket status ----
  const ticketBtn = document.getElementById("check-ticket");
  if (ticketBtn) {
    ticketBtn.addEventListener("click", () => {
      const input = document.getElementById("ticket-code").value;
      const res = document.getElementById("ticket-result");
      const r = MINEBIG.lookupTicket(input);
      res.className = "result show";
      const chips = r.code && /^[\d-]+$/.test(r.code)
        ? `<div class="big-nums">${digitChips(r.code.replace(/-/g, ""))}</div>` : "";
      if (r.status === "win") {
        res.classList.add("win");
        res.innerHTML =
          `<h3>★ WINNER — This code won!</h3>` +
          chips +
          `<p>This code won in the latest Sunday draw. Collect your prize through your agent — <a class="teal" href="connect.html">connect with an agent</a> to arrange the handover.</p>`;
      } else if (r.status === "taken") {
        res.classList.add("taken");
        res.innerHTML =
          `<h3>Code already sold</h3>` +
          chips +
          `<p>This code was sold this week. It did not win the latest draw. Winner announcements are published every Sunday — check again after the draw.</p>`;
      } else if (r.status === "notfound") {
        res.classList.add("missing");
        res.innerHTML =
          `<h3>Code not found</h3>` +
          chips +
          `<p>No record of this code this week. Codes reset every Sunday 12 PM.</p>`;
      } else if (r.status === "invalid") {
        res.classList.add("missing");
        res.innerHTML =
          `<h3>Invalid code</h3>` +
          `<p>Codes are 4 or 6 single digits (0-9) — e.g. <strong>4821</strong> or <strong>482196</strong>. You can enter either.</p>`;
      } else {
        res.classList.add("missing");
        res.innerHTML = `<h3>Enter a code first</h3><p>Enter your 4 number code or your six number code and we'll check it.</p>`;
      }
    });
  }

  // ---- number availability (4- or 6-digit codes) ----
  const availBtn = document.getElementById("check-avail");
  if (availBtn) {
    const availOut = document.getElementById("avail-result");
    const suggestEl = document.getElementById("avail-suggest");

    function gameFor(raw) {
      if (/^\d{4}$/.test(raw)) return { game: "d4", code: raw };
      if (/^\d{6}$/.test(raw)) return { game: "d6", code: raw };
      return null;
    }

    function randomFree(game, digits) {
      let code = "";
      for (let i = 0; i < digits; i++) code += Math.floor(Math.random() * 10);
      return MINEBIG.isNumberTaken(game, code) ? randomFree(game, digits) : code;
    }

    function renderAvail(raw) {
      const clean = String(raw || "").replace(/[\s,\-;]+/g, "");
      availOut.className = "result show";
      if (!clean) {
        availOut.classList.add("missing");
        availOut.innerHTML = `<h3>Enter a code first</h3><p>Type 4 or 6 digits to check availability.</p>`;
        suggestEl.innerHTML = "";
        return;
      }
      const g = gameFor(clean);
      if (!g) {
        availOut.classList.add("missing");
        availOut.innerHTML = `<h3>Invalid code</h3><p>Codes are 4 or 6 single digits (0-9) — e.g. 4821 or 482196.</p>`;
        suggestEl.innerHTML = "";
        return;
      }
      const digits = g.game === "d4" ? 4 : 6;
      if (MINEBIG.isNumberTaken(g.game, g.code)) {
        availOut.classList.add("taken");
        availOut.innerHTML =
          `<h3>Already sold this week</h3>` +
          `<div class="big-nums">${digitChips(g.code)}</div>` +
          `<p>This code is taken for the current week. Codes reset every Sunday 12 PM. Try one of these instead:</p>`;
        const alts = [];
        while (alts.length < 3) {
          const c = randomFree(g.game, digits);
          if (c !== g.code && !alts.includes(c)) alts.push(c);
        }
        suggestEl.innerHTML = `<div class="mini-balls" style="justify-content:flex-start;margin-top:8px">` +
          alts.map((c) => `<span class="ball sm teal">${c}</span>`).join("") + `</div>`;
      } else {
        availOut.classList.add("win");
        availOut.innerHTML =
          `<h3>Available — go for it!</h3>` +
          `<div class="big-nums">${digitChips(g.code)}</div>` +
          `<p>This code is still free this week. <a class="teal" href="try-your-luck.html">Add it to your selection →</a></p>`;
        suggestEl.innerHTML = "";
      }
    }

    availBtn.addEventListener("click", () => renderAvail(document.getElementById("avail-input").value));
    document.getElementById("avail-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") renderAvail(e.target.value);
    });
  }
})();
