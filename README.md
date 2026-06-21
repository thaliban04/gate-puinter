# GATE PUINTER: Smart LPR System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

GATE PUINTER adalah halaman pendarat (*landing page*) dan portal presentasi interaktif untuk proyek inovasi gerbang cerdas berbasis *License Plate Recognition* (LPR). Dibangun menggunakan *Vanilla JavaScript* dan HTML modular.

---

## Fitur Utama

### Antarmuka Pengguna
- **Floating Pill Navbar**: Navigasi responsif dengan efek bayangan berlapis.
- **Scroll Reveal**: Animasi *fade-in* yang diakselerasi oleh perangkat keras (`will-change: transform, opacity`).
- **Tema Terang / Gelap**: Pergantian tema dinamis berdasarkan preferensi sistem (`prefers-color-scheme`).
- **Mobile First**: Tata letak dan grid didesain agar tetap proporsional pada layar sentuh.

### Performa
- **Parallel Module Fetching**: Komponen situs (Hero, Solusi, SWOT, Persona, Data) dimuat secara paralel menggunakan `Promise.all`.
- **Native Lazy Loading**: Aset visual menggunakan `loading="lazy"` dikombinasikan dengan transisi saturasi.

### Keamanan
- **Content Security Policy (CSP)**: Aturan ketat pada eksekusi dokumen untuk memblokir eksploitasi *Cross-Site Scripting* (XSS).
- **DOMPurify**: Sanitasi ganda berbasis *runtime* untuk memastikan konten JSON bebas dari injeksi HTML.

---

## Struktur Direktori

```text
gate-puinter/
├── css/                  # Stylesheet
│   ├── animations.css    # Animasi scroll reveal
│   ├── base.css          # Variabel dan tipografi
│   ├── components.css    # Komponen tabel dan input
│   ├── layout.css        # Navbar dan tata letak dasar
│   └── sections.css      # Desain per-komponen parsial
├── data/                 # Basis data JSON
├── img/                  # Aset gambar statis
├── js/
│   ├── content-editor.js # Logika penanganan konten
│   ├── module-loader.js  # Sistem injeksi modul HTML
│   ├── nav.js            # Mekanisme navigasi dan tema
│   └── uploader.js       # Utilitas manajemen aset
├── partials/             # Modul kerangka HTML
└── index.html            # Berkas utama
```

---

## Cara Menjalankan

Sistem bergantung pada *Fetch API* yang harus dijalankan dalam lingkungan protokol `http://` atau `https://` (bukan direktori `file://`).

**1. Ekstensi VS Code Live Server:**
Buka `index.html`, lalu jalankan *Live Server*.

**2. Menggunakan Node.js:**
```bash
npx serve .
```

**3. Menggunakan Python:**
```bash
python3 -m http.server 8080
```

---

## Standar Pengembangan

1. Jangan menambahkan *library* eksternal tanpa alasan teknis. Dependensi yang ada (`DOMPurify`, `Lucide Icons`) diintegrasikan secara aman melalui CDN.
2. Patuhi arsitektur antarmuka yang ada. Gunakan fitur `flex` atau `grid` untuk adaptasi tata letak alih-alih memanipulasi *margin* secara statis.
3. Dilarang melonggarkan batas `Content-Security-Policy` di dalam berkas `index.html`.
