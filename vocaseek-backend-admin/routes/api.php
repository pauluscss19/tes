<?php

use Illuminate\Support\Facades\Route;

// --- AUTH CONTROLLERS ---
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\LanguagePreferenceController;

// --- APP CONTROLLERS ---
use App\Http\Controllers\InternController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\TalentController;

// --- ADMIN CONTROLLERS ---
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminTalentController;
use App\Http\Controllers\Auth\AdminPartnerController;
use App\Http\Controllers\Auth\AdminUserController;
use App\Http\Controllers\Auth\AdminVerificationController;
use App\Http\Controllers\Auth\AdminProfileController;
use App\Http\Controllers\GoogleAuthController;


// ==========================================
// PUBLIC ROUTES
// ==========================================

Route::post('/auth/google/token', [GoogleAuthController::class, 'handleTokenLogin']);
Route::get('/landing-stats', [CompanyController::class, 'getPublicStats']);
Route::get('/popular-vacancies', [CompanyController::class, 'getPublicJobs']);
Route::get('/partners', [CompanyController::class, 'getPublicPartners']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/auth/google', function () {
    return redirect()->route('google.redirect');
});
Route::get('/auth/google/callback', function () {
    return redirect()->route('google.callback', request()->query());
});
Route::post('/auth/google/token', [GoogleController::class, 'loginWithGoogleToken']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/forgot-password/validate-token', [ForgotPasswordController::class, 'validateResetToken']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::get('/test', function () {
    return response()->json(['message' => 'API Vocaseek Aktif & Terhubung']);
});


// ==========================================
// PROTECTED ROUTES
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/language', [LanguagePreferenceController::class, 'show']);
    Route::put('/language', [LanguagePreferenceController::class, 'update']);
    Route::get('/preferences/language', [LanguagePreferenceController::class, 'show']);
    Route::put('/preferences/language', [LanguagePreferenceController::class, 'update']);

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);


    // ==========================================
    // INTERN ROUTES
    // ==========================================

    Route::prefix('intern')->middleware('role:intern')->group(function () {
        Route::get('/profile', [InternController::class, 'getProfile']);
        Route::get('/test/questions', [InternController::class, 'getTestQuestions']);
        Route::put('/update-profile', [InternController::class, 'updateProfile']);
        Route::post('/start-test', [InternController::class, 'startTest']);
        Route::post('/submit-test', [InternController::class, 'submitPreTest']);
        Route::post('/apply', [InternController::class, 'applyJob']);
        Route::get('/applications', [InternController::class, 'getMyApplications']);
    });


    // ==========================================
    // COMPANY ROUTES
    // ==========================================

    Route::prefix('company')->middleware('role:company')->group(function () {
        Route::get('/profile', [CompanyController::class, 'getCompanyProfile']);
        Route::post('/profile/update', [CompanyController::class, 'updateProfile']);
        Route::get('/dashboard', [CompanyController::class, 'getDashboardData']);

        Route::get('/jobs/{jobId}/applicants', [CompanyController::class, 'getApplicantsByJob']);
        Route::put('/applications/{id}/status', [CompanyController::class, 'updateApplicationStatus']);

        Route::get('/jobs', [CompanyController::class, 'getJobPostings']);
        Route::post('/jobs', [CompanyController::class, 'storeJob']);
        Route::put('/jobs/{id}', [CompanyController::class, 'updateJob']);
        Route::delete('/jobs/{id}', [CompanyController::class, 'destroyJob']);

        Route::get('/talent/candidates', [TalentController::class, 'getAllCandidates']);
        Route::get('/talent/candidates/{id}/detail', [TalentController::class, 'getCandidateDetail']);
        Route::post('/talent/candidates/manual', [TalentController::class, 'storeManualCandidate']);
        Route::put('/talent/candidates/{id}/status', [TalentController::class, 'updateCandidateStatus']);
        Route::get('/talent/selected', [TalentController::class, 'getSelectedCandidates']);
    });


    // ==========================================
    // ADMIN ROUTES
    // ==========================================

    Route::prefix('admin')->group(function () {

        // Akses: super_admin DAN staff_admin
        Route::middleware('role:super_admin,staff_admin')->group(function () {

            // Profile Admin
            Route::prefix('profile')->group(function () {
                Route::get('/', [AdminProfileController::class, 'show']);
                Route::post('/update', [AdminProfileController::class, 'update']);
                Route::put('/change-password', [AdminProfileController::class, 'changePassword']);
            });

            // Dashboard
            Route::get('/overview', [AdminDashboardController::class, 'getOverview']);

            // Talent
            Route::get('/talents', [AdminTalentController::class, 'index']);

            // Partner — GET & POST untuk semua admin
            Route::get('/partners', [AdminPartnerController::class, 'index']);
            Route::post('/partners', [AdminPartnerController::class, 'store']);
            Route::get('/partners/{id}', [AdminPartnerController::class, 'show']);

            // Verifikasi
            Route::prefix('verification')->group(function () {
                Route::get('/', [AdminVerificationController::class, 'index']);
                Route::put('/{id}/review-status', [AdminVerificationController::class, 'updateReviewStatus']);
                Route::get('/{id}/detail', [AdminVerificationController::class, 'show']);
            });
        });

        // Akses: super_admin SAJA
        Route::middleware('role:super_admin')->group(function () {

            // Users Management
            Route::prefix('users-management')->group(function () {
                Route::get('/', [AdminUserController::class, 'index']);
                Route::post('/', [AdminUserController::class, 'store']);
                Route::put('/{id}/status', [AdminUserController::class, 'updateStatus']);
                Route::delete('/{id}', [AdminUserController::class, 'destroy']);
            });

            // Delete Partner & Talent
            Route::delete('/partners/{id}', [AdminPartnerController::class, 'destroy']);
            Route::delete('/talents/{id}', [AdminTalentController::class, 'destroy']);

            // Final Verifikasi
            Route::post('/verification/{id}/final', [AdminVerificationController::class, 'finalVerification']);
        });
    });
});