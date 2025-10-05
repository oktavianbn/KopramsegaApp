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
        Schema::create('transaksi_barang', function (Blueprint $table) {
            $table->id();
            $table->enum('tipe',['t','k']);
            $table->foreignId('barang_id')->nullable()->after('peminjaman_id')->constrained('barangs')->onDelete('set null');
            $table->foreignId('spesifikasi_id')->nullable()->after('barang_id')->constrained('spesifikasis')->onDelete('set null');
            $table->decimal('jumlah',10,2);
            $table->string('keterangan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_barang');
    }
};
