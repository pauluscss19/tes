<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\InternController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TalentController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/landing-stats',      [CompanyController::class, 'getPublicStats']);
Route::get('/popular-vacancies',  [CompanyController::class, 'getPublicJobs']);

Route::post('/register',          [AuthController::class, 'register']);
Route::post('/login',             [AuthController::class, 'login'])->name('login');
Route::get('/auth/google',        [GoogleController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback',[GoogleController::class, 'handleGoogleCallback']);

Route::post('/forgot-password',   [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password',    [ForgotPasswordController::class, 'resetPassword']);

// Fallback language (agar FloatingLanguageSwitcher tidak 404)
Route::get('/language', fn() => response()->json(['lang' => 'id']));

Route::get('/test', fn() => response()->json(['message' => 'API Vokaseek Aktif & Terhubung']));

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |------------------------------------------------------------------
    | INTERN
    |------------------------------------------------------------------
    */
    Route::prefix('intern')->group(function () {
        Route::get('/profile',          [InternController::class, 'getProfile']);
        Route::put('/update-profile',   [InternController::class, 'updateProfile']);
        Route::post('/start-test',      [InternController::class, 'startTest']);
        Route::post('/submit-test',     [InternController::class, 'submitPreTest']);
        Route::post('/apply',           [InternController::class, 'applyJob']);
        Route::get('/applications',     [InternController::class, 'getMyApplications']);
    });

    /*
    |------------------------------------------------------------------
    | COMPANY
    |------------------------------------------------------------------
    */
    Route::prefix('company')->group(function () {

        // Profil Perusahaan
        Route::get('/profile',          [CompanyController::class, 'getCompanyProfile']);
        Route::post('/profile/update',  [CompanyController::class, 'updateProfile']);

        Route::get('/dashboard',        [CompanyController::class, 'getDashboardData']);

        // Jobs
        Route::get('/jobs',             [CompanyController::class, 'getJobPostings']);
        Route::post('/jobs',            [CompanyController::class, 'storeJob']);
        Route::put('/jobs/{id}',        [CompanyController::class, 'updateJob']);
        Route::delete('/jobs/{id}',     [CompanyController::class, 'destroyJob']);

        // Talent — ⚠️ route statis (manual) HARUS di atas route dinamis ({id})
        Route::prefix('talent')->group(function () {
            Route::get('/candidates',               [TalentController::class, 'getAllCandidates']);
            Route::post('/candidates/manual',       [TalentController::class, 'storeManualCandidate']); // ⬅️ sebelum {id}
            Route::get('/candidates/{id}/detail',   [TalentController::class, 'getCandidateDetail']);   // ⬅️ setelah manual
            Route::put('/candidates/{id}/status',   [TalentController::class, 'updateCandidateStatus']);
            Route::get('/selected',                 [TalentController::class, 'getSelectedCandidates']);
        });
    });
});