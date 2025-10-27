<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kehadiran extends Model
{
    use HasFactory;

    protected $table = 'kehadiran';

    protected $fillable = [
        'siswa_id',
        'tanggal',
        'status',
        'keterangan',
        'dicatat_oleh',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
