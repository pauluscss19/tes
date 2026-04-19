<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE job_applications 
            MODIFY COLUMN status ENUM(
                'PENDING',
                'REVIEWED',
                'SHORTLISTED',
                'INTERVIEW',
                'REJECTED',
                'OFFER'
            ) NOT NULL DEFAULT 'PENDING'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE job_applications 
            MODIFY COLUMN status ENUM(
                'PENDING',
                'SHORTLISTED',
                'REJECTED'
            ) NOT NULL DEFAULT 'PENDING'");
    }
};