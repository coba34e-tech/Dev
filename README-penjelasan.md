# Penjelasan Baris demi Baris (HTML + CSS + JS)

Dokumen ini menjelaskan fungsi setiap baris kode pada proyek AffiShop. Buka berdampingan dengan file sumber untuk memudahkan.

## index.html (Beranda)

1. `<!DOCTYPE html>`: Mendeklarasikan dokumen HTML5.
2. `<html lang="id">`: Bahasa dokumen Indonesia.
3. `<head>` ... `</head>`: Metadata halaman.
4. `<meta charset="UTF-8">`: Set encoding UTF-8.
5. `<meta name="viewport" ...>`: Responsif di perangkat mobile.
6. `<title>...` : Judul tab browser.
7. Preconnect & font Inter: Optimisasi dan tipografi.
8. `<link rel="stylesheet" href="/workspace/css/styles.css">`: Memuat CSS utama.
9. `<body>`: Isi halaman.
10. `<header class="site-header">`: Header sticky.
11. `.header-inner`: Kontainer grid logo, form, dan navigasi.
12. `.logo`: Link kembali ke beranda.
13. `<form id="searchForm" ...>`: Form pencarian + filter + sort.
14. `#searchInput`: Input kata kunci.
15. `#categoryFilter`: Dropdown kategori (terisi via JS).
16. `#sortSelect`: Dropdown urutan.
17. Tombol `Cari` dan `Reset`.
18. `<nav class="top-nav">`: Link ke `dashboard.html`.
19. `<main class="container main-grid">`: Grid 2 kolom (katalog + sidebar).
20. `section.catalog`: Kolom utama berisi judul, grid produk, pagination, dan tempat iklan.
21. `#productGrid`: Grid kartu produk 3 kolom (dikontrol CSS).
22. `#pagination`: Navigasi halaman (dirender JS).
23. `#promoAds`: Slot iklan di bawah pagination.
24. `aside.sidebar`: Kolom samping.
25. Tiga `section` side: Produk Baru, Rekomendasi, Populer (diisi JS).
26. `<footer>`: Footer kecil dan tahun dinamis.
27. `<script src=...>`: Urutan JS: data, storage, utils, dan `main.js`.

## product-detail.html (Halaman Detail)

1-8. Head serupa beranda, memuat CSS.
9-18. Header dengan mini search (compact) dan link dasbor.
19. `<main class="container detail-grid">`: Dua kolom.
20-25. `section.media-column`: Viewer media + tombol prev/next + thumbnails.
26-41. `section.info-column`: Judul, badge kategori, harga, rating, tombol beli, deskripsi, spesifikasi, dan tag.
42-47. `section.related-section`: Baris produk terkait (scroll horizontal).
48-52. Footer kecil + tahun.
53-57. Script: data, storage, utils, `detail.js`.

## dashboard.html (Dasbor CMS)

1-8. Head seperti biasa + CSS.
9. `<body class="dashboard">`: Mengaktifkan layout grid 2 kolom.
10-17. `aside.sidebar-cms`: Sidebar dengan logo dan tombol collapse.
18-22. Menu anchor ke tiap section.
23-26. `main.cms-main`: Konten dasbor.
27-31. `#overview`: Ikhtisar statistik.
32-47. `#postProduct`: Form posting produk (input, checkbox, tombol simpan).
48-61. `#postAd`: Form posting iklan (posisi, tanggal aktif).
62-71. `#manage`: Tabel pengelolaan produk dan iklan.
72-76. Script: data, storage, utils, `dashboard.js`.

## css/styles.css

- Root variabel warna, radius, dan bayangan.
- Background gradien gelap modern.
- Header sticky dengan blur.
- Form pencarian grid, tombol, dan fokus ring.
- Grid utama: 3:1.2 (katalog:sidebar). Detail: 1.3:1.
- Kartu produk: media, konten, meta, aksi.
- Aksen warna berdasar kategori (`.cat-*`).
- Sidebar list kompak.
- Pagination tombol aktif/hover.
- Komponen iklan `.ad-banner`.
- Detail page: viewer media, thumbs, info.
- CMS: layout grid, sidebar, menu, section, form, manage-list.
- Responsif: breakpoint 1100/900/680 px.
- Collapsed dashboard: atur lebar sidebar via class di body.

## js/data.js

- `window.CATEGORIES`: Daftar kategori.
- Helper `img()` untuk placeholder gambar.
- `window.PRODUCTS_SEED`: Seed produk demo lengkap dengan gambar/video/tags.
- `window.ADS_SEED`: Seed iklan untuk beranda dan detail.

## js/storage.js

- Konstanta kunci localStorage.
- Util `parseJson`, `getCustomItems`, `saveCustomItems`.
- Generator ID.
- `normalizeProduct()` dan `normalizeAd()` untuk memastikan struktur konsisten.
- `getProducts()`: gabung seed + custom.
- `saveProduct()`, `deleteProduct()` untuk produk kustom.
- `getAds()`, `saveAd()`, `deleteAd()` untuk iklan kustom.

## js/utils.js

- `formatCurrencyIDR()`: Format rupiah.
- `categoryToClass()`: Map kategori ke kelas CSS.
- `createElement()`: Utility pembuatan DOM deklaratif.
- `getQueryParam()`: Ambil parameter query.
- `clamp()`: Batas angka.

## js/main.js (Beranda)

- State pencarian/filter/sort/pagination.
- `init()`: set tahun, muat produk, isi kategori, bind event, render grid, sidebar list, dan iklan.
- `applyFilterSort()`: filter kata kunci, kategori, dan sorting (newest/price/rating/popular).
- `renderGrid()`: buat kartu produk.
- `renderPagination()`: tombol « ... » dengan window 5 halaman.
- `renderSideLists()`: isi Produk Baru, Rekomendasi, Populer.
- `renderAds()`: tampilkan satu banner iklan `homepage_footer` jika aktif.

## js/detail.js (Detail)

- Ambil `id` dari query, cari produk.
- `renderInfo()`: isi judul, badge, harga, rating, deskripsi, spesifikasi, tag, tombol beli.
- Media carousel: daftar `mediaItems`, tombol prev/next, thumbnail aktif.
- Related: produk 1 kategori sama, prioritas populer/rating.
- Iklan `detail_related` (opsional bila ada dan aktif).

## js/dashboard.js (CMS)

- Toggle collapse sidebar (kelas `sidebar-collapsed` pada `<body>`).
- Navigasi menu: scroll ke section dan set active.
- Isi kategori pada form produk.
- Submit produk/iklan: simpan ke localStorage via `CMS`.
- Statistik: total produk, total iklan, jumlah kategori.
- Manage list: tampilkan item, tombol lihat, hapus (khusus item kustom).

Catatan: File ini adalah peta penjelasan baris per baris/ blok utama. Untuk memahami detil mikro (tiap atribut), buka berdampingan dan ikuti urutan di atas.