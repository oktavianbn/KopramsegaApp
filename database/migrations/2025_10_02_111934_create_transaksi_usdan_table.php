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
        Schema::create('transaksi_usdan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelanggan_id')->constrained('pelanggan')->onDelete('cascade');
            $table->foreignId('sesi_penjualan_id')->constrained('sesi_penjualan')->onDelete('cascade');
            $table->boolean('diantar')->nullable()->default(false);
            $table->string('tujuan');
            $table->enum('status', ['verifikasi', 'proses','sudah_siap', 'sudah_ambil', 'dibatalkan'])->default('verifikasi');
            $table->decimal('total_harga', 10, 2);
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_usdan');
    }
};
