<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->string('transkrip_pdf')->nullable()->after('portofolio_pdf');
            $table->string('ktp_pdf')->nullable()->after('transkrip_pdf');
            $table->string('surat_rekomendasi_pdf')->nullable()->after('ktp_pdf');
            $table->string('ktm_pdf')->nullable()->after('surat_rekomendasi_pdf');
        });
    }

    public function down(): void
    {
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'transkrip_pdf',
                'ktp_pdf',
                'surat_rekomendasi_pdf',
                'ktm_pdf',
            ]);
        });
    }
};