<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Post;

class LikeController extends Controller
{
    public function toggle($postId)
    {
        $user = auth()->user();
        $userId = $user->id;

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

            // Obtener el post para saber a quién notificar
            $post = Post::find($postId);

            // Evitar enviar notificación si el usuario se da like a sí mismo
            if ($post && $post->user_id !== $userId) {
                Notification::create([
                    'user_id' => $post->user_id,         // propietario del post
                    'from_user_id' => $userId,           // quien da like
                    'type' => 'like',
                    'link' => '/post/' . $post->id,

                    'message' => 'A ' . $user->name . ' le ha gustado tu publicación',
                ]);
            }

            return response()->json(['liked' => true]);
        }
    }
}
