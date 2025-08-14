/* Mock data and localStorage helpers for the Affiliate Pro Dashboard */
export const STORAGE_KEY = "affi_pro_mock_v1";

const now = () => new Date().toISOString();

export const initialData = {
  metrics: {
    clicks: 4821,
    conversions: 367,
    revenue: 128450000, // in IDR
    ctr: 7.6,
  },
  products: [
    { id: "p1", name: "Paket Hosting Turbo", category: "Hosting", price: 99000, commission: 25, active: true, url: "https://merchant.com/hosting?ref=YOURID" },
    { id: "p2", name: "Theme Premium SEO", category: "Tema", price: 350000, commission: 30, active: true, url: "https://merchant.com/theme?ref=YOURID" },
    { id: "p3", name: "Tool Riset Kata Kunci", category: "Tools", price: 199000, commission: 20, active: true, url: "https://merchant.com/keyword?ref=YOURID" },
    { id: "p4", name: "Kursus SEO 30 Hari", category: "Kursus", price: 499000, commission: 40, active: true, url: "https://merchant.com/seo-course?ref=YOURID" },
    { id: "p5", name: "Plugin Cache Pro", category: "Plugin", price: 149000, commission: 22, active: false, url: "https://merchant.com/cache?ref=YOURID" },
    { id: "p6", name: "Email Marketing Starter", category: "Email", price: 99000, commission: 18, active: true, url: "https://merchant.com/email?ref=YOURID" },
  ],
  campaigns: [
    { id: "c1", name: "Launching Juli", budget: 3000000, status: "aktif", start: "2025-07-01", end: "2025-07-31", utm: { source: "newsletter", medium: "email", campaign: "launch_juli" } },
    { id: "c2", name: "SEO Evergreen", budget: 1500000, status: "aktif", start: "2025-06-01", end: "2025-12-31", utm: { source: "organic", medium: "seo", campaign: "evergreen" } },
    { id: "c3", name: "Promo Lebaran", budget: 5000000, status: "selesai", start: "2025-04-01", end: "2025-04-20", utm: { source: "ads", medium: "cpc", campaign: "lebaran" } },
  ],
  coupons: [
    { id: "cp1", code: "HEMAT20", discount: 20, usage: 134, active: true },
    { id: "cp2", code: "SEOBOOST15", discount: 15, usage: 87, active: true },
    { id: "cp3", code: "SUPER10", discount: 10, usage: 212, active: false },
  ],
  clicks: [
    { id: "cl1", productId: "p1", ts: now(), source: "seo", campaignId: "c2" },
    { id: "cl2", productId: "p2", ts: now(), source: "email", campaignId: "c1" },
    { id: "cl3", productId: "p3", ts: now(), source: "ads", campaignId: "c3" },
  ],
  utmLinks: [
    { id: "u1", title: "Link Blog - Hosting", url: "https://yourblog.com/hosting?utm_source=seo&utm_medium=blog&utm_campaign=evergreen" },
  ],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return JSON.parse(JSON.stringify(initialData));
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load mock data", e);
    return JSON.parse(JSON.stringify(initialData));
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Failed to save mock data", e);
    return false;
  }
}

export function currencyIDR(n) {
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
  }
}