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
    Schema::table('lowongan', function (Blueprint $table) {
        // Hapus kolom lama
        $table->dropColumn(['judul_posisi', 'tipe_magang', 'gaji_per_bulan']);
    });

    Schema::table('lowongan', function (Blueprint $table) {
        // Tambah semua kolom baru (Schema::table tidak bisa drop+add sekaligus)
        $table->string('judul_pekerjaan')->after('company_profile_id');
        $table->string('kategori_pekerjaan')->after('judul_pekerjaan');
        $table->string('tipe_pekerjaan')->after('kategori_pekerjaan');
        $table->string('pengaturan_kerja')->after('lokasi');
        $table->decimal('gaji_min', 15, 2)->nullable()->after('pengaturan_kerja');
        $table->decimal('gaji_max', 15, 2)->nullable()->after('gaji_min');
       $table->date('tgl_tutup_lamaran')->nullable()->after('gaji_max');
$table->date('tgl_mulai_kerja')->nullable()->after('tgl_tutup_lamaran');

        // Ubah ENUM status: ACTIVE → OPEN, tambah DRAFT
        $table->enum('status', ['OPEN', 'CLOSED', 'DRAFT'])
              ->default('OPEN')->change();
    });
}

public function down(): void
{
    Schema::table('lowongan', function (Blueprint $table) {
        $table->dropColumn([
            'judul_pekerjaan', 'kategori_pekerjaan', 'tipe_pekerjaan',
            'pengaturan_kerja', 'gaji_min', 'gaji_max',
            'tgl_tutup_lamaran', 'tgl_mulai_kerja'
        ]);
    });

    Schema::table('lowongan', function (Blueprint $table) {
        $table->string('judul_posisi')->after('company_profile_id');
        $table->string('tipe_magang')->after('lokasi');
        $table->string('gaji_per_bulan')->nullable()->after('tipe_magang');
        $table->enum('status', ['ACTIVE', 'CLOSED'])->default('ACTIVE')->change();
    });

}
};
