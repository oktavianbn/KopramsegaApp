<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPeminjaman extends Model
{
    protected $table = 'detail_peminjamen';

    protected $fillable = [
        'peminjaman_id',
        'stok_id',
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

    // Helper method to get barang and spesifikasi through stok
    public function getBarangAttribute()
    {
        return $this->stok ? $this->stok->barang : null;
    }

    public function getSpesifikasiAttribute()
    {
        return $this->stok && $this->stok->spesifikasi ? $this->stok->spesifikasi : null;
    }
}
