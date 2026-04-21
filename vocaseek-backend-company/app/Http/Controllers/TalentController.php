<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Lowongan;
use App\Models\JobApplication;
use App\Models\InternProfile;
use App\Notifications\CandidateStatusUpdated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TalentController extends Controller
{
    public function getAllCandidates(Request $request)
    {
        $company = $request->user()->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $query = JobApplication::with(['user.internProfile', 'lowongan'])
            ->whereHas('lowongan', function ($q) use ($company) {
                $q->where('company_profile_id', $company->id);
            });

        if ($request->has('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%');
            });
        }

        $applications = $query->latest()->get();

        $stats = [
            'total_shortlisted'   => $applications->where('status', 'SHORTLISTED')->count(),
            'total_interviews'    => $applications->where('status', 'INTERVIEW')->count(),
            'accepted_this_month' => $applications->where('status', 'OFFER')
                ->where('updated_at', '>=', now()->startOfMonth())->count(),
        ];

        $internBase = rtrim(env('INTERN_STORAGE_URL', 'http://localhost:8002'), '/');
        $internUrl  = fn(?string $path) => $path ? $internBase . '/storage/' . $path : null;

        $tableData = $applications->map(fn($app) => [
            'id'           => $app->application_id,
            'name'         => $app->user->nama              ?? 'N/A',
            'email'        => $app->user->email             ?? '-',
            'foto'         => $internUrl($app->user->internProfile?->foto),
            'position'     => $app->lowongan->judul_posisi
                              ?? $app->lowongan->judul_pekerjaan
                              ?? 'N/A',
            'type'         => $app->lowongan->tipe_magang
                              ?? $app->lowongan->tipe_pekerjaan
                              ?? 'Internship',
            'date_applied' => $app->created_at->format('d M Y'),
            'status'       => $app->status,
        ]);

        return response()->json([
            'status'     => 'success',
            'stats'      => $stats,
            'candidates' => $tableData,
        ]);
    }

    public function getCandidateDetail($id)
    {
        $application = JobApplication::with([
            'user.internProfile',
            'user.experiences',
            'user.certifications',
            'lowongan',
        ])->findOrFail($id);

        $user    = $application->user;
        $profile = $user->internProfile;

        // URL ke storage intern backend (port 8002)
        $internBase = rtrim(env('INTERN_STORAGE_URL', 'http://localhost:8002'), '/');
        $internUrl  = fn(?string $path) => $path ? $internBase . '/storage/' . $path : null;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'personal' => [
                    'name'    => $user->nama            ?? '-',
                    'role'    => $application->lowongan->judul_posisi
                                 ?? $application->lowongan->judul_pekerjaan
                                 ?? 'Candidate',
                    'biodata' => $profile->tentang_saya  ?? 'Belum ada biodata.',
                    'gender'  => $profile->jenis_kelamin ?? '-',
                    'birth'   => ($profile->tempat_lahir ?? '-') . ', '
                                 . ($profile->tanggal_lahir ?? '-'),
                    'email'   => $user->email             ?? '-',
                    'phone'   => $profile->notelp         ?? $user->notelp ?? '-',
                    'address' => trim(implode(', ', array_filter([
                                    $profile->detail_alamat ?? null,
                                    $profile->kabupaten     ?? null,
                                    $profile->provinsi      ?? null,
                                ]))) ?: '-',
                    'foto'    => $internUrl($profile?->foto),
                    'socials' => [
                        'linkedin'  => $profile->linkedin  ?? null,
                        'instagram' => $profile->instagram ?? null,
                    ],
                ],
                'academic' => [
                    'university' => $profile->universitas ?? '-',
                    'major'      => $profile->jurusan     ?? '-',
                    'degree'     => $profile->jenjang     ?? '-',
                    'ipk'        => $profile->ipk         ?? '0.00',
                    'year_start' => $profile->tahun_masuk ?? '-',
                    'graduation' => $profile->tahun_lulus ?? '-',
                ],
                'assessment' => [
                    'score'       => $profile->skor_pretest ?? 0,
                    'date'        => $application->created_at->format('d M Y'),
                    'summary'     => ($profile->skor_pretest ?? 0) > 0
                                        ? 'Kandidat telah menyelesaikan asesmen online.'
                                        : 'Kandidat belum menyelesaikan asesmen.',
                    'finished_at' => $profile->test_finished_at
                                        ? \Carbon\Carbon::parse($profile->test_finished_at)
                                            ->format('d M Y H:i')
                                        : null,
                ],
                'documents' => [
                    'cv'                => $internUrl($profile?->cv_pdf),
                    'portfolio'         => $internUrl($profile?->portofolio_pdf),
                    'ktp'               => $internUrl($profile?->ktp_pdf),
                    'transkrip'         => $internUrl($profile?->transkrip_pdf),
                    'surat_rekomendasi' => $internUrl($profile?->surat_rekomendasi_pdf),
                    'ktm'               => $internUrl($profile?->ktm_pdf),
                ],
                'experience' => $user->experiences->map(fn($e) => [
                    'position' => $e->title   ?? '-',
                    'company'  => $e->company ?? '-',
                    'period'   => $e->period  ?? '-',
                    'desc'     => $e->description ?? null,
                ])->values()->all(),
                'licenses' => $user->certifications->map(fn($c) => [
                    'name'   => $c->name   ?? '-',
                    'issuer' => $c->issuer ?? '-',
                    'year'   => $c->year   ?? '-',
                ])->values()->all(),
            ],
        ]);
    }

    public function storeManualCandidate(Request $request)
    {
        $validated = $request->validate([
            'nama'        => 'required|string',
            'email'       => 'required|email|unique:users,email',
            'notelp'      => 'required',
            'universitas' => 'required',
            'jurusan'     => 'required',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'nama'     => $validated['nama'],
                'email'    => $validated['email'],
                'password' => Hash::make(Str::random(16)),
                'role'     => 'intern',
                'notelp'   => $validated['notelp'],
            ]);

            InternProfile::create([
                'user_id'             => $user->user_id,
                'universitas'         => $validated['universitas'],
                'jurusan'             => $validated['jurusan'],
                'is_profile_complete' => true,
            ]);
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Kandidat manual berhasil dibuat',
        ]);
    }

    public function updateCandidateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDING,REVIEWED,SHORTLISTED,INTERVIEW,REJECTED,OFFER',
        ]);

        $application = JobApplication::with(['user', 'lowongan.companyProfile'])->findOrFail($id);
        $application->update(['status' => $validated['status']]);

        if ($request->send_notification && $application->user) {
            $application->user->notify(new CandidateStatusUpdated(
                $validated['status'],
                $application->lowongan->judul_posisi
                    ?? $application->lowongan->judul_pekerjaan,
                $application->lowongan->companyProfile->nama_perusahaan ?? 'Vokaseek'
            ));
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Status diperbarui!',
        ]);
    }

    public function getSelectedCandidates(Request $request)
    {
        $company = $request->user()->companyProfile;

        $candidates = JobApplication::with(['user.internProfile', 'lowongan'])
            ->whereHas('lowongan', function ($q) use ($company) {
                $q->where('company_profile_id', $company->id);
            })
            ->whereIn('status', ['OFFER', 'SHORTLISTED', 'INTERVIEW'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $candidates->map(fn($app) => [
                'id'       => $app->application_id,
                'name'     => $app->user->nama,
                'position' => $app->lowongan->judul_posisi
                              ?? $app->lowongan->judul_pekerjaan,
                'status'   => $app->status,
            ]),
        ]);
    }
}