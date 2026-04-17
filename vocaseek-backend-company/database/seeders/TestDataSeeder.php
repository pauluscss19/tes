<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\JobApplication;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Buat 5 user intern
        $users = [
            ['nama' => 'Budi Santoso',    'email' => 'budi@test.com'],
            ['nama' => 'Siti Rahayu',     'email' => 'siti@test.com'],
            ['nama' => 'Ahmad Fauzi',     'email' => 'ahmad@test.com'],
            ['nama' => 'Dewi Lestari',    'email' => 'dewi@test.com'],
            ['nama' => 'Rizky Pratama',   'email' => 'rizky@test.com'],
        ];

        foreach ($users as $i => $data) {
            User::create([
                'user_id'  => $i + 3, // user_id 3,4,5,6,7
                'nama'     => $data['nama'],
                'email'    => $data['email'],
                'password' => Hash::make('password'),
                'role'     => 'intern',
            ]);
        }
    }
}