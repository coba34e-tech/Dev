(() => {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;

  function getFilters() {
    const q = document.getElementById('search-input').value.trim();
    const marketChecks = Array.from(document.querySelectorAll('input[name="marketplace"]:checked')).map(el => el.value);
    const category = document.getElementById('category-select').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    const sort = document.getElementById('sort-select').value;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (marketChecks.length) params.set('marketplace', marketChecks.join(','));
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);
    return params.toString();
  }

  async function load() {
    grid.innerHTML = '';
    empty.classList.add('hidden');
    const qs = getFilters();
    const url = qs ? `/api/products?${qs}` : '/api/products';
    const data = await window.afh.api(url);
    const items = data.items || [];
    if (!items.length) {
      empty.classList.remove('hidden');
      return;
    }
    const frag = document.createDocumentFragment();
    for (const p of items) {
      const card = renderCard(p);
      frag.appendChild(card);
    }
    grid.appendChild(frag);
  }

  function renderCard(p) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="thumb"><img loading="lazy" src="${p.image}" alt="${escapeHtml(p.title)}" /></div>
      <div class="body">
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="meta">
          <span class="badge" style="border-color:${getMarketColor(p.marketplace)}; color:${getMarketColor(p.marketplace)}; background:transparent;">${escapeHtml(p.marketplace)}</span>
          <span>⭐ ${Number(p.rating || 0).toFixed(1)}</span>
          <span>(${Number(p.reviews || 0).toLocaleString('id-ID')})</span>
        </div>
        <div class="price">${window.afh.formatRupiah(p.price)}</div>
        <div class="actions">
          <a class="button" href="#" data-id="${p.id}" data-url="${p.affiliateUrl}">Dapatkan Link</a>
          <a class="button ghost" href="${p.affiliateUrl}" target="_blank" rel="nofollow noopener">Kunjungi</a>
        </div>
      </div>
    `;
    const btn = el.querySelector('a.button');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await trackClick(p.id);
      navigator.clipboard.writeText(p.affiliateUrl).catch(() => {});
      btn.textContent = 'Link disalin ✔';
      setTimeout(() => (btn.textContent = 'Dapatkan Link'), 1500);
    });
    return el;
  }

  function getMarketColor(name) {
    return (window.afh.marketplaces[name] || window.afh.marketplaces['Other']).color;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  async function trackClick(productId) {
    try {
      await window.afh.api('/api/track/click', { method: 'POST', body: JSON.stringify({ productId }) });
    } catch (e) {
      // ignore
    }
  }

  document.getElementById('apply-filters').addEventListener('click', (e) => { e.preventDefault(); load(); });
  document.getElementById('reset-filters').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('search-input').value = '';
    document.getElementById('category-select').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('sort-select').value = '';
    document.querySelectorAll('input[name="marketplace"]').forEach(el => (el.checked = false));
    load();
  });
  document.getElementById('search-form').addEventListener('submit', (e) => { e.preventDefault(); load(); });

  load();
})();

