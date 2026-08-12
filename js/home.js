/* ============================================================
   Home — latest draw strip + lucky number generator
   (Magnum-style results-first homepage elements)
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // ---- latest draw strip ----
    const latestWrap = document.getElementById("latest-draw");
    if (latestWrap) {
      const latest = MINEBIG.WINNERS[0];
      const balls = latest.nums.map((n) => `<span class="ball sm">${n}</span>`).join("");
      const tiers = MINEBIG.TIERS
        .map((t) => `<strong>${t.label}</strong>: ${latest.winners[t.key] || "—"}`)
        .join(" &nbsp;·&nbsp; ");
      latestWrap.innerHTML =
        `<span class="draw-date">Latest draw — ${latest.date}</span>` +
        `<div class="balls">${balls}</div>` +
        `<div class="tiers">${tiers}</div>` +
        `<p class="note"><a href="winning.html">View all results →</a></p>`;
    }

    // ---- lucky number generator ----
    const gen = document.getElementById("lucky-gen");
    if (gen) {
      const box = document.getElementById("lucky-balls");
      const copyOk = document.getElementById("lucky-copy-ok");
      let current = [];

      function generate() {
        const taken = MINEBIG.getTaken();
        const pool = [];
        for (let n = 1; n <= 99 && pool.length < 20; n++) {
          if (!taken.has(n)) pool.push(n);
        }
        const picked = [];
        while (picked.length < 6 && pool.length) {
          const i = Math.floor(Math.random() * pool.length);
          picked.push(pool.splice(i, 1)[0]);
        }
        current = picked;
        box.innerHTML = picked.length
          ? picked.map((n) => `<span class="ball ${["", "mag", "teal", "violet"][n % 4]}">${n}</span>`).join("")
          : `<span class="empty-note">All numbers taken this week — check back after Sunday's reset.</span>`;
        copyOk.textContent = "";
      }

      document.getElementById("lucky-refresh").addEventListener("click", generate);
      document.getElementById("lucky-copy").addEventListener("click", () => {
        if (!current.length) return;
        navigator.clipboard.writeText(current.join("-")).then(() => {
          copyOk.textContent = "Copied: " + current.join("-");
        }).catch(() => { copyOk.textContent = "Copy failed — select the numbers manually."; });
      });
      generate();
    }
  });
})();
