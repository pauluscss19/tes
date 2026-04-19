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
        'judul_pekerjaan',
        'kategori_pekerjaan',
        'tipe_pekerjaan',
        'deskripsi_pekerjaan',
        'persyaratan',
        'lokasi',
        'pengaturan_kerja',
        'gaji_min',
        'gaji_max',
        'tgl_tutup_lamaran',
        'tgl_mulai_kerja',
        'status',
    ];

    protected $casts = [
        'gaji_min'          => 'decimal:2',
        'gaji_max'          => 'decimal:2',
        'tgl_tutup_lamaran' => 'date',
        'tgl_mulai_kerja'   => 'date',
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