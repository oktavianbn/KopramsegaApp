<?php

use App\Http\Controllers\Api\ArsipSuratApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('arsip', ArsipSuratApiController::class);

