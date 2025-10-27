<?php

use App\Http\Controllers\ArsipSuratController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StokController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RencanaController;
use App\Http\Controllers\DokumentasiController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DokumenController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\SesiController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SanggaController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\KehadiranController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('arsip-surat', ArsipSuratController::class);
    Route::resource('dokumen', DokumenController::class);
    Route::resource('keuangan', KeuanganController::class);
    Route::resource('user', UserController::class);
    Route::resource('role', RoleController::class);
    Route::resource('rencana', RencanaController::class);
    Route::patch('rencana/{rencana}/status', [RencanaController::class, 'updateStatus'])->name('rencana.updateStatus');
    Route::resource('dokumentasi', DokumentasiController::class);
    Route::resource('barang', BarangController::class);
    Route::resource('stok', StokController::class);
    // endpoint to fetch transaksi for a specific barang (optionally with spesifikasi_id)
    Route::get('stok/{barang}/transactions', [StokController::class, 'transactions'])->name('stok.transactions');
    Route::resource('peminjaman', PeminjamanController::class);
    Route::patch('peminjaman/{peminjaman}/status', [PeminjamanController::class, 'updateStatus'])->name('peminjaman.updateStatus');
    Route::resource('menu', MenuController::class);
    Route::resource('sesi', SesiController::class);
    Route::patch('sesi/{sesi}/status', [SesiController::class, 'updateStatusSesi'])->name('sesi.updateStatusSesi');
    Route::resource('transaksi', TransaksiController::class);
    Route::resource('pelanggan', PelangganController::class);

    // Pelanggan web routes (read, change status, delete)
    Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan.index');
    Route::patch('/pelanggan/{pelanggan}/status', [PelangganController::class, 'updateStatus'])->name('pelanggan.updateStatus');
    Route::delete('/pelanggan/{pelanggan}', [PelangganController::class, 'destroy'])->name('pelanggan.destroy');


    // sangga
    Route::resource('sangga', SanggaController::class);

    // Kehadiran
    // web.php
    Route::get('/kehadiran', [KehadiranController::class, 'pilihHari'])->name('kehadiran.index');
    Route::get('/kehadiran/{hari}', [KehadiranController::class, 'pilihKelompok'])->name('kehadiran.day');
    Route::get('/kehadiran/{hari}/{kelompok}', [KehadiranController::class, 'formKehadiran'])->name('kehadiran.form');
    Route::post('/kehadiran/{hari}/{kelompok}', [KehadiranController::class, 'simpanKehadiran'])->name('kehadiran.store');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/test', function () {
    return 'User route';
});


require __DIR__ . '/auth.php';
