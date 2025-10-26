<?php

namespace App\Http\Controllers;

use App\Models\Sangga;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\RedirectResponse;

class SanggaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Retrieve all Sangga records
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'nama_sangga');
        $sortDirection = $request->input('sort_direction', 'asc');
        $search = $request->input('search', '');
        $allowedSorts = ['nama_sangga', 'id', 'created_at'];
        $allowedDirections = ['asc', 'desc'];
        $query = Sangga::query();

        // apply simple filter options
        if ($search) {
            $query->where('nama_sangga', 'like', "%{$search}%");
        }

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'nama_sangga';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'asc';
        }

        $filter = request()->input('filter');
        if ($filter === 'with_logo') {
            $query->whereNotNull('logo_path');
        } elseif ($filter === 'without_logo') {
            $query->whereNull('logo_path');
        }

        // apply sorting
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'nama_sangga';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'asc';
        }

        $sanggas = $query->orderBy($sortBy, $sortDirection)->paginate($perPage)->withQueryString();

        return Inertia::render('Sangga/Index', [
            'sangga' => $sanggas,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
            ]
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sangga/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_sangga' => ['required', 'string', 'max:100'],
            'logo_path' => ['nullable', 'image', 'max:2048'],
        ]);

        $path = null;
        if ($request->hasFile('logo_path')) {
            $path = $request->file('logo_path')->store('sangga', 'public');
        }

        Sangga::create([
            'nama_sangga' => $validated['nama_sangga'],
            'logo_path' => $path,
        ]);

        return redirect()->route('sangga.index')->with('success', 'Data sangga berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sangga $sangga)
    {
        return Inertia::render('Sangga/Show', [
            'sangga' => $sangga,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sangga $sangga)
    {
        return Inertia::render('Sangga/Edit', [
            'sangga' => $sangga,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sangga $sangga)
    {
        // handle update request (accept multipart/form-data or normal requests)
        $validated = $request->validate([
            'nama_sangga' => ['required', 'string', 'max:100'],
            'logo_path' => ['nullable', 'image', 'max:2048'],
        ]);

        // If a new file is uploaded, store it and delete the old one
        if ($request->hasFile('logo_path')) {
            // delete old file if exists
            if ($sangga->logo_path && Storage::disk('public')->exists($sangga->logo_path)) {
                Storage::disk('public')->delete($sangga->logo_path);
            }

            $path = $request->file('logo_path')->store('sangga', 'public');
            $sangga->logo_path = $path;
        }

        $sangga->nama_sangga = $validated['nama_sangga'];
        $sangga->save();

        return redirect()->route('sangga.index')->with('success', 'Data sangga berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sangga $sangga)
    {
        // delete logo file if exists
        if ($sangga->logo_path && Storage::disk('public')->exists($sangga->logo_path)) {
            Storage::disk('public')->delete($sangga->logo_path);
        }

        $sangga->delete();

        return redirect()->route('sangga.index')->with('success', 'Data sangga berhasil dihapus.');
    }
}
