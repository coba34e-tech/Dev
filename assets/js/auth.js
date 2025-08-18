// Simple front-only auth mock (sessionStorage/localStorage based)
(function() {
  const AUTH_KEY = 'alldream_auth_user';
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function saveSession(user, persist) {
    try {
      const payload = JSON.stringify(user);
      if (persist) localStorage.setItem(AUTH_KEY, payload);
      else sessionStorage.setItem(AUTH_KEY, payload);
    } catch {}
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function clearSession() {
    try { sessionStorage.removeItem(AUTH_KEY); } catch {}
    try { localStorage.removeItem(AUTH_KEY); } catch {}
  }

  // Expose globally for other scripts
  window.AllDreamAuth = {
    isAuthenticated: function() { return !!getSession(); },
    getUser: getSession,
    login: function(email, password, persist) {
      // Demo user
      const demoEmail = 'demo@alldream.id';
      const demoPass = 'demo123';
      const ok = (email === demoEmail && password === demoPass);
      if (ok) {
        const user = { email: demoEmail, name: 'Demo User' };
        saveSession(user, !!persist);
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
        const res = window.AllDreamAuth.login(email, password, remember);
        if (res.ok) {
          window.location.href = 'dasbor.html';
        } else {
          errorEl.classList.remove('hidden');
        }
      });
    }
  });
})();

