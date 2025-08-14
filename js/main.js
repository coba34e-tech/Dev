(function(){
  const { formatCurrencyIDR, categoryToClass, createElement, clamp, getQueryParam } = window.UIUtils;

  const state = {
    search: '',
    category: '',
    sort: 'newest',
    page: 1,
    perPage: 9
  };

  let allProducts = [];

  function init(){
    document.getElementById('year').textContent = String(new Date().getFullYear());

    // Load products
    allProducts = window.CMS.getProducts();

    // Populate categories
    const categoryFilter = document.getElementById('categoryFilter');
    (window.CATEGORIES || []).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id; opt.textContent = cat.name;
      categoryFilter.appendChild(opt);
    });

    // Prefill from query
    const q = getQueryParam('q');
    if (q){
      state.search = q; document.getElementById('searchInput').value = q;
    }

    // Bind events
    document.getElementById('searchForm').addEventListener('submit', onSubmitSearch);
    document.getElementById('clearBtn').addEventListener('click', clearFilters);

    // First render
    render();

    // Sidebar lists
    renderSideLists();

    // Ads
    renderAds();
  }

  function onSubmitSearch(e){
    e.preventDefault();
    const term = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortSelect').value;
    state.search = term; state.category = category; state.sort = sort; state.page = 1;
    render();
  }

  function clearFilters(){
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortSelect').value = 'newest';
    state.search = ''; state.category = ''; state.sort = 'newest'; state.page = 1;
    render();
  }

  function applyFilterSort(items){
    let result = items.slice();

    // Filter by search
    if (state.search){
      const term = state.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (Array.isArray(p.tags) && p.tags.join(' ').toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (state.category){
      result = result.filter(p => p.category === state.category);
    }

    // Sort
    switch(state.sort){
      case 'price_low':
        result.sort((a,b)=> (a.price||0) - (b.price||0)); break;
      case 'price_high':
        result.sort((a,b)=> (b.price||0) - (a.price||0)); break;
      case 'rating':
        result.sort((a,b)=> (b.rating||0) - (a.rating||0)); break;
      case 'popular':
        result.sort((a,b)=> Number(b.isPopular) - Number(a.isPopular) || (b.rating||0) - (a.rating||0)); break;
      case 'newest':
      default:
        result.sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0));
    }

    return result;
  }

  function render(){
    const filtered = applyFilterSort(allProducts);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / state.perPage));
    state.page = clamp(state.page, 1, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = filtered.slice(start, start + state.perPage);

    document.getElementById('resultCount').textContent = `${total} hasil`;

    renderGrid(pageItems);
    renderPagination(totalPages);
  }

  function renderGrid(items){
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    if (!items.length){
      grid.appendChild(createElement('div', { class: 'muted' }, 'Tidak ada produk ditemukan.'));
      return;
    }

    items.forEach(p => grid.appendChild(renderCard(p)));
  }

  function renderCard(p){
    const card = createElement('article', { class: `card ${categoryToClass(p.category)}` });

    const imgSrc = (Array.isArray(p.images) && p.images[0]) || 'https://picsum.photos/seed/placeholder/800/500';
    const media = createElement('a', { class: 'media', href: `/workspace/product-detail.html?id=${encodeURIComponent(p.id)}`, 'aria-label': p.name });
    media.appendChild(createElement('img', { src: imgSrc, alt: p.name }));

    const title = createElement('h3', { class: 'title' }, p.name);
    const price = createElement('div', { class: 'price' }, formatCurrencyIDR(p.price||0));
    const meta = createElement('div', { class: 'meta' }, [
      createElement('span', {}, `⭐ ${p.rating || 0}`),
      createElement('span', {}, (window.CATEGORIES.find(c=>c.id===p.category)||{}).name || p.category)
    ]);

    const actions = createElement('div', { class: 'actions' }, [
      createElement('a', { class: 'btn small', href: `/workspace/product-detail.html?id=${encodeURIComponent(p.id)}` }, 'Detail'),
      createElement('a', { class: 'btn small primary', href: p.affiliateUrl || '#', target: '_blank', rel: 'noopener' }, 'Beli')
    ]);

    const content = createElement('div', { class: 'content' }, [title, price, meta, actions]);

    card.appendChild(media);
    card.appendChild(content);
    return card;
  }

  function renderPagination(totalPages){
    const nav = document.getElementById('pagination');
    nav.innerHTML = '';
    if (totalPages <= 1) return;

    const addBtn = (label, page, isActive=false) => {
      const btn = createElement('button', { class: `page-btn${isActive ? ' active' : ''}` }, label);
      btn.addEventListener('click', ()=>{ state.page = page; render(); });
      nav.appendChild(btn);
    };

    const prevPage = Math.max(1, state.page - 1);
    const nextPage = Math.min(totalPages, state.page + 1);

    addBtn('«', prevPage, false);

    const windowSize = 5;
    let start = Math.max(1, state.page - Math.floor(windowSize/2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    for (let p = start; p <= end; p++) addBtn(String(p), p, p === state.page);

    addBtn('»', nextPage, false);
  }

  function renderSideLists(){
    const products = allProducts.slice();

    const newList = products.filter(p=>p.isNew).sort((a,b)=> new Date(b.createdAt||0) - new Date(a.createdAt||0)).slice(0,6);
    const recList = products.filter(p=>p.isRecommended).sort((a,b)=> (b.rating||0) - (a.rating||0)).slice(0,6);
    const popList = products.filter(p=>p.isPopular).sort((a,b)=> (b.rating||0) - (a.rating||0)).slice(0,6);

    mountSideList('newList', newList);
    mountSideList('recList', recList);
    mountSideList('popList', popList);
  }

  function mountSideList(containerId, items){
    const wrap = document.getElementById(containerId);
    wrap.innerHTML = '';
    items.forEach(p => {
      const imgSrc = (Array.isArray(p.images) && p.images[0]) || 'https://picsum.photos/seed/placeholder/120/120';
      const it = createElement('a', { class: 'side-item', href: `/workspace/product-detail.html?id=${encodeURIComponent(p.id)}` });
      it.appendChild(createElement('img', { src: imgSrc, alt: p.name }));
      const info = createElement('div', {}, [
        createElement('p', { class: 'title' }, p.name),
        createElement('div', { class: 'price' }, formatCurrencyIDR(p.price||0))
      ]);
      it.appendChild(info);
      wrap.appendChild(it);
    });
  }

  function isAdActive(ad){
    const now = new Date();
    const startOk = !ad.startDate || new Date(ad.startDate) <= now;
    const endOk = !ad.endDate || new Date(ad.endDate) >= now;
    return startOk && endOk;
  }

  function renderAds(){
    const ads = window.CMS.getAds().filter(a => a.position === 'homepage_footer' && isAdActive(a));
    if (!ads.length) return;
    const ad = ads[0];
    const host = document.getElementById('promoAds');
    host.innerHTML = '';

    const banner = createElement('div', { class: 'ad-banner' });
    banner.appendChild(createElement('img', { src: ad.imageUrl, alt: ad.title }));
    const textWrap = createElement('div', {}, [
      createElement('h3', { class: 'ad-title' }, ad.title),
      createElement('p', { class: 'ad-desc' }, ad.description || '')
    ]);
    banner.appendChild(textWrap);
    banner.appendChild(createElement('a', { class: 'btn primary', href: ad.targetUrl, target: '_blank', rel: 'noopener' }, 'Lihat Promo'));

    host.appendChild(banner);
  }

  document.addEventListener('DOMContentLoaded', init);
})();