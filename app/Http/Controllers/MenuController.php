<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Sesi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    public function index()
    {
        // server-side filtering, sorting, search and pagination for sesi
        $perPage = request()->query('perPage', 8);
        $search = request()->query('search');
        $sortBy = request()->query('sort_by', 'tanggal_mulai');
        $sortDirection = request()->query('sort_direction', 'desc');
        $filter = request()->query('filter');

        $query = Sesi::with('menus');

        // search on sesi.nama or menus.nama
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhereHas('menus', function ($qm) use ($search) {
                      $qm->where('nama', 'like', "%{$search}%");
                  });
            });
        }

        // filter: open/closed or exact status
        if ($filter === 'open') {
            $query->where(function ($q) { $q->where('ditutup', false)->orWhereNull('ditutup'); });
        } elseif ($filter === 'closed') {
            $query->where('ditutup', true);
        } elseif (!empty($filter)) {
            $query->where('status', $filter);
        }

        // whitelist sort fields
        $allowedSorts = ['nama', 'tanggal_mulai'];
        if (!in_array($sortBy, $allowedSorts)) $sortBy = 'tanggal_mulai';
        $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

        $sesis = $query->orderBy($sortBy, $sortDirection)->paginate($perPage)->appends(request()->query());

        return Inertia::render('Menu/Index', [
            'sesis' => $sesis,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => (int) $perPage,
                'filter' => $filter,
            ],
        ]);
    }

    public function create()
    {
        // support optional sesi_id query param so Index can link to create?sesi_id=...
        $sesis = Sesi::orderBy('tanggal_mulai', 'desc')->get();
        $sesi_id = request()->query('sesi_id');
        return Inertia::render('Menu/Create', [
            'sesis' => $sesis,
            'sesi_id' => $sesi_id,
        ]);
    }

    public function edit(Menu $menu)
    {
        $sesis = Sesi::orderBy('tanggal_mulai', 'desc')->get();
        return Inertia::render('Menu/Edit', [
            'menu' => $menu,
            'sesis' => $sesis,
        ]);
    }

    public function store(Request $request)
    {
        // Support bulk creation via items[] (from Create page) or single menu payload
        if ($request->has('items')) {
            $validated = $request->validate([
                'sesi_id' => 'required|exists:sesi_penjualan,id',
                'items' => 'required|array|min:1',
                'items.*.nama' => 'required|string|max:255',
                'items.*.harga' => 'nullable|numeric',
                // 'items.*.stok' => 'nullable|integer',
                'items.*.foto' => 'nullable|file|image|max:2048',
            ]);

            $created = 0;
            foreach ($validated['items'] as $idx => $it) {
                $data = [
                    'sesi_id' => $validated['sesi_id'],
                    'nama' => $it['nama'],
                    'harga' => $it['harga'] ?? null,
                    // 'stok' => $it['stok'] ?? 0,
                    'foto' => null,
                ];

                // handle uploaded file from request->file("items.$idx.foto")
                if ($request->hasFile("items.$idx.foto")) {
                    $file = $request->file("items.$idx.foto");
                    $path = $file->store('menu', 'public');
                    $data['foto'] = $path;
                }

                Menu::create($data);
                $created++;
            }

            return redirect()->route('menu.index')->with('success', "{$created} menu berhasil ditambahkan.");
        }

        // legacy single-menu creation
        $validated = $request->validate([
            'sesi_id' => 'required|exists:sesi_penjualan,id',
            'nama' => 'required|string|max:255',
            'harga' => 'nullable|numeric',
            // 'stok' => 'nullable|integer',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('menu', 'public');
            $validated['foto'] = $path;
        }

        Menu::create($validated);

        return redirect()->route('menu.index')->with('success', 'Menu berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        // Handle update request (expect form-data with optional _method override)
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'harga' => 'nullable|numeric',
            // 'stok' => 'nullable|integer',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            // delete old foto if exists
            if ($menu->foto) Storage::disk('public')->delete($menu->foto);
            $path = $request->file('foto')->store('menu', 'public');
            $validated['foto'] = $path;
        }

    $menu->update($validated);

    return redirect()->route('menu.index')->with('success', 'Menu berhasil diperbarui.');
    }

    public function destroy(Request $request, Menu $menu)
    {
        if ($menu->foto) Storage::disk('public')->delete($menu->foto);
    $menu->delete();
    return redirect()->route('menu.index')->with('success', 'Menu berhasil dihapus.');
    }
}

