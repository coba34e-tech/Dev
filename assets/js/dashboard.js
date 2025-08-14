(function(){
  function drawSpark(canvasId, points, color){
    const c = document.getElementById(canvasId);
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height; ctx.clearRect(0,0,w,h);
    const max = Math.max(...points, 1);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
    points.forEach((v,i)=>{
      const x = (i/(points.length-1)) * (w-20) + 10;
      const y = h - (v/max) * (h-20) - 10;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }

  function switchView(view){
    document.querySelectorAll('[data-view]').forEach(sec => {
      const is = sec.getAttribute('data-view') === view;
      sec.hidden = !is;
    });
    document.querySelectorAll('#dashMenu a').forEach(a => a.setAttribute('aria-current', a.dataset.view===view ? 'page' : 'false'));
    location.hash = view;
  }

  function refreshOverview(app){
    document.getElementById('cardTotalProducts').textContent = String(app.products.length);
    const avgCommission = app.products.reduce((s,p)=> s + (p.commission?.percent||0), 0) / Math.max(app.products.length, 1);
    document.getElementById('cardAvgCommission').textContent = (Math.round(avgCommission*10)/10) + '%';
    const avgRating = app.products.reduce((s,p)=> s + (p.rating||0), 0) / Math.max(app.products.length, 1);
    document.getElementById('cardAvgRating').textContent = (Math.round(avgRating*10)/10).toString();
    const networks = new Set(app.products.map(p => p.network).filter(Boolean));
    document.getElementById('cardNetworks').textContent = String(networks.size);
    drawSpark('perfChart', Array.from({length:24}, (_,i)=> Math.round(50 + 30*Math.sin(i/3) + Math.random()*20)), '#06b6d4');
  }

  function fillSelects(app){
    const byCat = document.getElementById('filterByCategory');
    const byNet = document.getElementById('filterByNetwork');
    byCat.innerHTML = window.renderOptions(app.categories, 'id', 'name', true);
    const nets = Array.from(new Set(app.products.map(p => p.network))).filter(Boolean).map(n => ({ id: n, name: n }))
    byNet.innerHTML = window.renderOptions(nets, 'id', 'name', true);
  }

  function renderProductTable(app){
    const tbody = document.querySelector('#productTable tbody');
    const catFilter = document.getElementById('filterByCategory').value;
    const netFilter = document.getElementById('filterByNetwork').value;
    const q = document.getElementById('dashSearch').value.toLowerCase().trim();
    let list = app.products.slice();
    if (catFilter) list = list.filter(p => String(p.categoryId) === catFilter);
    if (netFilter) list = list.filter(p => String(p.network) === netFilter);
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q));
    tbody.innerHTML = list.map(p => {
      const cat = app.categories.find(c => c.id === p.categoryId)?.name || '-';
      const commission = p.commission?.percent ? (p.commission.percent + '%') : (p.commission?.fixed ? window.formatCurrencyIDR(p.commission.fixed) : '-');
      return `<tr>
        <td><a href="/workspace/produk.html?id=${p.id}" target="_blank">${p.name}</a></td>
        <td>${cat}</td>
        <td>${p.network||'-'}</td>
        <td>${window.formatCurrencyIDR(p.price||0)}</td>
        <td>${commission}</td>
        <td>
          <button class="btn small" data-edit="${p.id}">Edit</button>
          <button class="btn small ghost" data-del="${p.id}">Hapus</button>
        </td>
      </tr>`
    }).join('');
    // Bind actions
    tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openProductForm(app, btn.getAttribute('data-edit'))));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteProduct(app, btn.getAttribute('data-del'))));
  }

  function syncAndRender(app){
    window.setAppData(app);
    refreshOverview(app);
    fillSelects(app);
    renderProductTable(app);
    renderCategoryList(app);
    updateNetworkDatalist(app);
    document.getElementById('saveStatus').textContent = 'Tersimpan';
    setTimeout(()=>{ document.getElementById('saveStatus').textContent = 'Tidak ada perubahan'; }, 1200);
  }

  function openProductForm(app, id){
    const dlg = document.getElementById('productDialog');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productFormTitle');
    const item = app.products.find(p => String(p.id) === String(id));
    title.textContent = item ? 'Edit Produk' : 'Tambah Produk';
    document.getElementById('prodId').value = item?.id || '';
    document.getElementById('prodName').value = item?.name || '';
    document.getElementById('prodBrand').value = item?.brand || '';
    document.getElementById('prodCategory').innerHTML = window.renderOptions(app.categories, 'id', 'name', false);
    document.getElementById('prodCategory').value = item?.categoryId || app.categories[0]?.id || '';
    document.getElementById('prodNetwork').value = item?.network || '';
    document.getElementById('prodPrice').value = item?.price || '';
    document.getElementById('prodCommission').value = item?.commission?.percent || '';
    document.getElementById('prodDesc').value = item?.description || '';
    document.getElementById('prodLink').value = item?.link || '';
    document.getElementById('prodImage').value = item?.image || '';
    document.getElementById('prodTags').value = (item?.tags||[]).join(', ');
    dlg.showModal();
    form.onsubmit = (e)=>{
      e.preventDefault();
      const next = {
        id: item?.id || Math.floor(Date.now()/1000),
        name: document.getElementById('prodName').value.trim(),
        brand: document.getElementById('prodBrand').value.trim(),
        categoryId: parseInt(document.getElementById('prodCategory').value,10),
        network: document.getElementById('prodNetwork').value.trim(),
        price: parseFloat(document.getElementById('prodPrice').value||'0'),
        commission: { percent: parseFloat(document.getElementById('prodCommission').value||'0') },
        description: document.getElementById('prodDesc').value.trim(),
        link: document.getElementById('prodLink').value.trim(),
        image: document.getElementById('prodImage').value.trim() || 'https://images.unsplash.com/photo-1499955085172-a104c9463ece?q=80&w=900&auto=format&fit=crop',
        tags: document.getElementById('prodTags').value.split(',').map(t=>t.trim()).filter(Boolean),
        rating: item?.rating || 4.5,
        reviews: item?.reviews || 0
      };
      const idx = app.products.findIndex(p => p.id === next.id);
      if (idx >= 0) app.products[idx] = next; else app.products.unshift(next);
      dlg.close();
      syncAndRender(app);
    };
  }

  function deleteProduct(app, id){
    if (!confirm('Hapus produk ini?')) return;
    app.products = app.products.filter(p => String(p.id) !== String(id));
    syncAndRender(app);
  }

  function renderCategoryList(app){
    const list = document.getElementById('categoryList');
    list.innerHTML = app.categories.map(c => `<li style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
      <span>${c.name} <span class="muted">(${c.count||0})</span></span>
      <span>
        <button class="btn small" data-edit-cat="${c.id}">Edit</button>
        <button class="btn small ghost" data-del-cat="${c.id}">Hapus</button>
      </span>
    </li>`).join('');
    list.querySelectorAll('[data-edit-cat]').forEach(btn => btn.addEventListener('click', ()=> fillCategoryForm(app, btn.getAttribute('data-edit-cat'))));
    list.querySelectorAll('[data-del-cat]').forEach(btn => btn.addEventListener('click', ()=> deleteCategory(app, btn.getAttribute('data-del-cat'))));

    // Form
    const form = document.getElementById('categoryForm');
    form.onsubmit = (e)=>{
      e.preventDefault();
      const id = document.getElementById('catId').value;
      const name = document.getElementById('catName').value.trim();
      const slug = document.getElementById('catSlug').value.trim();
      if (!name || !slug) return;
      const existing = id ? app.categories.find(c => String(c.id)===String(id)) : null;
      const next = { id: existing?.id || Math.floor(Date.now()/1000), name, slug };
      if (existing) {
        Object.assign(existing, next);
      } else {
        app.categories.push(next);
      }
      app.categories = app.categories.map(c => ({...c, count: app.products.filter(p => p.categoryId===c.id).length }));
      syncAndRender(app);
      form.reset();
    };
    form.onreset = ()=>{ document.getElementById('catId').value=''; };
  }

  function fillCategoryForm(app, id){
    const item = app.categories.find(c => String(c.id) === String(id));
    if (!item) return;
    document.getElementById('catId').value = item.id;
    document.getElementById('catName').value = item.name;
    document.getElementById('catSlug').value = item.slug;
  }

  function deleteCategory(app, id){
    if (!confirm('Hapus kategori ini? Produk terkait akan kehilangan kategori.')) return;
    const catId = parseInt(id,10);
    app.categories = app.categories.filter(c => c.id !== catId);
    app.products = app.products.map(p => p.categoryId===catId ? {...p, categoryId: (app.categories[0]?.id||0)} : p);
    app.categories = app.categories.map(c => ({...c, count: app.products.filter(p => p.categoryId===c.id).length }));
    syncAndRender(app);
  }

  function updateNetworkDatalist(app){
    const d = document.getElementById('networks');
    const nets = Array.from(new Set(app.products.map(p => p.network))).filter(Boolean).sort();
    d.innerHTML = nets.map(n => `<option value="${n}"></option>`).join('');
  }

  function initSEO(app){
    const form = document.getElementById('seoForm');
    const state = window.loadLocal('seoMeta', { title: 'Katalog Afiliasi', desc: 'Temukan produk afiliasi terbaik', keywords: 'afiliasi, komisi, produk' });
    const title = document.getElementById('seoTitle');
    const desc = document.getElementById('seoDesc');
    const keys = document.getElementById('seoKeywords');
    const preview = document.getElementById('serpPreview');
    title.value = state.title; desc.value = state.desc; keys.value = state.keywords;
    function renderPreview(){
      preview.innerHTML = `<div class="t">${title.value || 'Judul halaman'}</div><div class="u">https://example.com/</div><div class="d">${desc.value || 'Deskripsi meta'}</div>`;
    }
    renderPreview();
    form.addEventListener('input', renderPreview);
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      window.saveLocal('seoMeta', { title: title.value, desc: desc.value, keywords: keys.value });
      document.getElementById('saveStatus').textContent = 'Tersimpan';
      setTimeout(()=>{ document.getElementById('saveStatus').textContent = 'Tidak ada perubahan'; }, 1200);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    window.updateYear();
    const app = window.getAppData();

    // Sidebar navigation
    document.querySelectorAll('#dashMenu a').forEach(a => a.addEventListener('click', (e)=>{
      e.preventDefault();
      switchView(a.dataset.view);
    }));
    switchView(location.hash?.replace('#','') || 'overview');

    refreshOverview(app);
    fillSelects(app);
    renderProductTable(app);
    renderCategoryList(app);
    updateNetworkDatalist(app);
    initSEO(app);

    // Toolbar filters
    document.getElementById('dashSearch').addEventListener('input', () => renderProductTable(app));
    document.getElementById('filterByCategory').addEventListener('change', () => renderProductTable(app));
    document.getElementById('filterByNetwork').addEventListener('change', () => renderProductTable(app));

    // Add product
    document.getElementById('btnAddProduct').addEventListener('click', ()=> openProductForm(app));

    // Settings
    const optNoindex = document.getElementById('optNoindex');
    const s = window.loadLocal('settings', { noindex: true });
    optNoindex.checked = s.noindex;
    optNoindex.addEventListener('change', ()=>{ window.saveLocal('settings', { noindex: optNoindex.checked }); });

    // Analytics mock
    drawSpark('analyticsChart', Array.from({length:30}, ()=> Math.round(50+Math.random()*100)), '#9ccaff');
  });
})();