<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $fillable = ['nama', 'deskripsi', 'foto'];

    public function spesifikasi()
    {
        return $this->hasMany(Spesifikasi::class);
    }
}
