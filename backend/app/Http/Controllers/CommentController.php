<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Notification;


class CommentController extends Controller
{
       public function index($postId)
       {
              $comments = Comment::with('user')
                     ->where('post_id', $postId)
                     ->orderBy('created_at', 'asc') // o 'asc', tú eliges
                     ->paginate(5); // ✅ esto ya ejecuta

              return response()->json($comments);
       }

       public function store(Request $request, $postId)
       {
              $request->validate([
                     'content' => 'required|string|max:500',
              ]);

              $post = \App\Models\Post::findOrFail($postId);

              $comment = $post->comments()->create([
                     'user_id' => auth()->id(),
                     'content' => $request->content,
              ]);

              // Notificación si no comenta su propio post
              if ($post->user_id !== auth()->id()) {
                     \App\Models\Notification::create([
                            'user_id' => $post->user_id,
                            'from_user_id' => auth()->id(),
                            'type' => 'comment',
                            'link' => '/post/' . $post->id,
                            'message' => auth()->user()->name . ' comentó en tu publicación',
                     ]);
              }

              // 🔥 Aquí se carga la relación
              $comment->load('user');

              return response()->json($comment);
       }


       public function destroy($id)
       {
              $comment = Comment::find($id);

              if (!$comment) {
                     return response()->json(['message' => 'Comentario no encontrado.'], 404);
              }

              if ($comment->user_id !== auth()->id()) {
                     return response()->json(['message' => 'No autorizado para eliminar este comentario.'], 403);
              }

              $comment->delete();

              return response()->json(['message' => 'Comentario eliminado con éxito.'], 200);
       }
}
