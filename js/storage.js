(function(){
  const STORAGE_KEYS = {
    products: 'cms_products',
    ads: 'cms_ads'
  };

  function parseJson(value, fallback){
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function getCustomItems(key){
    return parseJson(localStorage.getItem(key), []);
  }

  function saveCustomItems(key, items){
    localStorage.setItem(key, JSON.stringify(items));
  }

  function generateId(prefix){
    return `${prefix}_${Date.now()}_${Math.floor(Math.random()*100000)}`;
  }

  function normalizeProduct(raw){
    const images = Array.isArray(raw.images) ? raw.images : (raw.images ? String(raw.images).split(',').map(s=>s.trim()).filter(Boolean) : []);
    const videos = Array.isArray(raw.videos) ? raw.videos : (raw.videos ? String(raw.videos).split(',').map(s=>s.trim()).filter(Boolean) : []);
    const tags = Array.isArray(raw.tags) ? raw.tags : (raw.tags ? String(raw.tags).split(',').map(s=>s.trim()).filter(Boolean) : []);
    const price = Number(raw.price || 0);
    const rating = Number(raw.rating || 4.2);
    return {
      id: raw.id || generateId('prod'),
      name: raw.name || 'Produk',
      category: raw.category || 'other',
      price, rating,
      isNew: Boolean(raw.isNew),
      isRecommended: Boolean(raw.isRecommended),
      isPopular: Boolean(raw.isPopular),
      createdAt: raw.createdAt || new Date().toISOString().slice(0,10),
      images, videos,
      description: raw.description || '',
      specs: Array.isArray(raw.specs) ? raw.specs : (raw.specs ? String(raw.specs).split(',').map(s=>s.trim()).filter(Boolean) : []),
      tags, affiliateUrl: raw.affiliateUrl || '#'
    };
  }

  function getSeedProducts(){ return Array.isArray(window.PRODUCTS_SEED) ? window.PRODUCTS_SEED : []; }
  function getSeedAds(){ return Array.isArray(window.ADS_SEED) ? window.ADS_SEED : []; }

  function getProducts(){
    const seed = getSeedProducts();
    const custom = getCustomItems(STORAGE_KEYS.products).map(normalizeProduct);
    return [...seed, ...custom];
  }

  function saveProduct(product){
    const normalized = normalizeProduct(product);
    const items = getCustomItems(STORAGE_KEYS.products);
    const existingIndex = items.findIndex(p => p.id === normalized.id);
    if (existingIndex >= 0) items[existingIndex] = normalized; else items.push(normalized);
    saveCustomItems(STORAGE_KEYS.products, items);
    return normalized;
  }

  function deleteProduct(id){
    const items = getCustomItems(STORAGE_KEYS.products).filter(p => p.id !== id);
    saveCustomItems(STORAGE_KEYS.products, items);
  }

  function normalizeAd(raw){
    return {
      id: raw.id || generateId('ad'),
      title: raw.title || 'Iklan',
      description: raw.description || '',
      imageUrl: raw.imageUrl || '',
      targetUrl: raw.targetUrl || '#',
      position: raw.position || 'homepage_footer',
      startDate: raw.startDate || '',
      endDate: raw.endDate || ''
    };
  }

  function getAds(){
    const seed = getSeedAds();
    const custom = getCustomItems(STORAGE_KEYS.ads).map(normalizeAd);
    return [...seed, ...custom];
  }

  function saveAd(ad){
    const normalized = normalizeAd(ad);
    const items = getCustomItems(STORAGE_KEYS.ads);
    const idx = items.findIndex(a => a.id === normalized.id);
    if (idx >= 0) items[idx] = normalized; else items.push(normalized);
    saveCustomItems(STORAGE_KEYS.ads, items);
    return normalized;
  }

  function deleteAd(id){
    const items = getCustomItems(STORAGE_KEYS.ads).filter(a => a.id !== id);
    saveCustomItems(STORAGE_KEYS.ads, items);
  }

  window.CMS = {
    getProducts, saveProduct, deleteProduct,
    getAds, saveAd, deleteAd
  };
})();