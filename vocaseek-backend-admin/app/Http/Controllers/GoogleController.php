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

        Log::info('Redirecting to Google OAuth.', [
            'redirect_url' => $redirectUrl,
            'app_url' => config('app.url'),
        ]);

        return Socialite::driver('google')
            ->redirectUrl($redirectUrl)
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl($this->getGoogleRedirectUrl())
                ->stateless()
                ->user();

            $user = $this->findOrCreateGoogleUser($googleUser);
            Auth::login($user);
            request()->session()->regenerate();

            return redirect()->intended(route('dashboard'));

        } catch (\Exception $e) {
            DB::rollback();
            $message = config('app.debug') ? $e->getMessage() : 'Login Google gagal.';

            Log::error('Google login failed.', [
                'message' => $e->getMessage(),
                'redirect_url' => $this->getGoogleRedirectUrl(),
            ]);

            return redirect()->route('login')->withErrors([
                'google' => $message,
            ]);
        }
    }

    public function loginWithGoogleToken(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        try {
            $context = stream_context_create([
                'http' => [
                    'method'  => 'GET',
                    'header'  => "Authorization: Bearer {$request->access_token}\r\n" .
                                 "Accept: application/json\r\n",
                    'timeout' => 10,
                ],
                'ssl' => [
                    'verify_peer'      => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $raw = @file_get_contents(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                false,
                $context
            );

            if (!$raw) {
                throw new \Exception('Tidak bisa konek ke Google API.');
            }

            $googleData = json_decode($raw, true);

            if (empty($googleData['sub'])) {
                throw new \Exception('Token Google tidak valid: ' . json_encode($googleData));
            }

            $googleUser = new class($googleData) {
                public function __construct(private array $data) {}
                public function getName()  { return $this->data['name']  ?? ''; }
                public function getEmail() { return $this->data['email'] ?? ''; }
                public function getId()    { return $this->data['sub']   ?? ''; }
            };

            $user  = $this->findOrCreateGoogleUser($googleUser);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'Login Google berhasil.',
                'token'   => $token,
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

    private function findOrCreateGoogleUser(object $googleUser): User
    {
        return DB::transaction(function () use ($googleUser) {
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'nama'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'role'      => 'intern',
                    'password'  => bcrypt(Str::random(16)),
                    'notelp'    => '-',
                ]);

                InternProfile::create([
                    'user_id'             => $user->user_id,
                    'is_profile_complete' => false,
                ]);
            } elseif (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                ]);
            }

            return $user;
        });
    }
}