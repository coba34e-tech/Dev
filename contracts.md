# AffiPro.SEO – API Contracts (v0.1)

Scope: Mengganti mock localStorage di frontend dengan backend FastAPI + MongoDB. Semua route prefiks /api. Tanpa hardcode URL: frontend gunakan REACT_APP_BACKEND_URL, backend gunakan MONGO_URL & DB_NAME dari .env backend.

A. Entities & Collections
1) products
- id: string (uuid)
- name: string
- category: string
- price: number (IDR)
- commission: number (percentage)
- active: boolean
- url: string
- created_at: datetime

2) campaigns
- id: string (uuid)
- name: string
- budget: number (IDR)
- status: enum("aktif","pause","selesai")
- start: string (YYYY-MM-DD)
- end: string (YYYY-MM-DD)
- utm: { source: string, medium: string, campaign: string }
- created_at: datetime

3) coupons
- id: string (uuid)
- code: string
- discount: number (percentage)
- usage: number
- active: boolean
- created_at: datetime

4) utm_links
- id: string (uuid)
- title: string
- url: string
- created_at: datetime

5) clicks
- id: string (uuid)
- productId: string (ref products.id)
- ts: datetime (ISO)
- source: string (seo/email/ads/social/referral/...)
- campaignId: string (ref campaigns.id)

6) metrics (respons saja – agregasi)
- clicks: number
- conversions: number
- revenue: number
- ctr: number

B. API Contracts (request/response)
Base path: /api
Content-Type: application/json

Products
- GET /products -> 200 [{Product}]
- POST /products {ProductCreate} -> 201 {Product}
- PUT /products/{id} {ProductUpdate(partial)} -> 200 {Product}
- DELETE /products/{id} -> 204

Campaigns
- GET /campaigns -> 200 [{Campaign}]
- POST /campaigns {CampaignCreate} -> 201 {Campaign}
- PUT /campaigns/{id} {CampaignUpdate} -> 200 {Campaign}
- DELETE /campaigns/{id} -> 204

Coupons
- GET /coupons -> 200 [{Coupon}]
- POST /coupons {CouponCreate} -> 201 {Coupon}
- PUT /coupons/{id} {CouponUpdate} -> 200 {Coupon}
- DELETE /coupons/{id} -> 204

UTM Links
- GET /utm-links -> 200 [{UTMLink}]
- POST /utm-links {UTMLinkCreate} -> 201 {UTMLink}
- DELETE /utm-links/{id} -> 204

Clicks
- GET /clicks?limit=100 -> 200 [{Click}]
- POST /clicks {ClickCreate} -> 201 {Click}

Metrics
- GET /metrics -> 200 {Metrics}

Export
- GET /export/csv -> 200 text/csv (produk+kampanye)

C. Mapping dari Mock (frontend/src/mock/mock.js)
- metrics -> /metrics (sementara bisa nol/placeholder, nanti dihitung dari clicks/konversi)
- products[] -> /products CRUD
- campaigns[] -> /campaigns CRUD
- coupons[] -> /coupons CRUD
- clicks[] -> /clicks GET/POST
- utmLinks[] -> /utm-links GET/POST/DELETE

D. Implementasi Backend
- Tambah model Pydantic + router CRUD di FastAPI (server.py)
- Simpan dokumen dengan field id (string) dan abaikan _id mongo pada response
- Validasi sederhana + 404 untuk not found, 422 otomatis
- Ekspor CSV: gabung dua dataset products & campaigns

E. Integrasi Frontend ↔ Backend
- Ganti impor data dari mock.js menjadi panggilan API via REACT_APP_BACKEND_URL
- Buat util API kecil (axios/fetch) dengan baseURL = process.env.REACT_APP_BACKEND_URL + '/api'
- State management tetap lokal (optimistic update) + fallback bila API gagal
- Langkah migrasi bertahap:
  1) Tambah util api & health check
  2) Integrasi Products (list/create/update/delete)
  3) Integrasi Campaigns & Coupons
  4) Integrasi UTM Links & Export CSV
  5) (opsional) Metrics & Clicks
- Hapus penggunaan localStorage setelah semua endpoint stabil

F. Catatan
- Semua route wajib prefiks /api (sesuai ingress)
- Tidak mengubah .env dan tidak hardcode URL/port
- Tes backend via script requests/pytest (bukan curl)