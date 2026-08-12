/* ============================================================
   Events (P110) — weekly countdown + live window + HOLD
   Every Sunday 12:00 PM local time: 15-minute live event,
   then back to countdown for the next Sunday.
   ============================================================ */

(function () {
  const cd = document.getElementById("countdown");
  const liveEl = document.getElementById("live-view");
  const cdEl = document.getElementById("countdown-view");
  const playLeft = document.getElementById("play-left");
  let forcedLive = false;
  let forcedUntil = 0;
  let held = false;
  let heldAt = null;
  let lastTarget = null;

  function fmt(n) { return String(n).padStart(2, "0"); }

  function renderCountdown(target) {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);
    cd.innerHTML =
      `<div class="unit"><div class="num">${fmt(d)}</div><div class="lbl">Days</div></div>` +
      `<div class="unit"><div class="num">${fmt(h)}</div><div class="lbl">Hours</div></div>` +
      `<div class="unit"><div class="num">${fmt(m)}</div><div class="lbl">Minutes</div></div>` +
      `<div class="unit"><div class="num sec">${fmt(s)}</div><div class="lbl">Seconds</div></div>`;
  }

  function showCountdown(target) {
    liveEl.style.display = "none";
    cdEl.style.display = "block";
    renderCountdown(target);
  }

  function showLive(until) {
    cdEl.style.display = "none";
    liveEl.style.display = "block";
    const left = Math.max(0, until - Date.now());
    const m = Math.floor(left / 6e4);
    const s = Math.floor((left % 6e4) / 1e3);
    playLeft.textContent = `${fmt(m)}:${fmt(s)}`;
  }

  function tick() {
    const now = new Date();
    if (held) return;
    if (forcedLive) {
      if (now.getTime() >= forcedUntil) {
        forcedLive = false;
      } else {
        showLive(forcedUntil);
      }
      return;
    }
    const liveUntil = MINEBIG.isLiveWindow(now);
    if (liveUntil) {
      showLive(liveUntil);
    } else {
      const target = MINEBIG.nextSundayNoon(now);
      lastTarget = target;
      showCountdown(target);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("demo-live");
    if (btn) {
      btn.addEventListener("click", () => {
        forcedLive = !forcedLive;
        if (forcedLive) forcedUntil = Date.now() + 15 * 60 * 1000;
        btn.textContent = forcedLive ? "Exit live preview" : "Preview live event";
        tick();
      });
    }
    const holdBtn = document.getElementById("demo-hold");
    if (holdBtn) {
      holdBtn.addEventListener("click", () => {
        held = !held;
        if (held) {
          heldAt = lastTarget ? lastTarget.getTime() : Date.now();
          holdBtn.textContent = "RELEASE countdown";
        } else {
          holdBtn.textContent = "HOLD countdown";
          tick();
        }
      });
    }
    tick();
    setInterval(tick, 1000);
  });
})();
