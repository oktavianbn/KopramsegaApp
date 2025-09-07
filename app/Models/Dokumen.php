<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    protected $fillable = [
        'nama',
        'tanggal_dokumen',
        'keterangan',
        'file',
    ];

    protected $casts = [
        'file' => 'array',
    ];
}
