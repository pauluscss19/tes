<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client;

class GoogleAuthController extends Controller
{
    public function handleTokenLogin(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        try {
            // ✅ FIX: bypass SSL untuk localhost Windows
            $http = new Client(['verify' => false]);

            $googleUser = Socialite::driver('google')
                ->stateless()
                ->setHttpClient($http)
                ->userFromToken($request->access_token);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token Google tidak valid.',
                'debug'   => $e->getMessage(),
            ], 401);
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if (!$user) {
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