<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InternExperience;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    public function index()
    {
        $data = InternExperience::where('user_id', Auth::id())->get();
        return response()->json(['data' => $data]);
    }

    public function store(Request $request)
    {
        $exp = InternExperience::create([
            'user_id' => Auth::id(),
            'title'   => $request->title   ?? '',
            'company' => $request->company ?? '',
            'period'  => $request->period  ?? '',
        ]);
        return response()->json(['data' => $exp], 201);
    }

    public function update(Request $request, $id)
    {
        $exp = InternExperience::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();
        $exp->update($request->only(['title', 'company', 'period']));
        return response()->json(['data' => $exp]);
    }

    public function destroy($id)
    {
        $exp = InternExperience::where('id', $id)
                    ->where('user_id', Auth::id())
                    ->firstOrFail();
        $exp->delete();
        return response()->json(['message' => 'Deleted']);
    }
}