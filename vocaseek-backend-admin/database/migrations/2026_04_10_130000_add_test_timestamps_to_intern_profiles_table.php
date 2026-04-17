<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tambah skor_pretest jika belum ada
        Schema::whenTableDoesntHaveColumn('intern_profiles', 'skor_pretest', function (Blueprint $table) {
            $table->integer('skor_pretest')->nullable();
        });

        // Tambah timestamp columns
        Schema::whenTableDoesntHaveColumn('intern_profiles', 'test_started_at', function (Blueprint $table) {
            $table->timestamp('test_started_at')->nullable();
        });

        Schema::whenTableDoesntHaveColumn('intern_profiles', 'test_finished_at', function (Blueprint $table) {
            $table->timestamp('test_finished_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::whenTableHasColumn('intern_profiles', 'test_started_at', function (Blueprint $table) {
            $table->dropColumn('test_started_at');
        });

        Schema::whenTableHasColumn('intern_profiles', 'test_finished_at', function (Blueprint $table) {
            $table->dropColumn('test_finished_at');
        });
    }
};