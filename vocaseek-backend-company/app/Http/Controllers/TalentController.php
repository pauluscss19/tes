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

        $tableData = $applications->map(fn($app) => [
            'id'           => $app->id,
            'candidate_id' => 'KDT-' . str_pad($app->user_id, 3, '0', STR_PAD_LEFT),
            'name'         => $app->user->nama          ?? 'N/A',
            'email'        => $app->user->email         ?? '-',
            'position'     => $app->lowongan->judul_posisi   ?? $app->lowongan->judul_pekerjaan ?? 'N/A',
            'type'         => $app->lowongan->tipe_magang    ?? $app->lowongan->tipe_pekerjaan  ?? 'Internship',
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
            'lowongan',
        ])->findOrFail($id);

        $user    = $application->user;
        $profile = $user->internProfile;

        return response()->json([
            'status' => 'success',
            'data'   => [

                'personal' => [
                    'name'    => $user->nama ?? '-',
                    'role'    => $application->lowongan->judul_posisi
                                 ?? $application->lowongan->judul_pekerjaan
                                 ?? 'Candidate',
                    // ✅ FIX: tentang_saya bukan biodata
                    'biodata' => $profile->tentang_saya   ?? 'Belum ada biodata.',
                    'gender'  => $profile->jenis_kelamin  ?? '-',
                    // ✅ FIX: tanggal_lahir bukan tgl_lahir
                    'birth'   => ($profile->tempat_lahir  ?? '-') . ', '
                                 . ($profile->tanggal_lahir ?? '-'),
                    'email'   => $user->email             ?? '-',
                    // ✅ FIX: notelp dari profile, fallback ke user
                    'phone'   => $profile->notelp         ?? $user->notelp ?? '-',
                    // ✅ FIX: gabungkan detail_alamat + kabupaten + provinsi
                    'address' => trim(
                                    implode(', ', array_filter([
                                        $profile->detail_alamat ?? null,
                                        $profile->kabupaten     ?? null,
                                        $profile->provinsi      ?? null,
                                    ]))
                                 ) ?: '-',
                    'foto'    => $profile->foto
                                    ? asset('storage/' . $profile->foto)
                                    : null,
                    'socials' => [
                        // ✅ FIX: linkedin bukan linkedin_url
                        'linkedin'  => $profile->linkedin  ?? null,
                        'instagram' => $profile->instagram ?? null,
                    ],
                ],

                'academic' => [
                    'university' => $profile->universitas  ?? '-',
                    'major'      => $profile->jurusan      ?? '-',
                    'degree'     => $profile->jenjang      ?? '-',
                    'ipk'        => $profile->ipk          ?? '0.00',
                    'year_start' => $profile->tahun_masuk  ?? '-',
                    'graduation' => $profile->tahun_lulus  ?? '-',
                ],

                'assessment' => [
                    // ✅ FIX: pakai pretest_score dari profile
                    'score'       => $profile->pretest_score ?? 0,
                    'finished_at' => $profile->test_finished_at
                                        ? \Carbon\Carbon::parse($profile->test_finished_at)
                                            ->format('d M Y H:i')
                                        : null,
                    'date'        => $application->created_at->format('d M Y'),
                    'summary'     => ($profile->pretest_score ?? 0) > 0
                                        ? 'Kandidat telah menyelesaikan asesmen online.'
                                        : 'Kandidat belum menyelesaikan asesmen.',
                ],

                'documents' => [
                    // ✅ FIX: cv_pdf & portofolio_pdf sesuai database
                    'cv'        => $profile->cv_pdf
                                    ? asset('storage/' . $profile->cv_pdf)
                                    : null,
                    'portfolio' => $profile->portofolio_pdf
                                    ? asset('storage/' . $profile->portofolio_pdf)
                                    : null,
                    'ktp'       => $profile->ktp_path
                                    ? asset('storage/' . $profile->ktp_path)
                                    : null,
                ],

                'application' => [
                    'id'         => $application->id,
                    'status'     => $application->status,
                    'motivation' => $application->motivation ?? '-',
                    'position'   => $application->lowongan->judul_posisi
                                    ?? $application->lowongan->judul_pekerjaan
                                    ?? '-',
                    'applied_at' => $application->created_at->format('d M Y'),
                ],
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
                // ✅ FIX: universitas & jurusan sesuai kolom database
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
                'id'           => $app->id,
                'candidate_id' => 'KDT-' . str_pad($app->user_id, 3, '0', STR_PAD_LEFT),
                'name'         => $app->user->nama,
                'position'     => $app->lowongan->judul_posisi
                                  ?? $app->lowongan->judul_pekerjaan,
                'status'       => $app->status,
            ]),
        ]);
    }
}