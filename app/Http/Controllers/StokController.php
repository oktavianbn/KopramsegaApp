<?php

namespace App\Http\Controllers;

use App\Models\Stok;
use App\Models\Barang;
use App\Models\Spesifikasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stoks = Stok::with(['barang', 'spesifikasi']);
        return Inertia::render('Stok/Index', [
            'stoks' => $stoks->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $barangs = Barang::orderBy('nama')->get();
        $spesifikasis = Spesifikasi::with('barang')->orderBy('key')->get();

        return Inertia::render('Stok/Create', [
            'barangs' => $barangs,
            'spesifikasis' => $spesifikasis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'spesifikasi_id' => 'nullable|exists:spesifikasis,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        // Cari stok yang sudah ada dengan barang dan spesifikasi yang sama
        $existingStok = Stok::where('barang_id', $request->barang_id)
            ->where('spesifikasi_id', $request->spesifikasi_id ?: null)
            ->first();

        if ($existingStok) {
            // Jika sudah ada, tambah jumlahnya
            $existingStok->update([
                'jumlah' => $existingStok->jumlah + $request->jumlah
            ]);

            return redirect()->route('stok.index')
                ->with('success', 'Stok berhasil ditambahkan ke data yang sudah ada.');
        } else {
            // Jika belum ada, buat data baru
            Stok::create([
                'barang_id' => $request->barang_id,
                'spesifikasi_id' => $request->spesifikasi_id ?: null,
                'jumlah' => $request->jumlah,
            ]);

            return redirect()->route('stok.index')
                ->with('success', 'Data stok berhasil ditambahkan.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Stok $stok)
    {
        $stok->load(['barang', 'spesifikasi']);

        return Inertia::render('Stok/Show', [
            'stok' => $stok,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stok $stok)
    {
        $barangs = Barang::orderBy('nama')->get();
        $spesifikasis = Spesifikasi::with('barang')->orderBy('key')->get();
        $stok->load(['barang', 'spesifikasi']);

        return Inertia::render('Stok/Edit', [
            'stok' => $stok,
            'barangs' => $barangs,
            'spesifikasis' => $spesifikasis,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stok $stok)
    {
        $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'spesifikasi_id' => 'nullable|exists:spesifikasis,id',
            'jumlah' => 'required|integer|min:0',
        ]);

        $stok->update([
            'barang_id' => $request->barang_id,
            'spesifikasi_id' => $request->spesifikasi_id ?: null,
            'jumlah' => $request->jumlah,
        ]);

        return redirect()->route('stok.index')
            ->with('success', 'Data stok berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stok $stok)
    {
        $stok->delete();

        return redirect()->route('stok.index')
            ->with('success', 'Data stok berhasil dihapus.');
    }
}