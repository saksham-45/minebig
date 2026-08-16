/* ============================================================
   Home (P100) — hero countdown, ticker, carousel, lucky numbers
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

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

    // ---- ticker figures ----
    const winners = MINEBIG.WINNERS.length * 7;
    const tk1 = byId("tk-winners");
    const tk2 = byId("tk-winners2");
    if (tk1) tk1.textContent = winners;
    if (tk2) tk2.textContent = winners;

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

    // ---- carousel: results slide ----
    const carResults = byId("car-results");
    if (carResults) {
      const latest = MINEBIG.WINNERS[0];
      carResults.innerHTML =
        `<p class="muted">Draw of ${latest.date}</p>` +
        `<div class="mini-balls">${latest.nums.map((n, i) => `<span class="ball ${["", "teal", "mag"][i % 3]}">${n}</span>`).join("")}</div>` +
        `<div class="res-list">` +
        MINEBIG.TIERS.map((t) => `<div class="res-line"><span class="tier-chip ${t.cls}">${t.label}</span><span class="res-name">${latest.winners[t.key]}</span></div>`).join("") +
        `</div>`;
    }

    // ---- carousel: lucky numbers slide ----
    const carLucky = byId("car-lucky");
    if (carLucky) {
      function roll() {
        const taken = MINEBIG.getTaken();
        const pool = [];
        for (let n = 1; n <= 99 && pool.length < 20; n++) if (!taken.has(n)) pool.push(n);
        const picked = [];
        while (picked.length < 6 && pool.length) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        carLucky.innerHTML = picked.length
          ? picked.map((n, i) => `<span class="ball ${["", "teal", "mag", "", "teal"][i % 5]}">${n}</span>`).join("")
          : `<p class="muted">All taken this week — back after Sunday.</p>`;
      }
      const rb = byId("car-lucky-refresh");
      if (rb) rb.addEventListener("click", roll);
      roll();
    }

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
          track.scrollTo({ left: track.children[i].offsetLeft - track.offsetLeft, behavior: "auto" });
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
        track.scrollTo({ left: track.children[prev].offsetLeft - track.offsetLeft, behavior: "auto" });
      });
      byId("car-next").addEventListener("click", () => {
        const at = track.scrollLeft;
        let idx = 0;
        for (let i = 0; i < slides; i++) {
          if (track.children[i].offsetLeft - track.offsetLeft <= at + 20) idx = i;
        }
        const next = Math.min(slides - 1, idx + 1);
        track.scrollTo({ left: track.children[next].offsetLeft - track.offsetLeft, behavior: "auto" });
      });
    }
  });
})();
