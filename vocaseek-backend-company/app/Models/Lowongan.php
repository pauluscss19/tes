<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongan';

    protected $fillable = [
        'company_profile_id',
        'judul_posisi',           // ✅ sesuai DB (bukan judul_pekerjaan)
        'deskripsi_pekerjaan',
        'persyaratan',
        'lokasi',
        'tipe_magang',            // ✅ sesuai DB (bukan tipe_pekerjaan)
        'gaji_per_bulan',         // ✅ sesuai DB (bukan gaji_min/gaji_max)
        'status',                 // nilai: ACTIVE atau CLOSED
    ];

    public function companyProfile()
    {
        return $this->belongsTo(CompanyProfile::class, 'company_profile_id', 'id');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'job_id', 'id');
    }
}