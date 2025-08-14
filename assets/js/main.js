(function(){
  document.addEventListener('DOMContentLoaded', function(){
    window.updateYear();
    const app = window.getAppData();

    // Populate nav categories
    const navCat = document.getElementById('navCategories');
    if (navCat) {
      navCat.innerHTML = app.categories.slice(0, 8).map(c => `<li><a href="/workspace/katalog.html?cat=${encodeURIComponent(c.slug)}">${c.name}</a></li>`).join('');
    }

    // Stats
    const statProducts = document.getElementById('statProducts');
    const statCategories = document.getElementById('statCategories');
    if (statProducts) statProducts.textContent = String(app.products.length);
    if (statCategories) statCategories.textContent = String(app.categories.length);

    // Category grid
    const catGrid = document.getElementById('categoryGrid');
    if (catGrid) {
      catGrid.innerHTML = app.categories.slice(0, 8).map(window.renderCategoryChip).join('');
    }

    // Featured products
    const featured = document.getElementById('featuredGrid');
    if (featured) {
      const pick = app.products.slice(0, 12);
      featured.innerHTML = pick.map(window.renderProductCard).join('');
    }

    // Search suggestions
    const globalSearch = document.getElementById('globalSearch');
    const suggest = document.getElementById('searchSuggest');
    if (globalSearch && suggest) {
      let open = false;
      const toggle = (show) => { suggest.style.display = show ? 'block' : 'none'; open = show; };
      globalSearch.addEventListener('input', () => {
        const q = globalSearch.value.trim().toLowerCase();
        if (!q) { toggle(false); return; }
        const top = app.products.filter(p => p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q)).slice(0, 6);
        suggest.innerHTML = top.map(p => `<a href="/workspace/produk.html?id=${p.id}" role="option">${p.name}</a>`).join('');

        toggle(true);
      });
      document.addEventListener('click', (e)=>{ if (!suggest.contains(e.target) && e.target !== globalSearch) toggle(false); });
    }

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navWrap = document.querySelector('.nav');
    if (navToggle && navWrap) {
      navToggle.addEventListener('click', () => {
        const isOpen = navWrap.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Newsletter
    const nf = document.getElementById('newsletterForm');
    if (nf) {
      nf.addEventListener('submit', (e)=>{
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { alert('Email tidak valid'); return; }
        const list = window.loadLocal('newsletter', []);
        if (!list.includes(email)) list.push(email);
        window.saveLocal('newsletter', list);
        const msg = document.getElementById('newsletterMsg');
        msg.textContent = 'Terima kasih! Silakan cek inbox Anda.';
      });
    }
  });
})();