<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stok extends Model
{
    protected $fillable = ['barang_id', 'spesifikasi_id', 'jumlah'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function spesifikasi()
    {
        return $this->belongsTo(Spesifikasi::class);
    }
}
