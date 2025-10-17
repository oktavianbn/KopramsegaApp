<?php

use App\Http\Controllers\Api\ArsipSuratApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('arsip', ArsipSuratApiController::class);

// Pelanggan API
Route::post('/pelanggan', [App\Http\Controllers\PelangganApiController::class, 'store']);
Route::put('/pelanggan/{pelanggan}', [App\Http\Controllers\PelangganApiController::class, 'update']);
Route::delete('/pelanggan/{pelanggan}', [App\Http\Controllers\PelangganApiController::class, 'destroy']);

