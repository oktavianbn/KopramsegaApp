<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjamen', function (Blueprint $table) {
            $table->id();
            // informasi admin
            $table->foreignId('pemberi')->nullable()->constrained('users');
            $table->foreignId('penerima')->nullable()->constrained('users');
            // informasi orang peminjam
            $table->string('nama_peminjam');
            $table->string('alamat');
            $table->string('no_telp');
            $table->string('asal');
            $table->string('foto_identitas');
            // informasi peminjaman
            $table->enum('jenis', ['pinjam', 'sewa']);
            $table->date('waktu_pinjam_mulai');
            $table->date('waktu_pinjam_selesai');
            $table->timestamp('waktu_kembali')->nullable();
            $table->enum('status', ['pending', 'disetujui', 'sudah_ambil', 'sudah_kembali', 'dibatalkan'])->default('pending');
            $table->boolean('tepat_waktu')->nullable();
            $table->string('foto_barang_diambil')->nullable();
            $table->string('foto_barang_kembali')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};
