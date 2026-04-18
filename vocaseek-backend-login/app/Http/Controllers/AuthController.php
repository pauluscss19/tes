<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\InternProfile;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nama'     => 'required|string|max:100',
            'email'    => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:intern,company',
            'notelp'   => 'required|string|max:20',
            'nib'      => 'required_if:role,company|string',
            'loa_pdf'  => 'required_if:role,company|mimes:pdf|max:2048',
            'akta_pdf' => 'required_if:role,company|mimes:pdf|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'nama'     => $request->nama,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
                'notelp'   => $request->notelp,
            ]);

            if ($user->role === 'intern') {
                InternProfile::create([
                    'user_id'             => $user->user_id,
                    'is_profile_complete' => false,
                ]);
            } elseif ($user->role === 'company') {
                $loaPath  = $request->file('loa_pdf')->store('documents/loa', 'public');
                $aktaPath = $request->file('akta_pdf')->store('documents/akta', 'public');

                CompanyProfile::create([
                    'user_id'         => $user->user_id,
                    'nama_perusahaan' => $request->nama_perusahaan ?? $request->nama,
                    'notelp'          => $request->notelp,
                    'nib'             => $request->nib,
                    'loa_pdf'         => $loaPath,
                    'akta_pdf'        => $aktaPath,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Registrasi berhasil!'], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Gagal: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user  = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login berhasil',
                'token'   => $token,
                'user'    => $user,
            ], 200);
        }

        return response()->json(['message' => 'Email atau password salah.'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout'], 200);
    }

    // ─── LUPA PASSWORD ────────────────────────────────────────────

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Link reset password telah dikirim ke email Anda.',
                ], 200);
            }

            return response()->json([
                'message' => 'Email tidak ditemukan.',
            ], 422);

        } catch (\Throwable $e) {
            Log::error('ForgotPassword Error: ' . $e->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => 'Email reset password gagal dikirim.',
                'debug'   => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                 => 'required',
            'email'                 => 'required|email',
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->setRememberToken(Str::random(60));

                    $user->save();
                    event(new PasswordReset($user));
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'Password berhasil direset.',
                ], 200);
            }

            return response()->json([
                'message' => 'Token tidak valid atau sudah expired.',
            ], 422);

        } catch (\Throwable $e) {
            Log::error('ResetPassword Error: ' . $e->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal reset password.',
                'debug'   => $e->getMessage(),
            ], 500);
        }
    }
}