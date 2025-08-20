<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Keuangan extends Model
{
    protected $fillable = [
        'jumlah',
        'tipe',
        'jenis_pemasukkan',
        'catatan'
        ];
}
