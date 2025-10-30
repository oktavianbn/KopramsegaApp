<?php

namespace Database\Seeders;

use App\Models\Sangga;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SanggaSeeder extends Seeder
{
    public function run(): void
    {
        $sanggas = [
            'Pendobrak 1',
            'Pendobrak 2',
            'Pendobrak 3',
            'Pendobrak 4',
            'Perintis 1',
            'Perintis 2',
            'Perintis 3',
            'Perintis 4',
            'Perintis 5',
            'Perintis 6',
            'Perintis 7',
            'Perintis 8',
            'Perintis 9',
            'Perintis 10',
            'Pencoba 1',
            'Pencoba 2',
            'Pencoba 3',
            'Pencoba 4',
            'Pencoba 5',
            'Pencoba 6',
            'Pencoba 7',
            'Pencoba 8',
            'Pencoba 9',
            'Pencoba 10',
            'Penegas 1',
            'Penegas 2',
            'Penegas 3',
            'Penegas 4',
            'Penegas 5',
            'Penegas 6',
            'Penegas 7',
            'Penegas 8',
            'Penegas 9',
            'Penegas 10',
            'Pelaksana 1',
            'Pelaksana 2',
            'Pelaksana 3',
            'Pelaksana 4',
            'Pelaksana 5',
            'Pelaksana 6',
            'Pelaksana 7',
            'Pelaksana 8',
            'Pelaksana 9',
            'Pelaksana 10'
        ];
        foreach ($sanggas as $sangga) {
            Sangga::firstOrCreate(['nama_sangga' => $sangga]);
        }
    }
}
