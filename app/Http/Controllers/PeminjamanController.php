<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\DetailPeminjaman;
use App\Models\Spesifikasi;
use App\Models\Barang;
use App\Models\User;
use App\Models\TransaksiBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PeminjamanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
    $query = Peminjaman::with(['pemberiUser', 'penerimaUser', 'detailPeminjaman.barang', 'detailPeminjaman.spesifikasi']);

        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $allowedDirections = ['asc', 'desc'];
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');
        $filter = $request->input('filter');

        // 🔍 Filter pencarian
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_peminjam', 'like', "%$search%")
                    ->orWhere('alamat', 'like', "%$search%")
                    ->orWhere('no_telp', 'like', "%$search%")
                    ->orWhere('asal', 'like', "%$search%")
                    ->orWhereHas('pemberiUser', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    })
                    ->orWhereHas('penerimaUser', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    });
            });
        }

        // 📂 Filter status
        if ($filter) {
            if (in_array($filter, ['pending', 'disetujui', 'sudah_ambil', 'sudah_kembali', 'dibatalkan'])) {
                $query->where('status', $filter);
            } elseif ($filter === 'pinjam') {
                $query->where('jenis', 'pinjam');
            } elseif ($filter === 'sewa') {
                $query->where('jenis', 'sewa');
            } elseif ($filter === 'terlambat') {
                $query->where('tepat_waktu', false);
            }
        }

        // 🔽 Sortir
        $allowedSorts = ['created_at', 'nama_peminjam', 'waktu_pinjam_mulai', 'waktu_pinjam_selesai', 'status'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortDirection, $allowedDirections)) {
            $sortDirection = 'desc';
        }

        // 📑 Pagination
        $peminjaman = $query->orderBy($sortBy, $sortDirection)
            ->paginate($perPage)
            ->withQueryString();

        // Get users for status update modal
        $users = User::select('id', 'name')->get();

        return Inertia::render('Peminjaman/Index', [
            'peminjaman' => $peminjaman,
            'users' => $users,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'perPage' => $perPage,
                'filter' => $filter,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Build available stock from barangs that boleh_dipinjam and aggregate transaksi_barang
        $availableStok = [];

        $barangs = Barang::where('boleh_dipinjam', true)->get();

        foreach ($barangs as $barang) {
            // get spesifikasis for this barang (including a 'null' spesifikasi representing default)
            $spesifikasis = $barang->spesifikasi()->get();

            // include a null spesifikasi option when there are no spesifikasis
            if ($spesifikasis->isEmpty()) {
                $variants = [null];
            } else {
                $variants = $spesifikasis->pluck('id')->toArray();
            }

            // if we had spesifikasis, iterate them; otherwise treat as single default (null)
            $variantIds = $variants === [null] ? [null] : $variants;

            foreach ($variantIds as $spesifikasiId) {
                $stokMasuk = TransaksiBarang::where('barang_id', $barang->id)
                    ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                        $q->where('spesifikasi_id', $spesifikasiId);
                    }, function ($q) {
                        $q->whereNull('spesifikasi_id');
                    })->where('tipe', 't')->sum('jumlah');

                $stokKeluar = TransaksiBarang::where('barang_id', $barang->id)
                    ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                        $q->where('spesifikasi_id', $spesifikasiId);
                    }, function ($q) {
                        $q->whereNull('spesifikasi_id');
                    })->where('tipe', 'k')->sum('jumlah');

                $jumlahAkhir = $stokMasuk - $stokKeluar;

                if ($jumlahAkhir <= 0) continue;

                // generate a deterministic numeric id for the frontend per barang+spesifikasi
                $genId = intval($barang->id) * 1000000 + intval($spesifikasiId ?? 0);

                $spesifikasiObj = $spesifikasiId ? Spesifikasi::find($spesifikasiId) : null;

                $availableStok[] = [
                    'id' => $genId,
                    'barang_id' => $barang->id,
                    'barang_nama' => $barang->nama,
                    'spesifikasi_id' => $spesifikasiId,
                    'spesifikasi_key' => $spesifikasiObj ? $spesifikasiObj->key : 'Standar',
                    'spesifikasi_value' => $spesifikasiObj ? $spesifikasiObj->value : 'Standar',
                    'jumlah_tersedia' => $jumlahAkhir,
                ];
            }
        }

        // reindex
        $availableStok = array_values($availableStok);

        // Get users for pemberi and penerima
        $users = User::select('id', 'name')->get();

        return Inertia::render('Peminjaman/Create', [
            'availableStok' => $availableStok,
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_peminjam' => 'required|string|max:255',
            'alamat' => 'required|string|max:500',
            'no_telp' => 'required|string|max:20',
            'asal' => 'required|string|max:255',
            'foto_identitas' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'jenis' => 'required|in:pinjam,sewa',
            'waktu_pinjam_mulai' => 'required|date|after_or_equal:today',
            'waktu_pinjam_selesai' => 'required|date|after:waktu_pinjam_mulai',
            'detail_peminjaman' => 'required|array|min:1',
            'detail_peminjaman.*.barang_id' => 'required|exists:barangs,id',
            'detail_peminjaman.*.spesifikasi_id' => 'nullable|exists:spesifikasis,id',
            'detail_peminjaman.*.jumlah' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            // Check stok availability by aggregating transaksi_barang (don't reduce stock yet)
            foreach ($validated['detail_peminjaman'] as $detail) {
                $barangId = $detail['barang_id'];
                $spesifikasiId = $detail['spesifikasi_id'] ?? null;

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

                if ($stokAkhir < $detail['jumlah']) {
                    // attempt to get barang name for error message
                    $barang = Barang::find($barangId);
                    $namaBarang = $barang ? $barang->nama : $barangId;
                    throw new \Exception("Stok tidak mencukupi untuk barang {$namaBarang}");
                }
            }

            // Upload files
            $validated['foto_identitas'] = $request->file('foto_identitas')->store('peminjaman/identitas', 'public');

            // Create peminjaman with pending status (stock not reduced yet)
            $peminjaman = Peminjaman::create($validated);

            // Create detail peminjaman (without reducing stock)
            foreach ($validated['detail_peminjaman'] as $detail) {
                DetailPeminjaman::create([
                    'peminjaman_id' => $peminjaman->id,
                    'barang_id' => $detail['barang_id'],
                    'spesifikasi_id' => $detail['spesifikasi_id'] ?? null,
                    'jumlah' => $detail['jumlah']
                ]);
            }

            DB::commit();

            return redirect()->route('peminjaman.index')->with('success', 'Permintaan peminjaman berhasil dibuat dan menunggu persetujuan');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
public function show(Peminjaman $peminjaman)
{
    $peminjaman->load([
        'pemberiUser',
        'penerimaUser',
        'detailPeminjaman.barang',
        'detailPeminjaman.spesifikasi'
    ]);

    // Default
    $peminjaman->total_hari_terlambat = 0;

    if ($peminjaman->waktu_pinjam_selesai) {
        $selesai = Carbon::parse($peminjaman->waktu_pinjam_selesai);
        $kembali = $peminjaman->waktu_kembali
            ? Carbon::parse($peminjaman->waktu_kembali)
            : Carbon::now(); // kalau belum dikembalikan, pakai waktu sekarang

        if ($kembali->greaterThan($selesai)) {
            $jamTerlambat = $selesai->diffInHours($kembali);
            $peminjaman->total_hari_terlambat = (int) ceil($jamTerlambat / 24);
        }
    }

    // Get users for status update modal
    $users = User::select('id', 'name')->get();

    return Inertia::render('Peminjaman/Show', [
        'peminjaman' => $peminjaman,
        'users' => $users
    ]);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Peminjaman $peminjaman)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Peminjaman $peminjaman)
    {
        //
    }

    /**
     * Update status peminjaman
     */
    public function updateStatus(Request $request, Peminjaman $peminjaman)
    {
        $validated = $request->validate([
            'status' => 'required|in:disetujui,sudah_ambil,sudah_kembali,dibatalkan',
            'pemberi' => 'required_if:status,sudah_ambil|exists:users,id',
            'penerima' => 'required_if:status,sudah_kembali|exists:users,id',
            'foto_barang_diambil' => 'required_if:status,sudah_ambil|image|mimes:jpeg,png,jpg|max:2048',
            'foto_barang_kembali' => 'required_if:status,sudah_kembali|image|mimes:jpeg,png,jpg|max:2048',
            'detail_kembali' => 'required_if:status,sudah_kembali|array',
            'detail_kembali.*.id' => 'required_if:status,sudah_kembali|exists:detail_peminjamen,id',
            'detail_kembali.*.jumlah_kembali' => 'required_if:status,sudah_kembali|integer|min:0',
        ]);

        try {
            DB::beginTransaction();

            $updateData = ['status' => $validated['status']];

            // When status is 'disetujui' we only mark as approved; transaksi keluar will be recorded when admin marks 'sudah_ambil'

            if ($validated['status'] === 'sudah_ambil') {
                // Upload foto barang diambil dan set admin pemberi
                $updateData['foto_barang_diambil'] = $request->file('foto_barang_diambil')->store('peminjaman/barang_diambil', 'public');
                $updateData['pemberi'] = $validated['pemberi'];

                // At the moment items are taken, record transaksi keluar (k) for each detail after verifying stock
                foreach ($peminjaman->detailPeminjaman as $detail) {
                    $barangId = $detail->barang_id;
                    $spesifikasiId = $detail->spesifikasi_id ?: null;

                    // Hitung stok saat ini
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

                    if ($stokAkhir < $detail->jumlah) {
                        $barang = Barang::find($barangId);
                        $namaBarang = $barang ? $barang->nama : $barangId;
                        throw new \Exception("Stok tidak mencukupi untuk barang {$namaBarang}");
                    }

                    TransaksiBarang::create([
                        'tipe' => 'k',
                        'barang_id' => $barangId,
                        'spesifikasi_id' => $spesifikasiId,
                        'peminjaman_id' => $peminjaman->id,
                        'jumlah' => $detail->jumlah,
                        'keterangan' => ($peminjaman->jenis === 'sewa' ? 'Sewa' : 'Peminjaman'),
                    ]);
                }
            }

            if ($validated['status'] === 'sudah_kembali') {
                $updateData['waktu_kembali'] = now();
                $updateData['penerima'] = $validated['penerima'];

                // Check if return is on time
                $isLate = now()->gt(Carbon::parse($peminjaman->waktu_pinjam_selesai)->endOfDay());
                $updateData['tepat_waktu'] = !$isLate;

                // Upload foto barang kembali
                $updateData['foto_barang_kembali'] = $request->file('foto_barang_kembali')->store('peminjaman/barang_kembali', 'public');

                // Update detail peminjaman dengan jumlah yang kembali dan catat transaksi masuk (t)
                foreach ($validated['detail_kembali'] as $detailKembali) {
                    $detailPeminjaman = DetailPeminjaman::find($detailKembali['id']);

                    // Update jumlah kembali di detail peminjaman
                    $detailPeminjaman->update([
                        'jumlah_kembali' => $detailKembali['jumlah_kembali']
                    ]);

                    $barangId = $detailPeminjaman->barang_id;
                    $spesifikasiId = $detailPeminjaman->spesifikasi_id ?: null;

                    TransaksiBarang::create([
                        'tipe' => 't',
                        'barang_id' => $barangId,
                        'spesifikasi_id' => $spesifikasiId,
                        'peminjaman_id' => $peminjaman->id,
                        'jumlah' => $detailKembali['jumlah_kembali'],
                        'keterangan' => 'Pengembalian - ' . ($peminjaman->jenis === 'sewa' ? 'Sewa' : 'Peminjaman'),
                    ]);
                }
            }

            if ($validated['status'] === 'dibatalkan') {
                // Return stok jika dibatalkan setelah disetujui
                if ($peminjaman->status === 'disetujui' || $peminjaman->status === 'sudah_ambil') {
                        foreach ($peminjaman->detailPeminjaman as $detail) {
                        $barangId = $detail->barang_id;
                        $spesifikasiId = $detail->spesifikasi_id ?: null;
                        TransaksiBarang::create([
                            'tipe' => 't',
                            'barang_id' => $barangId,
                            'spesifikasi_id' => $spesifikasiId,
                            'jumlah' => $detail->jumlah,
                            'keterangan' => 'Pembatalan - ' . ($peminjaman->jenis === 'sewa' ? 'Sewa' : 'Peminjaman'),
                        ]);
                    }
                }
            }

            $peminjaman->update($updateData);

            DB::commit();

            return redirect()->route('peminjaman.index')->with('success', 'Status peminjaman berhasil diupdate');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Peminjaman $peminjaman)
    {
        try {
            DB::beginTransaction();

            // Return stok if peminjaman is not completed: create transaksi masuk (t)
            if (!in_array($peminjaman->status, ['sudah_kembali', 'dibatalkan'])) {
                foreach ($peminjaman->detailPeminjaman as $detail) {
                    // Prefer using barang_id/spesifikasi_id stored on detail_peminjamen.
                    // Fall back to legacy stok relation only if those are not present.
                    $barangId = $detail->barang_id ?? ($detail->stok ? $detail->stok->barang_id : null);
                    $spesifikasiId = $detail->spesifikasi_id ?? ($detail->stok ? $detail->stok->spesifikasi_id : null);

                    if (!$barangId) {
                        // nothing we can return to transport-wise; skip
                        continue;
                    }

                    TransaksiBarang::create([
                        'tipe' => 't',
                        'barang_id' => $barangId,
                        'spesifikasi_id' => $spesifikasiId ?: null,
                        'jumlah' => $detail->jumlah,
                        'keterangan' => 'Pengembalian stok karena penghapusan peminjaman',
                    ]);
                }
            }

            // Delete related files
            if ($peminjaman->foto_identitas) {
                Storage::disk('public')->delete($peminjaman->foto_identitas);
            }
            if ($peminjaman->foto_barang_diambil) {
                Storage::disk('public')->delete($peminjaman->foto_barang_diambil);
            }
            if ($peminjaman->foto_barang_kembali) {
                Storage::disk('public')->delete($peminjaman->foto_barang_kembali);
            }

            $peminjaman->delete();

            DB::commit();

            return redirect()->route('peminjaman.index')->with('success', 'Peminjaman berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
