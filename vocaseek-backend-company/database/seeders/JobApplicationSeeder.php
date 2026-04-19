<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\InternProfile;

class JobApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $company = DB::table('company_profiles')->first();

        if (!$company) {
            $this->command->warn('Tidak ada CompanyProfile.');
            return;
        }

        $lowongan = DB::table('lowongan')
            ->where('company_profile_id', $company->id)
            ->first();

        if (!$lowongan) {
            // Buat lowongan dummy otomatis
            $lowonganId = DB::table('lowongan')->insertGetId([
                'company_profile_id'  => $company->id,
                'judul_posisi'        => 'Frontend Developer Intern',
                'deskripsi_pekerjaan' => 'Membangun UI dengan React.',
                'persyaratan'         => 'Menguasai HTML, CSS, JS.',
                'lokasi'              => 'Makassar',
                'tipe_magang'         => 'Hybrid',
                'gaji_per_bulan'      => 1500000,
                'status'              => 'ACTIVE',
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);
            $this->command->info('Lowongan dummy dibuat.');
        } else {
            $lowonganId = $lowongan->id;
        }

        $candidates = [
            ['nama' => 'Andi Pratama', 'email' => 'andi.pratama@example.com',  'status' => 'SHORTLISTED'],
            ['nama' => 'Sari Dewi',    'email' => 'sari.dewi@example.com',     'status' => 'INTERVIEW'],
            ['nama' => 'Budi Santoso', 'email' => 'budi.santoso@example.com',  'status' => 'PENDING'],
            ['nama' => 'Lina Marlina', 'email' => 'lina.marlina@example.com',  'status' => 'OFFER'],
        ];

        foreach ($candidates as $c) {
            $user = User::firstOrCreate(
                ['email' => $c['email']],
                [
                    'nama'     => $c['nama'],
                    'password' => Hash::make('password123'),
                    'role'     => 'intern',
                    'notelp'   => '08' . rand(100000000, 999999999),
                ]
            );

            InternProfile::firstOrCreate(
                ['user_id' => $user->user_id],
                [
                    'universitas'         => 'Universitas Hasanuddin',
                    'jurusan'             => 'Teknik Informatika',
                    'jenjang'             => 'S1',
                    'ipk'                 => number_format(rand(300, 400) / 100, 2),
                    'tahun_masuk'         => '2021',
                    'tahun_lulus'         => '2025',
                    'jenis_kelamin'       => 'Laki-laki',
                    'tempat_lahir'        => 'Makassar',
                    'tanggal_lahir'       => '2000-01-01',
                    'provinsi'            => 'Sulawesi Selatan',
                    'kabupaten'           => 'Kota Makassar',
                    'detail_alamat'       => 'Jl. Contoh No. 1',
                    'tentang_saya'        => 'Mahasiswa aktif yang bersemangat belajar.',
                    'skor_pretest'        => rand(60, 100),
                    'is_profile_complete' => true,
                ]
            );

            // ✅ Pakai DB::table langsung — hindari masalah fillable/kolom
            $exists = DB::table('job_applications')
                ->where('user_id', $user->user_id)
                ->where('job_id', $lowonganId)
                ->exists();

            if (!$exists) {
                DB::table('job_applications')->insert([
                    'user_id'    => $user->user_id,
                    'job_id'     => $lowonganId,
                    'status'     => $c['status'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('✅ ' . count($candidates) . ' kandidat dummy berhasil dibuat.');
    }
}