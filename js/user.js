/* ============================================================
   Player (user) login + portal — separate from the agent portal
   Demo logic; data lives in the browser.
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  function guard() {
    const name = localStorage.getItem("minebig_user");
    const page = location.pathname.split("/").pop();
    if (page === "user-portal.html" && !name) {
      location.href = "login.html?role=player";
      return;
    }
    const who = byId("user-name");
    if (who && name) who.textContent = name;
  }

  function bindLogout() {
    const btn = byId("user-logout");
    if (!btn) return;
    btn.addEventListener("click", () => {
      localStorage.removeItem("minebig_user");
      location.href = "login.html";
    });
  }

  // ---- my codes ----
  function myCodes() {
    const name = localStorage.getItem("minebig_user") || "guest";
    try { return JSON.parse(localStorage.getItem(`minebig_codes_${name}`)) || []; }
    catch (e) { return []; }
  }
  function saveCodes(list) {
    const name = localStorage.getItem("minebig_user") || "guest";
    localStorage.setItem(`minebig_codes_${name}`, JSON.stringify(list));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function digitChips(code) {
    return String(code).split("").map((d) => `<span class="ball sm">${escapeHtml(d)}</span>`).join("");
  }

  function renderCodes() {
    const box = byId("my-codes");
    const codes = myCodes();
    if (!codes.length) {
      box.innerHTML = `<p class="muted center" style="padding:10px 0">No codes saved yet — add a code below to track it.</p>`;
      return;
    }
    box.innerHTML = codes.map((c, idx) => {
      const r = MINEBIG.lookupTicket(c.code);
      let pill, cls;
      if (r.status === "win") { cls = "win"; pill = `<span class="pill warn">🏆 WINNER</span>`; }
      else if (r.status === "taken") { cls = "taken"; pill = `<span class="pill bad">Sold — not a winner</span>`; }
      else if (r.status === "notfound") { cls = "missing"; pill = `<span class="pill">No record this week</span>`; }
      else { cls = "missing"; pill = `<span class="pill">Invalid code</span>`; }
      const d = new Date(c.at);
      return `<div class="card feature" style="margin-top:12px">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
          <h3>🎟️ <span class="gold">${digitChips(c.code)}</span></h3>
          <button type="button" data-idx="${idx}" class="del-code" aria-label="Remove code ${escapeHtml(c.code)}" style="flex:none;width:34px;height:34px;border-radius:50%;border:none;background:var(--red);color:#fff;font-size:15px;font-weight:900;cursor:pointer">×</button>
        </div>
        ${pill}
        <p class="muted" style="font-size:14px;margin-top:6px">Saved ${d.toLocaleDateString()} · codes reset every Sunday 12 PM</p>
      </div>`;
    }).join("");
    box.querySelectorAll(".del-code").forEach((b) => {
      b.addEventListener("click", () => {
        const list = myCodes();
        list.splice(Number(b.dataset.idx), 1);
        saveCodes(list);
        renderCodes();
      });
    });
  }

  function bindAddCode() {
    const btn = byId("add-code");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const input = byId("new-code");
      const raw = input.value;
      const clean = String(raw || "").replace(/[\s,\-;]+/g, "");
      if (!clean) { byId("add-code-msg").textContent = "Enter your code first."; return; }
      if (!/^\d{4}$/.test(clean) && !/^\d{6}$/.test(clean)) {
        byId("add-code-msg").textContent = "Codes are 4 or 6 single digits (0-9) — e.g. 4821 or 482196.";
        return;
      }
      const code = clean;
      const list = myCodes();
      if (list.some((c) => c.code === code)) {
        byId("add-code-msg").textContent = "That code is already in your list.";
        return;
      }
      list.push({ code, at: Date.now() });
      saveCodes(list);
      input.value = "";
      byId("add-code-msg").textContent = "Code added — status checked below.";
      renderCodes();
    });
    const input = byId("new-code");
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });
  }


  function renderLatest() {
    const latest = MINEBIG.WINNERS[0];
    const date = byId("user-latest-date");
    const nums = byId("user-latest-nums");
    if (date) date.textContent = latest.date;
    if (nums) nums.innerHTML = MINEBIG.digitCode(latest.nums).map((n) => `<span class="ball sm">${n}</span>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    guard();
    bindLogout();
    bindAddCode();
    renderLatest();
    if (location.pathname.split("/").pop() === "user-portal.html") renderCodes();
  });
})();
