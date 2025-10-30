<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {

        $query = Role::query();

        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $search = $request->input('search', '');
        $allowedSorts = ['name', 'id', 'guard_name'];

        // Search by name
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Sorting
        $allowedDirections = ['asc', 'desc'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'asc';
        }

        $role = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Role/Index', [
            'role' => $role,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Role/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);


        Role::create($validated);

        return redirect()->route('role.index')->with('success', 'User berhasil dibuat');
    }
    public function edit(string $id)
    {
        $role = Role::findOrFail($id);

        return Inertia::render('Role/Edit', [
            'role' => $role
        ]);
    }
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);

        $role->update($validated);

        return redirect()->route('role.index')
            ->with('success', 'Data role berhasil diupdate');
    }
    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()->route('role.index')->with('success', 'Rencana berhasil dihapus.');
    }
}
