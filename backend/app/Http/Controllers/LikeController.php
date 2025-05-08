<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends Controller
{
    public function toggle($postId)
    {
        $userId = auth()->id();

        $existing = Like::where('post_id', $postId)
                        ->where('user_id', $userId)
                        ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['liked' => false]);
        } else {
            Like::create([
                'post_id' => $postId,
                'user_id' => $userId,
            ]);
            return response()->json(['liked' => true]);
        }
    }
}
