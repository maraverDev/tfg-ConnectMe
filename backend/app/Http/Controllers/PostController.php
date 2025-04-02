<?php

namespace App\Http\Controllers;

use App\Models\Post;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'image_url' => 'required|string',
            'caption' => 'nullable|string',
        ]);

        $post = Post::create($validated);

        return response()->json($post, 201);
    }
}
