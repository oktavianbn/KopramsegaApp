<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function Index()
    {
        return Inertia::render('Transaksi/Index');
    }
}
