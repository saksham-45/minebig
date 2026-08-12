/* ============================================================
   Connect to Agent — lead form (demo: stores leads in browser)
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("lead-submit");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const name = document.getElementById("lead-name").value.trim();
      const phone = document.getElementById("lead-phone").value.trim();
      const area = document.getElementById("lead-area").value.trim();
      const time = document.getElementById("lead-time").value;
      const note = document.getElementById("lead-note").value.trim();
      const err = document.getElementById("lead-err");
      const ok = document.getElementById("lead-ok");

      if (!name || !phone || !area) {
        err.textContent = "Please fill in your name, phone and area — the agent needs these to reach you.";
        ok.style.display = "none";
        return;
      }
      err.textContent = "";

      // demo persistence only
      try {
        const leads = JSON.parse(localStorage.getItem("minebig_leads")) || [];
        leads.push({ name, phone, area, time, note, at: Date.now() });
        localStorage.setItem("minebig_leads", JSON.stringify(leads));
      } catch (e) { /* preview mode */ }

      ok.style.display = "block";
      document.getElementById("lead-form").reset();
    });
  });
})();
