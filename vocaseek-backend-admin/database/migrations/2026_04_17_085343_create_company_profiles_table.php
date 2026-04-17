<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('nama_perusahaan')->nullable();
            $table->string('industri')->nullable();
            $table->string('ukuran_perusahaan')->nullable();
            $table->string('website_url')->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('notelp')->nullable();
            $table->string('alamat_kantor_pusat')->nullable();
            $table->string('nib')->nullable();
            $table->string('logo_perusahaan')->nullable();
            $table->string('banner_perusahaan')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('loa_pdf')->nullable();
            $table->string('akta_pdf')->nullable();
            $table->enum('status_mitra', ['active', 'nonaktif', 'pending'])->default('pending');
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_profiles');
    }
};