# Dasbor Afiliasi (Sidebar Interaktif)

Cara menjalankan:

1. Buka file `index.html` langsung di browser, atau
2. Jalankan server statis lokal lalu buka `http://localhost:8000`:

```bash
cd /workspace
python3 -m http.server 8000
```

Fitur:
- Sidebar dapat dilipat/diringkas dan tersimpan di localStorage
- Mode gelap/terang dengan penyimpanan preferensi
- Filter rentang tanggal dan saluran
- Kartu metrik (Pendapatan, Klik, Konversi, CVR, EPC)
- Grafik interaktif (Chart.js) untuk tren dan pendapatan per kampanye
- Tabel kampanye dengan pencarian
- Tombol salin tautan rujukan
