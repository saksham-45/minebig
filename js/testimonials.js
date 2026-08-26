/* ============================================================
   Testimonials - past winners grouped by prize tier
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const wrap = document.getElementById("winners-by-tier");
    if (!wrap) return;
    const latest = MINEBIG.WINNERS[0];

    let html = "";
    MINEBIG.TIERS.forEach((tier) => {
      const name = latest.winners[tier.key] || "-";
      const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2);
      html += `
        <div class="tier-head">
          <h3><span class="tier-chip ${tier.cls}">${tier.label}</span></h3>
          <div class="line"></div>
        </div>
        <div class="grid3" style="margin-top:0">
          <div class="winner-card">
            <div class="avatar ${tier.cls}">${initials}</div>
            <div class="name">${escapeHtml(name)}</div>
            <div class="draw">Winner - draw of ${latest.date}</div>
            <div class="quote">“Winning with MineBig felt personal - my agent walked me through everything, right up to the handover.”</div>
            <div class="nums">${(() => { const c = MINEBIG.codesForDate(latest.date); return c.d4 ? `<span class="ball sm">${c.d4}</span>` : ""; })()}</div>
          </div>
        </div>`;
    });
    wrap.innerHTML = html;
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
