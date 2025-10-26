<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPeminjaman extends Model
{
    protected $table = 'detail_peminjamen';

    protected $fillable = [
        'peminjaman_id',
        'barang_id',
        'spesifikasi_id',
        'jumlah',
        'jumlah_kembali'
    ];

    // Append calculated attributes to model JSON
    protected $appends = ['jumlah_hilang'];

    // Relationships
    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }

    public function stok()
    {
        return $this->belongsTo(Stok::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function spesifikasi()
    {
        return $this->belongsTo(Spesifikasi::class);
    }

    // Helper method to get barang and spesifikasi through stok
    public function getBarangAttribute()
    {
        if ($this->barang) return $this->barang;
        return $this->stok ? $this->stok->barang : null;
    }

    public function getSpesifikasiAttribute()
    {
        if ($this->spesifikasi) return $this->spesifikasi;
        return $this->stok && $this->stok->spesifikasi ? $this->stok->spesifikasi : null;
    }

    /**
     * Calculate jumlah hilang dari transaksi barang yang terkait
     * Hilang = jumlah keluar (k) - jumlah masuk (t) untuk peminjaman ini
     */
    public function getJumlahHilangAttribute()
    {
        // Only calculate 'hilang' after the peminjaman has been marked returned.
        // If peminjaman not loaded, try to load it to check status.
        if (! $this->relationLoaded('peminjaman')) {
            $this->load('peminjaman');
        }

        // If the peminjaman hasn't been completed (returned), don't show any hilang.
        if (! $this->peminjaman || $this->peminjaman->status !== 'sudah_kembali') {
            return 0;
        }

        // Prefer the stored jumlah_kembali on the detail record, if available.
        $jumlahDipinjam = $this->jumlah ?? 0;
        $jumlahKembali = $this->jumlah_kembali;

        if (is_null($jumlahKembali)) {
            // Fallback: sum transaksi masuk (t) for this peminjaman+item
            $peminjamanId = $this->peminjaman_id;
            $barangId = $this->barang_id;
            $spesifikasiId = $this->spesifikasi_id;

            $jumlahKembali = TransaksiBarang::where('peminjaman_id', $peminjamanId)
                ->where('barang_id', $barangId)
                ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                    $q->where('spesifikasi_id', $spesifikasiId);
                }, function ($q) {
                    $q->whereNull('spesifikasi_id');
                })
                ->where('tipe', 't')
                ->sum('jumlah');
        }

        $hilang = $jumlahDipinjam - ($jumlahKembali ?? 0);
        return $hilang < 0 ? 0 : $hilang;
    }
}
