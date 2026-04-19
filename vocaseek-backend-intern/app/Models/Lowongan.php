<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lowongan extends Model
{
    protected $table = 'lowongan'; // ✅ nama tabel asli, bukan lowongans

    protected $fillable = [
        'company_profile_id',
        'judul_posisi',
        'deskripsi_pekerjaan',
        'persyaratan',
        'lokasi',
        'tipe_magang',
        'gaji_per_bulan',
        'status',
    ];

    // Relasi ke CompanyProfile
    public function companyProfile()
    {
        return $this->belongsTo(CompanyProfile::class, 'company_profile_id');
    }
}