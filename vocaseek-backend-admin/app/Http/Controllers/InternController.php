<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\InternProfile;
use App\Models\JobApplication;
use App\Models\TestAnswer;
use App\Models\InternExperience;
use App\Models\InternCertification;
use App\Models\Lowongan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InternController extends Controller
{
    public function getTestQuestions()
    {
        $user = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        if (!$profile || (int) $profile->is_profile_complete === 0) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lengkapi profil dulu sebelum mengakses pre-test.',
            ], 403);
        }

        if ($profile->test_finished_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pre-test hanya dapat dikerjakan satu kali.',
                'data'    => [
                    'already_completed' => true,
                    'test_started_at'   => $profile->test_started_at,
                    'test_finished_at'  => $profile->test_finished_at,
                ],
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'questions'       => $this->pretestQuestions(),
                'duration_minutes'=> $this->pretestDurationMinutes(),
                'total_questions' => count($this->pretestQuestions()),
                'already_started' => (bool) $profile->test_started_at,
                'test_started_at' => $profile->test_started_at,
                'expires_at'      => $this->expiresAt($profile),
            ],
        ]);
    }

    /**
     * Ambil Data Profil Lengkap
     */
    public function getProfile()
    {
        $user    = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $experiences    = InternExperience::where('user_id', $user->user_id)->get();
        $certifications = InternCertification::where('user_id', $user->user_id)->get();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'nama'               => $user->nama,
                'email'              => $user->email,
                'notelp'             => $profile->notelp,
                'universitas'        => $profile->universitas,
                'jurusan'            => $profile->jurusan,
                'jenjang'            => $profile->jenjang,
                'ipk'                => $profile->ipk,
                'tahun_masuk'        => $profile->tahun_masuk,
                'tahun_lulus'        => $profile->tahun_lulus,
                'provinsi'           => $profile->provinsi,
                'kabupaten'          => $profile->kabupaten,
                'detail_alamat'      => $profile->detail_alamat,
                'tempat_lahir'       => $profile->tempat_lahir,
                'tanggal_lahir'      => $profile->tanggal_lahir,
                'jenis_kelamin'      => $profile->jenis_kelamin,
                'tentang_saya'       => $profile->tentang_saya,
                'instagram'          => $profile->instagram,
                'linkedin'           => $profile->linkedin,
                'foto'               => $profile->foto
                                            ? asset('storage/' . $profile->foto)
                                            : null,
                // ── Dokumen ──────────────────────────────────────────────────
                'cv'                 => $profile->cv_pdf
                                            ? asset('storage/' . $profile->cv_pdf)
                                            : null,
                'portofolio'         => $profile->portofolio_pdf
                                            ? asset('storage/' . $profile->portofolio_pdf)
                                            : null,
                'transkrip'          => $profile->transkrip_pdf
                                            ? asset('storage/' . $profile->transkrip_pdf)
                                            : null,
                'ktp'                => $profile->ktp_pdf
                                            ? asset('storage/' . $profile->ktp_pdf)
                                            : null,
                'surat_rekomendasi'  => $profile->surat_rekomendasi_pdf
                                            ? asset('storage/' . $profile->surat_rekomendasi_pdf)
                                            : null,
                'ktm'                => $profile->ktm_pdf
                                            ? asset('storage/' . $profile->ktm_pdf)
                                            : null,
                // ── Lainnya ───────────────────────────────────────────────────
                'is_complete'        => (int) $profile->is_profile_complete,
                'pengalaman'         => $experiences,
                'sertifikasi'        => $certifications,
            ],
        ]);
    }

    /**
     * Update Profile Utama
     */
    public function updateProfile(Request $request)
    {
        $user    = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        $request->validate([
            'foto'                  => 'nullable|image|max:2048',
            'cv_pdf'                => 'nullable|mimes:pdf|max:5120',
            'portofolio_pdf'        => 'nullable|mimes:pdf|max:5120',
            'transkrip_pdf'         => 'nullable|mimes:pdf|max:5120',
            'ktp_pdf'               => 'nullable|mimes:pdf|max:5120',
            'surat_rekomendasi_pdf' => 'nullable|mimes:pdf|max:5120',
            'ktm_pdf'               => 'nullable|mimes:pdf|max:5120',
            'ipk'                   => 'nullable|numeric|between:0,4.00',
        ]);

        // ── Foto ─────────────────────────────────────────────────────────────
        if ($request->hasFile('foto')) {
            if ($profile->foto) Storage::disk('public')->delete($profile->foto);
            $profile->foto = $request->file('foto')->store('profiles/photos', 'public');
        }

        // ── Dokumen PDF ───────────────────────────────────────────────────────
        $pdfFields = [
            'cv_pdf',
            'portofolio_pdf',
            'transkrip_pdf',
            'ktp_pdf',
            'surat_rekomendasi_pdf',
            'ktm_pdf',
        ];

        foreach ($pdfFields as $field) {
            if ($request->hasFile($field)) {
                if ($profile->$field) Storage::disk('public')->delete($profile->$field);
                $profile->$field = $request->file($field)->store('profiles/documents', 'public');
            }
        }

        // ── Data Teks ─────────────────────────────────────────────────────────
        $profile->fill($request->only([
            'tentang_saya', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
            'provinsi', 'kabupaten', 'detail_alamat', 'universitas', 'jurusan',
            'jenjang', 'ipk', 'tahun_masuk', 'tahun_lulus', 'linkedin', 'instagram', 'notelp',
        ]));

        // ── Kelengkapan Profil ────────────────────────────────────────────────
        if ($profile->foto && $profile->cv_pdf && $profile->universitas) {
            $profile->is_profile_complete = 1;
        }

        $profile->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil diperbarui!',
            'data'    => [
                'cv'                => $profile->cv_pdf
                                          ? asset('storage/' . $profile->cv_pdf)
                                          : null,
                'portofolio'        => $profile->portofolio_pdf
                                          ? asset('storage/' . $profile->portofolio_pdf)
                                          : null,
                'transkrip'         => $profile->transkrip_pdf
                                          ? asset('storage/' . $profile->transkrip_pdf)
                                          : null,
                'ktp'               => $profile->ktp_pdf
                                          ? asset('storage/' . $profile->ktp_pdf)
                                          : null,
                'surat_rekomendasi' => $profile->surat_rekomendasi_pdf
                                          ? asset('storage/' . $profile->surat_rekomendasi_pdf)
                                          : null,
                'ktm'               => $profile->ktm_pdf
                                          ? asset('storage/' . $profile->ktm_pdf)
                                          : null,
            ],
        ]);
    }

    /**
     * Memulai Tes
     */
    public function startTest()
    {
        $user    = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        if (!$profile || (int) $profile->is_profile_complete === 0) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lengkapi profil dulu!',
            ], 403);
        }

        if ($profile->test_finished_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pre-test hanya dapat dikerjakan satu kali.',
            ], 403);
        }

        if (!$profile->test_started_at) {
            $profile->test_started_at = now();
            $profile->save();
        }

        return response()->json([
            'status'           => 'success',
            'message'          => 'Test dimulai!',
            'test_started_at'  => $profile->test_started_at,
            'expires_at'       => $this->expiresAt($profile),
            'duration_minutes' => $this->pretestDurationMinutes(),
            'total_questions'  => count($this->pretestQuestions()),
        ]);
    }

    /**
     * Submit Jawaban Tes
     */
    public function submitPreTest(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
        ]);

        $user          = Auth::user();
        $profile       = InternProfile::where('user_id', $user->user_id)->first();
        $questionsById = collect($this->pretestQuestions())->keyBy('id');

        if (!$profile || (int) $profile->is_profile_complete === 0) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lengkapi profil dulu sebelum mengerjakan pre-test.',
            ], 403);
        }

        if ($profile->test_finished_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pre-test hanya dapat dikerjakan satu kali.',
            ], 403);
        }

        if (!$profile->test_started_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Mulai pre-test terlebih dahulu.',
            ], 400);
        }

        if ($this->isTestExpired($profile)) {
            return response()->json([
                'status'     => 'error',
                'message'    => 'Waktu pre-test sudah habis.',
                'expires_at' => $this->expiresAt($profile),
            ], 422);
        }

        if (count($request->answers) !== $questionsById->count()) {
            return response()->json([
                'status'   => 'error',
                'message'  => 'Jumlah jawaban tidak sesuai dengan jumlah soal.',
                'expected' => $questionsById->count(),
            ], 422);
        }

        $normalizedAnswers = collect($request->answers);
        $questionIds       = $normalizedAnswers->pluck('question_id')->filter()->values();

        if ($questionIds->count() !== $questionsById->count() ||
            $questionIds->unique()->count() !== $questionsById->count()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Setiap soal harus dijawab tepat satu kali.',
            ], 422);
        }

        if ($questionIds->sort()->values()->all() !== $questionsById->keys()->sort()->values()->all()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Daftar soal yang dikirim tidak valid.',
            ], 422);
        }

        foreach ($request->answers as $ans) {
            $question       = $questionsById->get((int) ($ans['question_id'] ?? 0));
            $selectedOption = $ans['selected_option'] ?? null;

            if (!$question || !in_array($selectedOption, $question['options'], true)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Jawaban pre-test tidak valid.',
                ], 422);
            }

            TestAnswer::create([
                'user_id'       => $user->user_id,
                'question_text' => $question['question'],
                'user_answer'   => $selectedOption,
            ]);
        }

        $profile->update(['test_finished_at' => now()]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Tes berhasil dikirim!',
        ]);
    }

    /**
     * Melamar Kerja (Final Step)
     */
    public function applyJob(Request $request)
    {
        $request->validate([
            'job_id' => 'required|integer',
        ]);

        $user    = Auth::user();
        $profile = InternProfile::where('user_id', $user->user_id)->first();

        if (!$profile->is_profile_complete || !$profile->test_finished_at) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Selesaikan profil dan tes dulu sebelum melamar!',
            ], 403);
        }

        $exists = JobApplication::where('user_id', $user->user_id)
                                ->where('job_id', $request->job_id)
                                ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Anda sudah melamar di posisi ini.',
            ], 400);
        }

        JobApplication::create([
            'user_id' => $user->user_id,
            'job_id'  => $request->job_id,
            'status'  => 'PENDING',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Lamaran berhasil terkirim!',
        ]);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private function pretestQuestions(): array
    {
        return config('pretest.questions', []);
    }

    private function pretestDurationMinutes(): int
    {
        return (int) config('pretest.duration_minutes', 20);
    }

    private function expiresAt(InternProfile $profile): ?string
    {
        if (!$profile->test_started_at) return null;

        return Carbon::parse($profile->test_started_at)
            ->addMinutes($this->pretestDurationMinutes())
            ->toDateTimeString();
    }

    private function isTestExpired(InternProfile $profile): bool
    {
        if (!$profile->test_started_at) return false;

        return now()->greaterThan(
            Carbon::parse($profile->test_started_at)
                ->addMinutes($this->pretestDurationMinutes())
        );
    }
}