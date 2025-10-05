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
}
