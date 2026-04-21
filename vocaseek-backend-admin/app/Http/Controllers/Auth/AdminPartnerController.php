<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPartnerController extends Controller
{
    /**
     * 1. LIST PARTNER
     */
    public function index(Request $request)
    {
        $query = CompanyProfile::with(['user']);

        if ($request->has('search')) {
            $query->where('nama_perusahaan', 'like', '%' . $request->search . '%');
        }

        $partners = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'stats' => [
                'total_partner'    => CompanyProfile::count(),
                'kolaborasi_aktif' => CompanyProfile::where('status_mitra', 'active')->count(),
                'butuh_review'     => CompanyProfile::whereIn('status_mitra', ['pending', 'reviewed'])->count(),
            ],
            'data' => $partners->map(fn($item) => [
                'id'                  => $item->id,
                'id_perusahaan'       => 'CMP-' . str_pad($item->id, 3, '0', STR_PAD_LEFT),
                'nama_perusahaan'     => [
                    'nama'    => $item->nama_perusahaan,
                    'lokasi'  => $item->alamat_kantor_pusat ?? 'N/A',
                ],
                'tipe_bisnis'         => $item->industri ?? 'N/A',
                'tanggal_pengajuan'   => optional($item->created_at)->format('d M Y') ?? 'N/A',
                'status_verifikasi'   => $this->formatStatus($item->status_mitra),
            ]),
            'pagination' => [
                'total'        => $partners->total(),
                'current_page' => $partners->currentPage(),
            ]
        ]);
    }

    /**
     * 2. DETAIL MITRA
     */
    public function show($id)
    {
        $partner = CompanyProfile::with(['user', 'lowongans'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id'                  => $partner->id,
                'id_perusahaan'       => 'CMP-' . str_pad($partner->id, 3, '0', STR_PAD_LEFT),
                'nama_perusahaan'     => $partner->nama_perusahaan,
                'industri'            => $partner->industri,
                'ukuran_perusahaan'   => $partner->ukuran_perusahaan,
                'website_url'         => $partner->website_url,
                'deskripsi'           => $partner->deskripsi,
                'notelp'              => $partner->notelp,
                'alamat_kantor_pusat' => $partner->alamat_kantor_pusat,
                'nib'                 => $partner->nib,
                'status_mitra'        => $partner->status_mitra,
                'logo_url'            => $partner->logo_perusahaan
                                            ? asset('storage/' . $partner->logo_perusahaan)
                                            : null,
                'banner_url'          => $partner->banner_perusahaan
                                            ? asset('storage/' . $partner->banner_perusahaan)
                                            : null,
                'linkedin_url'        => $partner->linkedin_url,
                'instagram_url'       => $partner->instagram_url,
                'twitter_url'         => $partner->twitter_url,
                'loa_url'             => $partner->loa_pdf
                                            ? asset('storage/' . $partner->loa_pdf)
                                            : null,
                'akta_url'            => $partner->akta_pdf
                                            ? asset('storage/' . $partner->akta_pdf)
                                            : null,
                'tanggal_bergabung'   => optional($partner->created_at)->format('d M Y'),
                'pic' => [
                    'nama'    => $partner->user->nama ?? 'N/A',
                    'email'   => $partner->user->email ?? 'N/A',
                    'phone'   => $partner->user->notelp ?? $partner->notelp ?? 'N/A',
                    'jabatan' => 'PIC / Penanggung Jawab',
                ],
                'lowongans' => $partner->lowongans->map(fn($job) => [
                    'id'         => $job->id,
                    'judul'      => $job->judul_posisi ?? $job->judul_pekerjaan ?? 'N/A',
                    'status'     => $job->status,
                    'lokasi'     => $job->lokasi,
                    'created_at' => optional($job->created_at)->format('d M Y'),
                ]),
                'total_lowongan' => $partner->lowongans->count(),
                'lowongan_aktif' => $partner->lowongans->whereIn('status', ['ACTIVE', 'OPEN'])->count(),
            ]
        ]);
    }

    /**
     * 3. TAMBAH MITRA BARU
     */
    public function store(Request $request)
    {
        \Log::info('=== TAMBAH MITRA DEBUG ===');
        \Log::info('INPUT:', $request->all());

        $validated = $request->validate([
            'nama_perusahaan' => 'required|string',
            'industri'        => 'required',
            'website'         => 'nullable|url',
            'deskripsi'       => 'nullable|max:500',
            'nama_pic'        => 'required',
            'jabatan_pic'     => 'required',
            'email'           => 'required|email|unique:users,email',
            'notelp'          => 'required',
            'alamat_lengkap'  => 'required',
            'kota'            => 'required',
            'provinsi'        => 'required',
            'kode_pos'        => 'required',
        ]);

        $partner = DB::transaction(function () use ($validated) {
            $user = User::create([
                'nama'     => $validated['nama_pic'],
                'email'    => $validated['email'],
                'password' => Str::random(12),
                'role'     => 'company',
                'notelp'   => $validated['notelp'],
            ]);

            return CompanyProfile::create([
                'user_id'             => $user->user_id,
                'nama_perusahaan'     => $validated['nama_perusahaan'],
                'industri'            => $validated['industri'],
                'website_url'         => $validated['website'] ?? null,
                'deskripsi'           => $validated['deskripsi'] ?? null,
                'notelp'              => $validated['notelp'],
                'alamat_kantor_pusat' => $validated['alamat_lengkap'] . ', ' . $validated['kota'] . ', ' . $validated['provinsi'] . ' ' . $validated['kode_pos'],
                'status_mitra'        => 'active',
            ]);
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Perusahaan Berhasil Ditambahkan!',
            'data'    => $partner,
        ]);
    }

    /**
     * 4. HAPUS MITRA
     */
    public function destroy($id)
    {
        $partner = CompanyProfile::with('user')->findOrFail($id);

        DB::transaction(function () use ($partner) {
            // Hapus lowongan terkait dulu (hindari foreign key error)
            $partner->lowongans()->delete();

            // Hapus company profile
            $partner->delete();

            // Hapus user akun perusahaan
            if ($partner->user) {
                $partner->user->delete();
            }
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Mitra berhasil dihapus.',
        ]);
    }

    private function formatStatus(?string $statusMitra): string
    {
        return match ($statusMitra) {
            'active'   => 'Active',
            'reviewed' => 'Reviewed',
            'rejected' => 'Rejected',
            default    => 'Pending',
        };
    }
}