/* ============================================================
   Next Draw - MineBig 4D countdown, live window,
   prize tables. Every Sunday 12:00 PM local time, 15-minute
   live event, then back to countdown.
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  function fmt(n) { return String(n).padStart(2, "0"); }

  function renderCountdown(el, target) {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    el.innerHTML =
      `<div class="unit"><div class="num">${fmt(d)}</div><div class="lbl">Days</div></div>` +
      `<div class="unit"><div class="num">${fmt(h)}</div><div class="lbl">Hours</div></div>` +
      `<div class="unit"><div class="num">${fmt(m)}</div><div class="lbl">Minutes</div></div>` +
      `<div class="unit"><div class="num sec">${fmt(s)}</div><div class="lbl">Seconds</div></div>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const cdD4 = byId("cd-d4");
    const liveView = byId("live-view");
    const playLeft = byId("play-left");
    let forcedLive = false;
    let forcedUntil = 0;

    // ---- prize tables ----
    const prizeRow = (t) =>
      `<tr><td style="border-top:none;padding:10px 16px 10px 0;font-weight:700;color:var(--ink)">${t.label}</td>` +
      `<td style="border-top:none;padding:10px 0;text-align:right;color:var(--gold-deep);font-weight:800">[amount pending]</td></tr>`;
    const t4 = byId("prizes-d4");
    if (t4) t4.innerHTML = MINEBIG.PRIZE_TIERS.map(prizeRow).join("");

    // ---- recent winners sample (4D winning codes) ----
    const winsEl = byId("upcoming-winners");
    function renderWinnersSample() {
      if (!winsEl) return;
      const sample = MINEBIG.WINNERS.slice(0, 3);
      winsEl.innerHTML = sample.map((w) => {
        const codes = MINEBIG.codesForDate(w.date);
        const codeChips = codes.d4 ? `<span class="code-chip">${codes.d4}</span>` : "";
        return `<div class="win-row">
          <div class="win-row__date">${MINEBIG.formatShortDate(w.date)}</div>
          <div class="win-row__digits">${codeChips}</div>
          <div class="win-row__tiers">1st - ${w.winners.first} · Special - ${w.winners.special}</div>
        </div>`;
      }).join("");
    }
    renderWinnersSample();
    window.addEventListener("minebig:sheet-loaded", renderWinnersSample);
    function showLive(until) {
      if (liveView) liveView.style.display = "block";
      if (cdD4) cdD4.closest(".card").style.display = "none";
      const left = Math.max(0, until - Date.now());
      const m = Math.floor(left / 6e4);
      const s = Math.floor((left % 6e4) / 1e3);
      if (playLeft) playLeft.textContent = `${fmt(m)}:${fmt(s)}`;
    }

    function showCountdown(target) {
      if (liveView) liveView.style.display = "none";
      if (cdD4) { cdD4.closest(".card").style.display = ""; renderCountdown(cdD4, target); }
    }

    function tick() {
      const now = new Date();
      if (forcedLive) {
        if (now.getTime() >= forcedUntil) {
          forcedLive = false;
        } else {
          showLive(forcedUntil);
          return;
        }
      }
      const liveUntil = MINEBIG.isLiveWindow(now);
      if (liveUntil) {
        showLive(liveUntil);
      } else {
        showCountdown(MINEBIG.nextSundayNoon(now));
      }
    }

    const demoBtn = byId("demo-live");
    if (demoBtn) {
      demoBtn.addEventListener("click", () => {
        forcedLive = !forcedLive;
        if (forcedLive) forcedUntil = Date.now() + 15 * 60 * 1000;
        demoBtn.textContent = forcedLive ? "Exit preview" : "Preview live";
        tick();
      });
    }

    tick();
    setInterval(tick, 1000);
  });
})();
