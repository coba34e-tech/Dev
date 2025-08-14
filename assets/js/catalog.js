(function(){
  function readParams(){
    const p = new URLSearchParams(location.search);
    return {
      q: p.get('q') || '',
      cat: p.get('cat') || '',
      sort: p.get('sort') || 'relevance',
      page: parseInt(p.get('page')||'1',10),
      perPage: parseInt(p.get('perPage')||'12',10)
    };
  }

  function applyFilters(products, params, filters){
    let list = products.slice();
    if (params.q) {
      const q = params.q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q) || (p.tags||[]).join(' ').toLowerCase().includes(q));
    }
    if (params.cat) {
      const app = window.getAppData();
      const cat = app.categories.find(c => c.slug === params.cat || String(c.id)===params.cat);
      if (cat) list = list.filter(p => p.categoryId === cat.id);
    }
    if (filters.categoryIds?.length) {
      list = list.filter(p => filters.categoryIds.includes(p.categoryId));
    }
    if (filters.networks?.length) {
      list = list.filter(p => filters.networks.includes(p.network));
    }
    if (filters.priceMin != null) list = list.filter(p => (p.price||0) >= filters.priceMin);
    if (filters.priceMax != null) list = list.filter(p => (p.price||0) <= filters.priceMax);
    if (filters.ratingMin != null) list = list.filter(p => (p.rating||0) >= filters.ratingMin);

    switch (params.sort) {
      case 'price_asc': list.sort((a,b)=> (a.price||0)-(b.price||0)); break;
      case 'price_desc': list.sort((a,b)=> (b.price||0)-(a.price||0)); break;
      case 'rating_desc': list.sort((a,b)=> (b.rating||0)-(a.rating||0)); break;
      case 'commission_desc': list.sort((a,b)=> ((b.commission?.percent||0)-(a.commission?.percent||0))); break;
      default: break;
    }
    return list;
  }

  function paginate(list, page, perPage){
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(1, page), pages);
    const start = (current-1)*perPage; const end = start + perPage;
    return { items: list.slice(start, end), total, pages, current };
  }

  document.addEventListener('DOMContentLoaded', function(){
    window.updateYear();
    const app = window.getAppData();
    const params = readParams();

    const categoryContainer = document.getElementById('filterCategories');
    const networkContainer = document.getElementById('filterNetworks');

    if (categoryContainer) {
      categoryContainer.innerHTML = app.categories.map(c => `<label style="display:flex;gap:8px;align-items:center;"><input type="checkbox" value="${c.id}"><span>${c.name}</span></label>`).join('');
    }
    if (networkContainer) {
      const networks = Array.from(new Set(app.products.map(p => p.network))).filter(Boolean).sort();
      networkContainer.innerHTML = networks.map(n => `<label style="display:flex;gap:8px;align-items:center;"><input type="checkbox" value="${n}"><span>${n}</span></label>`).join('');
    }

    const controls = {
      priceMin: document.getElementById('priceMin'),
      priceMax: document.getElementById('priceMax'),
      ratingMin: document.getElementById('ratingMin'),
      sort: document.getElementById('sort'),
      perPage: document.getElementById('perPage'),
    };

    // Initialize sort/perPage from params
    if (controls.sort) controls.sort.value = params.sort;
    if (controls.perPage) controls.perPage.value = String(params.perPage);

    function getFilters(){
      return {
        categoryIds: Array.from(categoryContainer?.querySelectorAll('input[type="checkbox"]:checked')||[]).map(i => parseInt(i.value,10)),
        networks: Array.from(networkContainer?.querySelectorAll('input[type="checkbox"]:checked')||[]).map(i => i.value),
        priceMin: controls.priceMin?.value ? parseFloat(controls.priceMin.value) : null,
        priceMax: controls.priceMax?.value ? parseFloat(controls.priceMax.value) : null,
        ratingMin: controls.ratingMin?.value ? parseFloat(controls.ratingMin.value) : null,
      };
    }

    function render(){
      const list = applyFilters(app.products, params, getFilters());
      const page = paginate(list, params.page, params.perPage);
      const grid = document.getElementById('resultGrid');
      grid.innerHTML = page.items.map(window.renderProductCard).join('');
      const summary = document.getElementById('catalogSummary');
      if (summary) summary.textContent = `${page.total} produk ditemukan` + (params.q ? ` untuk "${params.q}"` : '') + (params.cat ? ` dalam kategori "${params.cat}"` : '');
      const info = document.getElementById('pageInfo');
      info.textContent = `Halaman ${page.current} dari ${page.pages}`;
      const prev = document.getElementById('prevPage');
      const next = document.getElementById('nextPage');
      prev.disabled = page.current<=1; next.disabled = page.current>=page.pages;
      prev.onclick = ()=>{ params.page = Math.max(1, params.page-1); render(); };
      next.onclick = ()=>{ params.page = Math.min(page.pages, params.page+1); render(); };

      // Update URL (no reload)
      const sp = new URLSearchParams({ q: params.q, cat: params.cat, sort: params.sort, page: String(params.page), perPage: String(params.perPage) });
      history.replaceState({}, '', location.pathname + '?' + sp.toString());
    }

    // Hook events
    document.getElementById('applyFilters')?.addEventListener('click', () => { params.page = 1; render(); });
    document.getElementById('resetFilters')?.addEventListener('click', () => {
      categoryContainer?.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
      networkContainer?.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
      if (controls.priceMin) controls.priceMin.value = '';
      if (controls.priceMax) controls.priceMax.value = '';
      if (controls.ratingMin) controls.ratingMin.value = '0';
      params.page = 1; render();
    });

    controls.sort?.addEventListener('change', () => { params.sort = controls.sort.value; params.page = 1; render(); });
    controls.perPage?.addEventListener('change', () => { params.perPage = parseInt(controls.perPage.value,10); params.page = 1; render(); });

    // Initial render
    render();
  });
})();