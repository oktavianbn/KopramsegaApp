<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use HasFactory;

class Dokumen extends Model
{

    protected $table = 'dokumens';

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
