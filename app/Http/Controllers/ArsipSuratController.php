<?php

namespace App\Http\Controllers;

use App\Models\ArsipSurat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArsipSuratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ArsipSurat::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('judul_surat', 'like', "%$search%")
                  ->orWhere('nomor_surat', 'like', "%$search%")
                  ->orWhere('pengirim', 'like', "%$search%")
                  ->orWhere('penerima', 'like', "%$search%")
                  ->orWhere('keterangan', 'like', "%$search%");
            });
        }
        if ($request->filled('jenis')) {
            $query->where('jenis', $request->input('jenis'));
        }

        $arsipSurat = $query->orderByDesc('tanggal_surat')->paginate(10)->withQueryString();

        return Inertia::render('ArsipSurat/Index', [
            'arsipSurat' => $arsipSurat,
            'filters' => $request->only(['search', 'jenis'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ArsipSurat/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ArsipSurat $arsipSurat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ArsipSurat $arsipSurat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ArsipSurat $arsipSurat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArsipSurat $arsipSurat)
    {
        $arsipSurat->delete();
        return redirect()->route('arsip-surat.index')->with('success', 'Surat berhasil dihapus');
    }
}
