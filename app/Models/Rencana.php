<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class Rencana extends Model
{
    protected $fillable = [
        'nama_rencana',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'role_id',
    ];

    // Define the relationship with Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
