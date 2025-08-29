<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Barang::with('spesifikasi');

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                    ->orWhere('deskripsi', 'like', '%' . $request->search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // Validate sort fields
        $allowedSortFields = ['nama', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $barangs = $query->paginate(10);

        return Inertia::render('Barang/Index', [
            'barangs' => $barangs,
            'filters' => $request->only(['search', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Barang/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB max
            'boleh_dipinjam' => 'boolean',
            'spesifikasi' => 'nullable|array',
            'spesifikasi.*.key' => 'required|string|max:255',
            'spesifikasi.*.value' => 'required|string|max:255',
            'spesifikasi.*.description' => 'nullable|string',
        ]);

        $data = $request->only(['nama', 'deskripsi', 'boleh_dipinjam']);

        // Handle file upload
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('barang', $filename, 'public');
            $data['foto'] = $path;
        }

        $barang = Barang::create($data);

        // Handle spesifikasi
        if ($request->has('spesifikasi') && is_array($request->spesifikasi)) {
            foreach ($request->spesifikasi as $spec) {
                if (!empty($spec['key']) && !empty($spec['value'])) {
                    $barang->spesifikasi()->create([
                        'key' => $spec['key'],
                        'value' => $spec['value'],
                        'description' => $spec['description'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('barang.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barang $barang)
    {
        $barang->load('spesifikasi');
        return Inertia::render('Barang/Edit', [
            'barang' => $barang
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB max
            'boleh_dipinjam' => 'boolean',
            'spesifikasi' => 'nullable|array',
            'spesifikasi.*.key' => 'required|string|max:255',
            'spesifikasi.*.value' => 'required|string|max:255',
            'spesifikasi.*.description' => 'nullable|string',
        ]);

        $data = $request->only(['nama', 'deskripsi', 'boleh_dipinjam']);

        // Handle file upload
        if ($request->hasFile('foto')) {
            // Delete old photo if exists
            if ($barang->foto) {
                $oldPhotoPath = storage_path('app/public/' . $barang->foto);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }

            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('barang', $filename, 'public');
            $data['foto'] = $path;
        } elseif ($request->foto === 'DELETE') {
            // Handle photo deletion
            if ($barang->foto) {
                $oldPhotoPath = storage_path('app/public/' . $barang->foto);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }
            $data['foto'] = null;
        }

        $barang->update($data);

        // Handle spesifikasi update
        if ($request->has('spesifikasi')) {
            // Delete existing spesifikasi
            $barang->spesifikasi()->delete();

            // Create new spesifikasi
            if (is_array($request->spesifikasi)) {
                foreach ($request->spesifikasi as $spec) {
                    if (!empty($spec['key']) && !empty($spec['value'])) {
                        $barang->spesifikasi()->create([
                            'key' => $spec['key'],
                            'value' => $spec['value'],
                            'description' => $spec['description'] ?? null,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('barang.index')->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang)
    {
        // Delete photo file if exists
        if ($barang->foto) {
            $photoPath = storage_path('app/public/' . $barang->foto);
            if (file_exists($photoPath)) {
                unlink($photoPath);
            }
        }

        $barang->delete();

        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus.');
    }
}
