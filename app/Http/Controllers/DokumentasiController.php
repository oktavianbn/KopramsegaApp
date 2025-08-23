<?php

namespace App\Http\Controllers;

use App\Models\Dokumentasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DokumentasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Dokumentasi::query();

        // Filter berdasarkan pencarian
        if ($request->filled('search')) {
            $query->where('judul', 'like', '%' . $request->search . '%')
                ->orWhere('kameramen', 'like', '%' . $request->search . '%')
                ->orWhere('keterangan', 'like', '%' . $request->search . '%');
        }

        $dokumentasis = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Dokumentasi/Index', [
            'dokumentasis' => $dokumentasis,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dokumentasi/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'links' => 'required|array|min:1',
            'links.*' => 'required|url',
            'kameramen' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:500'
        ]);

        Dokumentasi::create($validated);

        return redirect()->route('dokumentasi.index')
            ->with('success', 'Data dokumentasi berhasil disimpan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dokumentasi $dokumentasi)
    {
        return Inertia::render('Dokumentasi/Show', [
            'dokumentasi' => $dokumentasi
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dokumentasi $dokumentasi)
    {
        return Inertia::render('Dokumentasi/Edit', [
            'dokumentasi' => $dokumentasi
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dokumentasi $dokumentasi)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'links' => 'required|array|min:1',
            'links.*' => 'required|url',
            'kameramen' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:500'
        ]);

        $dokumentasi->update($validated);

        return redirect()->route('dokumentasi.index')
            ->with('success', 'Data dokumentasi berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dokumentasi $dokumentasi)
    {
        $dokumentasi->delete();

        return redirect()->route('dokumentasi.index')
            ->with('success', 'Data dokumentasi berhasil dihapus');
    }
}
