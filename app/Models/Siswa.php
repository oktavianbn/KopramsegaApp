<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'nis',
        'nta',
        'nama',
        'kelas',
        'jurusan',
        'rombel',
        'jenis_kelamin',
        'sangga_id',
    ];

    public function sangga()
    {
        return $this->belongsTo(Sangga::class);
    }

    public function kehadiran()
    {
        return $this->hasMany(Kehadiran::class);
    }
}
