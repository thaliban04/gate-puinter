# 🚀 GATE PUINTER: Smart LPR System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)
![Architecture](https://img.shields.io/badge/architecture-Vanilla%20JS%20%2B%20Modular%20HTML-orange.svg)

**GATE PUINTER** adalah sistem pendarat (*landing page*) dan portal manajemen presentasi interaktif untuk proyek inovasi gerbang cerdas berbasis *License Plate Recognition* (LPR). Proyek ini dibangun dengan filosofi **"Zero-Dependency Runtime"**, menghadirkan antarmuka pengguna premium, performa secepat kilat, dan keamanan tingkat produksi tanpa bergantung pada *framework* kelas berat seperti React atau Vue.

---

## ✨ Fitur Unggulan

### 🎨 Antarmuka Premium (*Aesthetics & UI*)
- **Floating Pill Navbar**: Navigasi cerdas yang melayang dengan *layered depth shadow* dan adaptif secara responsif.
- **Micro-Animations & Scroll Reveal**: Akselerasi GPU perangkat keras (`will-change: transform, opacity`) untuk memastikan animasi *fade-in* sangat mulus pada layar *smartphone* menengah ke bawah.
- **Light / Dark Mode**: Pergantian tema dinamis yang secara cerdas mendeteksi preferensi sistem pengguna (*prefers-color-scheme*).
- **Mobile First & Optical Alignment**: Setiap radius konsentris dan tatanan *grid* didesain agar tidak merusak struktur proporsional layar sentuh (mendukung horizontal geser pada tabel panjang).

### ⚡ Performa Kinerja Tingkat Lanjut
- **Parallel Module Fetching**: Komponen-komponen *website* (Hero, Latar Belakang, Solusi, SWOT, Persona, Data) dimuat secara paralel menggunakan `Promise.all` demi pencapaian *First Contentful Paint* (FCP) di bawah 1 detik.
- **Native Lazy Loading**: Seluruh aset visual selain *Hero Section* dikunci dengan `loading="lazy"` dikombinasikan dengan transisi saturasi (*opacity 0 -> 1*) guna menghemat pengeluaran *bandwidth* secara masif.

### 🔐 "Tap 10x" Secret CMS (Content Management System)
Sistem ini dilengkapi dengan mekanisme manajemen konten dinamis yang tersembunyi tanpa memerlukan instalasi *database* SQL terpisah (sepenuhnya berjalan menggunakan repositori GitHub).
- **Mekanisme Rahasia**: Klik / ketuk teks logo **GATE PUINTER** sebanyak 10 kali secara berturut-turut untuk membuka *Dashboard Editor* rahasia.
- **In-line Editing**: Kemampuan merubah teks paragraf, judul, dan matriks SWOT langsung di lokasi halaman tersebut berada.
- **Direct GitHub Uploader**: Kemampuan mengunggah aset gambar, memotong (*crop*), dan mengirim *commit* secara langsung ke direktori repositori `img/uploads` via GitHub API.

### 🛡 Keamanan Standar Industri (Hardening)
- **Strict Content Security Policy (CSP)**: Peraturan ketat pada eksekusi dokumen. Memblokir sumber skrip silang (*Cross-Site Scripting/XSS*) dari wilayah *domain* asing yang tidak terotorisasi.
- **DOMPurify Integration**: Sanitasi ganda berbasis *runtime* untuk memastikan setiap konten JSON yang diambil dari *GitHub Cloud* bebas dari injeksi *payload* HTML yang berbahaya.

---

## 🛠 Arsitektur & Direktori Proyek

Proyek ini tidak memerlukan proses `npm run build` yang rumit. Cukup layani berkas statis dari *server* lokal Anda.

```text
gate-puinter/
├── css/                  # Gaya arsitektur visual
│   ├── animations.css    # GPU-accelerated scroll reveals
│   ├── base.css          # Variabel warna (Light/Dark) & Tipografi HSL
│   ├── components.css    # Modal Editor rahasia, tabel, input
│   ├── layout.css        # Floating Navbar & struktur dasar
│   └── sections.css      # Desain per-komponen parsial
├── data/                 # Basis data JSON (Sebagai Headless CMS)
├── img/                  # Aset gambar lokal & direktori hasil unggahan
├── js/
│   ├── content-editor.js # Logika Secret CMS (Tap 10x, DOMPurify)
│   ├── module-loader.js  # Sistem injeksi HTML Paralel (Modular)
│   ├── nav.js            # Mekanisme navigasi, Scroll Spy & Tema
│   └── uploader.js       # Logika kompresi & Crop unggahan ke GitHub API
├── partials/             # Modul-modul kerangka HTML yang akan dirakit
└── index.html            # Kerangka induk proyek
```

---

## 🚀 Cara Menjalankan (Development)

Sistem bergantung pada *Fetch API* yang harus dijalankan dalam lingkungan protokol `http://` atau `https://`, bukan direktori berkas `file://`.

**1. Menggunakan ekstensi VS Code Live Server:**
- Buka `index.html`
- Tekan `Alt + L, Alt + O` (Start Live Server)

**2. Menggunakan Node.js:**
```bash
npx serve .
```

**3. Menggunakan Python:**
```bash
python3 -m http.server 8080
```

---

## 🔒 Konfigurasi Integrasi GitHub CMS

Agar *Secret Editor CMS* dapat menyimpan gambar maupun modifikasi teks ke repositori, pengguna (*Author*) wajib menyiapkan konfigurasi token.

1. Buka halaman *landing page*.
2. Klik nama merek **GATE PUINTER** 10 kali hingga ikon pensil melayang (*Floating Toolbar*) muncul di pojok kanan atas.
3. Klik tombol pengaturan (*gear*) pada panel Editor.
4. Masukkan kredensial konfigurasi repositori:
   - **Repository Owner**: `thaliban04`
   - **Repository Name**: `gate-puinter`
   - **GitHub Personal Access Token (PAT)**: *(Penting: Token harus berizin baca/tulis `repo` atau `contents`)*.
5. Simpan Konfigurasi. CMS kini sudah tersambung langsung dengan *backend* repositori statis!

---

## 👨‍💻 Kolaborasi & Standar Kode

Jika Anda ingin berkontribusi dalam pengembangan lebih lanjut, pastikan mematuhi panduan teknis yang telah dibakukan:
1. Jangan menyertakan paket *library* eksternal tambahan. Seluruh dependensi pihak ketiga (`DOMPurify`, `Cropper.js`, `Lucide Icons`) diintegrasikan via CDN yang diotorisasi secara aman.
2. Setiap kali merombak gaya CSS, pastikan merujuk kepada arsitektur *Interface Kit* (menghindari manipulasi margin statis dan lebih mempercayakan adaptasi kepadatan pada fitur `flex` atau `grid`).
3. Dilarang merusak atau melonggarkan batas `Content-Security-Policy` di berkas `index.html`. Jika Anda mengalami *error merah* di inspektor logal (seperti ekstensi Livereload), itu adalah bukti bahwa pagar CSP berfungsi sangat efektif melarang masuknya skrip lokal eksternal.

---
*Dibangun dengan dedikasi pada detail struktural dan obsesi penuh pada performa.* 🚀
