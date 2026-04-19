<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InternController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\LicenseController;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/

// Auth Manual
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login'])->name('login');

// Auth Google
Route::get('/auth/google',          [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Lupa Password
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password',  [ForgotPasswordController::class, 'resetPassword']);

// Testing Koneksi
Route::get('/test', function () {
    return response()->json(['message' => 'API Vokaseek Intern Aktif']);
});

// Language Preference
Route::get('/language', function () {
    return response()->json(['language' => 'id']);
});

// Lowongan — bisa diakses tanpa login
Route::get('/popular-vacancies', [InternController::class, 'getPopularVacancies']);
Route::get('/vacancies',         [InternController::class, 'getAllVacancies']);
Route::get('/vacancies/search',  [InternController::class, 'searchVacancies']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Wajib Login / Pakai Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/intern/profile',        [InternController::class, 'getProfile']);
    // Ubah ke:
Route::post('/intern/update-profile', [InternController::class, 'updateProfile']);

    // Pre-test
    Route::post('/intern/start-test',  [InternController::class, 'startTest']);
    Route::post('/intern/submit-test', [InternController::class, 'submitPreTest']);

    // Lamaran
    Route::post('/intern/apply',              [InternController::class, 'applyJob']);
    Route::get('/intern/applications',        [InternController::class, 'getMyApplications']);
    Route::get('/intern/applications/latest', [InternController::class, 'getLatestApplication']);

    // Pengalaman Kerja
    Route::get('/intern/experiences',         [ExperienceController::class, 'index']);
    Route::post('/intern/experiences',        [ExperienceController::class, 'store']);
    Route::put('/intern/experiences/{id}',    [ExperienceController::class, 'update']);
    Route::delete('/intern/experiences/{id}', [ExperienceController::class, 'destroy']);

    // Lisensi & Sertifikasi
    Route::get('/intern/licenses',            [LicenseController::class, 'index']);
    Route::post('/intern/licenses',           [LicenseController::class, 'store']);
    Route::put('/intern/licenses/{id}',       [LicenseController::class, 'update']);
    Route::delete('/intern/licenses/{id}',    [LicenseController::class, 'destroy']);
});