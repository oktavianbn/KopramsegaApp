<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TransaksiUsdan;

class UsdanController extends Controller
{
    // Tampilkan semua pesanan (untuk admin/pengawas)
    public function index()
    {
        $pesanan = TransaksiUsdan::latest()->paginate(10);
        return view('usdan.index', compact('pesanan'));
    }

    // Tampilkan form edit pesanan
    public function edit($id)
    {
        $pesanan = TransaksiUsdan::findOrFail($id);
        return view('usdan.edit', compact('pesanan'));
    }

    // Proses update pesanan
    public function update(Request $request, $id)
    {
        $pesanan = TransaksiUsdan::findOrFail($id);
        $data = $request->validate([
            'no_telp' => 'sometimes|string',
            'diantar' => 'sometimes|boolean',
            'tujuan' => 'sometimes|string',
            'catatan' => 'nullable|string',
        ]);
        $pesanan->update($data);
        return redirect()->route('usdan.index')->with('success', 'Pesanan berhasil diubah');
    }

    // Batalkan pesanan (admin/pengawas)
    public function batal($id)
    {
        $pesanan = TransaksiUsdan::findOrFail($id);
        if ($pesanan->status === 'dibatalkan') {
            return redirect()->back()->with('error', 'Pesanan sudah dibatalkan');
        }
        $pesanan->status = 'dibatalkan';
        $pesanan->save();
        return redirect()->route('usdan.index')->with('success', 'Pesanan berhasil dibatalkan');
    }
}
