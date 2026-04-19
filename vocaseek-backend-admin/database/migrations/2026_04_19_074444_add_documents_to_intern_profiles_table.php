<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('intern_profiles', function (Blueprint $table) {
        if (!Schema::hasColumn('intern_profiles', 'transkrip_pdf')) {
            $table->string('transkrip_pdf')->nullable()->after('portofolio_pdf');
        }
        if (!Schema::hasColumn('intern_profiles', 'ktp_pdf')) {
            $table->string('ktp_pdf')->nullable()->after('transkrip_pdf');
        }
        if (!Schema::hasColumn('intern_profiles', 'surat_rekomendasi_pdf')) {
            $table->string('surat_rekomendasi_pdf')->nullable()->after('ktp_pdf');
        }
        if (!Schema::hasColumn('intern_profiles', 'ktm_pdf')) {
            $table->string('ktm_pdf')->nullable()->after('surat_rekomendasi_pdf');
        }
    });
}

public function down(): void
{
    Schema::table('intern_profiles', function (Blueprint $table) {
        $table->dropColumn(array_filter([
            Schema::hasColumn('intern_profiles', 'transkrip_pdf') ? 'transkrip_pdf' : null,
            Schema::hasColumn('intern_profiles', 'ktp_pdf') ? 'ktp_pdf' : null,
            Schema::hasColumn('intern_profiles', 'surat_rekomendasi_pdf') ? 'surat_rekomendasi_pdf' : null,
            Schema::hasColumn('intern_profiles', 'ktm_pdf') ? 'ktm_pdf' : null,
        ]));
    });
}
};
