<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'success',
                'message' => 'Jika email terdaftar, link reset password telah dikirim.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token'      => Hash::make($token),
                'created_at' => Carbon::now(),
            ]
        );

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetUrl    = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($request->email);

        try {
            Mail::to($user->email)->send(
                new ResetPasswordMail($resetUrl, $user->nama ?? 'Pengguna')
            );
        } catch (\Throwable $e) {
            Log::error('Mail gagal dikirim: ' . $e->getMessage());

            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengirim email: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Jika email terdaftar, link reset password telah dikirim.',
        ]);
    }

    public function validateToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'valid'   => false,
                'message' => 'Token tidak ditemukan.',
            ], 404);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'valid'   => false,
                'message' => 'Token sudah kedaluwarsa. Minta link baru.',
            ], 410);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'valid'   => false,
                'message' => 'Token tidak valid.',
            ], 400);
        }

        return response()->json(['valid' => true]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Token tidak ditemukan.',
            ], 404);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'message' => 'Token tidak valid.',
            ], 400);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Token sudah kedaluwarsa. Silakan minta link baru.',
            ], 410);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Password berhasil direset. Silakan login kembali.',
        ]);
    }
}