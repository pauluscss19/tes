<?php

namespace App\Models;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPasswordContract
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    protected $table = 'users';
    protected $primaryKey = 'user_id';

    public $timestamps = true;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'notelp',
        'google_id',
        'status',
        'foto',
        'preferred_locale',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function sendPasswordResetNotification($token)
    {
        $url = env('FRONTEND_URL', 'http://localhost:5173')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($this->email);

        ResetPassword::createUrlUsing(fn() => $url);

        $this->notify(new ResetPassword($token));
    }

    public function internProfile()
    {
        return $this->hasOne(InternProfile::class, 'user_id', 'user_id');
    }

    public function companyProfile()
    {
        return $this->hasOne(CompanyProfile::class, 'user_id', 'user_id');
    }
}