<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;
    public string $nama;

    public function __construct(string $resetUrl, string $nama = 'Pengguna')
    {
        $this->resetUrl = $resetUrl;
        $this->nama     = $nama;
    }

    public function build(): static
    {
        return $this->subject('Reset Password Vocaseek')
                    ->view('emails.reset-password');
    }
}