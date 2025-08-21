<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArsipSurat extends Model
{
    protected $fillable = [
        'judul_surat',
        'nomor_surat',
        'jenis',
        'pengirim',
        'penerima',
        'tanggal_surat',
        'keterangan',
        'file_path',
    ];
}
