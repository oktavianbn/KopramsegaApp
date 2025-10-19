<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pelanggan;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        $query = Pelanggan::query();

        // Ambil parameter dari request
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $search = $request->input('search', '');
        $filter = $request->input('filter', null);

        // Kolom yang diizinkan untuk sorting
        $allowedSorts = ['name', 'no_hp', 'created_at'];
        $allowedDirections = ['asc', 'desc'];

        // Pencarian berdasarkan nama atau no_hp
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        // Filter status aktif / nonaktif (opsional)
        if ($filter === 'active' || $filter === '1') {
            $query->where('is_active', 1);
        } elseif ($filter === 'inactive' || $filter === '0') {
            $query->where('is_active', 0);
        }

        // Validasi sort & arah
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array(strtolower($sortDirection), $allowedDirections)) {
            $sortDirection = 'asc';
        }

        // Eksekusi query + paginasi
        $paginator = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->appends(request()->query());

        // Transform each item so frontend receives nohp and numeric status
        $paginator->setCollection($paginator->getCollection()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'nohp' => $p->no_hp,
                'status' => (int) $p->is_active,
                'created_at' => $p->created_at,
                'updated_at' => $p->updated_at,
            ];
        }));

        return Inertia::render('Pelanggan/Index', [
            'pelanggans' => $paginator,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
                'filter' => $filter,
            ],
        ]);
    }


    public function updateStatus(Request $request, $id)
    {
        // dd($request->all());
        $pelanggan = Pelanggan::findOrFail($id);
        $pelanggan->is_active = $request->input('is_active') ? true : false;
        $pelanggan->save();

        return redirect()->back();
    }

    public function destroy($id)
    {
        $pelanggan = Pelanggan::findOrFail($id);
        $pelanggan->delete();

        return redirect()->back();
    }
}
