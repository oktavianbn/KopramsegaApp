<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = fopen(public_path('data/akun.csv'), 'r');

        // Skip the header row
        fgetcsv($csvFile);

        while (($data = fgetcsv($csvFile)) !== false) {
            User::create([
                'name' => $data[0],
                'email' => $data[2],
                'password' => Hash::make('kopramsega'),
                'role_id' => null,
                'aktif' => true,
                'email_verified_at' => now(),
            ]);
        }

        fclose($csvFile);
    }
}
