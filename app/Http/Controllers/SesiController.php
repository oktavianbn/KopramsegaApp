<?php

namespace App\Http\Controllers;

use App\Models\Sesi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SesiController extends Controller
{
    public function Index(Request $request)
    {
        $query = Sesi::query();

        if ($request->search) {
            $query->where('nama', 'like', "%{$request->search}%");
        }

        if ($request->has('ditutup') && $request->ditutup !== '') {
            $query->where('ditutup', $request->ditutup);
        }

        // optional date filtering: tanggal_mulai / tanggal_selesai
        if ($request->has('tanggal_mulai') && $request->tanggal_mulai) {
            $query->whereDate('tanggal_mulai', '>=', $request->tanggal_mulai);
        }
        if ($request->has('tanggal_selesai') && $request->tanggal_selesai) {
            $query->whereDate('tanggal_selesai', '<=', $request->tanggal_selesai);
        }

        $sesis = $query
            ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_direction', 'desc'))
            ->paginate($request->get('perPage', 8))
            ->withQueryString();

        return Inertia::render('Sesi/Index', [
            'sesis' => $sesis,
            'filters' => $request->only('search', 'ditutup', 'sort_by', 'sort_direction', 'tanggal_mulai', 'tanggal_selesai'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Sesi/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'ditutup' => 'nullable|boolean',
        ]);

        Sesi::create($validated);

        return redirect()->route('sesi.index')->with('success', 'Sesi berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sesi $sesi)
    {
        return Inertia::render('Sesi/Show', [
            'sesi' => $sesi,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sesi $sesi)
    {
        return Inertia::render('Sesi/Edit', [
            'sesi' => $sesi,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sesi $sesi)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'ditutup' => 'nullable|boolean',
        ]);

        $sesi->update($validated);

        // if request came via AJAX (Inertia patch), return JSON success
        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('sesi.index')->with('success', 'Sesi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sesi $sesi)
    {
        $sesi->delete();
        return redirect()->route('sesi.index')->with('success', 'Sesi berhasil dihapus.');
    }

    public function updateStatusSesi(Sesi $sesi, Request $request)
    {
        $sesi->update([
            'ditutup' => $request->ditutup,
        ]);
        if ($request->wantsJson()) return response()->json(['success' => true]);
        return back();
    }
}
