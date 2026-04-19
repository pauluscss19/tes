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
    Schema::table('intern_certifications', function (Blueprint $table) {
        $table->string('penerbit')->nullable()->after('name');
        $table->string('tahun')->nullable()->after('penerbit');
        $table->string('nomor_sertifikat')->nullable()->after('tahun');
        $table->string('url_kredensial')->nullable()->after('nomor_sertifikat');
    });
}

public function down(): void
{
    Schema::table('intern_certifications', function (Blueprint $table) {
        $table->dropColumn(['penerbit', 'tahun', 'nomor_sertifikat', 'url_kredensial']);
    });
}};
