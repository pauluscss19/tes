<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        $redirectUrl = $this->getGoogleRedirectUrl();
        Log::info('Redirecting to Google OAuth.', ['redirect_url' => $redirectUrl]);
        return Socialite::driver('google')->redirectUrl($redirectUrl)->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->redirectUrl($this->getGoogleRedirectUrl())->stateless()->user();
            $user = $this->findOrCreateGoogleUser($googleUser);
            Auth::login($user);
            request()->session()->regenerate();
            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            DB::rollback();
            $message = config('app.debug') ? $e->getMessage() : 'Login Google gagal.';
            Log::error('Google login failed.', ['message' => $e->getMessage()]);
            return redirect()->route('login')->withErrors(['google' => $message]);
        }
    }

    public function loginWithGoogleToken(Request $request)
    {
        $request->validate(['access_token' => 'required|string']);

        try {
            $context = stream_context_create([
                'http' => [
                    'method'  => 'GET',
                    'header'  => 'Authorization: Bearer ' . $request->access_token . "\r\nAccept: application/json\r\n",
                    'timeout' => 10,
                ],
                'ssl' => [
                    'verify_peer'      => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $raw = @file_get_contents('https://www.googleapis.com/oauth2/v3/userinfo', false, $context);

            if (!$raw) {
                throw new \Exception('Tidak bisa konek ke Google API.');
            }

            $g = json_decode($raw, true);

            if (empty($g['sub'])) {
                throw new \Exception('Token tidak valid: ' . json_encode($g));
            }

            $user = User::where('email', $g['email'])->first();

            if (!$user) {
                $user = User::create([
                    'nama'      => $g['name']  ?? '',
                    'email'     => $g['email'] ?? '',
                    'google_id' => $g['sub']   ?? '',
                    'role'      => 'intern',
                    'password'  => bcrypt(Str::random(16)),
                    'notelp'    => '-',
                ]);
                InternProfile::create([
                    'user_id'             => $user->user_id,
                    'is_profile_complete' => false,
                ]);
            } elseif (!$user->google_id) {
                $user->update(['google_id' => $g['sub']]);
            }

            return response()->json([
                'status'  => 'success',
                'message' => 'Login Google berhasil.',
                'token'   => $user->createToken('auth_token')->plainTextToken,
                'role'    => $user->role,
                'user'    => [
                    'user_id'   => $user->user_id,
                    'nama'      => $user->nama,
                    'email'     => $user->email,
                    'google_id' => $user->google_id,
                ],
            ]);

        } catch (\Throwable $e) {
            Log::error('Google token login failed.', ['message' => $e->getMessage()]);
            return response()->json([
                'status'  => 'error',
                'message' => 'Google token tidak valid atau login Google gagal.',
                'debug'   => $e->getMessage(),
            ], 401);
        }
    }

    private function getGoogleRedirectUrl(): string
    {
        return config('services.google.redirect')
            ?: rtrim(config('app.url'), '/') . '/api/auth/google/callback';
    }
}
