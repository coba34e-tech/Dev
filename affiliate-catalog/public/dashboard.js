(() => {
  async function init() {
    await requireAuth();
    await loadStats();
  }

  async function requireAuth() {
    const token = localStorage.getItem('afh_token');
    if (!token) {
      location.href = '/login.html';
      return Promise.reject();
    }
  }

  async function loadStats() {
    const data = await window.afh.api('/api/stats');
    const { totals, clicksByMarketplace, convByMarketplace, topProducts } = data;
    document.getElementById('stat-clicks').textContent = totals.clicks;
    document.getElementById('stat-conv').textContent = totals.conversions;
    document.getElementById('stat-revenue').textContent = window.afh.formatRupiah(totals.revenue);
    renderBars('chart-clicks-market', clicksByMarketplace);
    renderBars('chart-conv-market', convByMarketplace);
    renderTop(topProducts || []);
  }

  function renderBars(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const entries = Object.entries(data || {});
    const maxVal = Math.max(1, ...entries.map(([, v]) => v));
    for (const [name, val] of entries) {
      const col = document.createElement('div');
      col.style.flex = '1 1 0';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.alignItems = 'center';
      const bar = document.createElement('div');
      bar.style.height = (val / maxVal * 200 + 10) + 'px';
      bar.style.width = '100%';
      bar.style.background = (window.afh.marketplaces[name] || window.afh.marketplaces['Other']).color;
      bar.style.borderRadius = '8px 8px 0 0';
      const label = document.createElement('div');
      label.style.fontSize = '12px';
      label.style.color = 'var(--muted)';
      label.style.marginTop = '6px';
      label.textContent = name + ' (' + val + ')';
      col.appendChild(bar);
      col.appendChild(label);
      container.appendChild(col);
    }
  }

  function renderTop(rows) {
    const container = document.getElementById('top-products');
    container.innerHTML = '';
    for (const row of rows) {
      const p = row.product || {};
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `
        <div class="thumb"><img src="${p.image}" alt="${escapeHtml(p.title || '')}" /></div>
        <div class="body">
          <div class="title">${escapeHtml(p.title || '')}</div>
          <div class="meta">Klik: ${row.clicks} · Konversi: ${row.conversions} · Komisi: ${window.afh.formatRupiah(row.revenue)}</div>
        </div>
      `;
      container.appendChild(el);
    }
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

  init().catch(() => {});
})();

