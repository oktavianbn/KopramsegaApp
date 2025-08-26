<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spesifikasi extends Model
{
    protected $fillable = ['barang_id', 'key', 'value', 'description'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
