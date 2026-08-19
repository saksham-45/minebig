/* ============================================================
   Login (P500) - player login by default; agents use the small
   "Agent login" link at the bottom for the secure agent channel
   ============================================================ */

(function () {
  function byId(id) { return document.getElementById(id); }

  let role = "player";

  function paint() {
    const label = byId("role-label");
    const hint = byId("role-hint");
    const agentLink = byId("agent-login");
    const isAgent = role === "agent";
    if (label) label.textContent = isAgent ? "Agent login" : "Player login";
    if (hint) hint.textContent = isAgent
      ? "Agent channel - selling & locking codes"
      : "Player channel - tracking your codes";
    if (agentLink) {
      agentLink.textContent = isAgent ? "Player login" : "Agent login";
      agentLink.href = isAgent ? "login.html" : "login.html?role=agent";
    }
    const err = byId("login-err");
    if (err) err.textContent = "";
  }

  function submit() {
    const name = (byId("login-name").value || "").trim();
    const pass = byId("login-pass").value;
    const err = byId("login-err");
    if (!name) { err.textContent = "Enter your name."; return; }
    if (!pass) { err.textContent = "Enter a password."; return; }

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
    if (preset === "agent") role = "agent";
    paint();

    byId("login-btn").addEventListener("click", submit);
    const form = byId("login-form");
    form.addEventListener("submit", (e) => { e.preventDefault(); submit(); });
    byId("login-pass").addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
  });
})();
