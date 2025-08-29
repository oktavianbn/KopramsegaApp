<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Peminjaman extends Model
{
    protected $table = 'peminjamen';

    protected $fillable = [
        'pemberi',
        'penerima',
        'nama_peminjam',
        'alamat',
        'no_telp',
        'asal',
        'foto_identitas',
        'jenis',
        'waktu_pinjam_mulai',
        'waktu_pinjam_selesai',
        'waktu_kembali',
        'status',
        'tepat_waktu',
        'foto_barang_diambil',
        'foto_barang_kembali'
    ];

    protected $casts = [
        'waktu_pinjam_mulai' => 'date',
        'waktu_pinjam_selesai' => 'date',
        'waktu_kembali' => 'datetime',
        'tepat_waktu' => 'boolean'
    ];

    // Relationships
    public function pemberiUser()
    {
        return $this->belongsTo(User::class, 'pemberi');
    }

    public function penerimaUser()
    {
        return $this->belongsTo(User::class, 'penerima');
    }

    public function detailPeminjaman()
    {
        return $this->hasMany(DetailPeminjaman::class);
    }

    // Helper methods
    public function getTotalBarangAttribute()
    {
        return $this->detailPeminjaman->sum('jumlah');
    }

    public function isLate()
    {
        if ($this->status === 'sudah_kembali' && $this->waktu_kembali) {
            return $this->waktu_kembali->gt(Carbon::parse($this->waktu_pinjam_selesai)->endOfDay());
        }
        return false;
    }
}
