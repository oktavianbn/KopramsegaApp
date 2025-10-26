<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TransaksiUsdan;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class TransaksiController extends Controller
{
    public function Index(Request $request)
    {
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $perPage = (int) $request->input('perPage', 10);
        $filter = $request->input('filter');

        // whitelist allowed sortable columns to avoid SQL injection
        $allowedSorts = ['created_at', 'total_harga', 'status', 'tujuan', 'id'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $query = TransaksiUsdan::with(['pelanggan', 'sesiPenjualan']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tujuan', 'like', "%{$search}%")
                    ->orWhere('no_telp', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('id', $search);
            });
        }

        if ($filter) {
            // treat filter as status for transaksi
            $query->where('status', $filter);
        }

        $paginator = $query->orderBy($sortBy, $sortDirection)->paginate($perPage)->withQueryString();

        $users = User::select('id', 'name')->get();

        return Inertia::render('Transaksi/Index', [
            // frontend prop renamed to `transaksi`
            'transaksi' => $paginator,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'filter' => $filter,
            ],
            'users' => $users,
        ]);
    }

    // Show a single transaksi (web)
    public function show($id)
    {
        $transaksi = TransaksiUsdan::with(['pelanggan', 'detail', 'sesiPenjualan'])->findOrFail($id);
        return Inertia::render('Transaksi/Show', [
            'transaksi' => $transaksi,
        ]);
    }

    // Update status (web)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:verifikasi,proses,sudah_siap,sudah_ambil,dibatalkan',
        ]);

        $transaksi = TransaksiUsdan::findOrFail($id);

        // Optionally check permissions here (e.g., only admin or owner)
        $transaksi->status = $request->input('status');
        $transaksi->save();

        return Redirect::back()->with('success', 'Status transaksi berhasil diubah.');
    }

    // Delete transaksi (web)
    public function destroy($id)
    {
        $transaksi = TransaksiUsdan::findOrFail($id);
        // permission checks can be placed here
        $transaksi->delete();
        return Redirect::route('transaksi.index')->with('success', 'Transaksi berhasil dihapus.');
    }
}
