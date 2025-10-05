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
        // Users
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'super admin',
            ],
            [
                'name' => 'Kerani',
                'email' => 'kerani@example.com',
                'password' => Hash::make('password'),
                'role' => 'kerani',
            ],
            [
                'name' => 'Juru Uang',
                'email' => 'juruuang@example.com',
                'password' => Hash::make('password'),
                'role' => 'juru uang',
            ],
            [
                'name' => 'Media Publikasi',
                'email' => 'mediapublikasi@example.com',
                'password' => Hash::make('password'),
                'role' => 'media publikasi',
            ],
            [
                'name' => 'Inventaris',
                'email' => 'inventaris@example.com',
                'password' => Hash::make('password'),
                'role' => 'inventaris',
            ],
            [
                'name' => 'Usaha Dana',
                'email' => 'usahadana@example.com',
                'password' => Hash::make('password'),
                'role' => 'usaha dana',
            ],
            [
                'name' => 'Perkap',
                'email' => 'perkap@example.com',
                'password' => Hash::make('password'),
                'role' => 'perkap',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate([
                'email' => $userData['email']
            ], [
                'name' => $userData['name'],
                'password' => $userData['password'],
            ]);
            // Pastikan role sudah ada sebelum assign
            if (Role::where('name', $userData['role'])->exists()) {
                $user->assignRole($userData['role']);
            }
        }
    }
}
