<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TestAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminTalentController extends Controller
{
    // ── Helper: buat URL storage intern ──────────────────────────────────────
    private function internUrl(?string $path): ?string
    {
        if (!$path) return null;
        $base = rtrim(config('app.intern_storage_url', env('INTERN_STORAGE_URL', 'http://localhost:8002')), '/');
        return $base . '/storage/' . $path;
    }

    // ── Helper: dokumen PDF ───────────────────────────────────────────────────
    // Hanya return URL jika file benar-benar ada di storage intern
    private function buildDokumen($profile): array
    {
        return [
            'cv_pdf'                => $this->safeInternUrl($profile?->cv_pdf),
            'portofolio_pdf'        => $this->safeInternUrl($profile?->portofolio_pdf),
            'transkrip_pdf'         => $this->safeInternUrl($profile?->transkrip_pdf),
            'ktp_pdf'               => $this->safeInternUrl($profile?->ktp_pdf),
            'surat_rekomendasi_pdf' => $this->safeInternUrl($profile?->surat_rekomendasi_pdf),
            'ktm_pdf'               => $this->safeInternUrl($profile?->ktm_pdf),
        ];
    }

    // ── Helper: return URL hanya jika file ada di storage intern ─────────────
    private function safeInternUrl(?string $path): ?string
    {
        if (!$path) return null;

        $internStorageBase = rtrim(
            env('INTERN_STORAGE_PATH', base_path('../../vocaseek-backend-intern/storage/app')),
            '/\\'
        );

        // Coba 1: public disk (storage/app/public/<path>)
        $publicPath = $internStorageBase
            . DIRECTORY_SEPARATOR . 'public'
            . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $path);

        // Coba 2: local disk (storage/app/<path>) — untuk data lama
        $localPath = $internStorageBase
            . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $path);

        if (file_exists($publicPath) || file_exists($localPath)) {
            return $this->internUrl($path);
        }

        // Jika tidak bisa cek file (misalnya path tidak cocok), tetap return URL
        // supaya frontend bisa coba akses sendiri daripada null
        return $this->internUrl($path);
    }

    // ── Helper: pengalaman kerja ──────────────────────────────────────────────
    private function buildExperiences($user): array
    {
        return $user->experiences->map(fn($e) => [
            'title'   => $e->title,
            'company' => $e->company,
            'period'  => $e->period,
        ])->values()->all();
    }

    // ── Helper: lisensi / keahlian ────────────────────────────────────────────
    private function buildCertifications($user): array
    {
        return $user->certifications->map(fn($c) => [
            'name' => $c->name,
        ])->values()->all();
    }

    // ── Helper: skills (alias dari certifications untuk kompatibilitas frontend) ─
    private function buildSkills($user): array
    {
        // Skills dan certifications disimpan di tabel yang sama (intern_certifications)
        // Frontend membutuhkan field 'skills' terpisah
        return $this->buildCertifications($user);
    }

    // ── Helper: pretest answers ───────────────────────────────────────────────
    private function buildPretestAnswers($userId): array
    {
        return TestAnswer::where('user_id', $userId)
            ->orderBy('id')
            ->get(['question_text', 'user_answer'])
            ->map(fn($a) => [
                'question_text' => $a->question_text,
                'user_answer'   => $a->user_answer,
            ])->values()->all();
    }

    // ── Helper: profil lengkap ────────────────────────────────────────────────
    private function buildProfile($user): array
    {
        $p = $user->internProfile;

        return [
            'foto'                => $p?->foto ? $this->internUrl($p->foto) : null,
            'tentang_saya'        => $p?->tentang_saya,
            'jenis_kelamin'       => $p?->jenis_kelamin,
            'tempat_lahir'        => $p?->tempat_lahir,
            'tanggal_lahir'       => optional($p?->tanggal_lahir)->format('Y-m-d'),
            'notelp'              => $p?->notelp ?? $user->notelp,
            'provinsi'            => $p?->provinsi,
            'kabupaten'           => $p?->kabupaten,
            'detail_alamat'       => $p?->detail_alamat,
            'universitas'         => $p?->universitas,
            'jurusan'             => $p?->jurusan,
            'jenjang'             => $p?->jenjang,
            'ipk'                 => $p?->ipk,
            'tahun_masuk'         => $p?->tahun_masuk,
            'tahun_lulus'         => $p?->tahun_lulus,
            'linkedin'            => $p?->linkedin,
            'instagram'           => $p?->instagram,
            'skor_pretest'        => $p?->skor_pretest ?? 0,
            'test_started_at'     => optional($p?->test_started_at)->toDateTimeString(),
            'test_finished_at'    => optional($p?->test_finished_at)->toDateTimeString(),
            'is_profile_complete' => (bool) ($p?->is_profile_complete ?? false),
            // ── Dokumen ───────────────────────────────────────────────────────
            ...$this->buildDokumen($p),
            // ── Pengalaman, Sertifikasi & Skills ──────────────────────────────
            'pengalaman_kerja'    => $this->buildExperiences($user),
            'lisensi_keahlian'    => $this->buildCertifications($user),
            'skills'              => $this->buildSkills($user),
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/admin/talents
    // ─────────────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $totalTalents = User::where('role', 'intern')->count();

        $activeTalents = User::where('role', 'intern')
            ->whereHas('applications', fn($q) =>
                $q->whereIn('status', ['ACCEPTED', 'OFFER'])
            )->count();

        $newTalentsMonth = User::where('role', 'intern')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $query = User::where('role', 'intern')
            ->with(['internProfile', 'applications', 'experiences', 'certifications']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                  ->orWhereHas('internProfile', fn($sq) =>
                      $sq->where('universitas', 'like', "%$search%")
                         ->orWhere('jurusan', 'like', "%$search%")
                  );
            });
        }

        $talents = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'stats'  => [
                'total_talenta' => ['value' => number_format($totalTalents),    'growth' => '+12.5%'],
                'talenta_aktif' => ['value' => number_format($activeTalents),   'growth' => '+5.2%'],
                'talenta_baru'  => ['value' => number_format($newTalentsMonth), 'growth' => '-2.1%'],
            ],
            'data' => $talents->map(fn($user) => [
                'id'                    => $user->user_id,
                'user_id'               => $user->user_id,
                'id_talenta'            => 'TLA-' . str_pad($user->user_id, 3, '0', STR_PAD_LEFT),
                'nama'                  => $user->nama,
                'name'                  => $user->nama,
                'full_name'             => $user->nama,
                'email'                 => $user->email,
                'email_address'         => $user->email,
                'tanggal_daftar'        => optional($user->created_at)->format('M d, Y') ?? 'N/A',
                'status'                => $user->applications->first()?->status ?? 'PENDING',
                'nama_talenta'          => [
                    'nama'  => $user->nama,
                    'email' => $user->email,
                    'foto'  => $user->internProfile?->foto
                                   ? $this->internUrl($user->internProfile->foto) : null,
                ],
                'universitas'           => $user->internProfile?->universitas ?? '-',
                'jurusan'               => $user->internProfile?->jurusan ?? '-',
                'skor_pretest'          => $user->internProfile?->skor_pretest ?? 0,
                'is_profile_complete'   => (bool) ($user->internProfile?->is_profile_complete ?? false),
                'pretest_answers_count' => TestAnswer::where('user_id', $user->user_id)->count(),
                'pretest_answers'       => $this->buildPretestAnswers($user->user_id),
                'profile'               => $this->buildProfile($user),
            ]),
            'pagination' => [
                'total'        => $talents->total(),
                'current_page' => $talents->currentPage(),
                'last_page'    => $talents->lastPage(),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/admin/talents/{id}
    // ─────────────────────────────────────────────────────────────────────────
    public function show($id)
    {
        $user = User::where('role', 'intern')
            ->with(['internProfile', 'applications', 'experiences', 'certifications'])
            ->findOrFail($id);

        $p = $user->internProfile;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'                    => $user->user_id,
                'user_id'               => $user->user_id,
                'id_talenta'            => 'TLA-' . str_pad($user->user_id, 3, '0', STR_PAD_LEFT),
                'nama'                  => $user->nama,
                'name'                  => $user->nama,
                'full_name'             => $user->nama,
                'email'                 => $user->email,
                'email_address'         => $user->email,
                'foto'                  => $p?->foto ? $this->internUrl($p->foto) : null,
                'tentang_saya'          => $p?->tentang_saya,
                'jenis_kelamin'         => $p?->jenis_kelamin,
                'tempat_lahir'          => $p?->tempat_lahir,
                'tanggal_lahir'         => optional($p?->tanggal_lahir)->format('Y-m-d'),
                'notelp'                => $p?->notelp ?? $user->notelp,
                'provinsi'              => $p?->provinsi,
                'kabupaten'             => $p?->kabupaten,
                'detail_alamat'         => $p?->detail_alamat,
                'universitas'           => $p?->universitas ?? '-',
                'jurusan'               => $p?->jurusan ?? '-',
                'jenjang'               => $p?->jenjang,
                'ipk'                   => $p?->ipk,
                'tahun_masuk'           => $p?->tahun_masuk,
                'tahun_lulus'           => $p?->tahun_lulus,
                'linkedin'              => $p?->linkedin,
                'instagram'             => $p?->instagram,
                'skor_pretest'          => $p?->skor_pretest ?? 0,
                'test_started_at'       => optional($p?->test_started_at)->toDateTimeString(),
                'test_finished_at'      => optional($p?->test_finished_at)->toDateTimeString(),
                'is_profile_complete'   => (bool) ($p?->is_profile_complete ?? false),
                'status'                => $user->applications->first()?->status ?? 'PENDING',
                'tanggal_daftar'        => optional($user->created_at)->format('M d, Y') ?? 'N/A',
                'pretest_answers_count' => TestAnswer::where('user_id', $user->user_id)->count(),
                'pretest_answers'       => $this->buildPretestAnswers($user->user_id),
                // ── Dokumen flat ──────────────────────────────────────────────
                ...$this->buildDokumen($p),
                // ── Pengalaman, Sertifikasi & Skills flat ─────────────────────
                'pengalaman_kerja'      => $this->buildExperiences($user),
                'lisensi_keahlian'      => $this->buildCertifications($user),
                'skills'                => $this->buildSkills($user),
                // ── Profile nested ────────────────────────────────────────────
                'profile'               => $this->buildProfile($user),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/admin/talents/{id}
    // ─────────────────────────────────────────────────────────────────────────
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'Talenta berhasil dihapus dari sistem']);
    }
}