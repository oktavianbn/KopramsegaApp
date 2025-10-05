<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiBarang extends Model
{
    protected $table = 'transaksi_barang';
    protected $fillable = [
        'tipe', // 't' (tambah/masuk), 'k' (keluar/kurang)
        'barang_id',
        'spesifikasi_id',
        'jumlah',
        'keterangan',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function spesifikasi()
    {
        return $this->belongsTo(Spesifikasi::class);
    }
}
