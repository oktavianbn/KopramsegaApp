# SIMAKO — Sistem Manajemen Administrasi Kopramsega

![Status](https://img.shields.io/badge/status-development-yellow)
![Tech Laravel](https://img.shields.io/badge/Laravel-Backend-red)
![Tech React](https://img.shields.io/badge/React-Frontend-blue)
![License](https://img.shields.io/badge/license-pending-lightgrey)

---

**SIMAKO** *(**Si**stem **M**anajemen **A**dministrasi **Ko**pramsega)* adalah aplikasi web internal yang dirancang untuk **mendigitalisasi seluruh proses administrasi organisasi Kopramsega**, menggantikan sistem manual agar lebih cepat, akurat, terstruktur serta transparan. Aplikasi ini mencakup berbagai modul penting, mulai dari **pendataan keuangan**, **manajemen inventaris**, **arsip dokumen**, **penjualan**, **perencanaan**, **media informasi**, hingga **pengelolaan pengguna**.

Dengan arsitektur modern berbasis **Laravel** sebagai backend, SIMAKO mampu menangani autentikasi, manajemen data, dan logika bisnis secara aman dan terpusat. Sementara itu, **React** digunakan sebagai antarmuka pengguna (frontend) untuk memberikan pengalaman interaktif, responsif, dan mudah digunakan bagi pengurus organisasi.

Setiap modul dirancang untuk **meningkatkan efisiensi kerja pengurus**, mengurangi kesalahan administrasi manual, dan memberikan **visualisasi data yang jelas** agar pengambilan keputusan lebih cepat dan tepat.

---

## 🚀 Status Proyek

- Saat ini proyek berada dalam tahap **pengembangan aktif** dengan beberapa modul utama sudah mulai diimplementasikan.
- Fitur-fitur tambahan dan penyempurnaan akan terus dilakukan berdasarkan kebutuhan organisasi.

---

## 🎯 Tujuan Utama

- Menyajikan data penting organisasi dalam bentuk visual agar pengurus dapat mengambil keputusan lebih cepat dan tepat.
- Mempercepat serta menertibkan proses pendataan kehadiran untuk mengurangi potensi kesalahan pencatatan manual.
- Meningkatkan transparansi dan kerapian pencatatan keuangan sehingga laporan lebih mudah dibuat dan diaudit.
- Menjaga keamanan data melalui pembagian akses dan peran yang jelas pada setiap pengguna.
- Mengoptimalkan manajemen inventaris agar barang tidak mudah hilang dan seluruh pergerakan tercatat.
- Meningkatkan efisiensi penyimpanan dokumen sehingga mudah dicari tanpa risiko kerusakan fisik.
- Mendukung perencanaan kegiatan yang lebih terjadwal dan terdokumentasi dengan baik.
- Menyimpan dokumentasi kegiatan secara tersusun untuk kebutuhan evaluasi dan publikasi internal.
- Menjadikan transaksi usaha dana lebih efisien dan transparan dalam pencatatan serta pelaporan.
- Menyederhanakan pengelolaan konten informasi internal agar tetap konsisten dan terstruktur.
- Menyediakan pusat data anggota yang valid untuk mendukung seluruh proses administrasi dan transaksi pada unit organisasi.

---

## 🧩 Fitur yang Tersedia / Direncanakan

| Modul       | Fitur                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Dashboard   | Statistik dan ringkasan data                                                               |
| Presensi    | Kehadiran, Rekap                                                                           |
| Keuangan    | Manajemen dana dan transaksi                                                               |
| Pengguna    | Role, Manajemen akun user                                                                  |
| Inventory   | Barang, Stok, Peminjaman                                                                   |
| Arsip       | Surat, Dokumen                                                                             |
| Rencana     | Penjadwalan & rencana unit kerja                                                           |
| Dokumentasi | Media dokumentasi kegiatan                                                                 |
| Usaha Dana  | Sesi penjualan, Menu, Transaksi ![Status](https://img.shields.io/badge/development-yellow) |
| CMS         | Kategori, Tag, Posting ![Status](https://img.shields.io/badge/development-yellow)          |
| Master Data | Data Siswa, Data Sangga                                                                    |

---

## 🛠️ Teknologi

| Teknologi                                                                                                      | Fungsi dalam Proyek                                                                           |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Laravel 12** ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?logo=laravel&logoColor=white)            | Mengelola backend, autentikasi, middleware, manajemen user & data administrasi organisasi     |
| **MySQL 8.0.30** ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)                | Database utama untuk menyimpan data anggota, inventaris, transaksi dan seluruh entitas sistem |
| **React** ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)                       | Membangun antarmuka web modern yang interaktif dan cepat dengan konsep SPA                    |
| **TypeScript** ![TS](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)           | Menjamin kualitas dan keamanan kode front-end melalui tipe data yang ketat                    |
| **Inertia.js** ![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?logo=inertia&logoColor=white)      | Menjembatani React & Laravel untuk routing SPA tanpa perlu API REST kompleks                  |
| **Vite** ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)                           | Membuat proses development cepat (hot reload) dan bundling lebih efisien                      |
| **Tailwind CSS** ![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white) | Mempercepat pembuatan UI responsif berbasis utility-first styling                             |
| **Shadcn UI** ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white)        | Menyediakan komponen UI siap pakai berkualitas tinggi dan mudah dikustomisasi                 |
| **Lucide Icons** ![Lucide](https://img.shields.io/badge/Lucide-333?logo=lucide&logoColor=white)                | Menyediakan ikon vektor modern untuk navigasi dan representasi fitur                          |

---

## 🖼️ Screenshot UI

> Tampilan hanya contoh, tidak seluruh tampilan ditampilkan di sini.

| Tampilan                       | Gambar                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Login                          | ![Screenshot Dark Mode](Image/login.png)                                            |
| Sidebar                        | ![Screenshot Dark Mode](Image/sidebar.png)                                          |
| Dashboard                      | _(coming soon)_                                                                     |
| Penampilan data (Tabel & Card) | ![Screenshot Dark Mode](Image/tabel.png) ![Screenshot Dark Mode](Image/card.png)    |
| Form Pengisian Data            | ![Screenshot Dark Mode](Image/form.png)                                             |
| Show Data                      | ![Screenshot Dark Mode](Image/show.png)                                             |
| Modal                          | ![Screenshot Dark Mode](Image/modal1.png) ![Screenshot Dark Mode](Image/modal2.png) |
| Profil                         | ![Screenshot Dark Mode](Image/profil.png)                                           |

---

## 📦 Instalasi dan Menjalankan Aplikasi

> Install Laravel, Composer dan Node.js terlebih dahulu  
> Laravel: https://laravel.com/docs  
> Composer: https://getcomposer.org  
> Node.js: https://nodejs.org/en

```bash
# Clone repository
git clone https://github.com/oktavianbn/KopramsegaApp.git
cd KopramsegaApp

# Install backend dependencies
composer install

# Install frontend dependencies
npm install

# Copy ENV & generate key
cp .env.example .env
php artisan key:generate

# Migrasi database
php artisan migrate

# Jalankan server backend dan frontend
composer run dev

# Membuat akun di localhost/register
```

---

**Copyright © 2025 Simako Project Authors.** **All Rights Reserved.**
