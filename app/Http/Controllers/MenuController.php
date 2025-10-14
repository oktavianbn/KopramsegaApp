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
        // load all sesi with their menus (no pagination per requirement)
        $sesis = Sesi::with('menus')->orderBy('tanggal_mulai', 'desc')->get();

        return Inertia::render('Menu/Index', [
            'sesis' => $sesis,
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
        $validated = $request->validate([
            'sesi_id' => 'required|exists:sesi_penjualan,id',
            'nama' => 'required|string|max:255',
            'harga' => 'nullable|numeric',
            'stok' => 'nullable|integer',
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
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'harga' => 'nullable|numeric',
            'stok' => 'nullable|integer',
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

