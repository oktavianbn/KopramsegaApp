<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TransaksiUsdan;
use App\Models\Sesi;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

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
        $allowedSorts = ['created_at', 'total_harga', 'status', 'tujuan', 'id', 'nama_pelanggan', 'nomor_telepon'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $query = TransaksiUsdan::with(['sesiPenjualan', 'detail']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tujuan', 'like', "%{$search}%")
                    ->orWhere('nomor_telepon', 'like', "%{$search}%")
                    ->orWhere('nama_pelanggan', 'like', "%{$search}%")
                    ->orWhere('id', $search);
            });
        }

        if ($filter) {
            if ($filter === 'diantar') {
                $query->where('diantar', true);
            } elseif ($filter === 'ambil') {
                $query->where('diantar', false);
            } else {
                $query->where('status', $filter);
            }
        }

        $paginator = $query->orderBy($sortBy, $sortDirection)->paginate($perPage)->withQueryString();

        // Get active sesi summary
        $activeSesis = Sesi::where('ditutup', false)->orderBy('tanggal_mulai', 'desc')->get();
        $sesiSummary = [];
        foreach ($activeSesis as $s) {
            $totals = DB::table('transaksi_usdan as t')
                ->leftJoin('detail_transaksi_usdan as d', 'd.transaksi_usdan_id', '=', 't.id')
                ->where('t.sesi_penjualan_id', $s->id)
                ->where('t.status', '!=', 'dibatalkan')
                ->selectRaw('COUNT(DISTINCT t.id) as total_orders, COALESCE(SUM(d.jumlah),0) as total_items, COALESCE(SUM(t.total_harga),0) as total_revenue')
                ->first();

            $sesiSummary[] = [
                'id' => $s->id,
                'nama' => $s->nama,
                'total_orders' => (int) ($totals->total_orders ?? 0),
                'total_items' => (int) ($totals->total_items ?? 0),
                'total_revenue' => (float) ($totals->total_revenue ?? 0),
            ];
        }

        return Inertia::render('Transaksi/Index', [
            'transaksi' => $paginator,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'filter' => $filter,
            ],
            'active_sesis' => $activeSesis,
            'sesi_summary' => $sesiSummary,
        ]);
    }

    // Dashboard: rekap pembelian per sesi
    public function dashboard(Request $request)
    {
        $sesiId = $request->input('sesi_penjualan_id');
        $page = (int) $request->input('page', 1);
        $perPage = (int) $request->input('per_page', 20);

        $sesis = Sesi::select('id', 'nama')->orderBy('tanggal_mulai', 'desc')->get();

        // Auto-select latest sesi if not specified
        if (!$sesiId && $sesis->isNotEmpty()) {
            $sesiId = $sesis->first()->id;
        }

        $payload = [
            'sesis' => $sesis,
            'selected_sesi' => $sesiId,
            'rekap' => [],
            'totals' => null,
            'transaksi' => null,
        ];

        if ($sesiId) {
            // Get menu recap for this session
            $rekap = DB::table('detail_transaksi_usdan as d')
                ->join('transaksi_usdan as t', 'd.transaksi_usdan_id', '=', 't.id')
                ->join('menu as m', 'd.menu_id', '=', 'm.id')
                ->where('t.sesi_penjualan_id', $sesiId)
                ->where('t.status', '!=', 'dibatalkan')
                ->selectRaw('m.id as menu_id, m.nama as menu_nama, SUM(d.jumlah) as total_qty, SUM(d.jumlah * COALESCE(d.harga_satuan,0)) as estimated_revenue')
                ->groupBy('m.id', 'm.nama')
                ->orderByDesc('total_qty')
                ->get();

            // Get totals
            $totals = DB::table('transaksi_usdan as t')
                ->leftJoin('detail_transaksi_usdan as d', 'd.transaksi_usdan_id', '=', 't.id')
                ->where('t.sesi_penjualan_id', $sesiId)
                ->where('t.status', '!=', 'dibatalkan')
                ->selectRaw('COUNT(DISTINCT t.id) as total_orders, COALESCE(SUM(d.jumlah),0) as total_items, COALESCE(SUM(t.total_harga),0) as total_revenue')
                ->first();

            // Get transaction list (buyers)
            $transaksiList = TransaksiUsdan::with(['detail.menu'])
                ->where('sesi_penjualan_id', $sesiId)
                ->where('status', '!=', 'dibatalkan')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage)
                ->withQueryString();

            $payload['rekap'] = $rekap;
            $payload['totals'] = [
                'total_orders' => (int) ($totals->total_orders ?? 0),
                'total_items' => (int) ($totals->total_items ?? 0),
                'total_revenue' => (float) ($totals->total_revenue ?? 0),
            ];
            $payload['transaksi'] = $transaksiList;
        }

        return Inertia::render('Transaksi/Dashboard', $payload);
    }

    // Show a single transaksi (web)
    public function show($id)
    {
        $transaksi = TransaksiUsdan::with(['detail.menu', 'sesiPenjualan'])->findOrFail($id);
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
        $transaksi->status = $request->input('status');
        $transaksi->save();

        return Redirect::back()->with('success', 'Status transaksi berhasil diubah.');
    }

    // Delete transaksi (web)
    public function destroy($id)
    {
        $transaksi = TransaksiUsdan::findOrFail($id);
        $transaksi->delete();
        return Redirect::route('transaksi.index')->with('success', 'Transaksi berhasil dihapus.');
    }
}
