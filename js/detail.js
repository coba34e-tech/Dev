(function(){
  const { formatCurrencyIDR, categoryToClass, createElement, getQueryParam, clamp } = window.UIUtils;

  let product = null;
  let mediaItems = [];
  let currentIndex = 0;

  function init(){
    document.getElementById('year').textContent = String(new Date().getFullYear());

    // Mini search delegates back to homepage
    document.getElementById('miniSearchForm').addEventListener('submit', function(e){
      e.preventDefault();
      const term = document.getElementById('miniSearchInput').value.trim();
      if (term) window.location.href = `/workspace/index.html?q=${encodeURIComponent(term)}`; else window.location.href = '/workspace/index.html';
    });

    const id = getQueryParam('id');
    const products = window.CMS.getProducts();
    product = products.find(p => String(p.id) === String(id));

    if (!product){
      renderNotFound();
      return;
    }

    renderInfo();
    setupMedia();
    renderRelated(products);
    renderAds();
  }

  function renderNotFound(){
    const main = document.getElementById('detailContent');
    main.innerHTML = '';
    main.appendChild(createElement('div', { class: 'muted' }, 'Produk tidak ditemukan.'));
  }

  function renderInfo(){
    document.getElementById('prodTitle').textContent = product.name;
    const catObj = (window.CATEGORIES||[]).find(c=>c.id===product.category);
    const badge = document.getElementById('categoryBadge');
    badge.textContent = catObj ? catObj.name : product.category;
    badge.classList.add(categoryToClass(product.category));

    document.getElementById('prodPrice').textContent = formatCurrencyIDR(product.price||0);
    document.getElementById('prodRating').textContent = `⭐ ${product.rating || 0}`;
    document.getElementById('prodDesc').textContent = product.description || '';

    const specsUl = document.getElementById('prodSpecs');
    specsUl.innerHTML = '';
    (Array.isArray(product.specs) ? product.specs : []).forEach(s => specsUl.appendChild(createElement('li', {}, s)));

    const tagsWrap = document.getElementById('prodTags');
    tagsWrap.innerHTML = '';
    (Array.isArray(product.tags) ? product.tags : []).forEach(t => tagsWrap.appendChild(createElement('span', { class: 'tag' }, `#${t}`)));

    const buyBtn = document.getElementById('buyBtn');
    buyBtn.href = product.affiliateUrl || '#';
  }

  function setupMedia(){
    const images = Array.isArray(product.images) ? product.images : [];
    const videos = Array.isArray(product.videos) ? product.videos : [];
    mediaItems = [
      ...images.map(src => ({ type: 'image', src })),
      ...videos.map(src => ({ type: 'video', src }))
    ];
    if (!mediaItems.length){
      mediaItems = [{ type: 'image', src: 'https://picsum.photos/seed/placeholder/800/500' }];
    }

    const prev = document.getElementById('prevMedia');
    const next = document.getElementById('nextMedia');
    prev.addEventListener('click', ()=> goTo(currentIndex - 1));
    next.addEventListener('click', ()=> goTo(currentIndex + 1));

    renderThumbs();
    goTo(0);
  }

  function renderThumbs(){
    const thumbs = document.getElementById('thumbs');
    thumbs.innerHTML = '';
    mediaItems.forEach((m, idx) => {
      const th = createElement('div', { class: 'thumb', role: 'listitem' });
      if (m.type === 'image') th.appendChild(createElement('img', { src: m.src, alt: product.name }));
      else th.appendChild(createElement('video', { src: m.src }));
      th.addEventListener('click', ()=> goTo(idx));
      thumbs.appendChild(th);
    });
  }

  function goTo(index){
    currentIndex = clamp(index, 0, mediaItems.length - 1);
    const stage = document.getElementById('mediaStage');
    stage.innerHTML = '';
    const m = mediaItems[currentIndex];
    if (m.type === 'image') stage.appendChild(createElement('img', { src: m.src, alt: product.name }));
    else stage.appendChild(createElement('video', { src: m.src, controls: true }));

    const thumbs = Array.from(document.querySelectorAll('#thumbs .thumb'));
    thumbs.forEach((el, i)=> el.classList.toggle('active', i === currentIndex));
  }

  function renderRelated(products){
    const related = products.filter(p => p.category === product.category && String(p.id) !== String(product.id))
      .sort((a,b)=> Number(b.isPopular) - Number(a.isPopular) || (b.rating||0) - (a.rating||0))
      .slice(0, 12);

    const row = document.getElementById('relatedRow');
    row.innerHTML = '';
    related.forEach(p => row.appendChild(renderRelatedCard(p)));
  }

  function renderRelatedCard(p){
    const card = createElement('a', { class: `card ${categoryToClass(p.category)}`, href: `/workspace/product-detail.html?id=${encodeURIComponent(p.id)}`, style: 'min-width:220px' });
    const imgSrc = (Array.isArray(p.images) && p.images[0]) || 'https://picsum.photos/seed/placeholder/800/500';
    card.appendChild(createElement('div', { class: 'media' }, createElement('img', { src: imgSrc, alt: p.name })));
    const content = createElement('div', { class: 'content' }, [
      createElement('div', { class: 'title' }, p.name),
      createElement('div', { class: 'price' }, formatCurrencyIDR(p.price||0))
    ]);
    card.appendChild(content);
    return card;
  }

  function isAdActive(ad){
    const now = new Date();
    const startOk = !ad.startDate || new Date(ad.startDate) <= now;
    const endOk = !ad.endDate || new Date(ad.endDate) >= now;
    return startOk && endOk;
  }

  function renderAds(){
    const host = document.getElementById('detailAds');
    if (!host) return;
    const ads = window.CMS.getAds().filter(a => a.position === 'detail_related' && isAdActive(a));
    if (!ads.length) return;
    const ad = ads[0];
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