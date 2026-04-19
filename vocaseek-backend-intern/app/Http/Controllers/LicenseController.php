<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InternCertification;
use Illuminate\Support\Facades\Auth;

class LicenseController extends Controller
{
    public function index()
    {
        $data = InternCertification::where('user_id', Auth::id())->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $cert = InternCertification::create([
            'user_id' => Auth::id(),
            'name'    => $request->name ?? '',
        ]);
        return response()->json(['data' => $cert], 201);
    }

    public function update(Request $request, $id)
    {
        $cert = InternCertification::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();
        $cert->update($request->only(['name']));
        return response()->json(['data' => $cert]);
    }

    public function destroy($id)
    {
        $cert = InternCertification::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();
        $cert->delete();
        return response()->json(['message' => 'Deleted']);
    }
}