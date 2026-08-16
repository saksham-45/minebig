/* ============================================================
   Star Numbers — symbolic dictionary + draw statistics
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---- dictionary: render + live search ----
  function renderDict(filter) {
    const grid = byId("dict-grid");
    if (!grid) return;
    const q = (filter || "").trim().toLowerCase();
    const rows = MINEBIG.DICTIONARY.filter((d) =>
      !q || d.word.toLowerCase().includes(q) || d.nums.some((n) => n.includes(q))
    );
    grid.innerHTML = rows.map((d) => {
      const art = d.image
        ? `<img class="dict-art" src="${escapeHtml(d.image)}" alt="" loading="lazy">`
        : `<span class="dict-sym" aria-hidden="true">${d.symbol || "⭐"}</span>`;
      const meaning = d.meaning
        ? `<span class="dict-meaning">${escapeHtml(d.meaning)}</span>` : "";
      return `<div class="dict-item">
        ${art}
        <div class="dict-body">
          <span class="word">${escapeHtml(d.word)}</span>
          ${meaning}
          <span class="nums">${d.nums.map((n) => `<span>${escapeHtml(n)}</span>`).join("")}</span>
        </div>
      </div>`;
    }).join("");
    const empty = byId("dict-empty");
    if (empty) empty.style.display = rows.length ? "none" : "block";
  }

  // ---- statistics: bars for most/least drawn digits ----
  function statLines(entries, total) {
    if (!entries.length) return `<p class="muted">No data for this range yet.</p>`;
    const max = entries[0][1];
    return entries.map(([digit, count]) => {
      const pct = max ? Math.round((count / max) * 100) : 0;
      return `<div class="stat-line">
        <span class="num">${digit}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="count">${count}×</span>
      </div>`;
    }).join("");
  }

  function renderStats(days) {
    const els = {
      "stats-most-d4": MINEBIG.mostFrequent("d4", days),
      "stats-least-d4": MINEBIG.leastFrequent("d4", days),
      "stats-most-d6": MINEBIG.mostFrequent("d6", days),
      "stats-least-d6": MINEBIG.leastFrequent("d6", days),
    };
    for (const [id, entries] of Object.entries(els)) {
      const el = byId(id);
      if (el) el.innerHTML = statLines(entries);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderDict("");

    const search = byId("dict-search");
    if (search) {
      search.addEventListener("input", () => renderDict(search.value));
    }

    // filter chips
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach((c) => c.classList.toggle("on", c === chip));
        renderStats(Number(chip.dataset.days));
      });
    });
    renderStats(0);
  });
})();
