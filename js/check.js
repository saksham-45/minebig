/* ============================================================
   Check Status — ticket status lookup + number availability
   ============================================================ */

(function () {
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
      const nums = r.code ? r.code.replace(/-/g, " - ") : "";
      if (r.status === "win") {
        res.classList.add("win");
        res.innerHTML =
          `<h3>★ WINNER — This code won!</h3>` +
          `<div class="big-nums">${nums}</div>` +
          `<p>This code won in the latest Sunday draw. Collect your prize through your agent — <a class="teal" href="connect.html">connect with an agent</a> to arrange the handover.</p>`;
      } else if (r.status === "taken") {
        res.classList.add("taken");
        res.innerHTML =
          `<h3>Code already sold</h3>` +
          `<div class="big-nums">${nums}</div>` +
          `<p>This code was sold this week. It did not win the latest draw. Winner announcements are published every Sunday — check again after the draw.</p>`;
      } else if (r.status === "notfound") {
        res.classList.add("missing");
        res.innerHTML =
          `<h3>Code not found</h3>` +
          `<div class="big-nums">${nums}</div>` +
          `<p>No record of this code this week. Codes reset every Sunday 12 PM — or check the number format (6 numbers, e.g. 4-19-27-33-41-49).</p>`;
      } else {
        res.classList.add("missing");
        res.innerHTML = `<h3>Enter a code first</h3><p>Type your 6 numbers, separated by spaces, dashes or commas.</p>`;
      }
    });
  }

  // ---- number availability ----
  const availBtn = document.getElementById("check-avail");
  if (availBtn) {
    const availOut = document.getElementById("avail-result");
    const suggestEl = document.getElementById("avail-suggest");
    function renderAvail(n) {
      const num = Number(n);
      if (!Number.isInteger(num) || num <= 0) {
        availOut.className = "result show missing";
        availOut.innerHTML = `<h3>Enter a number</h3><p>Type any natural number to check if it is available this week.</p>`;
        suggestEl.classList.remove("show");
        return;
      }
      const taken = MINEBIG.isTaken(num);
      availOut.className = "result show " + (taken ? "taken" : "ok");
      availOut.innerHTML = taken
        ? `<h3>❌ Number ${num} is taken this week</h3><p>It was sold to another player. Try one of the suggestions below.</p>`
        : `<h3>✅ Number ${num} is available!</h3><p>You can include it in your code. Get it before someone else does.</p>`;
      const sugg = taken ? MINEBIG.suggestAlternatives(num) : [];
      if (taken && sugg.length) {
        suggestEl.classList.add("show");
        suggestEl.innerHTML =
          `<strong class="teal">Available nearby:</strong><br>` +
          sugg.map((s) => `<span class="s-num" data-n="${s}">${s}</span>`).join("");
        suggestEl.querySelectorAll(".s-num").forEach((el) => {
          el.addEventListener("click", () => {
            document.getElementById("avail-input").value = el.dataset.n;
            renderAvail(el.dataset.n);
          });
        });
      } else {
        suggestEl.classList.remove("show");
      }
    }
    availBtn.addEventListener("click", () => renderAvail(document.getElementById("avail-input").value));
    document.getElementById("avail-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") renderAvail(e.target.value);
    });
  }
})();
