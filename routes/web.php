<?php

use App\Http\Controllers\ArsipSuratController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RencanaController;
use App\Http\Controllers\DokumentasiController;
use App\Http\Controllers\BarangController;

Route::get('/', function () {
    return Inertia::render('Dashboard');

})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');

})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('arsip-surat', ArsipSuratController::class);
    Route::resource('keuangan', KeuanganController::class);
    Route::resource('user', UserController::class);
    Route::resource('rencana', RencanaController::class);
    Route::patch('rencana/{rencana}/status', [RencanaController::class, 'updateStatus'])->name('rencana.updateStatus');
    Route::resource('dokumentasi', DokumentasiController::class);
    Route::resource('barang', BarangController::class);
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__ . '/auth.php';
