<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $primaryKey = 'application_id'; // ✅ wajib ada

    protected $fillable = [
        'user_id',
        'job_id',
        'motivation',
        'status',
    ];

    // ✅ Relasi ke tabel lowongans
    public function lowongan()
    {
        return $this->belongsTo(Lowongan::class, 'job_id', 'id');
    }
}