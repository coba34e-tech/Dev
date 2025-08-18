(() => {
  const list = document.getElementById('admin-list');
  if (!list) return;

  async function init() {
    await requireAuth();
    await load();
    bindForm();
  }

  async function requireAuth() {
    const token = localStorage.getItem('afh_token');
    if (!token) {
      location.href = '/login.html';
      return Promise.reject();
    }
  }

  async function load() {
    list.innerHTML = '';
    const data = await window.afh.api('/api/products');
    const items = data.items || [];
    for (const p of items) {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `
        <div class="thumb"><img src="${p.image}" alt="${escapeHtml(p.title)}" /></div>
        <div class="body">
          <div class="title">${escapeHtml(p.title)}</div>
          <div class="meta">${escapeHtml(p.marketplace)} • ${escapeHtml(p.category)}</div>
          <div class="price">${window.afh.formatRupiah(p.price)}</div>
          <div class="actions">
            <button class="button" data-action="edit" data-id="${p.id}">Edit</button>
            <button class="button ghost" data-action="delete" data-id="${p.id}">Hapus</button>
          </div>
        </div>
      `;
      list.appendChild(el);
    }
    list.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (action === 'edit') {
        const prod = await window.afh.api('/api/products/' + id);
        fillForm(prod);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (action === 'delete') {
        if (!confirm('Hapus produk ini?')) return;
        await window.afh.api('/api/products/' + id, { method: 'DELETE' });
        await load();
      }
    });
  }

  function bindForm() {
    const form = document.getElementById('product-form');
    const resetBtn = document.getElementById('btn-reset');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = collectForm();
      if (body.id) {
        await window.afh.api('/api/products/' + body.id, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await window.afh.api('/api/products', { method: 'POST', body: JSON.stringify(body) });
      }
      form.reset();
      document.getElementById('prod-id').value = '';
      await load();
    });
    resetBtn.addEventListener('click', () => { form.reset(); document.getElementById('prod-id').value = ''; });
  }

  function collectForm() {
    return {
      id: byId('prod-id').value || undefined,
      title: byId('prod-title').value,
      marketplace: byId('prod-market').value,
      category: byId('prod-category').value,
      price: Number(byId('prod-price').value || 0),
      rating: Number(byId('prod-rating').value || 0),
      reviews: Number(byId('prod-reviews').value || 0),
      commissionRate: Number(byId('prod-commission').value || 0) / 100,
      popularity: Number(byId('prod-popularity').value || 0),
      image: byId('prod-image').value,
      affiliateUrl: byId('prod-affurl').value,
      description: byId('prod-desc').value
    };
  }

  function fillForm(p) {
    byId('prod-id').value = p.id;
    byId('prod-title').value = p.title || '';
    byId('prod-market').value = p.marketplace || 'Other';
    byId('prod-category').value = p.category || '';
    byId('prod-price').value = p.price || 0;
    byId('prod-rating').value = p.rating || 0;
    byId('prod-reviews').value = p.reviews || 0;
    byId('prod-commission').value = (Number(p.commissionRate || 0) * 100).toFixed(1);
    byId('prod-popularity').value = p.popularity || 0;
    byId('prod-image').value = p.image || '';
    byId('prod-affurl').value = p.affiliateUrl || '';
    byId('prod-desc').value = p.description || '';
  }

  function byId(id) { return document.getElementById(id); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

  init().catch(() => {});
})();

