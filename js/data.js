(function(){
  // Categories
  window.CATEGORIES = [
    { id: 'electronics', name: 'Elektronik' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Rumah' },
    { id: 'sports', name: 'Olahraga' },
    { id: 'beauty', name: 'Kecantikan' },
    { id: 'toys', name: 'Mainan' },
    { id: 'other', name: 'Lainnya' },
  ];

  // Helpers for placeholder media
  function img(w, h, seed){ return `https://picsum.photos/seed/${seed}/${w}/${h}`; }

  // Products seed
  window.PRODUCTS_SEED = [
    {
      id: 1,
      name: 'Headphone Wireless X200',
      category: 'electronics',
      price: 899000,
      rating: 4.6,
      isNew: true,
      isRecommended: true,
      isPopular: true,
      createdAt: '2025-07-10',
      images: [img(800,500,'hp1a'), img(800,500,'hp1b'), img(800,500,'hp1c')],
      videos: ['https://samplelib.com/lib/preview/mp4/sample-5s.mp4'],
      description: 'Headphone nirkabel dengan peredam bising aktif, baterai 40 jam, dan Bluetooth 5.3.',
      specs: ['ANC Hybrid', 'Driver 40mm', 'USB-C Fast Charge'],
      tags: ['audio','bluetooth','anc'],
      affiliateUrl: 'https://example.com/aff/headphone-x200'
    },
    {
      id: 2,
      name: 'Sneakers Street Flow',
      category: 'fashion',
      price: 599000,
      rating: 4.4,
      isNew: true,
      isRecommended: false,
      isPopular: true,
      createdAt: '2025-07-06',
      images: [img(800,500,'snk1'), img(800,500,'snk2')],
      videos: [],
      description: 'Sepatu sneakers ringan dan nyaman untuk gaya kasual harian.',
      specs: ['Upper Knit', 'Outsole Karet', 'Tali Elastis'],
      tags: ['sepatu','sneakers'],
      affiliateUrl: 'https://example.com/aff/sneakers-flow'
    },
    {
      id: 3,
      name: 'Blender Pro 900W',
      category: 'home',
      price: 499000,
      rating: 4.3,
      isNew: false,
      isRecommended: true,
      isPopular: false,
      createdAt: '2025-05-22',
      images: [img(800,500,'bld1')],
      videos: [],
      description: 'Blender kuat untuk smoothie dan bumbu dengan 3 mode kecepatan.',
      specs: ['Kapasitas 1.5L', 'Pisau Stainless', '3 Kecepatan'],
      tags: ['dapur','blender'],
      affiliateUrl: 'https://example.com/aff/blender-pro'
    },
    {
      id: 4,
      name: 'Raket Badminton Carbon Lite',
      category: 'sports',
      price: 349000,
      rating: 4.5,
      isNew: false,
      isRecommended: true,
      isPopular: true,
      createdAt: '2025-06-15',
      images: [img(800,500,'rkt1'), img(800,500,'rkt2')],
      videos: [],
      description: 'Raket ringan bahan karbon untuk kontrol dan kecepatan terbaik.',
      specs: ['Berat 82g', 'Tension 24-28 lbs', 'Frame Carbon'],
      tags: ['badminton','olahraga'],
      affiliateUrl: 'https://example.com/aff/raket-carbon'
    },
    {
      id: 5,
      name: 'Serum Vitamin C Glow',
      category: 'beauty',
      price: 129000,
      rating: 4.2,
      isNew: true,
      isRecommended: true,
      isPopular: false,
      createdAt: '2025-07-01',
      images: [img(800,500,'ser1')],
      videos: [],
      description: 'Serum pencerah dengan vitamin C stabil membantu menyamarkan noda.',
      specs: ['Vitamin C 10%', 'Niacinamide', 'Tanpa Paraben'],
      tags: ['skincare','serum'],
      affiliateUrl: 'https://example.com/aff/serum-c'
    },
    {
      id: 6,
      name: 'Lego Creative Box 500pcs',
      category: 'toys',
      price: 399000,
      rating: 4.7,
      isNew: false,
      isRecommended: false,
      isPopular: true,
      createdAt: '2025-04-20',
      images: [img(800,500,'lego1'), img(800,500,'lego2')],
      videos: [],
      description: 'Kotak kreatif 500 pcs untuk membangun imajinasi tanpa batas.',
      specs: ['500 pcs', 'Usia 6+', 'Buku Panduan'],
      tags: ['lego','mainan'],
      affiliateUrl: 'https://example.com/aff/lego-box'
    },
    {
      id: 7,
      name: 'Smartwatch Fit S',
      category: 'electronics',
      price: 1199000,
      rating: 4.1,
      isNew: true,
      isRecommended: false,
      isPopular: false,
      createdAt: '2025-07-08',
      images: [img(800,500,'sw1'), img(800,500,'sw2')],
      videos: ['https://samplelib.com/lib/preview/mp4/sample-5s.mp4'],
      description: 'Smartwatch tipis dengan monitor kesehatan dan GPS.',
      specs: ['GPS', 'Spo2', 'Tahan Air 5ATM'],
      tags: ['jam','elektronik'],
      affiliateUrl: 'https://example.com/aff/smartwatch-fit'
    },
    {
      id: 8,
      name: 'Set Panci Stainless 8-in-1',
      category: 'home',
      price: 799000,
      rating: 4.0,
      isNew: false,
      isRecommended: false,
      isPopular: true,
      createdAt: '2025-03-12',
      images: [img(800,500,'pan1')],
      videos: [],
      description: 'Paket panci lengkap untuk kebutuhan dapur harian.',
      specs: ['Food Grade', 'Bebas PFOA', 'Tahan Karat'],
      tags: ['dapur','panci'],
      affiliateUrl: 'https://example.com/aff/panci-set'
    },
    {
      id: 9,
      name: 'Bola Basket Outdoor',
      category: 'sports',
      price: 199000,
      rating: 4.3,
      isNew: false,
      isRecommended: true,
      isPopular: false,
      createdAt: '2025-06-01',
      images: [img(800,500,'ball1')],
      videos: [],
      description: 'Bola basket tahan lama untuk lapangan outdoor.',
      specs: ['Ukuran 7', 'Grip Tinggi', 'Karet Tebal'],
      tags: ['basket','bola'],
      affiliateUrl: 'https://example.com/aff/basket-ball'
    },
    {
      id: 10,
      name: 'Lipstik Matte Velvet',
      category: 'beauty',
      price: 99000,
      rating: 4.5,
      isNew: false,
      isRecommended: true,
      isPopular: true,
      createdAt: '2025-05-04',
      images: [img(800,500,'lip1')],
      videos: [],
      description: 'Lipstik matte tahan lama dengan hasil lembut.',
      specs: ['Tahan 12 jam', 'Pigmen Tinggi'],
      tags: ['kosmetik','lipstik'],
      affiliateUrl: 'https://example.com/aff/lipstik-matte'
    }
  ];

  // Ads seed
  window.ADS_SEED = [
    {
      id: 'ad1',
      title: 'Promo Musim Panas! Diskon s/d 70%',
      description: 'Belanja hemat untuk produk pilihan minggu ini.',
      imageUrl: img(560,360,'ads1'),
      targetUrl: 'https://example.com/promo',
      position: 'homepage_footer'
    },
    {
      id: 'ad2',
      title: 'Bundle Elektronik Hemat',
      description: 'Headphone + Smartwatch paket spesial! ',
      imageUrl: img(560,360,'ads2'),
      targetUrl: 'https://example.com/bundle',
      position: 'detail_related'
    }
  ];
})();