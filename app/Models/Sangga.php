<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sangga extends Model
{
    protected $table = 'sangga';

    protected $fillable = [
        'logo_path',
        'nama_sangga',
    ];
}
