<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                $namaFile = $uploadedFile->getClientOriginalName();

                // simpan dengan nama asli (di folder 'dokumen' disk 'public')
                $file = $uploadedFile->storeAs('dokumen', $namaFile, 'public');

                // simpan dalam array JSON
                $files[] = $file;
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
    public function edit(Dokumen $dokumen, $id)
    {
        $dokumen = Dokumen::findOrFail($id);

        return Inertia::render('Dokumen/Edit', [
            'dokumen' => $dokumen,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dokumen $dokumen,$id)
    {
        $dokumen = Dokumen::findOrFail($id);
        // dd($request->all(), $dokumen);
        // dd($dokumen->file);
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_dokumen' => 'required|date',
            'keterangan' => 'required|string',
            'existing_files' => 'nullable|array', // file lama yang tetap dipakai
            'file' => 'nullable|array',           // file baru yang diupload
            'file.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:2048',
            'replace_keys' => 'nullable|array',   // index file lama yang diganti
        ]);

        // Ambil file lama dari DB (array JSON)
        $oldFiles = $dokumen->file ?? [];

        // Step 1: mulai dengan file lama yang dipertahankan
        $newFiles = $request->existing_files ?? [];

        // Step 2: proses file baru
        if ($request->hasFile('file')) {
            foreach ($request->file('file') as $index => $uploadedFile) {
                $replaceKey = $request->replace_keys[$index] ?? null;

                // kalau ada index pengganti → hapus file lama dari storage
                if ($replaceKey !== null && isset($oldFiles[$replaceKey])) {
                    if (Storage::disk('public')->exists($oldFiles[$replaceKey])) {
                        Storage::disk('public')->delete($oldFiles[$replaceKey]);
                    }
                }

                // simpan file baru
                $namaFile = $uploadedFile->getClientOriginalName();
                $filePath = $uploadedFile->storeAs('dokumen', $namaFile, 'public');

                // masukkan ke array
                if ($replaceKey !== null) {
                    // ganti posisi lama
                    $newFiles[$replaceKey] = $filePath;
                } else {
                    // tambahkan baru
                    $newFiles[] = $filePath;
                }
            }
        }

        // Step 3: rapikan index (0,1,2,...)
        $newFiles = array_values($newFiles);

        // Update DB
        $dokumen->update([
            'nama' => $validated['nama'],
            'tanggal_dokumen' => $validated['tanggal_dokumen'],
            'keterangan' => $validated['keterangan'],
            'file' => $newFiles,
        ]);

        return redirect()->route('dokumen.index')->with('success', 'Dokumen berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dokumen $dokumen, $id)
    {
        $dokumen = Dokumen::findOrFail($id);
        $dokumen->delete();
        return redirect()->route('dokumen.index')->with('success', 'Surat berhasil dihapus');
    }
}
