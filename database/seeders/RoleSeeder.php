<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
	public function run(): void
	{
		$roles = [
			'super admin',
			'kerani',
			'juru uang',
			'media publikasi',
			'inventaris',
			'usaha dana',
			'perkap',
		];
		foreach ($roles as $role) {
			Role::firstOrCreate(['name' => $role]);
		}
	}
}
