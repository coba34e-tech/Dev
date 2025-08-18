(() => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('login-error');
    error.classList.add('hidden');
    try {
      const data = await window.afh.api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('afh_token', data.token);
      location.href = '/dashboard.html';
    } catch (e) {
      error.textContent = e.message || 'Email atau password salah';
      error.classList.remove('hidden');
    }
  });
})();

