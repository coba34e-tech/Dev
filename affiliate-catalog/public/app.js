(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn) {
    // apply initial theme
    const saved = localStorage.getItem('afh_theme');
    if (saved === 'light') document.documentElement.classList.add('light');
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      html.classList.toggle('light');
      localStorage.setItem('afh_theme', html.classList.contains('light') ? 'light' : 'dark');
    });
  }

  const token = localStorage.getItem('afh_token');
  const loginBtn = document.getElementById('btn-login');
  const logoutBtn = document.getElementById('btn-logout');
  if (loginBtn && token) {
    loginBtn.textContent = 'Dasbor';
    loginBtn.href = '/dashboard.html';
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('afh_token');
      location.href = '/login.html';
    });
  }
})();

// Utilities
window.afh = {
  formatRupiah(value) {
    try {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
    } catch (e) {
      return 'Rp ' + (Number(value || 0)).toLocaleString('id-ID');
    }
  },
  async api(path, options = {}) {
    const token = localStorage.getItem('afh_token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(path, { ...options, headers });
    if (!res.ok) {
      let msg = 'Request gagal';
      try { const data = await res.json(); msg = data.message || msg; } catch (e) {}
      throw new Error(msg);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
  },
  marketplaces: {
    'Shopee': { color: '#ee4d2d' },
    'Tokopedia': { color: '#42b549' },
    'Lazada': { color: '#1a2c7b' },
    'TikTok Shop': { color: '#000000' },
    'Blibli': { color: '#0aa1dd' },
    'Other': { color: '#64748b' }
  }
};

