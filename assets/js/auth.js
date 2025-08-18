// Simple front-only auth mock (localStorage based)
(function() {
  const AUTH_KEY = 'alldream_auth_user';
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function saveSession(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
  }

  // Expose globally for other scripts
  window.AllDreamAuth = {
    isAuthenticated: function() { return !!getSession(); },
    getUser: getSession,
    login: function(email, password) {
      // Demo user
      const demoEmail = 'demo@alldream.id';
      const demoPass = 'demo123';
      const ok = (email === demoEmail && password === demoPass);
      if (ok) {
        const user = { email: demoEmail, name: 'Demo User' };
        saveSession(user);
        return { ok: true, user };
      }
      return { ok: false };
    },
    logout: function() { clearSession(); },
    requireAuthOrRedirect: function() {
      if (!this.isAuthenticated()) {
        window.location.href = 'login.html';
      }
    }
  };

  // Login page behavior
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      const errorEl = document.getElementById('loginError');
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const res = window.AllDreamAuth.login(email, password);
        if (res.ok) {
          // Optionally persist longer when remember is checked
          if (!remember) {
            // mimic session by clearing on tab close
            window.addEventListener('beforeunload', () => window.AllDreamAuth.logout());
          }
          window.location.href = 'dasbor.html';
        } else {
          errorEl.classList.remove('hidden');
        }
      });
    }
  });
})();

