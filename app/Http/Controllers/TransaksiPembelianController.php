<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiUsdan;
use App\Models\DetailTransaksiUsdan;

class TransaksiPembelianController extends Controller
{
    public function show($id)
    {
        $trans = TransaksiUsdan::with(['detail_transaksi_usdan.menu'])->findOrFail($id);
        return response()->json($trans);
    }

    /**
     * Store a new transaction with details
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_pelanggan' => ['required', 'string', 'max:255'],
            'nomor_telepon' => ['required', 'string', 'max:20'],
            'sesi_penjualan_id' => ['required', 'integer', 'exists:sesi_penjualan,id'],
            'diantar' => ['nullable', 'boolean'],
            'tujuan' => ['required', 'string', 'max:255'],
            'catatan' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_id' => ['required', 'integer', 'exists:menu,id'],
            'items.*.jumlah' => ['required', 'integer', 'min:1'],
            'items.*.harga_satuan' => ['required', 'numeric', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            $total = 0;
            foreach ($data['items'] as $it) {
                $total += $it['jumlah'] * $it['harga_satuan'];
            }

            $trans = TransaksiUsdan::create([
                'nama_pelanggan' => $data['nama_pelanggan'],
                'nomor_telepon' => $data['nomor_telepon'],
                'sesi_penjualan_id' => $data['sesi_penjualan_id'],
                'diantar' => $data['diantar'] ?? false,
                'tujuan' => $data['tujuan'],
                'status' => 'verifikasi',
                'total_harga' => $total,
                'catatan' => $data['catatan'] ?? null,
            ]);

            foreach ($data['items'] as $it) {
                DetailTransaksiUsdan::create([
                    'transaksi_usdan_id' => $trans->id,
                    'menu_id' => $it['menu_id'],
                    'jumlah' => $it['jumlah'],
                    'harga_satuan' => $it['harga_satuan'],
                ]);
            }

            DB::commit();

            // Return the transaction with a consistent `detail` relation payload
            // (the model exposes `detail()` as an alias for detail_transaksi_usdan).
            return response()->json($trans->load(['detail.menu']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat transaksi', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update status of a transaction
     */
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => ['required', 'in:verifikasi,proses,sudah_siap,sudah_ambil,dibatalkan'],
        ]);

        $trans = TransaksiUsdan::findOrFail($id);
        $trans->status = $data['status'];
        $trans->save();

        return response()->json($trans);
    }

    /**
     * Delete transaction
     */
    public function destroy($id)
    {
        $trans = TransaksiUsdan::findOrFail($id);
        $trans->delete();
        return response()->json(['message' => 'Transaksi dihapus']);
    }
}
