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
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search', '');
        $filter = $request->input('filter', null);

        $allowedSorts = ['jumlah', 'tanggal_surat', 'judul_surat', 'pengirim', 'penerima'];
        $allowedDirections = ['asc', 'desc'];

        // Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul_surat', 'like', "%$search%")
                    ->orWhere('nomor_surat', 'like', "%$search%")
                    ->orWhere('pengirim', 'like', "%$search%")
                    ->orWhere('penerima', 'like', "%$search%")
                    ->orWhere('keterangan', 'like', "%$search%");
            });
        }

        // Filter
        if ($filter) {
            if (in_array($filter, ['m', 'k'])) {
                $query->where('jenis', $filter);
            } elseif ($filter === 'with_file') {
                $query->whereNotNull('file_path')->where('file_path', '!=', '');
            } elseif ($filter === 'without_file') {
                $query->whereNull('file_path')->orWhere('file_path', '=', '');
            }
        }

        // Short
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'desc';
        }

        // Pagination
        $arsipSurat = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        // Return
        return Inertia::render('ArsipSurat/Index', [
            'arsipSurat' => $arsipSurat,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
                'filter' => $filter,
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
            // Ambil file yang diupload
            $uploadedFile = $request->file('file_path');

            // Ambil nama asli file
            $namaFile = $uploadedFile->getClientOriginalName();

            // Simpan dengan nama asli ke folder 'arsip_surats' (public)
            $validated['file_path'] = $uploadedFile->storeAs('arsip_surats', $namaFile, 'public');
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
        // dd($arsipSurat);
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
        // hapus file lama kalau ada
        if ($arsip->file_path && Storage::disk('public')->exists($arsip->file_path)) {
            Storage::disk('public')->delete($arsip->file_path);
        }

        $uploadedFile = $request->file('file_path');
        $namaFile = $uploadedFile->getClientOriginalName();

        $validated['file_path'] = $uploadedFile->storeAs('arsip_surats', $namaFile, 'public');
    } else {
        unset($validated['file_path']); // ⬅ penting! agar file lama tidak dihapus
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
        dd($arsipSurat);
        $arsipSurat->delete();
        return redirect()->route('arsip-surat.index')->with('success', 'Surat berhasil dihapus');
    }
}
