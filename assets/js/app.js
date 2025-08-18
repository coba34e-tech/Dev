// Shared site logic for index and common UI
(function() {
  const marketplaces = [
    { name: 'Shopee', color: '#f97316' },
    { name: 'Tokopedia', color: '#10b981' },
    { name: 'Lazada', color: '#7c3aed' },
    { name: 'TikTok Shop', color: '#0ea5e9' },
    { name: 'Blibli', color: '#2563eb' },
    { name: 'Bukalapak', color: '#ef4444' },
  ];

  // Sample product dataset
  const sampleProducts = Array.from({ length: 24 }).map((_, i) => {
    const m = marketplaces[i % marketplaces.length];
    const price = Math.round(15000 + Math.random() * 950000);
    const rating = (3 + Math.random() * 2).toFixed(1);
    return {
      id: 'P' + (1000 + i),
      title: 'Produk ' + (i + 1) + ' unggulan ' + m.name,
      marketplace: m.name,
      color: m.color,
      price,
      rating: Number(rating),
      image: '',
      url: '#',
    };
  });

  function formatIDR(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  }

  function renderProductCard(product) {
    const div = document.createElement('div');
    div.className = 'card-product';
    div.innerHTML = `
      <a href="${product.url}" target="_blank" rel="noopener" class="thumb">${product.image ? `<img src="${product.image}" alt="${product.title}">` : 'Gambar'}</a>
      <div class="body">
        <div class="market-badge"><span class="market-dot" style="background:${product.color}"></span>${product.marketplace}</div>
        <div class="title" title="${product.title}">${product.title}</div>
        <div class="row" style="display:flex;justify-content:space-between;align-items:center;">
          <div class="price">${formatIDR(product.price)}</div>
          <div class="rating">★ ${product.rating}</div>
        </div>
        <div class="actions">
          <a href="${product.url}" target="_blank" rel="noopener" class="btn btn-primary">Beli</a>
          <button class="btn btn-copy" data-id="${product.id}">Salin Link Afiliasi</button>
        </div>
      </div>
    `;
    return div;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve();
    }
  }

  function applyIndexPageBehavior() {
    const grid = document.getElementById('productGrid');
    if (!grid) return; // not on index

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const tabs = Array.from(document.querySelectorAll('#marketTabs .tab'));
    const sortSelect = document.getElementById('sortSelect');
    const empty = document.getElementById('emptyState');

    let currentMarket = 'Semua';
    let currentQuery = '';
    let currentSort = 'recent';

    function getFiltered() {
      let arr = sampleProducts.slice();
      if (currentMarket !== 'Semua') arr = arr.filter(p => p.marketplace === currentMarket);
      if (currentQuery) arr = arr.filter(p => p.title.toLowerCase().includes(currentQuery.toLowerCase()));
      switch (currentSort) {
        case 'price_asc': arr.sort((a,b)=>a.price-b.price); break;
        case 'price_desc': arr.sort((a,b)=>b.price-a.price); break;
        case 'rating_desc': arr.sort((a,b)=>b.rating-a.rating); break;
        default: arr.sort((a,b)=>b.id.localeCompare(a.id));
      }
      return arr;
    }

    function render() {
      grid.innerHTML = '';
      const items = getFiltered();
      if (!items.length) {
        empty.classList.remove('hidden');
      } else {
        empty.classList.add('hidden');
      }
      items.forEach(p => grid.appendChild(renderProductCard(p)));
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMarket = tab.getAttribute('data-marketplace');
        render();
      });
    });

    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      render();
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentQuery = searchInput.value.trim();
      render();
    });

    document.body.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.classList.contains('btn-copy')) {
        const id = target.getAttribute('data-id');
        const product = sampleProducts.find(p => p.id === id);
        const link = product ? (product.url + '?ref=alldream') : window.location.href;
        copyToClipboard(link).then(() => {
          target.textContent = 'Tautan Disalin';
          setTimeout(() => target.textContent = 'Salin Link Afiliasi', 1500);
        });
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', applyIndexPageBehavior);
})();

