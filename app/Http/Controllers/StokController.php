<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Spesifikasi;
use App\Models\TransaksiBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StokController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Build combos from all barangs and their spesifikasis.
        $barangs = Barang::with('spesifikasi')->orderBy('nama')->get();
        $stokData = [];

        foreach ($barangs as $barang) {
            if ($barang->spesifikasi->count() > 0) {
                foreach ($barang->spesifikasi as $sp) {
                    $stokMasuk = TransaksiBarang::where('barang_id', $barang->id)
                        ->where('spesifikasi_id', $sp->id)
                        ->where('tipe', 't')->sum('jumlah');
                    $stokKeluar = TransaksiBarang::where('barang_id', $barang->id)
                        ->where('spesifikasi_id', $sp->id)
                        ->where('tipe', 'k')->sum('jumlah');
                    $stokAkhir = $stokMasuk - $stokKeluar;
                    $stokData[] = (object) [
                        'barang_id' => $barang->id,
                        'spesifikasi_id' => $sp->id,
                        'barang' => $barang,
                        'spesifikasi' => $sp,
                        'jumlah' => $stokAkhir,
                    ];
                }
            } else {
                // barang tanpa spesifikasi
                $stokMasuk = TransaksiBarang::where('barang_id', $barang->id)
                    ->whereNull('spesifikasi_id')
                    ->where('tipe', 't')->sum('jumlah');
                $stokKeluar = TransaksiBarang::where('barang_id', $barang->id)
                    ->whereNull('spesifikasi_id')
                    ->where('tipe', 'k')->sum('jumlah');
                $stokAkhir = $stokMasuk - $stokKeluar;
                $stokData[] = (object) [
                    'barang_id' => $barang->id,
                    'spesifikasi_id' => null,
                    'barang' => $barang,
                    'spesifikasi' => null,
                    'jumlah' => $stokAkhir,
                ];
            }
        }

        return Inertia::render('Stok/Index', [
            'stoks' => $stokData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $barangs = Barang::orderBy('nama')->get();
        $spesifikasis = Spesifikasi::with('barang')->orderBy('key')->get();

        return Inertia::render('Stok/Create', [
            'barangs' => $barangs,
            'spesifikasis' => $spesifikasis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'spesifikasi_id' => 'nullable|exists:spesifikasis,id',
            'jumlah' => 'required|integer|min:1',
            'tipe' => 'required|in:t,k',
            'keterangan' => 'nullable|string',
        ]);

        $userName = Auth::user()?->name ?? null;
        $suffix = $userName ? "(Penyesuaian stok oleh {$userName})" : '(Penyesuaian stok oleh user)';

        TransaksiBarang::create([
            'barang_id' => $request->barang_id,
            'spesifikasi_id' => $request->spesifikasi_id ?: null,
            'jumlah' => $request->jumlah,
            'tipe' => $request->tipe,
            'keterangan' => $request->keterangan ? trim($request->keterangan) . ' ' . $suffix : $suffix,
        ]);

        return redirect()->route('stok.index')
            ->with('success', 'Transaksi stok berhasil dicatat.');
    }

    /**
     * Display the specified resource.
     */
    // Show stock detail based on barang_id and optional spesifikasi_id
    public function show(Request $request, $barang_id)
    {
        $spesifikasi_id = $request->input('spesifikasi_id');
        $barang = Barang::findOrFail($barang_id);
        $spesifikasi = $spesifikasi_id ? Spesifikasi::find($spesifikasi_id) : null;

        $stokMasuk = TransaksiBarang::where('barang_id', $barang->id)
            ->when($spesifikasi, function ($q) use ($spesifikasi) {
                $q->where('spesifikasi_id', $spesifikasi->id);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 't')->sum('jumlah');

        $stokKeluar = TransaksiBarang::where('barang_id', $barang->id)
            ->when($spesifikasi, function ($q) use ($spesifikasi) {
                $q->where('spesifikasi_id', $spesifikasi->id);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 'k')->sum('jumlah');

        $stokAkhir = $stokMasuk - $stokKeluar;

        $stokObj = (object) [
            
            'barang_id' => $barang->id,
            'spesifikasi_id' => $spesifikasi?->id ?? null,
            'barang' => $barang,
            'spesifikasi' => $spesifikasi,
            'jumlah' => $stokAkhir,
        ];

        return Inertia::render('Stok/Show', [
            'stok' => $stokObj,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    // Edit penyesuaian: tampilkan form dengan nilai stok sekarang
    public function edit(Request $request, $barang_id)
    {
        $spesifikasi_id = $request->input('spesifikasi_id');
        $barangs = Barang::orderBy('nama')->get();
        $spesifikasis = Spesifikasi::with('barang')->orderBy('key')->get();
        $barang = Barang::findOrFail($barang_id);
        $spesifikasi = $spesifikasi_id ? Spesifikasi::find($spesifikasi_id) : null;

        $stokMasuk = TransaksiBarang::where('barang_id', $barang->id)
            ->when($spesifikasi, function ($q) use ($spesifikasi) {
                $q->where('spesifikasi_id', $spesifikasi->id);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 't')->sum('jumlah');

        $stokKeluar = TransaksiBarang::where('barang_id', $barang->id)
            ->when($spesifikasi, function ($q) use ($spesifikasi) {
                $q->where('spesifikasi_id', $spesifikasi->id);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 'k')->sum('jumlah');

        $stokAkhir = $stokMasuk - $stokKeluar;

        $stokObj = (object) [
            'barang_id' => $barang->id,
            'spesifikasi_id' => $spesifikasi?->id ?? null,
            'barang' => $barang,
            'spesifikasi' => $spesifikasi,
            'jumlah' => $stokAkhir,
        ];

        return Inertia::render('Stok/Edit', [
            'stok' => $stokObj,
            'barangs' => $barangs,
            'spesifikasis' => $spesifikasis,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // Update stok = catat penyesuaian sebagai transaksi
    public function update(Request $request, $id)
    {
        // $id is a composite key representation: barang_{id}_spes_{id} or stok id
        $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'spesifikasi_id' => 'nullable|exists:spesifikasis,id',
            'jumlah_sekarang' => 'required|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $barangId = $request->barang_id;
        $spesifikasiId = $request->spesifikasi_id ?: null;

        // Hitung total sekarang dari transaksi
        $stokMasuk = TransaksiBarang::where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 't')->sum('jumlah');

        $stokKeluar = TransaksiBarang::where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 'k')->sum('jumlah');

        $stokAkhir = $stokMasuk - $stokKeluar;

        $target = $request->jumlah_sekarang;
        if ($target == $stokAkhir) {
            return redirect()->route('stok.index')->with('info', 'Stok sudah sesuai, tidak ada penyesuaian yang dibuat.');
        }

        $userName = Auth::user()?->name ?? null;
        $suffix = $userName ? "(Penyesuaian stok oleh {$userName})" : '(Penyesuaian stok oleh user)';

        if ($target > $stokAkhir) {
            $diff = $target - $stokAkhir;
            // buat transaksi masuk
            TransaksiBarang::create([
                'tipe' => 't',
                'barang_id' => $barangId,
                'spesifikasi_id' => $spesifikasiId,
                'jumlah' => $diff,
                'keterangan' => $request->keterangan ? trim($request->keterangan) . ' ' . $suffix : 'Penyesuaian stok (manual) ' . $suffix,
            ]);
        } else {
            $diff = $stokAkhir - $target;
            // buat transaksi keluar
            TransaksiBarang::create([
                'tipe' => 'k',
                'barang_id' => $barangId,
                'spesifikasi_id' => $spesifikasiId,
                'jumlah' => $diff,
                'keterangan' => $request->keterangan ? trim($request->keterangan) . ' ' . $suffix : 'Penyesuaian stok (manual) ' . $suffix,
            ]);
        }

        // Do not touch legacy Stok table (system is transaction-based)

        return redirect()->route('stok.index')
            ->with('success', 'Penyesuaian stok berhasil dicatat.');
    }

    // Destroy: create a transaction to zero the stock for the given barang+spesifikasi
    public function destroy(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barangs,id',
            'spesifikasi_id' => 'nullable|exists:spesifikasis,id',
        ]);

        $barangId = $request->barang_id;
        $spesifikasiId = $request->spesifikasi_id ?: null;

        $stokMasuk = TransaksiBarang::where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 't')->sum('jumlah');

        $stokKeluar = TransaksiBarang::where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })->where('tipe', 'k')->sum('jumlah');

        $stokAkhir = $stokMasuk - $stokKeluar;

        if ($stokAkhir > 0) {
            TransaksiBarang::create([
                'tipe' => 'k',
                'barang_id' => $barangId,
                'spesifikasi_id' => $spesifikasiId,
                'jumlah' => $stokAkhir,
                    'keterangan' => 'Penyesuaian: hapus stok via UI (Penyesuaian stok oleh user)',
            ]);
        }

        return redirect()->route('stok.index')->with('success', 'Penyesuaian hapus stok berhasil dicatat.');
    }

    // removed legacy destroy(Stok $stok) to keep system transaction-based
}
