import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API_BASE = `${BACKEND_URL}`.replace(/\/$/, "") + "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Products
export const getProducts = () => api.get("/products").then(r => r.data);
export const createProduct = (payload) => api.post("/products", payload).then(r => r.data);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload).then(r => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(r => r.data);

// Campaigns
export const getCampaigns = () => api.get("/campaigns").then(r => r.data);
export const createCampaign = (payload) => api.post("/campaigns", payload).then(r => r.data);
export const updateCampaign = (id, payload) => api.put(`/campaigns/${id}`, payload).then(r => r.data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`).then(r => r.data);

// Coupons
export const getCoupons = () => api.get("/coupons").then(r => r.data);
export const createCoupon = (payload) => api.post("/coupons", payload).then(r => r.data);
export const updateCoupon = (id, payload) => api.put(`/coupons/${id}`, payload).then(r => r.data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`).then(r => r.data);

// UTM Links
export const getUtmLinks = () => api.get("/utm-links").then(r => r.data);
export const createUtmLink = (payload) => api.post("/utm-links", payload).then(r => r.data);
export const deleteUtmLink = (id) => api.delete(`/utm-links/${id}`).then(r => r.data);

// Clicks & Metrics
export const getClicks = (limit = 100) => api.get(`/clicks?limit=${limit}`).then(r => r.data);
export const createClick = (payload) => api.post("/clicks", payload).then(r => r.data);
export const getMetrics = () => api.get("/metrics").then(r => r.data);

// Export
export const exportCSVUrl = () => `${API_BASE}/export/csv`;