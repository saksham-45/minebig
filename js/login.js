/* ============================================================
   Login (P500) — one login, two channels: player or agent
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  let role = null;

  function selectRole(r) {
    role = r;
    document.querySelectorAll(".role-card").forEach((c) => {
      const on = c.dataset.role === r;
      c.classList.toggle("selected", on);
      c.setAttribute("aria-pressed", String(on));
    });
    const form = byId("login-form");
    form.style.display = "block";
    byId("role-label").textContent = r === "agent"
      ? "Agent channel — selling & locking codes"
      : "Player channel — tracking your codes";
    byId("login-name").value = "";
    byId("login-pass").value = "";
    byId("login-err").textContent = "";
    byId("login-name").focus();
  }

  function submit() {
    const name = (byId("login-name").value || "").trim();
    const pass = byId("login-pass").value;
    const err = byId("login-err");
    if (!role) { err.textContent = "Choose a role first — player or agent."; return; }
    if (!name) { err.textContent = "Enter your name."; return; }
    if (!pass) { err.textContent = "Enter a password. (Demo: any password works.)"; return; }

    if (role === "agent") {
      sessionStorage.setItem("minebig_agent", name);
      localStorage.removeItem("minebig_user");
      location.href = "agent-portal.html";
    } else {
      localStorage.setItem("minebig_user", name);
      sessionStorage.removeItem("minebig_agent");
      location.href = "user-portal.html";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // already signed in? go straight to the right portal
    if (sessionStorage.getItem("minebig_agent")) { location.href = "agent-portal.html"; return; }
    if (localStorage.getItem("minebig_user")) { location.href = "user-portal.html"; return; }

    const params = new URLSearchParams(location.search);
    const preset = params.get("role");
    if (preset === "agent" || preset === "player") {
      selectRole(preset);
    }

    document.querySelectorAll(".role-card").forEach((c) => {
      c.addEventListener("click", () => selectRole(c.dataset.role));
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectRole(c.dataset.role);
        }
      });
    });

    // keyed-digit idiom: 1 = player, 2 = agent
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "1") selectRole("player");
      if (e.key === "2") selectRole("agent");
      if (e.key === "Enter" && role) submit();
    });

    byId("login-btn").addEventListener("click", submit);
    byId("switch-role").addEventListener("click", (e) => {
      e.preventDefault();
      role = null;
      document.querySelectorAll(".role-card").forEach((c) => c.classList.remove("selected"));
      byId("login-form").style.display = "none";
    });
  });
})();
