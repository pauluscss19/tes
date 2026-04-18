<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    // Frontend kirim access_token Google → kita verifikasi → return Sanctum token
    public function handleTokenLogin(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        try {
            // Ambil data user dari Google pakai access_token
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->userFromToken($request->access_token);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token Google tidak valid atau sudah expired.',
            ], 401);
        }

        // Cari user berdasarkan google_id atau email
        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if (!$user) {
            // Auto-register jika belum ada akun
            $user = User::create([
                'nama'      => $googleUser->getName(),
                'email'     => $googleUser->getEmail(),
                'password'  => bcrypt(Str::random(32)),
                'role'      => 'intern',
                'google_id' => $googleUser->getId(),
                'notelp'    => '',
            ]);

            InternProfile::create([
                'user_id'             => $user->user_id,
                'is_profile_complete' => false,
            ]);
        } else {
            // Update google_id jika belum ada (login pakai email biasa sebelumnya)
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        }

        $token = $user->createToken('google_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login Google berhasil',
            'token'   => $token,
            'user'    => $user,
        ], 200);
    }
}