<?php

namespace App\Http\Controllers;

use App\Models\Keuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class KeuanganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Keuangan::query();

        // Filter berdasarkan pencarian
        if ($request->filled('search')) {
            $query->where('catatan', 'like', '%' . $request->search . '%');
        }

        // Filter berdasarkan tipe
        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }

        // Filter berdasarkan jenis_pemasukkan
        if ($request->filled('jenis_pemasukkan')) {
            $query->where('jenis_pemasukkan', $request->jenis_pemasukkan);
        }

        $keuangan = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Keuangan/Index', [
            'keuangan' => $keuangan,
            'filters' => $request->only(['search', 'tipe', 'jenis', 'kategori'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Keuangan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // hilangkan semua titik di input jumlah
        $request->merge([
            'jumlah' => str_replace('.', '', $request->jumlah),
        ]);
        // dump($request);
        $validated = $request->validate([
            'jumlah'   => 'required|numeric',
            'tipe'    => 'required|in:m,k',
            'jenis_pemasukkan' => 'nullable|in:k,u,a',
            'catatan'  => 'nullable|string|max:255'
        ]);
        // dd($validated);
        Keuangan::create($validated);
        return redirect()->route('keuangan.index')
            ->with('success', 'Data keuangan berhasil disimpan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Keuangan $keuangan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Keuangan $keuangan)
    {
        // Ubah ke integer dulu biar .00 hilang
        $jumlah = (int) $keuangan->jumlah;

        // Format dengan ribuan pakai titik
        $keuangan->jumlah = number_format($jumlah, 0, ',', '.');
        return Inertia::render('Keuangan/Edit', [
            'keuangan' => $keuangan
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // hilangkan titik di input jumlah
        $request->merge([
            'jumlah' => str_replace('.', '', $request->jumlah),
        ]);

        $validated = $request->validate([
            'jumlah'   => 'required|numeric',
            'tipe'     => 'required|in:m,k',
            'jenis_pemasukkan' => 'nullable|in:k,u,a',
            'catatan'  => 'nullable|string|max:255',
        ]);

        $keuangan = Keuangan::findOrFail($id);
        $keuangan->update($validated);

        return redirect()->route('keuangan.index')
            ->with('success', 'Data keuangan berhasil diupdate');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Keuangan $keuangan)
    {
        $keuangan->delete();

        return redirect()->route('keuangan.index')
            ->with('success', 'Data keuangan berhasil dihapus');
    }
}
