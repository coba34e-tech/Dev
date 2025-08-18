## AllDream — Panduan Pengembangan Lengkap

AllDream adalah web katalog produk afiliasi lintas marketplace (Shopee, Tokopedia, Lazada, TikTok Shop, dll) dengan dasbor afiliasi sederhana namun profesional.

### Struktur Proyek
- `index.html`: Beranda katalog.
- `login.html`: Halaman login (demo: `demo@alldream.id` / `demo123`).
- `dasbor.html`: Dasbor afiliasi dengan sidebar collapsible (butuh login).
- `assets/css/styles.css`: Gaya global.
- `assets/js/auth.js`: Autentikasi (mock, menggunakan sessionStorage/localStorage).
- `assets/js/app.js`: Logika katalog (pencarian, filter, sorting, sample data).
- `assets/js/dashboard.js`: Logika dasbor (metrik dummy, grafik, link afiliasi, pengaturan lokal).

### Menjalankan Secara Lokal
1) Python HTTP server (disarankan, paling sederhana):
```bash
python3 -m http.server 8000
```
Buka `http://localhost:8000/index.html`.

2) VS Code Live Server:
- Open Folder ke root proyek (yang berisi `index.html`).
- Klik kanan `index.html` → Open with Live Server.

Catatan: Pastikan server men-serve root folder proyek sehingga path relatif `assets/...` valid.

### Kredensial Demo
- Email: `demo@alldream.id`
- Password: `demo123`

### Alur Autentikasi (Mock)
- Jika ceklis “Ingat saya”, data user disimpan di `localStorage` (persisten). Jika tidak, di `sessionStorage` (hilang saat tab ditutup).
- `dasbor.html` memanggil `requireAuthOrRedirect()` untuk memastikan sesi ada; jika tidak ada, redirect ke `login.html`.
- `login.html` otomatis redirect ke `dasbor.html` bila sudah login.

### Menghubungkan ke Backend (JWT/OAuth)
Ganti mock auth dengan API nyata:
- Endpoint yang disarankan:
  - POST `/api/auth/login` → `{ accessToken, refreshToken, user }`
  - POST `/api/auth/refresh` → `{ accessToken }`
  - POST `/api/auth/logout` → 204
  - GET `/api/me` → `{ ...user }`
- Client-side:
  - Simpan `accessToken` di memori (variabel JS). Simpan `refreshToken` di cookie httpOnly (lebih aman) atau `localStorage` saat “Ingat saya”.
  - Buat wrapper `apiFetch()` yang menambahkan `Authorization: Bearer <accessToken>` dan auto-refresh saat 401.
  - Ubah `login()` dan `logout()` di `assets/js/auth.js` untuk memanggil API.

Contoh ringkas wrapper fetch:
```javascript
async function apiFetch(url, options = {}) {
  options.headers = Object.assign({}, options.headers, {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.__accessToken || ''}`,
  });
  let res = await fetch(url, options);
  if (res.status === 401) {
    const r = await fetch('/api/auth/refresh', { method: 'POST' });
    if (!r.ok) throw new Error('Unauthorized');
    const { accessToken } = await r.json();
    window.__accessToken = accessToken;
    options.headers.Authorization = `Bearer ${accessToken}`;
    res = await fetch(url, options);
  }
  return res;
}
```

### Menambah/Mengubah Produk
- Edit array `sampleProducts` di `assets/js/app.js`.
- Atau ganti dengan `fetch('/api/products')` lalu render grid dari respons.

### Kustomisasi Tampilan
- Ubah warna dan tema di `:root` pada `assets/css/styles.css` (mis. `--primary`).
- Komponen: kartu produk (`.card-product`), metrik (`.metric`), tabel (`.table`), dsb.

### Sidebar Collapsible
- Tombol ☰ toggle data attribute `data-sidebar="collapsed"` pada `<body>`.
- CSS mengatur grid dari `260px` menjadi `86px` saat collapsed.

### Testing Manual (Checklist)
- Login berhasil → diarahkan ke dasbor.
- Reload `dasbor.html` → tetap login (ceklis “Ingat saya” untuk persistensi).
- Logout dari sidebar → kembali ke `login.html`.
- Pencarian, filter, sorting di katalog berfungsi.
- “Salin Link Afiliasi” menyalin URL dengan parameter `ref=alldream`.
- Grafik tampil (Chart.js melalui CDN).

### Praktik Pengembangan (Git)
- Branch: `main` untuk stable, `dev` untuk pengembangan.
- Fitur baru: buat branch `feature/<nama-fitur>` → PR ke `dev` → QA → merge ke `main`.
- Commit message konvensi singkat: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`.

### Deploy
- Hosting statis (Netlify, Vercel, Cloudflare Pages, GitHub Pages): unggah seluruh isi folder ini.
- Pastikan base path adalah root (agar `assets/...` terlayani).

### Troubleshooting
- “Terpental ke login”: bersihkan `localStorage/sessionStorage` item `alldream_auth_user`, pastikan served dari root, hard refresh (Ctrl+F5).
- Aset 404 di Live Server: cek root folder yang diserve, atau gunakan `python3 -m http.server 8000` sebagai pembanding.
- Grafik tidak muncul: pastikan koneksi ke CDN Chart.js tidak diblok.

### Roadmap (Opsional)
- Integrasi API produk per marketplace, agregasi performa lintas platform.
- Auth nyata (JWT + refresh, role-based access).
- Ekspor CSV, filter tanggal, dan laporan lanjutan.
- Tema gelap (dark mode) dan i18n.
