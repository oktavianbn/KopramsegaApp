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

        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');
        $filter = $request->input('filter');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('catatan', 'like', "%$search%")
                    ->orWhere('jumlah', 'like', "%$search%");
            });
        }

        if ($filter) {
            if (in_array($filter, ['m', 'k'])) {
                $query->where('tipe', $filter);
            } elseif (in_array($filter, ['i', 'u', 'a'])) {
                // mapping 'i' -> 'k'
                $mapped = $filter === 'i' ? 'k' : $filter;
                $query->where('jenis_pemasukkan', $mapped);
            }
        }

        // 🔹 validasi kolom untuk urutkan
        $allowedSorts = ['jumlah', 'created_at'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $keuangan = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Keuangan/Index', [
            'keuangan' => $keuangan,
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
            ->with('success', 'Data Keuangan berhasil diupdate');
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
