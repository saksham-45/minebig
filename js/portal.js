/* ============================================================
   Agent Portal — number picker, code locking, log book, winners
   Demo logic; all data lives in the browser (localStorage).
   ============================================================ */

(function () {
  const week = MINEBIG.weekKey();

  function byId(id) { return document.getElementById(id); }

  // ---- guard: portal requires login ----
  function guard() {
    const name = MINEBIG.agentName();
    const page = location.pathname.split("/").pop();
    if (page === "login.html") {
      if (name) location.href = "agent-portal.html";
      return;
    }
    if (page === "agent-portal.html" && !name) {
      location.href = "login.html?role=agent";
      return;
    }
    if (name) {
      const who = byId("agent-name");
      if (who) who.textContent = name;
    }
  }

  function bindLogin() {
    const btn = byId("login-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const name = (byId("login-name").value || "").trim();
      const pass = byId("login-pass").value;
      if (!name) { byId("login-err").textContent = "Enter an agent name to continue."; return; }
      if (!pass) { byId("login-err").textContent = "Enter the portal password. (Demo: any password works.)"; return; }
      MINEBIG.setAgent(name);
      location.href = "agent-portal.html";
    });
  }

  function bindLogout() {
    const btn = byId("logout-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      MINEBIG.clearAgent();
      location.href = "login.html";
    });
  }

  // ================= number picker =================
  const slots = [0, 1, 2, 3, 4, 5].map(() => ({
    el: null, status: null,
  }));

  function statusOf(slot) {
    const v = Number(slot.el.value);
    if (!slot.el.value.trim()) return { kind: "empty", label: "empty" };
    if (!Number.isInteger(v) || v <= 0) return { kind: "bad", label: "invalid" };
    if (MINEBIG.isTaken(v)) return { kind: "taken", label: "taken" };
    return { kind: "ok", label: "available" };
  }

  function renderSlotStatus(i) {
    const s = slots[i];
    const st = statusOf(s);
    s.status.className = "status " + (st.kind === "ok" ? "ok" : st.kind === "taken" || st.kind === "bad" ? "bad" : "");
    s.status.textContent = st.label;
    return st;
  }

  function renderSuggestions() {
    const box = byId("suggest-box");
    const takenNums = slots.map((s, i) => statusOf(s).kind === "taken" ? Number(s.el.value) : null).filter((n) => n !== null);
    if (!takenNums.length) { box.classList.remove("show"); box.innerHTML = ""; return; }
    const sugg = MINEBIG.suggestAlternatives(takenNums[0], 5);
    box.classList.add("show");
    box.innerHTML =
      `<strong class="teal">Number ${takenNums[0]} is taken — available nearby:</strong><br>` +
      sugg.map((s) => `<span class="s-num" data-n="${s}">${s}</span>`).join("");
    box.querySelectorAll(".s-num").forEach((el) => {
      el.addEventListener("click", () => {
        const target = slots.find((s, i) => statusOf(s).kind === "taken");
        if (target) { target.el.value = el.dataset.n; renderSlotStatus(slots.indexOf(target)); renderSuggestions(); }
      });
    });
  }

  function initPicker() {
    for (let i = 0; i < 6; i++) {
      const slot = {
        el: byId(`num-${i}`),
        status: byId(`num-${i}-status`),
      };
      slots[i] = slot;
      slot.el.addEventListener("input", () => { renderSlotStatus(i); renderSuggestions(); });
      slot.el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const next = byId(`num-${Math.min(i + 1, 5)}`);
          if (next && next !== e.target) next.focus();
        }
      });
      renderSlotStatus(i);
    }

    byId("buy-code").addEventListener("click", () => {
      const out = byId("buy-result");
      const states = slots.map((_, i) => renderSlotStatus(i));
      const invalid = states.some((s) => s.kind === "bad");
      const taken = states.some((s) => s.kind === "taken");
      const empty = states.some((s) => s.kind === "empty");
      if (empty) { showBuy(out, "missing", "Fill all 6 number slots first."); return; }
      if (invalid) { showBuy(out, "taken", "Every slot must be a natural number (1, 2, 3…)."); return; }
      if (taken) { showBuy(out, "taken", "One or more numbers are already taken this week — use the suggested alternatives."); return; }
      const nums = slots.map((s) => Number(s.el.value));
      const code = nums.join("-");
      const takenSet = MINEBIG.getTaken();
      nums.forEach((n) => takenSet.add(n));
      MINEBIG.setTaken(takenSet);
      const tickets = getTickets();
      tickets.push({ code, at: Date.now(), week, agent: MINEBIG.agentName(), buyer: null, phone: null });
      localStorage.setItem("minebig_tickets", JSON.stringify(tickets));
      showBuy(out, "win", `Code created and locked: <span class="big-nums">${code.replace(/-/g, " - ")}</span><br>No other agent can sell this combination this week. Record the sale in your log book below.`);
      renderTickets();
      renderLogbook();
    });

    byId("demo-reset").addEventListener("click", () => {
      MINEBIG.setTaken(new Set());
      localStorage.removeItem("minebig_tickets");
      slots.forEach((_, i) => { slots[i].el.value = ""; renderSlotStatus(i); });
      byId("suggest-box").classList.remove("show");
      renderTickets();
      renderLogbook();
      const out = byId("buy-result");
      out.className = "result show ok";
      out.innerHTML = `<h3>Demo reset</h3><p>This week's pool is fresh again — all numbers available.</p>`;
    });
  }

  function showBuy(el, kind, html) {
    el.className = "result show " + kind;
    el.innerHTML = html;
  }

  // ================= tickets + log book =================
  function getTickets() {
    try {
      const all = JSON.parse(localStorage.getItem("minebig_tickets")) || [];
      return all.filter((t) => t.week === week);
    } catch (e) { return []; }
  }

  function renderTickets() {
    const box = byId("ticket-list");
    const tickets = getTickets();
    if (!tickets.length) {
      box.innerHTML = `<p class="muted center">No codes bought this week yet.</p>`;
      return;
    }
    box.innerHTML = tickets.map((t) => {
      const recorded = t.buyer;
      return `<div class="card feature mt" style="margin-top:14px">
        <h3>🎟️ <span class="gold">${t.code.replace(/-/g, " - ")}</span> ${t.week}</h3>
        ${recorded
          ? `<p><span class="pill ok">Recorded — sold to ${escapeHtml(t.buyer)}</span></p>`
          : `<p class="muted">Not yet recorded. Who did you sell this to?</p>
             <div class="logbook-actions" style="justify-content:flex-start">
               <input type="text" id="buyer-${t.code}" placeholder="Buyer name" style="width:160px">
               <input type="tel" id="phone-${t.code}" placeholder="Phone" style="width:160px">
               <button class="btn btn-teal" data-code="${t.code}" data-rec="1" style="padding:10px 18px">Record</button>
             </div>`}
      </div>`;
    }).join("");
    box.querySelectorAll("[data-rec]").forEach((b) => {
      b.addEventListener("click", () => {
        const code = b.dataset.code;
        const buyer = byId(`buyer-${code}`).value.trim();
        const phone = byId(`phone-${code}`).value.trim();
        if (!buyer) { alert("Enter the buyer's name to record the sale."); return; }
        const tickets = getTickets();
        const t = tickets.find((x) => x.code === code);
        if (!t || t.buyer) return;
        t.buyer = buyer; t.phone = phone || "—";
        localStorage.setItem("minebig_tickets", JSON.stringify(tickets));
        MINEBIG.addLogEntry({ code, buyer, phone: phone || "—", agent: MINEBIG.agentName(), at: Date.now(), week });
        renderTickets();
        renderLogbook();
      });
    });
  }

  function renderLogbook() {
    const tbody = byId("logbook-body");
    const book = MINEBIG.getLogbook().filter((e) => e.week === week);
    if (!book.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="center muted">No sales recorded yet — sold codes stay here permanently.</td></tr>`;
      return;
    }
    tbody.innerHTML = book.map((e) => {
      const d = new Date(e.at);
      const stamp = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `<tr>
        <td>${stamp}</td>
        <td>${e.code.replace(/-/g, " - ")}</td>
        <td>${escapeHtml(e.buyer)}</td>
        <td>${escapeHtml(e.phone)}</td>
        <td><span class="won-tag" style="background:linear-gradient(90deg,#4ade80,#22d3ee);color:#04222b">PERMANENT</span></td>
      </tr>`;
    }).join("");
  }

  // ================= winners =================
  function renderWinners() {
    const latest = MINEBIG.WINNERS[0];
    const tbody = byId("winners-body");
    const rows = MINEBIG.WINNERS.map((w) => {
      const nums = w.nums.map((n) => `<span class="num-chip">${n}</span>`).join("");
      const tiers = MINEBIG.TIERS.map((t) => w.winners[t.key] || "—").join(" · ");
      return `<tr><td>${w.date}</td><td>${nums}</td><td>${escapeHtml(tiers)}</td></tr>`;
    }).join("");
    tbody.innerHTML = rows;
    const latestNums = latest.nums.map((n) => `<span class="ball sm mag">${n}</span>`).join("");
    byId("latest-nums").innerHTML = latestNums;
    byId("latest-date").textContent = latest.date;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  document.addEventListener("DOMContentLoaded", () => {
    guard();
    bindLogin();
    bindLogout();
    if (location.pathname.split("/").pop() === "agent-portal.html") {
      const wl = byId("week-label");
      if (wl) wl.textContent = week;
      initPicker();
      renderTickets();
      renderLogbook();
      renderWinners();
    }
  });
})();
