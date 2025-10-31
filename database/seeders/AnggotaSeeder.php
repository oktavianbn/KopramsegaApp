<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Sangga;
use App\Models\Siswa;
use Carbon\Carbon;

class AnggotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = public_path('/data/anggotaplain.csv');

        if (!file_exists($csvFile)) {
            $this->command->error("File CSV tidak ditemukan: {$csvFile}");
            return;
        }

        $file = fopen($csvFile, 'r');

        // Skip header row
        fgetcsv($file, 0, ';');

        $chunk = [];
        $chunkSize = 100;
        $processedCount = 0;

        while (($row = fgetcsv($file, 0, ';')) !== false) {
            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }

            $chunk[] = [
                'nama' => trim($row[0] ?? ''),
                'jurusan' => trim($row[1] ?? ''),
                'rombel' => !empty(trim($row[2] ?? '')) ? trim($row[2]) : null,
                'jenis_kelamin' => strtolower(trim($row[3] ?? '')),
                'sangga_nama' => trim($row[4] ?? ''),
            ];

            // Process chunk when it reaches the chunk size
            if (count($chunk) >= $chunkSize) {
                $this->processChunk($chunk);
                $processedCount += count($chunk);
                $this->command->info("Diproses: {$processedCount} data");
                $chunk = [];
            }
        }

        // Process remaining data
        if (!empty($chunk)) {
            $this->processChunk($chunk);
            $processedCount += count($chunk);
        }

        fclose($file);

        $this->command->info("Selesai! Total data yang diproses: {$processedCount}");
    }

    private function processChunk(array $chunk): void
    {
        $now = Carbon::now();

        foreach ($chunk as $data) {
            // Cari sangga_id berdasarkan nama menggunakan LIKE
            $sanggaId = null;
            if (!empty($data['sangga_nama'])) {
                $sangga = Sangga::where('nama_sangga', 'LIKE', '%' . $data['sangga_nama'] . '%')->first();
                $sanggaId = $sangga?->id;
            }

            // Insert atau update data siswa menggunakan firstOrCreate
            Siswa::firstOrCreate(
                [
                    'nama' => $data['nama'],
                    'kelas' => 'X',
                    'jurusan' => $data['jurusan'],
                ],
                [
                    'nis' => null,
                    'nta' => null,
                    'rombel' => $data['rombel'],
                    'jenis_kelamin' => $data['jenis_kelamin'],
                    'sangga_id' => $sanggaId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}