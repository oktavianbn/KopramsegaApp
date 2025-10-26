<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nis', 20)->unique()->nullable(); // Nomor induk siswa
            $table->string('nta', 50)->unique()->nullable(); // Nomor tanda anggota
            $table->string('nama', 100);
            $table->enum('kelas', ['X', 'XI', 'XII']); // contoh: X, XI, XII
            $table->enum('jurusan', ['AKL','MPLB', 'PM', 'ULP', 'DKV','RPL','BC']); // contoh: RPL, TKJ, DKV, dsb
            $table->enum('rombel',['1','2','3'])->nullable();
            $table->enum('jenis_kelamin', ['l', 'p']); // Laki-laki / Perempuan
            $table->foreignId('sangga_id')
                ->nullable()
                ->constrained('sangga')
                ->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
