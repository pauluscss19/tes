<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdminProfileController extends Controller
{
    /**
     * 1. GET DATA PROFIL
     */
    public function show()
    {
        $user = auth()->user();

        return response()->json([
            'status'        => 'success',
            'nama'          => $user->nama,
            'name'          => $user->nama,
            'full_name'     => $user->nama,
            'email'         => $user->email,
            'email_address' => $user->email,
            'role'          => $user->role,
            'data'          => [
                'nama'          => $user->nama,
                'name'          => $user->nama,
                'full_name'     => $user->nama,
                'email'         => $user->email,
                'email_address' => $user->email,
                'notelp'        => $user->notelp,
                'id_karyawan'   => 'VK-2024-' . str_pad($user->user_id, 3, '0', STR_PAD_LEFT),
                'role_name'     => $user->role === 'super_admin' ? 'Master Admin Platform' : 'Staff Admin Platform',
                'foto'          => $user->foto
                    ? Storage::disk('public')->url($user->foto)
                    : null,
                'terdaftar_sejak'   => optional($user->created_at)->format('M Y') ?? 'N/A',
                'riwayat_aktivitas' => [
                    ['pesan' => 'Login Berhasil', 'waktu' => now()->format('H:i \W\I\B')],
                    ['pesan' => 'Memperbarui Pengguna: J. Doe', 'waktu' => 'Kemarin, 14:20 WIB'],
                ],
            ],
        ]);
    }

    /**
     * 2. UPDATE DATA PROFIL + FOTO
     */
    public function update(Request $request)
    {
        // DEBUG — cek apakah file sampai ke backend
        Log::info('=== UPDATE PROFILE DEBUG ===');
        Log::info('FILES:', $request->allFiles());
        Log::info('INPUT:', $request->except(['foto']));
        Log::info('HAS FILE foto:', [$request->hasFile('foto')]);
        Log::info('Content-Type:', [$request->header('Content-Type')]);

        $user = auth()->user();

        $request->validate([
            'nama'   => 'required|string|max:255',
            'email'  => 'nullable|email|unique:users,email,' . $user->user_id . ',user_id',
            'notelp' => 'required|string',
            'foto'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $updateData = $request->only(['nama', 'email', 'notelp']);

        // Upload foto baru jika ada
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $updateData['foto'] = $request->file('foto')->store('profiles/admin', 'public');
            Log::info('FOTO TERSIMPAN:', [$updateData['foto']]);
        } else {
            Log::warning('FOTO TIDAK DITERIMA — hasFile() = false');
        }

        $user->update($updateData);
        $user->refresh();

        return response()->json([
            'status'  => 'success',
            'message' => 'Data profil berhasil disimpan!',
            'data'    => [
                'nama'   => $user->nama,
                'email'  => $user->email,
                'notelp' => $user->notelp,
                'foto'   => $user->foto
                    ? Storage::disk('public')->url($user->foto)
                    : null,
            ],
        ]);
    }

    /**
     * 3. GANTI PASSWORD
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        auth()->user()->update([
            'password' => bcrypt($request->password),
        ]);

        return response()->json(['message' => 'Kata sandi berhasil diperbarui!']);
    }
}