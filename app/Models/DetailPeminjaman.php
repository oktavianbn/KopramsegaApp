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
        // Get peminjaman_id
        $peminjamanId = $this->peminjaman_id;
        $barangId = $this->barang_id;
        $spesifikasiId = $this->spesifikasi_id;

        // Get sum of keluar for this detail's barang+spesifikasi in this peminjaman
        $jumlahKeluar = \App\Models\TransaksiBarang::where('peminjaman_id', $peminjamanId)
            ->where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })
            ->where('tipe', 'k')
            ->sum('jumlah');

        // Get sum of masuk (returns) for this detail's barang+spesifikasi in this peminjaman
        $jumlahMasuk = \App\Models\TransaksiBarang::where('peminjaman_id', $peminjamanId)
            ->where('barang_id', $barangId)
            ->when($spesifikasiId, function ($q) use ($spesifikasiId) {
                $q->where('spesifikasi_id', $spesifikasiId);
            }, function ($q) {
                $q->whereNull('spesifikasi_id');
            })
            ->where('tipe', 't')
            ->sum('jumlah');

        // Hilang = keluar - masuk
        $hilang = $jumlahKeluar - $jumlahMasuk;
        return $hilang < 0 ? 0 : $hilang;
    }
}
