<?php

namespace App\Http\Controllers;

use App\Models\Lowongan;
use App\Models\CompanyProfile;
use App\Models\InternProfile;
use App\Models\JobApplication;
use App\Models\TestAnswer;
use App\Models\InternExperience;
use App\Models\InternCertification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InternController extends Controller
{
    // ─── Helper: ambil user_id ────────────────────────────────────────────────

    private function userId(): int
    {
        $user = Auth::user();
        return $user->user_id ?? $user->id;
    }

    // ─── Profil ───────────────────────────────────────────────────────────────

    public function getProfile()
    {
        $user = Auth::user();
        $uid  = $this->userId();

        $profile = InternProfile::where('user_id', $uid)->first();

        if (!$profile) {
            return response()->json(['message' => 'Profil tidak ditemukan'], 404);
        }

        $experiences    = InternExperience::where('user_id', $uid)->get();
        $certifications = InternCertification::where('user_id', $uid)->get();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'nama'        => $user->nama,
                'email'       => $user->email,
                'universitas' => $profile->universitas,
                'jurusan'     => $profile->jurusan,
                'ipk'         => $profile->ipk,
                'provinsi'    => $profile->provinsi,
                'kabupaten'   => $profile->kabupaten,
                'foto'        => $profile->foto
                                    ? asset('storage/' . $profile->foto)
                                    : null,
                'cv'          => $profile->cv_pdf
                                    ? asset('storage/' . $profile->cv_pdf)
                                    : null,
                'instagram'   => $profile->instagram,
                'is_complete' => $profile->is_profile_complete,
                'pengalaman'  => $experiences,
                'sertifikasi' => $certifications,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $uid     = $this->userId();
        $profile = InternProfile::where('user_id', $uid)->first();

        // Buat profile baru kalau belum ada
        if (!$profile) {
            $profile = new InternProfile();
            $profile->user_id = $uid;
            $profile->save();
        }

        $request->validate([
            'foto'           => 'nullable|image|max:5120',
            'cv_pdf'         => 'nullable|mimes:pdf|max:5120',
            'portofolio_pdf' => 'nullable|mimes:pdf|max:5120',
            'ipk'            => 'nullable|numeric|between:0,4.00',
        ]);

        if ($request->hasFile('foto')) {
            if ($profile->foto) {
                Storage::disk('public')->delete($profile->foto);
            }
            $profile->foto = $request->file('foto')->store('profiles/photos', 'public');
        }

        if ($request->hasFile('cv_pdf')) {
            if ($profile->cv_pdf) {
                Storage::disk('public')->delete($profile->cv_pdf);
            }
            $profile->cv_pdf = $request->file('cv_pdf')->store('profiles/documents', 'public');
        }

        if ($request->hasFile('portofolio_pdf')) {
            if ($profile->portofolio_pdf) {
                Storage::disk('public')->delete($profile->portofolio_pdf);
            }
            $profile->portofolio_pdf = $request->file('portofolio_pdf')
                                            ->store('profiles/documents', 'public');
        }

        $fillable = [
            'tentang_saya', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin',
            'provinsi', 'kabupaten', 'detail_alamat', 'universitas', 'jurusan',
            'jenjang', 'ipk', 'tahun_masuk', 'tahun_lulus', 'linkedin', 'instagram',
            'notelp',
        ];

        foreach ($fillable as $field) {
            if ($request->has($field)) {
                $profile->$field = $request->input($field);
            }
        }

        if ($profile->foto && $profile->cv_pdf && $profile->universitas) {
            $profile->is_profile_complete = 1;
        }

        $profile->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil diperbarui!',
        ]);
    }

    // ─── Pre-test ─────────────────────────────────────────────────────────────

    public function startTest()
    {
        $uid     = $this->userId();
        $profile = InternProfile::where('user_id', $uid)->first();

        if (!$profile || !$profile->is_profile_complete) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Lengkapi profil dulu!',
            ], 403);
        }

        if (!$profile->test_started_at) {
            $profile->update(['test_started_at' => now()]);
        }

        return response()->json([
            'status'          => 'success',
            'test_started_at' => $profile->test_started_at,
        ]);
    }

    public function submitPreTest(Request $request)
    {
        $request->validate([
            'answers'                   => 'required|array',
            'answers.*.question'        => 'required|string',
            'answers.*.selected_option' => 'required|string',
        ]);

        $uid     = $this->userId();
        $profile = InternProfile::where('user_id', $uid)->first();

        if (!$profile) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Profil tidak ditemukan. Lengkapi profil dulu!',
            ], 404);
        }

        // Hapus jawaban lama (jika ada) sebelum menyimpan yang baru
        TestAnswer::where('user_id', $uid)->delete();

        foreach ($request->answers as $ans) {
            TestAnswer::create([
                'user_id'       => $uid,
                'question_text' => $ans['question'],
                'user_answer'   => $ans['selected_option'],
            ]);
        }

        // Update timestamp selesai — JANGAN set pretest_score ke null (NOT NULL column)
        $profile->update([
            'test_finished_at' => now(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Tes selesai! Admin akan mereview jawaban Anda.',
        ]);
    }

    // ─── Lamaran ──────────────────────────────────────────────────────────────

    public function applyJob(Request $request)
    {
        $request->validate([
            'job_id'     => 'required|integer',
            'motivation' => 'required|string',
        ]);

        $uid     = $this->userId();
        $profile = InternProfile::where('user_id', $uid)->first();

        if (!$profile || !$profile->is_profile_complete) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Selesaikan profil dulu sebelum melamar!',
            ], 403);
        }

        // Jika test_finished_at null tapi user sudah punya jawaban di DB,
        // fix otomatis timestamp-nya (akibat bug lama pretest_score not null)
        if (!$profile->test_finished_at) {
            $hasAnswers = TestAnswer::where('user_id', $uid)->exists();
            if ($hasAnswers) {
                $profile->update(['test_finished_at' => now()]);
            } else {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Selesaikan pre-test dulu sebelum melamar!',
                ], 403);
            }
        }

        $alreadyApplied = JobApplication::where('user_id', $uid)
            ->where('job_id', $request->job_id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kamu sudah melamar ke lowongan ini.',
            ], 409);
        }

        JobApplication::create([
            'user_id'    => $uid,
            'job_id'     => $request->job_id,
            'motivation' => $request->motivation,
            'status'     => 'PENDING',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Kamu berhasil mendaftar!',
        ]);
    }

    public function getMyApplications()
    {
        $data = JobApplication::with('job')
            ->where('user_id', $this->userId())
            ->latest()
            ->get();

        return response()->json(['status' => 'success', 'data' => $data]);
    }

    public function getLatestApplication()
    {
        $uid = $this->userId();

        $application = JobApplication::with(['lowongan.companyProfile'])
            ->where('user_id', $uid)
            ->latest('created_at')
            ->first();

        if (!$application) {
            return response()->json(['data' => null], 200);
        }

        $lowongan = $application->lowongan;
        $company  = $lowongan?->companyProfile;

        return response()->json([
            'data' => [
                'application_id' => $application->application_id,
                'status'         => $application->status,
                'title'          => $lowongan?->judul_posisi        ?? 'Belum ada lowongan',
                'company'        => $company?->nama_perusahaan      ?? 'Perusahaan belum tersedia',
                'location'       => $lowongan?->lokasi              ?? 'Lokasi belum tersedia',
                'type'           => $lowongan?->tipe_magang         ?? 'MAGANG',
            ],
        ]);
    }

    // ─── Lowongan (Public) ────────────────────────────────────────────────────

    public function getPopularVacancies()
    {
        $vacancies = Lowongan::with('companyProfile')
            ->where('status', 'ACTIVE')
            ->latest()
            ->take(6)
            ->get()
            ->map(fn($l) => [
                'id'       => $l->id,
                'title'    => $l->judul_posisi,
                'company'  => $l->companyProfile?->nama_perusahaan ?? 'Perusahaan',
                'location' => $l->lokasi,
                'type'     => $l->tipe_magang,
                'salary'   => $l->gaji_per_bulan,
                'logo'     => $l->companyProfile?->logo_perusahaan ?? null,
            ]);

        return response()->json(['data' => $vacancies]);
    }

    public function getAllVacancies()
    {
        $vacancies = Lowongan::with('companyProfile')
            ->where('status', 'ACTIVE')
            ->latest()
            ->get()
            ->map(fn($l) => [
                'id'       => $l->id,
                'title'    => $l->judul_posisi,
                'company'  => $l->companyProfile?->nama_perusahaan ?? 'Perusahaan',
                'location' => $l->lokasi,
                'type'     => $l->tipe_magang,
                'salary'   => $l->gaji_per_bulan,
                'logo'     => $l->companyProfile?->logo_perusahaan ?? null,
            ]);

        return response()->json(['data' => $vacancies]);
    }

    public function searchVacancies(Request $request)
    {
        $keyword = $request->query('q', '');

        $vacancies = Lowongan::with('companyProfile')
            ->where('status', 'ACTIVE')
            ->where(function ($q) use ($keyword) {
                $q->where('judul_posisi', 'LIKE', "%{$keyword}%")
                  ->orWhere('lokasi',     'LIKE', "%{$keyword}%")
                  ->orWhereHas('companyProfile', fn($q2) =>
                      $q2->where('nama_perusahaan', 'LIKE', "%{$keyword}%")
                  );
            })
            ->latest()
            ->get()
            ->map(fn($l) => [
                'id'       => $l->id,
                'title'    => $l->judul_posisi,
                'company'  => $l->companyProfile?->nama_perusahaan ?? 'Perusahaan',
                'location' => $l->lokasi,
                'type'     => $l->tipe_magang,
                'salary'   => $l->gaji_per_bulan,
                'logo'     => $l->companyProfile?->logo_perusahaan ?? null,
            ]);

        return response()->json(['data' => $vacancies]);
    }
}