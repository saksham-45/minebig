/* ============================================================
   Contact Us — message form (demo: stores in browser)
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("c-submit");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const name = document.getElementById("c-name").value.trim();
      const email = document.getElementById("c-email").value.trim();
      const subject = document.getElementById("c-subject").value.trim();
      const message = document.getElementById("c-message").value.trim();
      const err = document.getElementById("c-err");
      const ok = document.getElementById("c-ok");

      if (!name || !email || !subject || !message) {
        err.textContent = "Please fill in all fields — name, email, subject and message.";
        ok.style.display = "none";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        err.textContent = "That email address doesn't look right — please check it.";
        ok.style.display = "none";
        return;
      }
      err.textContent = "";

      // demo persistence only
      try {
        const msgs = JSON.parse(localStorage.getItem("minebig_messages")) || [];
        msgs.push({ name, email, subject, message, at: Date.now() });
        localStorage.setItem("minebig_messages", JSON.stringify(msgs));
      } catch (e) { /* preview mode */ }

      ok.style.display = "block";
      document.getElementById("contact-form").reset();
    });
  });
})();
