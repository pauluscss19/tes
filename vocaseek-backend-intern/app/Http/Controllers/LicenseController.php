<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InternCertification;
use Illuminate\Support\Facades\Auth;

class LicenseController extends Controller
{
    // Helper: ambil user_id yang benar berdasarkan primary key tabel users
    private function uid(): int
    {
        $user = Auth::user();
        return $user->user_id ?? $user->id ?? Auth::id();
    }

    public function index()
    {
        $data = InternCertification::where('user_id', $this->uid())->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $cert = InternCertification::create([
            'user_id' => $this->uid(),
            'name'    => $request->name ?? '',
        ]);
        return response()->json(['data' => $cert], 201);
    }

    public function update(Request $request, $id)
    {
        $cert = InternCertification::where('id', $id)
                    ->where('user_id', $this->uid())
                    ->firstOrFail();
        $cert->update($request->only(['name']));
        return response()->json(['data' => $cert]);
    }

    public function destroy($id)
    {
        $cert = InternCertification::where('id', $id)
                    ->where('user_id', $this->uid())
                    ->firstOrFail();
        $cert->delete();
        return response()->json(['message' => 'Deleted']);
    }
}