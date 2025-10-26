<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailTransaksiUsdan extends Model
{
    protected $table = 'detail_transaksi_usdan';
    protected $fillable = ['transaksi_usdan_id', 'menu_id', 'jumlah', 'harga_satuan'];
}
