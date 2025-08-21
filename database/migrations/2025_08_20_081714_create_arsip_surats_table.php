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
        Schema::create('arsip_surats', function (Blueprint $table) {
            $table->id();
            $table->string('judul_surat');
            $table->string('nomor_surat')->unique();
            $table->enum('jenis', ['m', 'k']);
            // 'm' for masuk, 'k' for keluar
            $table->string('pengirim')->nullable();
            $table->string('penerima')->nullable();
            $table->date('tanggal_surat');
            $table->text('keterangan');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arsip_surats');
    }
};
