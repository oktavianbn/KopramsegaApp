<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiUsdan extends Model
{
    use HasFactory;

    protected $table = 'transaksi_usdan';

    protected $fillable = [
        'nama',
        'no_telp',
        'diantar',
        'tujuan',
        'status',
        'total_harga',
        'catatan',
    ];
}
