(function() {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const routes = {
    '/dashboard': 'view-dashboard',
    '/campaigns': 'view-campaigns',
    '/links': 'view-links',
    '/payouts': 'view-payouts',
    '/reports': 'view-reports',
    '/referrals': 'view-referrals',
    '/assets': 'view-assets',
    '/notifications': 'view-notifications',
    '/settings/profile': 'view-settings-profile',
    '/settings/payments': 'view-settings-payments',
    '/settings/security': 'view-settings-security',
    '/support': 'view-support'
  };

  const contentEl = $('#content');
  const sidebarEl = $('#sidebar');
  const hamburgerBtn = $('#hamburgerBtn');
  const sidebarCloseBtn = $('#sidebarCloseBtn');
  const themeToggleBtn = $('#themeToggleBtn');
  const toastEl = $('#toast');

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('is-show');
    setTimeout(() => toastEl.classList.remove('is-show'), 1700);
  }

  function setTheme(mode) {
    if (mode !== 'light' && mode !== 'dark') mode = 'auto';
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('auto');
    }
  }

  function openSidebar() {
    sidebarEl.classList.add('is-open');
    document.body.classList.add('menu-open');
  }
  function closeSidebar() {
    sidebarEl.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  function activateNav(path) {
    const all = $$('.nav__item, .nav__subitem');
    all.forEach(a => a.classList.remove('is-active'));
    const current = all.find(a => a.dataset.route === path);
    if (current) current.classList.add('is-active');

    // Open settings group if child is active
    const settings = $('[data-group="settings"]');
    if (settings) {
      const anySettingsActive = $$('.nav__subitem', settings).some(a => a.classList.contains('is-active'));
      if (anySettingsActive) settings.setAttribute('open', ''); else settings.removeAttribute('open');
    }
  }

  function formatNumber(n) {
    return new Intl.NumberFormat('id-ID').format(n);
  }

  function animateValue(el, toValue, prefix = '', suffix = '') {
    const duration = 650;
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const val = Math.floor(from + (toValue - from) * (1 - Math.pow(1 - t, 3)));
      el.textContent = `${prefix}${formatNumber(val)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function drawMiniChart(days) {
    const canvas = $('#miniChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
    const height = canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);

    // Seed pseudo data
    const points = Array.from({ length: days }, (_, i) => 50 + Math.sin(i / 2.3) * 14 + Math.random() * 10);
    const max = Math.max(...points) + 12;
    const min = Math.min(...points) - 12;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border');
    ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
    for (let i = 0; i < 4; i++) {
      const y = (i / 3) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Line
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
    ctx.beginPath();
    points.forEach((v, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((v - min) / (max - min)) * height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, primary.trim() + '55');
    grad.addColorStop(1, primary.trim() + '05');
    ctx.fillStyle = grad;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }

  function render(path) {
    const tplId = routes[path] || routes['/dashboard'];
    const tpl = document.getElementById(tplId);
    if (!tpl) return;
    contentEl.innerHTML = '';
    contentEl.appendChild(tpl.content.cloneNode(true));
    document.title = `Affilio — ${document.querySelector(`[data-route="${path}"]`)?.textContent || 'Dasbor'}`;

    // Animations for numbers
    $$('[data-animate]', contentEl).forEach(el => {
      const val = Number(el.getAttribute('data-animate')) || 0;
      const isCurrency = /rp/i.test(el.textContent);
      animateValue(el, val, isCurrency ? 'Rp ' : '');
    });

    // Chart on dashboard
    if (path === '/dashboard') {
      const select = $('#chartRange', contentEl);
      const draw = () => drawMiniChart(Number(select.value));
      select.addEventListener('change', draw);
      setTimeout(draw, 0);

      const activity = $('#activityList', contentEl);
      if (activity) {
        seedActivity(activity);
        $('#refreshActivityBtn', contentEl)?.addEventListener('click', () => {
          seedActivity(activity, true);
          showToast('Aktivitas diperbarui');
        });
      }

      bindCopyButtons(contentEl);
    }

    // Links
    if (path === '/links') {
      seedLinks($('#linksTable', contentEl));
      bindCopyButtons(contentEl);
      $('#generateLinkBtn', contentEl)?.addEventListener('click', () => {
        const table = $('#linksTable', contentEl);
        const link = newLinkRow(randomCampaign());
        table.appendChild(link);
        showToast('Tautan dibuat');
      });
    }

    // Campaigns
    if (path === '/campaigns') {
      const list = $('#campaignsList', contentEl);
      seedCampaigns(list);
      $('#newCampaignBtn', contentEl)?.addEventListener('click', () => {
        const c = campaignCard({ name: `Kampanye ${Math.floor(Math.random()*100)}`, status: 'Aktif', ctr: `${(Math.random()*4+1).toFixed(2)}%` });
        list.prepend(c);
        showToast('Kampanye ditambahkan');
      });
    }

    // Reports
    if (path === '/reports') {
      $('#exportCsvBtn', contentEl)?.addEventListener('click', exportCsv);
    }

    // Assets
    if (path === '/assets') {
      bindCopyButtons(contentEl);
    }

    // Notifications
    if (path === '/notifications') {
      seedNotifications($('#notifList', contentEl));
    }

    // Forms
    $('form#profileForm', contentEl)?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Profil disimpan'); });
    $('form#paymentsForm', contentEl)?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Setelan pembayaran disimpan'); });
    $('form#securityForm', contentEl)?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Kata sandi diperbarui'); });

    // Focus main content
    contentEl.focus();
  }

  function bindCopyButtons(scope = document) {
    $$('[data-copy]', scope).forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-copy');
        const el = $(target);
        if (el) {
          navigator.clipboard.writeText(el.value || el.textContent || '').then(() => showToast('Disalin ke papan klip'));
        }
      });
    });
    $$('[data-copy-text]', scope).forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy-text') || '';
        navigator.clipboard.writeText(text).then(() => showToast('Kode disalin'));
      });
    });
  }

  function randomCampaign() {
    const names = ['Musim Panas', 'Back to School', '11.11', 'Ramadan', 'Liburan'];
    return names[Math.floor(Math.random()*names.length)];
  }

  function newLinkRow(campaign) {
    const row = document.createElement('div');
    row.className = 'table__row';
    const id = Math.random().toString(36).slice(2, 8);
    const url = `https://domainmu.com/${id}?ref=AFF-23918`;
    row.innerHTML = `
      <div><input type="text" value="${url}" readonly /></div>
      <div>${campaign}</div>
      <div>${Math.floor(Math.random()*500)}</div>
      <div>${Math.floor(Math.random()*50)}</div>
      <div><button class="pill-btn" data-copy-text="${url}">Salin</button></div>
    `;
    return row;
  }

  function seedLinks(table) {
    const campaigns = ['Peluncuran A', 'Promo B', 'Event C'];
    campaigns.forEach(c => table.appendChild(newLinkRow(c)));
  }

  function campaignCard({ name, status, ctr }) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="card__title">${status}</div>
      <div class="card__value">${name}</div>
      <div class="muted">CTR: ${ctr}</div>
      <div class="actions">
        <button class="pill-btn">Detail</button>
        <button class="icon-btn">⋯</button>
      </div>
    `;
    return el;
  }

  function seedCampaigns(list) {
    const data = [
      { name: 'Peluncuran Produk X', status: 'Aktif', ctr: '3.18%' },
      { name: 'Promo Akhir Pekan', status: 'Jeda', ctr: '1.02%' },
      { name: 'Flash Sale 9.9', status: 'Aktif', ctr: '2.44%' }
    ];
    data.forEach(d => list.appendChild(campaignCard(d)));
  }

  function seedActivity(container, refresh = false) {
    if (refresh) container.querySelectorAll('.table__row:not(.table__row--head)').forEach(n => n.remove());
    const items = [
      { t: '10:23', y: 'Pembelian', k: 'Peluncuran Produk X', v: 'Rp 320.000' },
      { t: '09:12', y: 'Klik', k: 'Promo Akhir Pekan', v: '-' },
      { t: '08:44', y: 'Pendaftaran', k: 'Flash Sale 9.9', v: 'Rp 0' }
    ];
    items.forEach(i => {
      const row = document.createElement('div');
      row.className = 'table__row';
      row.innerHTML = `<div>${i.t}</div><div>${i.y}</div><div>${i.k}</div><div>${i.v}</div>`;
      container.appendChild(row);
    });
  }

  function seedNotifications(list) {
    const items = [
      'Pembayaran Agustus telah diproses.',
      'Kampanye baru: Back to School telah tersedia.',
      'Peningkatan keamanan: aktifkan 2FA di Pengaturan.'
    ];
    items.forEach(text => { const li = document.createElement('li'); li.textContent = text; list.appendChild(li); });
  }

  function exportCsv() {
    const lines = [
      ['Tanggal', 'Klik', 'Konversi', 'Pendapatan'],
      ['2025-08-09', '1245', '53', '4250000'],
      ['2025-08-08', '1001', '47', '3980000']
    ];
    const csv = lines.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'laporan.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV diekspor');
  }

  function navigateTo(path) {
    if (!routes[path]) path = '/dashboard';
    if (location.hash !== `#${path}`) location.hash = `#${path}`;
    activateNav(path);
    render(path);
    closeSidebar();
  }

  function currentPath() {
    return location.hash.replace(/^#/, '') || '/dashboard';
  }

  function initRouting() {
    window.addEventListener('hashchange', () => navigateTo(currentPath()));
    if (!location.hash) location.hash = '#/dashboard';
    navigateTo(currentPath());

    // Nav click (improve responsiveness on mobile)
    $$('.nav__item, .nav__subitem').forEach(a => {
      a.addEventListener('click', (e) => {
        // Allow anchor to update hash; handler will render.
        // Just close sidebar on mobile quickly.
        setTimeout(closeSidebar, 0);
      });
    });
  }

  function initUI() {
    hamburgerBtn?.addEventListener('click', openSidebar);
    sidebarCloseBtn?.addEventListener('click', closeSidebar);
    document.body.addEventListener('click', (e) => {
      if (document.body.classList.contains('menu-open')) {
        const isInside = sidebarEl.contains(e.target);
        if (!isInside) closeSidebar();
      }
    });

    initTheme();
    themeToggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'auto';
      const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      setTheme(next);
      showToast(`Tema: ${next}`);
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initRouting();
  });
})();