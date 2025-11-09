<?php

use App\Http\Controllers\Api\ArsipSuratApiController;
use App\Http\Controllers\Api\TransaksiPembelianApiController;
use App\Http\Controllers\Api\SesiMenuApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('arsip', ArsipSuratApiController::class);

// Pelanggan API
// Route::post('/pelanggan', [App\Http\Controllers\PelangganApiController::class, 'store']);
// Route::put('/pelanggan/{pelanggan}', [App\Http\Controllers\PelangganApiController::class, 'update']);
// Route::delete('/pelanggan/{pelanggan}', [App\Http\Controllers\PelangganApiController::class, 'destroy']);

// Transaksi Pembelian API - POST only for creating transactions
Route::prefix('v1')->group(function () {
    Route::post('transaksi-pembelian', [TransaksiPembelianApiController::class, 'store']);

    // Sesi & Menu API - GET only for retrieving active sessions and menus
    // Route::get('sesi/active', [SesiMenuApiController::class, 'getActiveSessions']);
    // Route::get('sesi/{sesiId}/menus', [SesiMenuApiController::class, 'getMenusBySesi']);
    // Route::get('sesi-with-menus', [SesiMenuApiController::class, 'getActiveSessionsWithMenus']);
    // Route::get('menu/{menuId}', [SesiMenuApiController::class, 'getMenuById']);
});
