<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InternController;

// 1. Route Publik (Tanpa Login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Route Terproteksi (Harus Login)
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/intern/update-profile', [InternController::class, 'updateProfile']);

    // Alur Pre-test (Timer & Skor)
    Route::post('/intern/start-test', [InternController::class, 'startTest']);
    Route::post('/intern/submit-test', [InternController::class, 'submitPreTest']);

    // Language Preference
    Route::get('/language', function () {
        $user = auth()->user();
        $locale = $user->locale ?? 'id';
        return response()->json(['data' => ['locale' => $locale]]);
    });

    Route::put('/language', function (\Illuminate\Http\Request $request) {
        $locale = in_array($request->input('locale'), ['id', 'en'])
            ? $request->input('locale')
            : 'id';
        return response()->json(['data' => ['locale' => $locale]]);
    });

});

// Testing
Route::get('/test', function () {
    return response()->json(['message' => 'API Vokaseek Aktif']);
});