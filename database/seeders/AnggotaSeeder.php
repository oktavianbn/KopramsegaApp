<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnggotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = base_path('public/data/anggota.csv');

        if (!file_exists($file)) {
            $this->command?->error("CSV file not found: {$file}");
            return;
        }

        if (($handle = fopen($file, 'r')) === false) {
            $this->command?->error("Unable to open CSV file: {$file}");
            return;
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            $this->command?->error('CSV appears empty or malformed.');
            fclose($handle);
            return;
        }

        $insertRows = [];
        $chunkSize = 500;

        while (($data = fgetcsv($handle)) !== false) {
            // skip empty lines
            if (count($data) === 1 && trim($data[0]) === '') {
                continue;
            }

            // map header -> value and normalize empty strings to null
            $row = array_combine($header, $data);
            foreach ($row as $k => $v) {
                $row[$k] = $v === '' ? null : $v;
            }

            // resolve sangga by name (case-insensitive LIKE). CSV stores the sangga name.
            $sanggaId = null;
            if (!empty($row['sangga_id'])) {
                $sanggaName = trim($row['sangga_id']);
                // use LOWER(...) LIKE ? for case-insensitive matching
                $sanggaId = DB::table('sangga')
                    ->whereRaw('LOWER(nama_sangga) LIKE ?', ['%' . strtolower($sanggaName) . '%'])
                    ->value('id');
            }

            $jenisKelamin = null;
            if (!empty($row['jenis_kelamin'])) {
                $j = strtolower($row['jenis_kelamin']);
                $jenisKelamin = in_array($j, ['l', 'p']) ? $j : null;
            }

            $insertRows[] = [
                'nis' => $row['nis'] ?? null,
                'nta' => $row['nta'] ?? null,
                'nama' => $row['nama'] ?? null,
                'kelas' => 'X',
                'jurusan' => $row['jurusan'] ?? null,
                'rombel' => $row['rombel'] ?? null,
                'jenis_kelamin' => $jenisKelamin,
                'sangga_id' => $sanggaId,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($insertRows) >= $chunkSize) {
                DB::table('siswa')->insert($insertRows);
                $insertRows = [];
            }
        }

        if (!empty($insertRows)) {
            DB::table('siswa')->insert($insertRows);
        }

        fclose($handle);
        $this->command?->info('Imported anggota from CSV.');
    }
}
