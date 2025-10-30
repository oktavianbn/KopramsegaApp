<?php

namespace App\Http\Controllers;

use App\Models\Rencana;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RencanaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Rencana::with('role');

        $perPage = $request->input('perPage', 8);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search', '');
        $filter = $request->input('filter', null);

        $allowedSorts = ['nama_rencana', 'tanggal_mulai', 'tanggal_selesai', 'status', 'created_at'];
        $allowedDirections = ['asc', 'desc'];

        // Search
        if ($search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_rencana', 'like', '%' . $request->search . '%')
                    ->orWhere('deskripsi', 'like', '%' . $request->search . '%');
            });
        }

        // Filter
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('role_id')) {
            $query->where('role_id', $request->input('role_id'));
        }

        // Short
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'desc';
        }
        if ($sortBy === 'tanggal_selesai') {
            $query->orderByRaw("tanggal_selesai IS NULL, tanggal_selesai {$sortDirection}");
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Pagination
        $rencanas = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Rencana/Index', [
            'rencanas' => $rencanas,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
                'filter' => $filter,
            ],
            'roles' => Role::all(),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Rencana/Create', [
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_rencana' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            // tanggal_mulai must be today or in the future (cannot pick yesterday)
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'status' => 'required|in:belum_dimulai,sedang_dilaksanakan,selesai',
            'role_id' => 'required|exists:roles,id',
        ]);

        Rencana::create($request->all());

        return redirect()->route('rencana.index')->with('success', 'Rencana berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rencana $rencana)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rencana $rencana)
    {
        return Inertia::render('Rencana/Edit', [
            'roles' => Role::all(),
            'rencana' => $rencana
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rencana $rencana, $id)
    {
        $rencana = Rencana::findOrFail($id);

        $validated = $request->validate([
            'nama_rencana' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            // tanggal_mulai must be today or in the future (cannot pick yesterday)
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'status' => 'required|in:belum_dimulai,sedang_dilaksanakan,selesai',
            'role_id' => 'required|exists:roles,id',
        ]);

        $rencana->update($validated);

        return redirect()->route('rencana.index')
            ->with('success', 'Data rencana surat berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rencana $rencana)
    {
        $rencana->delete();

        return redirect()->route('rencana.index')->with('success', 'Rencana berhasil dihapus.');
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, Rencana $rencana)
    {
        $request->validate([
            'status' => 'required|in:belum_dimulai,sedang_dilaksanakan,selesai',
        ]);

        $data = ['status' => $request->status];

        // Auto-set tanggal_selesai if status is 'selesai'
        if ($request->status === 'selesai') {
            $data['tanggal_selesai'] = now()->toDateString();
        }

        $rencana->update($data);

        return redirect()->back()->with('success', 'Status rencana berhasil diperbarui.');
    }
}
