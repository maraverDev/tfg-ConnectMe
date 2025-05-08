<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    // Listar todos los posts con usuario relacionado
    public function index()
    {
        $userId = Auth::id();

        $posts = \App\Models\Post::with(['user'])
            ->latest()
            ->get()
            ->map(function ($post) use ($userId) {
                $post->is_liked = $userId
                    ? $post->likes()->where('user_id', $userId)->exists()
                    : false;
                return $post;
            });
    
        return response()->json($posts);
    }

    // Crear un nuevo post (autenticado)
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // archivo de imagen
            'caption' => 'nullable|string',
        ]);

        // Guardar imagen en storage/app/public/posts
        $path = $request->file('image')->store('posts', 'public');

        $post = Post::create([
            'user_id' => Auth::id(), // autenticación basada en sesión
            'image_url' => asset('storage/' . $path),
            'caption' => $request->caption,
        ]);

        return response()->json([
            'message' => 'Post creado correctamente',
            'post' => $post,
        ], 201);
    }

    public function show($id)
    {
        $post = Post::with('user')->findOrFail($id);
    
        $post->is_liked = auth()->check()
            ? $post->likes()->where('user_id', auth()->id())->exists()
            : false;
    
        return response()->json($post);
    }

    // Eliminar un post (solo si pertenece al usuario)
    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $post->delete();
        return response()->json(['message' => 'Post eliminado']);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        // Verifica que el post le pertenezca al usuario autenticado
        if ($post->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'caption' => 'nullable|string',
            'image_url' => 'nullable|url',
        ]);

        $post->update($data);

        return response()->json([
            'message' => 'Post actualizado correctamente',
            'post' => $post,
        ]);
    }
}
