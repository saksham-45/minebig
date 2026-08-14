/* ============================================================
   Results & Winners — latest 4D/6D results + results timeline
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  document.addEventListener("DOMContentLoaded", () => {
    const latest = MINEBIG.DRAWS;

    // ---- latest results: 4D + 6D ----
    const nums4 = byId("latest-nums-d4");
    const nums6 = byId("latest-nums-d6");
    if (nums4) {
      nums4.innerHTML = latest.d4[0].num.split("").map((d) => `<span class="ball">${d}</span>`).join("");
    }
    if (nums6) {
      nums6.innerHTML = latest.d6[0].num.split("").map((d) => `<span class="ball teal">${d}</span>`).join("");
    }
    const d4 = byId("latest-date-d4");
    const d6 = byId("latest-date-d6");
    if (d4) d4.textContent = latest.d4[0].date;
    if (d6) d6.textContent = latest.d6[0].date;

    // ---- results timeline ----
    function timelineRows(gameId, tbodyId) {
      const tbody = byId(tbodyId);
      if (!tbody) return;
      tbody.innerHTML = MINEBIG.DRAWS[gameId].map((d) =>
        `<tr>
          <td data-label="Draw date">${d.date}</td>
          <td data-label="Winning number"><span class="num-chip">${d.num}</span></td>
          <td data-label="Winner location">${escapeHtml(d.city)}, ${escapeHtml(d.country)}</td>
        </tr>`
      ).join("");
    }
    timelineRows("d4", "timeline-d4");
    timelineRows("d6", "timeline-d6");
  });
})();
