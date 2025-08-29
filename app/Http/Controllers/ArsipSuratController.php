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

        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'tanggal_surat');
        $allowedDirections = ['asc', 'desc'];
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');
        $filter = $request->input('filter');

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
        if ($filter) {
            if (in_array($filter, ['m', 'k'])) {
                $query->where('jenis', $filter);
            } elseif ($filter === 'with_file') {
                $query->whereNotNull('file_path')->where('file_path', '!=', '');
            } elseif ($filter === 'without_file') {
                $query->whereNull('file_path')->orWhere('file_path', '=', '');
            }
        }

        // 🔽 Sortir
        $allowedSorts = ['jumlah', 'tanggal_surat', 'judul_surat', 'pengirim', 'penerima'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'tanggal_surat';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'desc';
        }

        // 📑 Pagination (pakai dropdown perPage, default 10)
        $arsipSurat = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('ArsipSurat/Index', [
            'arsipSurat' => $arsipSurat,
            'filters' => [
                'search' => $search ?? '',
                'sort_by' => $sortBy ?? 'created_at',
                'sort_direction' => $sortDirection ?? 'desc',
                'perPage' => $perPage ?? 10,
                'filter' => $filter ?? null,
            ]
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
        return Inertia::render('ArsipSurat/Edit', [
            'arsipSurat' => $arsipSurat
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id)
    {
        $arsip = ArsipSurat::findOrFail($id);

        $validated = $request->validate([
            'judul_surat' => 'required|string|max:255',
            'nomor_surat' => 'required|string|max:255|unique:arsip_surats,nomor_surat,' . $arsip->id,
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

        $arsip->update($validated);

        return redirect()->route('arsip-surat.index')
            ->with('success', 'Data arsip surat berhasil diupdate');
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
