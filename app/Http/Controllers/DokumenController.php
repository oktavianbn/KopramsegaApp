<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DokumenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Dokumen::query();

        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search', '');
        $filter = $request->input('filter', null);

        $allowedSorts = ['tanggal_dokumen', 'nama'];
        $allowedDirections = ['asc', 'desc'];

        // Search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                    ->orWhere('keterangan', 'like', "%$search%");
            });
        }

        // Filter
        if ($filter) {
            if (in_array($filter, ['m', 'k'])) {
                $query->where('jenis', $filter);
            } elseif ($filter === 'with_file') {
                $query->whereNotNull('file')->where('file', '!=', '');
            } elseif ($filter === 'without_file') {
                $query->whereNull('file')->orWhere('file', '=', '');
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
        $dokumen = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        // Return
        return Inertia::render('Dokumen/Index', [
            'dokumen' => $dokumen,
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
        return Inertia::render('Dokumen/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_dokumen' => 'required|date',
            'keterangan' => 'required|string',
            'file' => 'nullable|array',
            'file.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ]);

        $files = [];
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $uploadedFile) {
                // nama asli file
                $namaAsli = $uploadedFile->getClientOriginalName();

                // nama hasil simpan (terenkripsi oleh Laravel)
                $namaTersimpan = $uploadedFile->store('dokumen', 'public');

                // simpan dalam array JSON
                $files[] = [
                    'nama_asli' => $namaAsli,
                    'nama_tersimpan' => $namaTersimpan,
                ];
            }
        }

        // Simpan array JSON ke kolom file
        $validated['file'] = $files;

        Dokumen::create($validated);

        return redirect()->route('dokumen.index')->with('success', 'Data dokumen berhasil ditambahkan');
    }


    /**
     * Display the specified resource.
     */
    public function show(Dokumen $dokumen)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dokumen $dokumen)
    {
        return Inertia::render('Dokumen/Edit', [
            // dd($dokumen)
            'dokumen' => $dokumen
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dokumen $dokumen, $id)
    {
        $dokumen = Dokumen::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_dokumen' => 'required|date',
            'keterangan' => 'required|string',
            'file' => 'nullable|array',
            'file.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
        ]);

        $files = [];
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $uploadedFile) {
                // nama asli file
                $namaAsli = $uploadedFile->getClientOriginalName();

                // nama hasil simpan (terenkripsi oleh Laravel)
                $namaTersimpan = $uploadedFile->store('dokumen', 'public');

                // simpan dalam array JSON
                $files[] = [
                    'nama_asli' => $namaAsli,
                    'nama_tersimpan' => $namaTersimpan,
                ];
            }
        }

        // Simpan array JSON ke kolom file
        $validated['file'] = $files;

        return redirect()->route('dokumen.index')->with('success', 'Data dokumen berhasil perbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dokumen $dokumen)
    {
        $dokumen->delete();
        return redirect()->route('dokumen.index')->with('success', 'Surat berhasil dihapus');
    }
}
