<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiUsdan extends Model
{
    use HasFactory;

    protected $table = 'transaksi_usdan';

    protected $fillable = [
        'pelanggan_id',
        'sesi_penjualan_id',
        'diantar',
        'tujuan',
        'status',
        'total_harga',
        'catatan',
    ];

    protected $casts = [
        'diantar' => 'boolean',
        'total_harga' => 'decimal:2',
    ];

    // Relations
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'pelanggan_id');
    }

    public function sesiPenjualan()
    {
        return $this->belongsTo(Sesi::class, 'sesi_penjualan_id');
    }

    public function detail()
    {
        return $this->hasMany(DetailTransaksiUsdan::class, 'transaksi_usdan_id');
    }
}

