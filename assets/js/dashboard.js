// Dashboard-only behaviors
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.body.classList.contains('page-dashboard')) return;

    // Require auth
    if (window.AllDreamAuth && typeof window.AllDreamAuth.requireAuthOrRedirect === 'function') {
      window.AllDreamAuth.requireAuthOrRedirect();
    }

    // Sidebar collapse (small behavior, toggles class on body or sidebar width)
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.getElementById('sidebarToggle');
    toggle && toggle.addEventListener('click', () => {
      if (document.body.dataset.sidebar === 'collapsed') {
        delete document.body.dataset.sidebar;
        sidebar.style.width = '';
      } else {
        document.body.dataset.sidebar = 'collapsed';
        sidebar.style.width = '86px';
      }
    });

    // Section switching
    const links = Array.from(document.querySelectorAll('.sidebar-link'));
    const sections = Array.from(document.querySelectorAll('.section'));
    links.forEach(l => l.addEventListener('click', () => {
      const sectionKey = l.getAttribute('data-section');
      if (sectionKey === null) return;
      if (l.id === 'logoutBtn') return; // handled below
      links.forEach(x => x.classList.remove('active'));
      l.classList.add('active');
      sections.forEach(s => s.classList.remove('visible'));
      const target = document.getElementById('section-' + sectionKey);
      if (target) target.classList.add('visible');
    }));

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn && logoutBtn.addEventListener('click', () => {
      window.AllDreamAuth.logout();
      window.location.href = 'login.html';
    });

    // Fill user chip
    const user = (window.AllDreamAuth && window.AllDreamAuth.getUser && window.AllDreamAuth.getUser()) || { name: 'Akun' };
    const userChip = document.getElementById('userChip');
    if (userChip) userChip.textContent = user.name || user.email || 'Akun';

    // Demo metrics
    const clicks = Math.floor(1200 + Math.random() * 2300);
    const conversions = Math.floor(clicks * (0.03 + Math.random() * 0.04));
    const revenue = Math.floor(conversions * (10000 + Math.random() * 40000));
    const epc = revenue / Math.max(1, clicks);
    const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
    document.getElementById('metricClicks').textContent = String(clicks);
    document.getElementById('metricConversions').textContent = String(conversions);
    document.getElementById('metricRevenue').textContent = formatIDR(revenue);
    document.getElementById('metricEpc').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.round(epc));

    // Chart.js simple line
    const ctx = document.getElementById('chartPerformance');
    if (ctx && window.Chart) {
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86400000);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      });
      const data = days.map(() => Math.floor(80 + Math.random() * 200));
      new Chart(ctx, {
        type: 'line',
        data: { labels: days, datasets: [{ label: 'Klik', data, borderColor: '#5a67d8', backgroundColor: 'rgba(90, 103, 216, .15)', tension: .35, fill: true }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { precision: 0 }}}}
      });
    }

    // Top marketplaces table
    const topMarkets = [
      { name: 'Shopee', clicks: 1320, conversions: 64, revenue: 1850000 },
      { name: 'Tokopedia', clicks: 980, conversions: 41, revenue: 1320000 },
      { name: 'Lazada', clicks: 710, conversions: 28, revenue: 820000 },
      { name: 'TikTok Shop', clicks: 540, conversions: 22, revenue: 610000 },
    ];
    const tbody = document.querySelector('#tableTopMarketplaces tbody');
    if (tbody) {
      tbody.innerHTML = '';
      topMarkets.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.name}</td><td>${row.clicks}</td><td>${row.conversions}</td><td>${formatIDR(row.revenue)}</td>`;
        tbody.appendChild(tr);
      });
    }

    // Dashboard products (reuse sample)
    const dashboardProducts = document.getElementById('dashboardProducts');
    if (dashboardProducts) {
      const sample = Array.from({ length: 8 }).map((_, i) => ({
        id: 'D' + i, title: 'Produk Dasbor ' + (i + 1), marketplace: ['Shopee','Tokopedia','Lazada','TikTok Shop'][i % 4], price: 20000 + i * 5000, rating: 4 + (i % 2 ? .2 : .5), color: ['#f97316', '#10b981', '#7c3aed', '#0ea5e9'][i % 4], url: '#'
      }));
      function formatIDR(n){ return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n); }
      dashboardProducts.innerHTML = '';
      sample.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card-product';
        div.innerHTML = `
          <a href="${p.url}" class="thumb">Gambar</a>
          <div class="body">
            <div class="market-badge"><span class="market-dot" style="background:${p.color}"></span>${p.marketplace}</div>
            <div class="title">${p.title}</div>
            <div class="row" style="display:flex;justify-content:space-between;align-items:center;">
              <div class="price">${formatIDR(p.price)}</div>
              <div class="rating">★ ${p.rating}</div>
            </div>
          </div>`;
        dashboardProducts.appendChild(div);
      });
    }

    // Links create
    const linkForm = document.getElementById('linkForm');
    const linkList = document.getElementById('linkList');
    if (linkForm && linkList) {
      linkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const url = document.getElementById('linkUrl').value.trim();
        const campaign = document.getElementById('linkCampaign').value.trim();
        if (!url) return;
        const affLink = url + (url.includes('?') ? '&' : '?') + 'ref=alldream' + (campaign ? ('&cmp=' + encodeURIComponent(campaign)) : '');
        const li = document.createElement('li');
        li.innerHTML = `<span class="muted small" style="word-break: break-all;">${affLink}</span> <button class="btn btn-primary btn-sm">Salin</button>`;
        const btn = li.querySelector('button');
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(affLink).then(() => { btn.textContent = 'Tersalin'; setTimeout(()=>btn.textContent='Salin',1200); });
        });
        linkList.prepend(li);
        linkForm.reset();
      });
    }

    // Settings save
    const saveSettings = document.getElementById('saveSettings');
    if (saveSettings) {
      saveSettings.addEventListener('click', () => {
        const name = document.getElementById('profileName').value.trim();
        const currency = document.getElementById('currency').value;
        // Persist locally
        localStorage.setItem('alldream_settings', JSON.stringify({ name, currency }));
        const chip = document.getElementById('userChip');
        if (chip && name) chip.textContent = name;
        saveSettings.textContent = 'Tersimpan';
        setTimeout(() => saveSettings.textContent = 'Simpan', 1200);
      });
      // Load existing
      const raw = localStorage.getItem('alldream_settings');
      if (raw) {
        try {
          const s = JSON.parse(raw);
          document.getElementById('profileName').value = s.name || '';
          document.getElementById('currency').value = s.currency || 'IDR';
        } catch {}
      }
    }
  });
})();

