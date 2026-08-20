/* ============================================================
   Star Numbers - symbolic dictionary + draw statistics
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
      const slug = String(d.word || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "default";
      const src = d.image || ("img/dict/" + slug + ".svg");
      const art = `<span class="dict-art-wrap"><img class="dict-art" src="${escapeHtml(src)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='img/dict/_default.svg'"></span>`;
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

  function heatPad(freq) {
    const counts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => freq[String(d)] || 0);
    const max = Math.max(...counts, 1);
    const min = Math.min(...counts);
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""];
    const cells = keys.map((d) => {
      if (d === "") return `<span class="heat-key heat-key--ghost"></span>`;
      const c = counts[d];
      const t = (c - min) / (max - min || 1);
      const tag = t >= 0.66 ? "Hot" : t <= 0.33 ? "Cool" : "Warm";
      const cls = t >= 0.66 ? "is-hot" : t <= 0.33 ? "is-cool" : "is-warm";
      return `<button type="button" class="heat-key ${cls}" data-digit="${d}" style="--heat:${t.toFixed(2)}">
        <b>${d}</b><small>${c}× · ${tag}</small>
      </button>`;
    }).join("");
    return `<div class="heat-pad">${cells}</div>
      <p class="heat-legend"><span class="is-hot">Hot</span> drawn more · <span class="is-warm">Warm</span> mid · <span class="is-cool">Cool</span> drawn less</p>`;
  }

  function renderStats(days) {
    const d4 = byId("stats-d4");
    const d6 = byId("stats-d6");
    if (d4) d4.innerHTML = heatPad(MINEBIG.digitFreq("d4", days));
    if (d6) d6.innerHTML = heatPad(MINEBIG.digitFreq("d6", days));
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderDict("");

    const search = byId("dict-search");
    if (search) {
      search.addEventListener("input", () => renderDict(search.value));
    }

    const selects = Array.from(document.querySelectorAll(".stat-period-select"));
    function applyPeriod(days) {
      selects.forEach((s) => { s.value = String(days); });
      renderStats(days);
    }
    selects.forEach((sel) => {
      sel.addEventListener("change", () => applyPeriod(Number(sel.value)));
    });
    applyPeriod(0);
  });
})();
