<?php

namespace App\Http\Controllers;

use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InternController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        if (!$profile) return response()->json(['message' => 'Profil tidak ditemukan'], 404);

        $request->validate([
            'foto'           => 'nullable|image|mimes:jpg,jpeg,png|max:1024',
            'cv_pdf'         => 'nullable|mimes:pdf|max:2048',
            'portofolio_pdf' => 'nullable|mimes:pdf|max:2048',
            'tentang_saya'   => 'nullable|string|max:1500',
        ]);

        $updateData = $request->only([
            'tentang_saya', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
            'provinsi', 'kabupaten', 'detail_alamat', 'universitas', 'jurusan'
        ]);

        if ($request->hasFile('foto')) {
            if ($profile->foto) Storage::disk('public')->delete($profile->foto);
            $updateData['foto'] = $request->file('foto')->store('profiles/photos', 'public');
        }

        if ($request->hasFile('cv_pdf')) {
            if ($profile->cv_pdf) Storage::disk('public')->delete($profile->cv_pdf);
            $updateData['cv_pdf'] = $request->file('cv_pdf')->store('profiles/documents', 'public');
        }

        if ($request->hasFile('portofolio_pdf')) {
            if ($profile->portofolio_pdf) Storage::disk('public')->delete($profile->portofolio_pdf);
            $updateData['portofolio_pdf'] = $request->file('portofolio_pdf')->store('profiles/documents', 'public');
        }

        $profile->update($updateData);

        if ($profile->foto && $profile->cv_pdf && $profile->universitas) {
            $profile->update(['is_profile_complete' => true]);
        }

        return response()->json(['status' => 'success', 'message' => 'Profil diperbarui!', 'data' => $profile->fresh()]);
    }

    public function startTest()
    {
        $profile = InternProfile::where('user_id', Auth::id())->first();

        if ($profile->pretest_score > 0 || $profile->test_finished_at) {
            return response()->json(['status' => 'error', 'message' => 'Tes sudah selesai dilakukan.'], 403);
        }

        if (!$profile->test_started_at) {
            $profile->update(['test_started_at' => now()]);
        }

        return response()->json([
            'status' => 'success',
            'test_started_at' => $profile->test_started_at,
            'duration' => '15 minutes'
        ]);
    }

    public function submitPreTest(Request $request)
    {
        $request->validate(['skor' => 'required|integer|min:0|max:100']);
        $profile = InternProfile::where('user_id', Auth::id())->first();

        if ($profile->test_finished_at) {
            return response()->json(['status' => 'error', 'message' => 'Skor sudah ada.'], 403);
        }

        $profile->update([
            'pretest_score' => $request->skor,
            'test_finished_at' => now()
        ]);

        return response()->json(['status' => 'success', 'message' => 'Skor disimpan!', 'skor' => $profile->pretest_score]);
    }
}