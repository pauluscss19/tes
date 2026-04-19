<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: #fff;
                 border-radius: 8px; padding: 32px; }
    .btn { display: inline-block; background: #3267e3; color: #fff;
           padding: 12px 28px; border-radius: 6px; text-decoration: none;
           font-weight: bold; margin: 20px 0; }
    .footer { color: #9ca3af; font-size: 12px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Password</h2>
    <p>Halo <strong>{{ $nama }}</strong>,</p>
    <p>Kami menerima permintaan reset password untuk akun Vocaseek kamu.</p>
    <p>Klik tombol di bawah untuk membuat password baru. Tautan ini berlaku <strong>60 menit</strong>.</p>
    <a href="{{ $resetUrl }}" class="btn">Reset Password Sekarang</a>
    <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
    <div class="footer">
      <p>Tautan ini akan kedaluwarsa dalam 60 menit.</p>
      <p>© {{ date('Y') }} Vocaseek</p>
    </div>
  </div>
</body>
</html>