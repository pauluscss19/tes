<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lowongan;
use App\Models\JobApplication;
use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    /**
     * STATISTIK LANDING PAGE (Publik)
     */
    public function getPublicStats()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'live_jobs'  => Lowongan::where('status', 'OPEN')->count(),
                'companies'  => CompanyProfile::count(),
                'candidates' => User::where('role', 'intern')->count(),
                'new_jobs'   => Lowongan::where('created_at', '>=', now()->subDays(7))->count(),
            ]
        ]);
    }

    /**
     * PUBLIC JOBS (Tanpa Auth - untuk halaman SearchLowongan)
     */
    public function getPublicJobs()
    {
        $jobs = Lowongan::with('companyProfile')
            ->where('status', 'OPEN')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $jobs
        ]);
    }

    /**
     * DASHBOARD DATA (Internal Mitra)
     */
    public function getDashboardData(Request $request)
    {
        $company = $request->user()->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $stats = [
            'total_applicants' => JobApplication::whereHas('lowongan', function ($q) use ($company) {
                $q->where('company_profile_id', $company->id);
            })->count(),
            'active_jobs' => Lowongan::where('company_profile_id', $company->id)
                ->where('status', 'OPEN')->count(),
            'shortlisted' => JobApplication::where('status', 'SHORTLISTED')
                ->whereHas('lowongan', function ($q) use ($company) {
                    $q->where('company_profile_id', $company->id);
                })->count(),
        ];

        $internBase = rtrim(env('INTERN_STORAGE_URL', 'http://localhost:8002'), '/');
        $internUrl  = fn(?string $path) => $path ? $internBase . '/storage/' . $path : null;

        $recentApplicants = JobApplication::with(['user.internProfile', 'lowongan'])
            ->whereHas('lowongan', function ($q) use ($company) {
                $q->where('company_profile_id', $company->id);
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($app) => [
                'application_id' => $app->application_id,
                'id'             => $app->application_id,
                'candidate_id'   => 'KDT-' . str_pad($app->application_id, 3, '0', STR_PAD_LEFT),
                'name'           => $app->user->nama ?? 'N/A',
                'foto'           => $internUrl($app->user->internProfile?->foto),
                'position'       => $app->lowongan->judul_pekerjaan
                                    ?? $app->lowongan->judul_posisi
                                    ?? 'N/A',
                'date'           => $app->created_at->format('M d, Y'),
                'status'         => $app->status,
            ]);

        return response()->json([
            'status'            => 'success',
            'stats'             => $stats,
            'recent_applicants' => $recentApplicants,
        ]);
    }

    /**
     * GET PROFIL PERUSAHAAN (butuh auth)
     */
    public function getCompanyProfile(Request $request)
    {
        $user    = $request->user();
        $company = $user->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $baseUrl = rtrim(config('app.url'), '/');

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'                  => $company->id,
                'nama_perusahaan'     => $company->nama_perusahaan,
                'industri'            => $company->industri,
                'ukuran_perusahaan'   => $company->ukuran_perusahaan,
                'website_url'         => $company->website_url,
                'deskripsi'           => $company->deskripsi,
                'notelp'              => $company->notelp ?? $user->notelp,
                'alamat_kantor_pusat' => $company->alamat_kantor_pusat,
                'nib'                 => $company->nib,
                'status_mitra'        => $company->status_mitra,
                'linkedin_url'        => $company->linkedin_url,
                'instagram_url'       => $company->instagram_url,
                'twitter_url'         => $company->twitter_url,
                'logo_url'            => $company->logo_perusahaan
                                            ? $baseUrl . '/storage/' . $company->logo_perusahaan
                                            : null,
                'banner_url'          => $company->banner_perusahaan
                                            ? $baseUrl . '/storage/' . $company->banner_perusahaan
                                            : null,
                // PIC info
                'nama_pic'            => $user->nama,
                'email_pic'           => $user->email,
                'phone_pic'           => $user->notelp,
            ],
        ]);
    }

    /**
     * UPDATE PROFIL PERUSAHAAN (butuh auth)
     */
    public function updateProfile(Request $request)
    {
        $user    = $request->user();
        $company = $user->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $request->validate([
            'logo'   => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'banner' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($company->logo_perusahaan) Storage::disk('public')->delete($company->logo_perusahaan);
            $company->logo_perusahaan = $request->file('logo')->store('company/logos', 'public');
        }

        if ($request->hasFile('banner')) {
            if ($company->banner_perusahaan) Storage::disk('public')->delete($company->banner_perusahaan);
            $company->banner_perusahaan = $request->file('banner')->store('company/banners', 'public');
        }

        $fillable = [
            'nama_perusahaan', 'industri', 'ukuran_perusahaan', 'website_url',
            'deskripsi', 'notelp', 'alamat_kantor_pusat', 'nib',
            'linkedin_url', 'instagram_url', 'twitter_url',
        ];

        foreach ($fillable as $field) {
            if ($request->has($field)) {
                $company->$field = $request->input($field);
            }
        }

        $company->save();

        return response()->json([
            'status'  => 'success',
            'message' => 'Profil perusahaan berhasil diperbarui!',
        ]);
    }

    /**
     * MANAJEMEN LOWONGAN (List & Statistik - butuh auth)
     */
    public function getJobPostings(Request $request)
    {
        $company = $request->user()->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $jobs = Lowongan::where('company_profile_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->get()
            ->map(fn($job) => [
                'id'               => $job->id,
                'job_id_display'   => '#JOB-' . $job->created_at->format('Y') . '-' . str_pad($job->id, 3, '0', STR_PAD_LEFT),
                'judul_pekerjaan'  => $job->judul_pekerjaan,
                'kategori_pekerjaan' => $job->kategori_pekerjaan,
                'tipe_pekerjaan'   => $job->tipe_pekerjaan,
                'lokasi'           => $job->lokasi,
                'pengaturan_kerja' => $job->pengaturan_kerja,
                'gaji_min'         => $job->gaji_min,
                'gaji_max'         => $job->gaji_max,
                'tgl_tutup_lamaran' => $job->tgl_tutup_lamaran,
                'tgl_mulai_kerja'  => $job->tgl_mulai_kerja,
                'applicants_count' => $job->applications_count,
                'posted_date'      => $job->created_at->format('M d, Y'),
                'status'           => $job->status,
            ]);

        return response()->json([
            'status' => 'success',
            'stats'  => [
                'total_jobs'      => $jobs->count(),
                'active_openings' => $jobs->where('status', 'OPEN')->count(),
                'closed_jobs'     => $jobs->where('status', 'CLOSED')->count(),
                'drafts'          => $jobs->where('status', 'DRAFT')->count(),
            ],
            'jobs' => $jobs,
        ]);
    }

    /**
     * SIMPAN LOWONGAN BARU
     */
    public function storeJob(Request $request)
    {
        $company = $request->user()->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        if ($company->status_mitra !== 'active') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Perusahaan Anda belum diverifikasi oleh admin. Anda belum bisa membuat lowongan.'
            ], 403);
        }

        $validated = $request->validate([
            'judul_pekerjaan'    => 'required|string|max:255',
            'kategori_pekerjaan' => 'required|string|max:255',
            'tipe_pekerjaan'     => 'required|string|max:255',
            'lokasi'             => 'required|string|max:255',
            'pengaturan_kerja'   => 'required|string|max:255',
            'gaji_min'           => 'nullable|numeric|min:0',
            'gaji_max'           => 'nullable|numeric|min:0',
            'deskripsi_pekerjaan' => 'required|string',
            'persyaratan'        => 'required|string',
            'tgl_tutup_lamaran'  => 'nullable|date',
            'tgl_mulai_kerja'    => 'nullable|date',
            'status'             => 'required|in:OPEN,CLOSED,DRAFT',
        ]);

        $job = Lowongan::create(array_merge($validated, [
            'company_profile_id' => $company->id,
        ]));

        return response()->json([
            'status'  => 'success',
            'message' => 'Lowongan berhasil diterbitkan!',
            'data'    => $job->load('companyProfile'),
        ], 201);
    }

    /**
     * UPDATE LOWONGAN
     */
    public function updateJob(Request $request, $id)
    {
        $company = $request->user()->companyProfile;

        if (!$company) {
            return response()->json(['message' => 'Profil perusahaan tidak ditemukan'], 404);
        }

        $job = Lowongan::where('id', $id)
            ->where('company_profile_id', $company->id)
            ->firstOrFail();

        $validated = $request->validate([
            'judul_pekerjaan'    => 'required|string|max:255',
            'kategori_pekerjaan' => 'required|string|max:255',
            'tipe_pekerjaan'     => 'required|string|max:255',
            'lokasi'             => 'required|string|max:255',
            'pengaturan_kerja'   => 'required|string|max:255',
            'gaji_min'           => 'nullable|numeric|min:0',
            'gaji_max'           => 'nullable|numeric|min:0',
            'deskripsi_pekerjaan' => 'required|string',
            'persyaratan'        => 'required|string',
            'tgl_tutup_lamaran'  => 'nullable|date',
            'tgl_mulai_kerja'    => 'nullable|date',
            'status'             => 'required|in:OPEN,CLOSED,DRAFT',
        ]);

        $job->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Lowongan berhasil diperbarui!',
            'data'    => $job->fresh()->load('companyProfile'),
        ]);
    }

    /**
     * HAPUS LOWONGAN
     */
    public function destroyJob($id)
    {
        $job = Lowongan::findOrFail($id);
        $job->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Lowongan berhasil dihapus',
        ]);
    }
}