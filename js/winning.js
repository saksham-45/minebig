/* ============================================================
   Winning Numbers — last 3 months + lifetime number archive
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // latest draw hero
    const latest = MINEBIG.WINNERS[0];
    const latestNums = document.getElementById("latest-nums");
    if (latestNums) {
      latestNums.innerHTML = latest.nums.map((n) => `<span class="ball">${n}</span>`).join("");
    }
    const latestDate = document.getElementById("latest-date");
    if (latestDate) latestDate.textContent = latest.date;

    // last 3 months draws
    const tbody = document.getElementById("draws-body");
    if (tbody) {
      tbody.innerHTML = MINEBIG.WINNERS.map((w) => {
        const nums = w.nums.map((n) => `<span class="num-chip">${n}</span>`).join("");
        const tiers = MINEBIG.TIERS.map((t) => w.winners[t.key] || "—").join(" · ");
        return `<tr><td data-label="Draw date">${w.date}</td><td data-label="Winning numbers">${nums}</td><td data-label="Winners">${escapeHtml(tiers)}</td></tr>`;
      }).join("");
    }

    // lifetime frequency
    const freq = document.getElementById("lifetime-body");
    if (freq) {
      const rows = MINEBIG.lifetimeCounts();
      const max = rows[0][1];
      freq.innerHTML = rows.map(([n, c]) => {
        const pct = Math.round((c / max) * 100);
        return `<tr>
          <td data-label="Number"><span class="num-chip">${n}</span></td>
          <td data-label="Times won">${c}</td>
          <td data-label="Frequency"><div style="height:8px;background:rgba(255,255,255,0.08);overflow:hidden">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--yellow),var(--magenta))"></div>
          </div></td>
        </tr>`;
      }).join("");
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
