# Sistem Rekap Kehadiran

## 📊 Overview

Sistem rekapitulasi kehadiran yang komprehensif untuk monitoring dan analisis kehadiran siswa dengan berbagai tampilan yang informatif.

## 🎯 Fitur Utama

### 1. Dashboard Rekap (`/kehadiran/rekap/dashboard`)

-   **Summary Cards**: Total pertemuan, total siswa, persentase kehadiran, pertemuan terakhir
-   **Distribusi Status**: Visualisasi hadir, izin, dan alfa dalam bentuk statistik
-   **Trend Chart**: Grafik trend kehadiran 6 bulan terakhir
-   **Rekap Per Sangga**: Ranking sangga dengan performa kehadiran
-   **Quick Links**: Akses cepat ke rekap siswa, sangga, dan pertemuan

### 2. Rekap Per Siswa (`/kehadiran/rekap/siswa`)

-   **Filter Lengkap**: Bulan, tahun, sangga, kelas, dan pencarian nama
-   **Tabel Komprehensif**: Nama, kelas, sangga, statistik kehadiran, persentase
-   **Status Visual**: Color-coded status (Sangat Baik, Baik, Cukup, Kurang)
-   **Export**: Tombol export ke Excel
-   **Detail Siswa**: Klik untuk melihat detail per siswa

### 3. Detail Siswa (`/kehadiran/rekap/siswa/{id}`)

-   **Profil Siswa**: Info lengkap siswa dengan badge performa
-   **Stats Cards**: Persentase, hadir, izin, alfa
-   **Trend 6 Bulan**: Visualisasi performa 6 bulan terakhir
-   **Ringkasan Pie**: Distribusi status kehadiran
-   **Riwayat Lengkap**: Tabel detail kehadiran per tanggal dengan status

### 4. Rekap Per Sangga (`/kehadiran/rekap/sangga`)

-   **Top 3 Podium**: Visualisasi 3 sangga terbaik dengan medali
-   **Ranking Lengkap**: Tabel ranking semua sangga
-   **Visual Menarik**: Logo sangga, warna ranking, badge status
-   **Statistik Detail**: Total anggota, hadir, izin, alfa, persentase

### 5. Detail Sangga (`/kehadiran/rekap/sangga/{id}`)

-   **Profil Sangga**: Header dengan logo dan info sangga
-   **Overall Stats**: Ringkasan kehadiran keseluruhan
-   **Member List**: Daftar semua anggota dengan statistik individual
-   **Per Member Performance**: Ranking anggota dalam sangga

### 6. Rekap Per Pertemuan (`/kehadiran/rekap/pertemuan`)

-   **Summary Cards**: Total pertemuan, rata-rata kehadiran, total hadir/tidak hadir
-   **List Pertemuan**: Semua pertemuan di bulan terpilih
-   **Status Lengkap**: Indicator data lengkap/belum lengkap
-   **Quick Access**: Link ke detail pertemuan

### 7. Detail Pertemuan (`/kehadiran/rekap/pertemuan/{tanggal}`)

-   **Date Info**: Info tanggal dan hari
-   **Overall Stats**: Statistik keseluruhan pertemuan
-   **Per Sangga Breakdown**: Detail kehadiran per sangga
-   **Member Detail**: List semua siswa dengan status per sangga
-   **Edit Button**: Akses cepat ke form edit kehadiran

## 🎨 Desain UI/UX

### Color Coding

-   🟢 **Hijau (Sangat Baik)**: ≥ 90%
-   🟡 **Kuning (Baik)**: 75-89%
-   🟠 **Orange (Cukup)**: 60-74%
-   🔴 **Merah (Kurang)**: < 60%

### Status Kehadiran

-   🟢 **Hadir**: bg-green-50
-   🟡 **Izin**: bg-yellow-50
-   🔴 **Alfa**: bg-red-50
-   ⚪ **Belum Isi**: bg-white

### Komponen UI Reusable

-   `StatsCard`: Card statistik dengan icon
-   `FilterBar`: Filter bulan/tahun dengan extra filters
-   `PageHeader`: Header halaman konsisten
-   `StatusBadge`: Badge status dengan warna

## 📁 Struktur File

```
app/Http/Controllers/
└── RekapKehadiranController.php (Controller utama rekap)

resources/js/Pages/Kehadiran/Rekap/
├── Dashboard.tsx (Dashboard utama)
├── Siswa/
│   ├── Index.tsx (List siswa)
│   └── Detail.tsx (Detail siswa)
├── Sangga/
│   ├── Index.tsx (Ranking sangga)
│   └── Detail.tsx (Detail sangga)
└── Pertemuan/
    ├── Index.tsx (List pertemuan)
    └── Detail.tsx (Detail pertemuan)

resources/js/Components/ui/
├── stats-card.tsx
├── filter-bar.tsx
└── page-header.tsx

app/Models/
├── Siswa.php (relasi kehadiran)
├── Sangga.php (relasi siswa)
└── Kehadiran.php
```

## 🔗 Route Structure

```php
// Dashboard
GET /kehadiran/rekap/dashboard

// Per Siswa
GET /kehadiran/rekap/siswa
GET /kehadiran/rekap/siswa/{id}

// Per Sangga
GET /kehadiran/rekap/sangga
GET /kehadiran/rekap/sangga/{id}

// Per Pertemuan
GET /kehadiran/rekap/pertemuan
GET /kehadiran/rekap/pertemuan/{tanggal}
```

## 💡 Best Practices

### UX yang Diterapkan

1. **Breadcrumb Navigation**: Setiap halaman punya breadcrumb jelas
2. **Back Button**: Semua detail page ada tombol kembali
3. **Loading State**: Transisi smooth dengan preserveState
4. **Responsive**: Mobile-first design dengan breakpoints
5. **Visual Hierarchy**: Info penting di atas, detail di bawah
6. **Color Consistency**: Warna konsisten across pages

### Performance

1. **Eager Loading**: Relasi dimuat dengan efficient queries
2. **Pagination**: Ready untuk implementasi di masa depan
3. **Index Database**: Query menggunakan WHERE clause terindeks
4. **Caching Ready**: Structure siap untuk caching layer

### Data Integrity

1. **Validation**: Filter date range dalam controller
2. **NULL Handling**: Semua query handle missing data
3. **Permission Ready**: Middleware auth sudah terpasang

## 🚀 Cara Akses

1. **Via Sidebar**: Menu "Presensi" > "Rekap"
2. **Direct URL**: `/kehadiran/rekap/dashboard`
3. **Via Dashboard**: Quick links card di dashboard

## 📊 Kalkulasi Persentase

```
Persentase Kehadiran = (Total Hadir / Total Pertemuan) × 100

Status Siswa:
- Excellent: ≥ 90%
- Good: 75-89%
- Fair: 60-74%
- Poor: < 60%
```

## 🔄 Workflow User

1. **Mulai dari Dashboard** → Lihat overview
2. **Filter Periode** → Pilih bulan/tahun
3. **Drill Down**:
    - Klik sangga → Detail sangga → Detail siswa
    - Klik "Rekap Per Siswa" → Pilih siswa → Detail
    - Klik "Rekap Per Pertemuan" → Pilih tanggal → Detail
4. **Export Data** → Download Excel (ready to implement)

## 🎯 Future Enhancements

-   [ ] Export to Excel/PDF
-   [ ] Email notification untuk kehadiran < 75%
-   [ ] Grafik interaktif (Chart.js/Recharts)
-   [ ] Comparison mode (compare 2 periods)
-   [ ] Print preview mode
-   [ ] QR Code report generation
-   [ ] Advanced filters (jurusan, jenis kelamin)
-   [ ] API endpoints untuk mobile app

## 📝 Notes

-   Sistem hanya menghitung **Jumat** sebagai hari pertemuan
-   Data real-time berdasarkan input dari form kehadiran
-   Semua data terintegrasi dengan sistem input kehadiran existing
-   UI konsisten dengan design system yang ada

## 👨‍💻 Developer Notes

-   TypeScript types sudah lengkap untuk semua props
-   Reusable components di `/Components/ui/`
-   Color utilities pakai Tailwind classes
-   Inertia.js untuk SPA-like navigation
-   Laravel query optimization dengan selectRaw
