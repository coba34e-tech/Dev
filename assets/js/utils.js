(function(){
  const formatCurrencyIDR = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value||0);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'class') node.className = v; else if (k === 'html') node.innerHTML = v; else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).filter(Boolean).forEach(c => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  };
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  window.formatCurrencyIDR = formatCurrencyIDR;
  window.$el = el; window.$ = qs; window.$$ = qsa;

  window.renderCategoryChip = function renderCategoryChip(category) {
    const initials = (category.name||'?').slice(0,2).toUpperCase();
    return `<a class="category-card" href="/workspace/katalog.html?cat=${encodeURIComponent(category.slug)}" aria-label="${category.name}">
      <span class="icon">${initials}</span>
      <span>
        <strong>${category.name}</strong>
        <div class="muted" style="font-size:12px;">${category.count||0} produk</div>
      </span>
    </a>`;
  }

  window.renderProductCard = function renderProductCard(product){
    return `<article class="product-card">
      <a href="/workspace/produk.html?id=${encodeURIComponent(product.id)}" aria-label="${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="body">
        <a href="/workspace/produk.html?id=${encodeURIComponent(product.id)}"><strong>${product.name}</strong></a>
        <div class="muted" style="font-size:12px;">${product.brand||''} · ${product.network||''}</div>
        <div class="price-rating">
          <span class="price">${formatCurrencyIDR(product.price||0)}</span>
          <span class="rating">${'★'.repeat(Math.round(product.rating||0))}</span>
        </div>
        <div class="card-actions">
          <a class="btn small" href="${product.link}" target="_blank" rel="nofollow sponsored noopener">Promosikan</a>
          <button class="btn small ghost" data-copy="${product.link}" onclick="navigator.clipboard.writeText(this.getAttribute('data-copy')).then(()=>{this.textContent='Disalin'; setTimeout(()=>this.textContent='Salin',1200)}).catch(()=>{})">Salin</button>
        </div>
      </div>
    </article>`
  }

  window.renderOptions = function renderOptions(items, valueKey, labelKey, includeAll){
    const arr = includeAll ? [{[valueKey]: '', [labelKey]: 'Semua'}].concat(items) : items;
    return arr.map(it => `<option value="${String(it[valueKey])}">${it[labelKey]}</option>`).join('');
  }

  window.saveLocal = function saveLocal(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  window.loadLocal = function loadLocal(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }

  window.updateYear = function updateYear(){ const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); }
})();