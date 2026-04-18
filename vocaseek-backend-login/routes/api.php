<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InternController;
use App\Http\Controllers\GoogleAuthController;

// Google OAuth
Route::post('/auth/google/token', [GoogleAuthController::class, 'handleTokenLogin']);

// Route Publik
Route::post('/register',      [AuthController::class, 'register']);
Route::post('/login',         [AuthController::class, 'login']);
Route::post('/forgot-password',                [AuthController::class, 'forgotPassword']);
Route::post('/forgot-password/validate-token', function() {
    return response()->json(['message' => 'valid']);
});
Route::post('/reset-password',                 [AuthController::class, 'resetPassword']);

// Route Terproteksi
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',               [AuthController::class, 'logout']);
    Route::post('/intern/update-profile',[InternController::class, 'updateProfile']);
    Route::post('/intern/start-test',    [InternController::class, 'startTest']);
    Route::post('/intern/submit-test',   [InternController::class, 'submitPreTest']);

    Route::get('/language', function () {
        $locale = auth()->user()->locale ?? 'id';
        return response()->json(['data' => ['locale' => $locale]]);
    });
    Route::put('/language', function (\Illuminate\Http\Request $request) {
        $locale = in_array($request->input('locale'), ['id', 'en']) ? $request->input('locale') : 'id';
        return response()->json(['data' => ['locale' => $locale]]);
    });
});

// Testing
Route::get('/test', function () {
    return response()->json(['message' => 'API Vokaseek Aktif']);
});