(function(){
  const { createElement } = window.UIUtils;

  function init(){
    // Footer year across pages
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Sidebar toggle
    const toggleBtn = document.getElementById('toggleSidebar');
    toggleBtn.addEventListener('click', ()=>{
      document.body.classList.toggle('sidebar-collapsed');
    });

    // Menu navigation
    document.querySelectorAll('.menu .menu-item').forEach(a => {
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        document.querySelectorAll('.menu .menu-item').forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Populate categories in product form
    const catSelect = document.getElementById('categorySelect');
    catSelect.innerHTML = '';
    (window.CATEGORIES || []).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id; opt.textContent = cat.name; catSelect.appendChild(opt);
    });

    // Forms
    document.getElementById('productForm').addEventListener('submit', onSubmitProduct);
    document.getElementById('adForm').addEventListener('submit', onSubmitAd);

    // First render
    renderStats();
    renderManage();
  }

  function onSubmitProduct(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const product = {
      name: data.get('name'),
      category: data.get('category'),
      price: Number(data.get('price')||0),
      images: String(data.get('images')||'').split(',').map(s=>s.trim()).filter(Boolean),
      videos: String(data.get('videos')||'').split(',').map(s=>s.trim()).filter(Boolean),
      description: data.get('description'),
      affiliateUrl: data.get('affiliateUrl'),
      tags: String(data.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean),
      isNew: data.get('isNew') === 'on',
      isRecommended: data.get('isRecommended') === 'on',
      isPopular: data.get('isPopular') === 'on'
    };

    const saved = window.CMS.saveProduct(product);
    form.reset();
    alert('Produk disimpan');
    renderStats();
    renderManage();
  }

  function onSubmitAd(e){
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const ad = {
      title: data.get('title'),
      imageUrl: data.get('imageUrl'),
      targetUrl: data.get('targetUrl'),
      position: data.get('position'),
      startDate: data.get('startDate'),
      endDate: data.get('endDate')
    };

    window.CMS.saveAd(ad);
    form.reset();
    alert('Iklan disimpan');
    renderStats();
    renderManage();
  }

  function renderStats(){
    const statsEl = document.getElementById('stats');
    const products = window.CMS.getProducts();
    const ads = window.CMS.getAds();

    const uniqueCats = new Set(products.map(p=>p.category));

    statsEl.innerHTML = '';
    statsEl.appendChild(createStat('Total Produk', String(products.length)));
    statsEl.appendChild(createStat('Total Iklan', String(ads.length)));
    statsEl.appendChild(createStat('Kategori Terpakai', String(uniqueCats.size)));
  }

  function createStat(label, value){
    return createElement('div', { class: 'stat' }, [
      createElement('div', { class: 'muted' }, label),
      createElement('div', { style: 'font-size:22px;font-weight:800' }, value)
    ]);
  }

  function renderManage(){
    renderManageProducts();
    renderManageAds();
  }

  function isSeedProduct(p){
    // Seed products are numbers 1..N in this demo
    return typeof p.id === 'number';
  }

  function renderManageProducts(){
    const wrap = document.getElementById('manageProducts');
    wrap.innerHTML = '';
    const products = window.CMS.getProducts();
    products.forEach(p => {
      const img = (Array.isArray(p.images) && p.images[0]) || 'https://picsum.photos/seed/placeholder/160/100';
      const row = createElement('div', { class: 'manage-item' });
      row.appendChild(createElement('img', { src: img, alt: p.name }));
      const info = createElement('div', {}, [
        createElement('p', { class: 'title' }, p.name),
        createElement('div', { class: 'muted' }, `${p.category} • Rp ${p.price}`)
      ]);
      row.appendChild(info);

      const actions = createElement('div', {});
      actions.appendChild(createElement('a', { class: 'btn small', href: `/workspace/product-detail.html?id=${encodeURIComponent(p.id)}`, target: '_blank' }, 'Lihat'));
      if (!isSeedProduct(p)){
        const del = createElement('button', { class: 'btn small ghost' }, 'Hapus');
        del.addEventListener('click', ()=>{ if (confirm('Hapus produk ini?')){ window.CMS.deleteProduct(p.id); renderStats(); renderManage(); } });
        actions.appendChild(del);
      } else {
        actions.appendChild(createElement('span', { class: 'muted' }, 'Seed'));
      }
      row.appendChild(actions);

      wrap.appendChild(row);
    });
  }

  function renderManageAds(){
    const wrap = document.getElementById('manageAds');
    wrap.innerHTML = '';
    const ads = window.CMS.getAds();
    ads.forEach(a => {
      const row = createElement('div', { class: 'manage-item' });
      row.appendChild(createElement('img', { src: a.imageUrl, alt: a.title }));
      const info = createElement('div', {}, [
        createElement('p', { class: 'title' }, a.title),
        createElement('div', { class: 'muted' }, a.position)
      ]);
      row.appendChild(info);

      const actions = createElement('div', {});
      if (String(a.id).startsWith('ad_')){
        const del = createElement('button', { class: 'btn small ghost' }, 'Hapus');
        del.addEventListener('click', ()=>{ if (confirm('Hapus iklan ini?')){ window.CMS.deleteAd(a.id); renderStats(); renderManage(); } });
        actions.appendChild(del);
      } else {
        actions.appendChild(createElement('span', { class: 'muted' }, 'Seed'));
      }
      row.appendChild(actions);

      wrap.appendChild(row);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();