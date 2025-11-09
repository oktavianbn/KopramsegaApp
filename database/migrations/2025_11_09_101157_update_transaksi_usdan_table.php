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
        Schema::table('transaksi_usdan', function (Blueprint $table) {
            // Drop foreign key if exists
            if (Schema::hasColumn('transaksi_usdan', 'pelanggan_id')) {
                $table->dropForeign(['pelanggan_id']);
                $table->dropColumn('pelanggan_id');
            }

            // Add new columns if not exists
            if (!Schema::hasColumn('transaksi_usdan', 'nama_pelanggan')) {
                $table->string('nama_pelanggan')->after('id');
            }
            if (!Schema::hasColumn('transaksi_usdan', 'nomor_telepon')) {
                $table->string('nomor_telepon')->after('nama_pelanggan');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaksi_usdan', function (Blueprint $table) {
            $table->unsignedBigInteger('pelanggan_id')->after('id');
            $table->foreign('pelanggan_id')->references('id')->on('pelanggan')->onDelete('cascade');
            $table->dropColumn('nama_pelanggan');
            $table->dropColumn('nomor_telepon');
        });
    }
};
