const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));
app.use('/', express.static(path.join(__dirname, '..', 'public')));

function loadDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Health
app.get('/api/health', (req, res) => {
  return res.json({ ok: true, env: process.env.NODE_ENV || 'development', time: new Date().toISOString() });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = signToken({ sub: email, role: 'admin' });
    return res.json({ token, email });
  }
  return res.status(401).json({ message: 'Email atau password salah' });
});

// Products: list/search/filter/sort
app.get('/api/products', (req, res) => {
  const { q, marketplace, category, minPrice, maxPrice, sort } = req.query;
  const db = loadDb();
  let items = db.products || [];

  if (q) {
    const lower = String(q).toLowerCase();
    items = items.filter(p => (p.title || '').toLowerCase().includes(lower) || (p.description || '').toLowerCase().includes(lower));
  }
  if (marketplace) {
    const list = String(marketplace).split(',').map(s => s.trim().toLowerCase());
    items = items.filter(p => list.includes(String(p.marketplace).toLowerCase()));
  }
  if (category) {
    const list = String(category).split(',').map(s => s.trim().toLowerCase());
    items = items.filter(p => list.includes(String(p.category).toLowerCase()));
  }
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;
  if (min !== null) items = items.filter(p => Number(p.price) >= min);
  if (max !== null) items = items.filter(p => Number(p.price) <= max);

  switch (sort) {
    case 'price_asc':
      items.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price_desc':
      items.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'rating_desc':
      items.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case 'popular':
      items.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
      break;
    default:
      break;
  }

  res.json({ items });
});

app.get('/api/products/:id', (req, res) => {
  const db = loadDb();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json(product);
});

// Admin CRUD
app.post('/api/products', authMiddleware, (req, res) => {
  const db = loadDb();
  const body = req.body || {};
  const id = nanoid();
  const product = {
    id,
    title: body.title,
    description: body.description || '',
    price: Number(body.price) || 0,
    image: body.image || '',
    marketplace: body.marketplace || 'other',
    category: body.category || 'other',
    rating: Number(body.rating) || 0,
    reviews: Number(body.reviews) || 0,
    commissionRate: Number(body.commissionRate) || 0,
    affiliateUrl: body.affiliateUrl || '#',
    popularity: Number(body.popularity) || 0,
    createdAt: new Date().toISOString()
  };
  db.products.push(product);
  saveDb(db);
  res.status(201).json(product);
});

app.patch('/api/products/:id', authMiddleware, (req, res) => {
  const db = loadDb();
  const idx = (db.products || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  const updated = { ...db.products[idx], ...req.body, id: db.products[idx].id };
  db.products[idx] = updated;
  saveDb(db);
  res.json(updated);
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const db = loadDb();
  const before = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  const removed = before - db.products.length;
  saveDb(db);
  res.json({ removed });
});

// Tracking
app.post('/api/track/click', (req, res) => {
  const { productId, channel, ref } = req.body || {};
  const db = loadDb();
  const product = (db.products || []).find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  const event = {
    id: nanoid(),
    type: 'click',
    productId,
    channel: channel || 'default',
    ref: ref || null,
    ts: Date.now()
  };
  db.events.push(event);
  saveDb(db);
  res.json({ ok: true });
});

app.post('/api/track/conversion', (req, res) => {
  const { productId, orderId, amount, commission, channel } = req.body || {};
  const db = loadDb();
  const product = (db.products || []).find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  const event = {
    id: nanoid(),
    type: 'conversion',
    productId,
    orderId: orderId || nanoid(),
    amount: Number(amount) || 0,
    commission: Number(commission) || 0,
    channel: channel || 'default',
    ts: Date.now()
  };
  db.events.push(event);
  saveDb(db);
  res.json({ ok: true });
});

// Stats
app.get('/api/stats', authMiddleware, (req, res) => {
  const { from, to } = req.query;
  const db = loadDb();
  const start = from ? new Date(from).getTime() : 0;
  const end = to ? new Date(to).getTime() : Date.now();
  const events = (db.events || []).filter(e => e.ts >= start && e.ts <= end);

  let clicks = 0;
  let conversions = 0;
  let revenue = 0;

  const clicksByProduct = {};
  const convByProduct = {};
  const revenueByProduct = {};
  const clicksByMarketplace = {};
  const convByMarketplace = {};

  for (const e of events) {
    if (e.type === 'click') {
      clicks++;
      clicksByProduct[e.productId] = (clicksByProduct[e.productId] || 0) + 1;
      const mp = (db.products.find(p => p.id === e.productId) || {}).marketplace || 'other';
      clicksByMarketplace[mp] = (clicksByMarketplace[mp] || 0) + 1;
    }
    if (e.type === 'conversion') {
      conversions++;
      revenue += Number(e.commission || 0);
      convByProduct[e.productId] = (convByProduct[e.productId] || 0) + 1;
      revenueByProduct[e.productId] = (revenueByProduct[e.productId] || 0) + Number(e.commission || 0);
      const mp = (db.products.find(p => p.id === e.productId) || {}).marketplace || 'other';
      convByMarketplace[mp] = (convByMarketplace[mp] || 0) + 1;
    }
  }

  const topProducts = Object.entries(clicksByProduct)
    .map(([productId, c]) => ({ productId, clicks: c, conversions: convByProduct[productId] || 0, revenue: revenueByProduct[productId] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map(row => ({
      ...row,
      product: db.products.find(p => p.id === row.productId) || null
    }));

  res.json({
    totals: { clicks, conversions, revenue },
    clicksByMarketplace,
    convByMarketplace,
    topProducts
  });
});

// Fallback to SPA/static pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Affiliate catalog server running on http://localhost:${PORT}`);
});

