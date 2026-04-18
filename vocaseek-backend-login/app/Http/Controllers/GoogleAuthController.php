<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function handleTokenLogin(Request $request)
    {
        $request->validate(['access_token' => 'required|string']);

        try {
            $context = stream_context_create([
                'http' => [
                    'method'  => 'GET',
                    'header'  => 'Authorization: Bearer ' . $request->access_token . "\r\n" .
                                 'Accept: application/json' . "\r\n",
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

            if ($raw === false) {
                return response()->json(['status' => 'error', 'message' => 'FILE_GET_CONTENTS_FAILED'], 401);
            }

            $googleUser = json_decode($raw, true);

            if (empty($googleUser['sub'])) {
                return response()->json(['status' => 'error', 'message' => 'TOKEN_CHECK_FAILED', 'google_body' => $googleUser], 401);
            }

        } catch (\Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'EXCEPTION_CAUGHT', 'debug' => $e->getMessage()], 401);
        }

        $user = User::where('google_id', $googleUser['sub'])
            ->orWhere('email', $googleUser['email'])
            ->first();

        if (!$user) {
            $user = User::create([
                'nama'      => $googleUser['name'],
                'email'     => $googleUser['email'],
                'password'  => bcrypt(Str::random(32)),
                'role'      => 'intern',
                'google_id' => $googleUser['sub'],
                'notelp'    => '',
            ]);
            InternProfile::create([
                'user_id'             => $user->user_id,
                'is_profile_complete' => false,
            ]);
        } else {
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser['sub']]);
            }
        }

        $token = $user->createToken('google_auth_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login Google berhasil',
            'token'   => $token,
            'role'    => $user->role,
            'user'    => $user,
        ], 200);
    }
}