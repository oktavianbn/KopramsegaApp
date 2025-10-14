<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sesi extends Model
{
    protected $table = 'sesi_penjualan';
    // allow mass assignment for deskripsi and tanggal fields
    protected $fillable = ['nama', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'ditutup'];

    // Casts for convenience
    protected $casts = [
        'ditutup' => 'boolean',
        'tanggal_mulai' => 'datetime:Y-m-d',
        'tanggal_selesai' => 'datetime:Y-m-d',
    ];

    /**
     * Menus that belong to this sesi
     */
    public function menus()
    {
        return $this->hasMany(Menu::class, 'sesi_id');
    }
}
