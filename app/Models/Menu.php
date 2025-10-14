<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'nama',
        'sesi_id',
        'harga',
        'stok',
        'foto'
    ];

    // Relationships
    public function sesi()
    {
        return $this->belongsTo(Sesi::class);
    }
}
