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
            $query->where('keterangan', 'like', '%' . $request->search . '%');
        }

        // Filter berdasarkan jenis
        if ($request->filled('jenis_pemasukkan')) {
            $query->where('jenis_pemasukkan', $request->jenis);
        }

        // Filter berdasarkan kategori
        if ($request->filled('kategori')) {
            $query->where('kategori', 'like', '%' . $request->kategori . '%');
        }

        $keuangan = $query->orderBy('tanggal', 'desc')->paginate(10);

        return Inertia::render('Keuangan/Index', [
            'keuangan' => $keuangan,
            'filters' => $request->only(['search', 'jenis', 'kategori'])
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
    $validated = $request->validate([
        'jumlah'   => 'required|numeric',
        'jenis'    => 'required|in:m,k',        // m=masuk, k=keluar
        'tipe'     => 'nullable|in:k,u,a',      // hanya wajib kalau jenis = m
        'catatan'  => 'required|string|max:255'
    ]);

    // mapping ke database
    $data = [
        'jumlah' => $validated['jumlah'],
        'tipe' => $validated['jenis'], // simpan m/k ke kolom `tipe`
        'jenis_pemasukkan' => $validated['tipe'] ?? null, // simpan k/u/a kalau ada
        'catatan' => $validated['catatan'],
    ];

    Keuangan::create($data);

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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Keuangan $keuangan)
    {
        //
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
