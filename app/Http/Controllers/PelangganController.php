<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PelangganController extends Controller
{
    public function Index()
    {
        return Inertia::render('Pelanggan/Index');
    }
}
