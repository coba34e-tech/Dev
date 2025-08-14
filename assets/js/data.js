(function(){
  const seed = {
    categories: [
      { id: 1, name: 'Elektronik', slug: 'elektronik' },
      { id: 2, name: 'Kecantikan', slug: 'kecantikan' },
      { id: 3, name: 'Software', slug: 'software' },
      { id: 4, name: 'Fashion', slug: 'fashion' },
      { id: 5, name: 'Rumah Tangga', slug: 'rumah-tangga' }
    ],
    products: [
      { id: 101, name: 'Headset Gaming Orion', brand: 'Aurora', categoryId: 1, network: 'Tokopedia', price: 599000, commission: { percent: 6 }, rating: 4.5, reviews: 120, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=900&auto=format&fit=crop', link: 'https://tokopedia.com/ref/101', tags: ['gaming','audio'] },
      { id: 102, name: 'Mic USB Streamer Pro', brand: 'Voxa', categoryId: 1, network: 'Shopee', price: 899000, commission: { percent: 8 }, rating: 4.3, reviews: 84, image: 'https://images.unsplash.com/photo-1590608897129-79da98d15972?q=80&w=900&auto=format&fit=crop', link: 'https://shopee.com/ref/102', tags: ['podcast','recording'] },
      { id: 103, name: 'Serum Vitamin C Glow', brand: 'Lumina', categoryId: 2, network: 'Lazada', price: 129000, commission: { percent: 12 }, rating: 4.7, reviews: 340, image: 'https://images.unsplash.com/photo-1585386959984-a4155223167f?q=80&w=900&auto=format&fit=crop', link: 'https://lazada.com/ref/103', tags: ['skincare'] },
      { id: 104, name: 'Platform Akuntansi Cloud', brand: 'AccuFlow', categoryId: 3, network: 'SaaS Partner', price: 1490000, commission: { percent: 25 }, rating: 4.8, reviews: 52, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop', link: 'https://accuflow.io/aff/104', tags: ['saas','bisnis'] },
      { id: 105, name: 'Kemeja Linen Pria', brand: 'Nord', categoryId: 4, network: 'Zalora', price: 249000, commission: { percent: 7 }, rating: 4.1, reviews: 20, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop', link: 'https://zalora.com/ref/105', tags: ['pria','pakaian'] },
      { id: 106, name: 'Vacuum Nirkabel Lite', brand: 'CleanX', categoryId: 5, network: 'Blibli', price: 799000, commission: { percent: 9 }, rating: 4.4, reviews: 66, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop', link: 'https://blibli.com/ref/106', tags: ['bersih','rumah'] },
      { id: 107, name: 'Editor Video Pro', brand: 'CutLab', categoryId: 3, network: 'SaaS Partner', price: 499000, commission: { percent: 30 }, rating: 4.6, reviews: 94, image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop', link: 'https://cutlab.com/aff/107', tags: ['video','kreator'] },
      { id: 108, name: 'Face Wash Gentle', brand: 'Purely', categoryId: 2, network: 'Lazada', price: 69000, commission: { percent: 10 }, rating: 4.2, reviews: 210, image: 'https://images.unsplash.com/photo-1585238342028-4bbc6df6f50b?q=80&w=900&auto=format&fit=crop', link: 'https://lazada.com/ref/108', tags: ['skincare'] },
      { id: 109, name: 'Mechanical Keyboard 75%', brand: 'Clicky', categoryId: 1, network: 'Tokopedia', price: 1299000, commission: { percent: 5 }, rating: 4.5, reviews: 180, image: 'https://images.unsplash.com/photo-1519245659620-e859806a8d3f?q=80&w=900&auto=format&fit=crop', link: 'https://tokopedia.com/ref/109', tags: ['keyboard','gaming'] },
      { id: 110, name: 'Task Manager Tim', brand: 'Flowboard', categoryId: 3, network: 'SaaS Partner', price: 99000, commission: { percent: 20 }, rating: 4.4, reviews: 44, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop', link: 'https://flowboard.com/aff/110', tags: ['produktifitas'] }
    ]
  };

  function computeCounts(data){
    const counts = data.categories.map(c => ({...c, count: data.products.filter(p => p.categoryId===c.id).length }));
    return counts;
  }

  function getMerged(){
    const saved = window.loadLocal('appData', null);
    const merged = saved ? {
      categories: saved.categories?.length ? saved.categories : seed.categories,
      products: saved.products?.length ? saved.products : seed.products
    } : seed;
    // Recompute category counts
    merged.categories = computeCounts(merged);
    return merged;
  }

  window.getAppData = function getAppData(){
    return getMerged();
  }

  window.setAppData = function setAppData(next){
    window.saveLocal('appData', next);
  }
})();