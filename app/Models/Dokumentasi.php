<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumentasi extends Model
{
    protected $fillable = [
        'judul',
        'links',
        'kameramen',
        'keterangan',
    ];

    protected $casts = [
        'links' => 'array', // Cast JSON ke array
    ];
}
