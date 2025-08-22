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

        // 🔍 Filter pencarian
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

        // 📂 Filter jenis surat
        if ($request->filled('jenis')) {
            $query->where('jenis', $request->input('jenis'));
        }

        // 🔽 Sortir
        $sortBy = $request->input('sortBy', 'tanggal_surat');
        $sortDir = $request->input('sortDir', 'desc');

        if (!in_array($sortBy, ['tanggal_surat', 'nomor_surat'])) {
            $sortBy = 'tanggal_surat';
        }
        if (!in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'desc';
        }

        // 📑 Pagination (pakai dropdown perPage, default 10)
        $perPage = $request->input('perPage', 10);
        $arsipSurat = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('ArsipSurat/Index', [
            'arsipSurat' => $arsipSurat,
            'filters' => $request->only(['search', 'jenis', 'perPage', 'sortBy', 'sortDir']),
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
        $validated = $request->validate([
            'judul_surat' => 'required|string|max:255',
            'nomor_surat' => 'required|string|max:255|unique:arsip_surats,nomor_surat',
            'jenis' => 'required|in:m,k',
            'pengirim' => 'nullable|string|max:255',
            'penerima' => 'nullable|string|max:255',
            'tanggal_surat' => 'required|date',
            'keterangan' => 'required|string',
            'file_path' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx',
        ]);

        if ($request->hasFile('file_path')) {
            $validated['file_path'] = $request->file('file_path')->store('arsip_surats', 'public');
        }

        ArsipSurat::create($validated);

        return redirect()->route('arsip-surat.index')->with('success', 'Data arsip surat berhasil ditambahkan');
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
