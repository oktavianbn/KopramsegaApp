<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Sangga;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with('sangga');
        // request params
        $filter = $request->input('filter', null);
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nta', 'like', "%{$search}%");
            });
        }

        // filter by sangga_id when filter is provided (frontend sends sangga id)
        if ($filter) {
            if (is_numeric($filter)) {
                $query->where('sangga_id', $filter);
            }
        }

        // guard allowed sort columns to prevent arbitrary SQL injection
        $allowedSorts = ['nama', 'created_at', 'nis'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $siswa = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Siswa/Index', [
            'siswa' => $siswa,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'filter' => $filter,
            ],
            'sangga' => Sangga::all(),
        ]);
    }

    public function create()
    {
        $sangga = Sangga::orderBy('nama_sangga')->get();
        return Inertia::render('Siswa/Create', [
            'sangga' => $sangga,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nis' => 'required|string|max:50|unique:siswa,nis',
            'nta' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'kelas' => 'nullable|string|max:50',
            'jurusan' => 'nullable|string|max:100',
            'rombel' => 'nullable|string|max:50',
            'jenis_kelamin' => 'required|in:l,p',
            'sangga_id' => 'nullable|exists:sangga,id',
        ]);

        Siswa::create($data);

        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $siswa = Siswa::findOrFail($id);
        $sangga = Sangga::orderBy('nama_sangga')->get();
        return Inertia::render('Siswa/Edit', [
            'siswa' => $siswa,
            'sangga' => $sangga,
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $data = $request->validate([
            'nis' => 'required|string|max:50|unique:siswa,nis,' . $siswa->id,
            'nta' => 'nullable|string|max:50',
            'nama' => 'required|string|max:255',
            'kelas' => 'nullable|string|max:50',
            'jurusan' => 'nullable|string|max:100',
            'rombel' => 'nullable|string|max:50',
            'jenis_kelamin' => 'required|in:l,p',
            'sangga_id' => 'nullable|exists:sangga,id',
        ]);

        $siswa->update($data);

        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->delete();
        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil dihapus.');
    }
}
