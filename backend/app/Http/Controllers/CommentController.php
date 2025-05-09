<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
       public function index($postId)
       {
              $comments = Comment::with('user')
                     ->where('post_id', $postId)
                     ->orderBy('created_at', 'asc')
                     ->get();

              return response()->json($comments);
       }
       public function store(Request $request, $postId)
       {
              $request->validate([
                     'content' => 'required|string|max:1000',
              ]);

              $comment = new Comment();
              $comment->content = $request->content;
              $comment->user_id = auth()->id(); // 👤
              $comment->post_id = $postId;
              $comment->save();

              $comment->load('user');

              return response()->json($comment, 201);
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
