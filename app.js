'use strict';

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const sidebarEl = $('#sidebar');
  const toggleSidebarBtn = $('#toggleSidebar');
  const toggleThemeBtn = $('#toggleTheme');
  const dateRangeSelect = $('#dateRange');
  const channelFilterSelect = $('#channelFilter');
  const navLinks = $$('.nav-link');
  const searchCampaignInput = $('#searchCampaign');
  const yearEl = $('#year');

  const statRevenueEl = $('#statRevenue');
  const statRevenueSubEl = $('#statRevenueSub');
  const statClicksEl = $('#statClicks');
  const statClicksSubEl = $('#statClicksSub');
  const statConversionsEl = $('#statConversions');
  const statConversionsSubEl = $('#statConversionsSub');
  const statCvrEl = $('#statCvr');
  const statCvrSubEl = $('#statCvrSub');
  const statEpcsEl = $('#statEpcs');
  const statEpcsSubEl = $('#statEpcsSub');

  const copyRefBtn = $('#copyRef');

  const trafficChartCtx = $('#trafficChart');
  const revenueChartCtx = $('#revenueChart');

  yearEl.textContent = String(new Date().getFullYear());

  // Feather icons
  if (window.feather) {
    window.feather.replace();
  }

  // Local storage helpers
  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  // Theme handling
  const THEME_KEY = 'af_theme';
  const SIDEBAR_KEY = 'af_sidebar_collapsed';
  const ROUTE_KEY = 'af_active_route';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  function initTheme() {
    let theme = storage.get(THEME_KEY, null);
    if (!theme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    storage.set(THEME_KEY, next);
  }

  toggleThemeBtn.addEventListener('click', toggleTheme);
  initTheme();

  // Sidebar handling
  function applySidebarCollapsed(collapsed) {
    if (collapsed) sidebarEl.classList.add('collapsed'); else sidebarEl.classList.remove('collapsed');
  }

  function initSidebar() {
    const collapsed = storage.get(SIDEBAR_KEY, false);
    applySidebarCollapsed(collapsed);
  }

  toggleSidebarBtn.addEventListener('click', () => {
    const willBeCollapsed = !sidebarEl.classList.contains('collapsed');
    applySidebarCollapsed(willBeCollapsed);
    storage.set(SIDEBAR_KEY, willBeCollapsed);
  });
  initSidebar();

  // Routing (visual only)
  function setActiveRoute(route) {
    navLinks.forEach(a => {
      if (a.dataset.route === route) a.classList.add('active'); else a.classList.remove('active');
    });
    storage.set(ROUTE_KEY, route);
  }
  navLinks.forEach(a => a.addEventListener('click', () => setActiveRoute(a.dataset.route)));
  setActiveRoute(storage.get(ROUTE_KEY, 'overview'));

  // Seeded random for stable demo data
  function hashStringToInt(input) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function() {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ t >>> 15, 1 | t);
      r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
      return ((r ^ r >>> 14) >>> 0) / 4294967296;
    };
  }
  function seededRandom(min, max, seedStr) {
    const seed = hashStringToInt(seedStr);
    const rnd = mulberry32(seed)();
    return min + rnd * (max - min);
  }

  // Demo campaigns
  const demoCampaigns = [
    { id: 'CMP-1001', name: 'Aplikasi Keuangan Pro', channel: 'Search' },
    { id: 'CMP-1002', name: 'Kursus Online UI/UX', channel: 'Social' },
    { id: 'CMP-1003', name: 'Perangkat IoT Rumah', channel: 'Display' },
    { id: 'CMP-1004', name: 'SaaS Manajemen Proyek', channel: 'Email' },
    { id: 'CMP-1005', name: 'Bundle Gaming A+', channel: 'Influencer' },
    { id: 'CMP-1006', name: 'VPN Premium', channel: 'Search' },
    { id: 'CMP-1007', name: 'Aplikasi Kesehatan', channel: 'Social' },
    { id: 'CMP-1008', name: 'Paket Hosting', channel: 'Display' }
  ];

  function formatCurrencyIDR(value) {
    try {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
    } catch {
      return 'Rp ' + Math.round(value).toLocaleString('id-ID');
    }
  }

  function formatPercent(value) {
    return (value).toFixed(2) + '%';
  }

  function generateDailySeries(days, channel) {
    const labels = [];
    const clicks = [];
    const conversions = [];
    const revenue = [];

    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      labels.push(label);

      const baseKey = label + '|' + (channel || 'all');
      const baseTraffic = seededRandom(220, 1100, baseKey + '|t');
      const seasonBoost = seededRandom(0.85, 1.25, baseKey + '|s');
      const clickVal = Math.round(baseTraffic * seasonBoost);
      clicks.push(clickVal);

      const cvr = seededRandom(0.018, 0.045, baseKey + '|cvr');
      const conv = Math.round(clickVal * cvr);
      conversions.push(conv);

      const aov = seededRandom(60000, 250000, baseKey + '|aov');
      const rev = Math.round(conv * aov * seededRandom(0.75, 1.15, baseKey + '|mult'));
      revenue.push(rev);
    }

    return { labels, clicks, conversions, revenue };
  }

  function computeSummary(clicks, conversions, revenue) {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const totalClicks = sum(clicks);
    const totalConversions = sum(conversions);
    const totalRevenue = sum(revenue);
    const cvr = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const epc = totalClicks > 0 ? totalRevenue / totalClicks : 0;
    return { totalClicks, totalConversions, totalRevenue, cvr, epc };
  }

  function updateStats(summary, previousSummary) {
    const deltaPct = (curr, prev) => {
      if (!prev || prev === 0) return 0;
      return ((curr - prev) / prev) * 100;
    };

    statRevenueEl.textContent = formatCurrencyIDR(summary.totalRevenue);
    statClicksEl.textContent = String(summary.totalClicks);
    statConversionsEl.textContent = String(summary.totalConversions);
    statCvrEl.textContent = formatPercent(summary.cvr);
    statEpcsEl.textContent = formatCurrencyIDR(summary.epc);

    const prev = previousSummary || { totalRevenue: 0, totalClicks: 0, totalConversions: 0, cvr: 0, epc: 0 };
    statRevenueSubEl.textContent = `${deltaPct(summary.totalRevenue, prev.totalRevenue).toFixed(1)}% dari periode sebelumnya`;
    statClicksSubEl.textContent = `${deltaPct(summary.totalClicks, prev.totalClicks).toFixed(1)}% dari periode sebelumnya`;
    statConversionsSubEl.textContent = `${deltaPct(summary.totalConversions, prev.totalConversions).toFixed(1)}% dari periode sebelumnya`;
    statCvrSubEl.textContent = `${deltaPct(summary.cvr, prev.cvr).toFixed(1)}% dari periode sebelumnya`;
    statEpcsSubEl.textContent = `${deltaPct(summary.epc, prev.epc).toFixed(1)}% dari periode sebelumnya`;
  }

  // Charts
  let trafficChart;
  let revenueChart;

  function initTrafficChart(labels, clicks, conversions) {
    if (!window.Chart) return;
    if (trafficChart) trafficChart.destroy();
    trafficChart = new Chart(trafficChartCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Klik', data: clicks, borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,.15)', tension: .35, fill: true, pointRadius: 0, borderWidth: 2
          },
          {
            label: 'Konversi', data: conversions, borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,.15)', tension: .35, fill: true, pointRadius: 0, borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: getCssVar('--muted') } },
          y: { grid: { color: 'rgba(99,102,241,.12)' }, ticks: { color: getCssVar('--muted') } }
        },
        plugins: {
          legend: { labels: { color: getCssVar('--muted') } },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'index', intersect: false }
      }
    });
  }

  function initRevenueChart(labels, revenueByCampaign) {
    if (!window.Chart) return;
    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueChartCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Pendapatan', data: revenueByCampaign, backgroundColor: 'rgba(99,102,241,.7)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: getCssVar('--muted') } },
          y: { grid: { color: 'rgba(99,102,241,.12)' }, ticks: { color: getCssVar('--muted') }, beginAtZero: true }
        },
        plugins: {
          legend: { labels: { color: getCssVar('--muted') } },
          tooltip: {
            callbacks: { label: (ctx) => ' ' + formatCurrencyIDR(ctx.parsed.y) }
          }
        }
      }
    });
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Campaign table
  function renderCampaignTable(campaignStats, searchQuery) {
    const tbody = $('#campaignTableBody');
    tbody.innerHTML = '';

    const visible = (searchQuery || '').trim().toLowerCase();
    const filtered = campaignStats.filter(row =>
      !visible || row.name.toLowerCase().includes(visible) || row.channel.toLowerCase().includes(visible)
    );

    filtered.sort((a, b) => b.revenue - a.revenue);

    for (const row of filtered) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.channel}</td>
        <td class="num">${row.clicks.toLocaleString('id-ID')}</td>
        <td class="num">${row.conversions.toLocaleString('id-ID')}</td>
        <td class="num">${formatCurrencyIDR(row.epc)}</td>
        <td class="num">${formatCurrencyIDR(row.revenue)}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  function buildCampaignStats(days, channel) {
    const rows = [];
    const baseList = demoCampaigns.filter(c => channel === 'all' ? true : c.channel === channel);
    for (const c of baseList) {
      // Stable per-campaign stats derived from seeded series
      let clicks = 0, conversions = 0, revenue = 0;
      for (let i = 0; i < days; i++) {
        const label = 'd' + i;
        const baseKey = `${c.id}|${label}`;
        const clk = Math.round(seededRandom(40, 320, baseKey + '|clk'));
        const cvr = seededRandom(0.02, 0.06, baseKey + '|cvr');
        const cnv = Math.round(clk * cvr);
        const aov = seededRandom(50000, 200000, baseKey + '|aov');
        const rev = Math.round(cnv * aov);
        clicks += clk; conversions += cnv; revenue += rev;
      }
      const epc = clicks > 0 ? revenue / clicks : 0;
      rows.push({ id: c.id, name: c.name, channel: c.channel, clicks, conversions, revenue, epc });
    }
    return rows;
  }

  // Filters and data update
  let currentDays = Number(dateRangeSelect.value);
  let currentChannel = channelFilterSelect.value;

  let previousSummary = null;

  function updateAll() {
    const series = generateDailySeries(currentDays, currentChannel === 'all' ? '' : currentChannel);
    const summary = computeSummary(series.clicks, series.conversions, series.revenue);

    const campaignStats = buildCampaignStats(currentDays, currentChannel);

    // Prepare revenue by campaign (top 7)
    const top = [...campaignStats].sort((a,b) => b.revenue - a.revenue).slice(0, 7);
    const revLabels = top.map(r => r.name);
    const revData = top.map(r => r.revenue);

    initTrafficChart(series.labels, series.clicks, series.conversions);
    initRevenueChart(revLabels, revData);
    renderCampaignTable(campaignStats, searchCampaignInput.value);

    updateStats(summary, previousSummary);
    previousSummary = summary;
  }

  dateRangeSelect.addEventListener('change', () => {
    currentDays = Number(dateRangeSelect.value);
    updateAll();
  });
  channelFilterSelect.addEventListener('change', () => {
    currentChannel = channelFilterSelect.value;
    updateAll();
  });
  searchCampaignInput.addEventListener('input', () => {
    const campaignStats = buildCampaignStats(currentDays, currentChannel);
    renderCampaignTable(campaignStats, searchCampaignInput.value);
  });

  copyRefBtn.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    const ref = 'aff_id=AFF-93827';
    url.searchParams.set('ref', 'AFF-93827');
    try {
      await navigator.clipboard.writeText(url.toString());
      copyRefBtn.classList.add('copied');
      copyRefBtn.innerHTML = '<i data-feather="check"></i><span>Disalin!</span>';
      if (window.feather) window.feather.replace();
      setTimeout(() => {
        copyRefBtn.classList.remove('copied');
        copyRefBtn.innerHTML = '<i data-feather="link-2"></i><span>Salin Tautan Rujukan</span>';
        if (window.feather) window.feather.replace();
      }, 1200);
    } catch (e) {
      alert('Gagal menyalin tautan');
    }
  });

  // Initial render
  updateAll();
})();