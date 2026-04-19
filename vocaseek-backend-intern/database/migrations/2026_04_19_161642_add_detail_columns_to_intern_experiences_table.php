<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('intern_experiences', function (Blueprint $table) {
        $table->string('jabatan')->nullable()->after('company');
        $table->string('jenis')->nullable()->after('jabatan');
        $table->string('tahun_mulai')->nullable()->after('jenis');
        $table->string('tahun_selesai')->nullable()->after('tahun_mulai');
        $table->text('deskripsi')->nullable()->after('tahun_selesai');
    });
}

public function down(): void
{
    Schema::table('intern_experiences', function (Blueprint $table) {
        $table->dropColumn(['jabatan', 'jenis', 'tahun_mulai', 'tahun_selesai', 'deskripsi']);
    });
}
};
