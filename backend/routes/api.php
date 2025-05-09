<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\FollowController;

// 🔐 Usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 🧑‍💼 Usuarios (ver perfil)
Route::get('/users/{id}', [UserController::class, 'show']);
Route::get('/users/{id}/followers-count', [FollowController::class, 'followersCount']);
Route::get('/users/{id}/following-count', [FollowController::class, 'followingCount']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/users/{id}', [UserController::class, 'update'])->middleware('throttle:5,1'); // 5 req/min
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('throttle:3,1'); // 3 req/min

    // 👥 Follows
    Route::post('/users/{id}/follow', [FollowController::class, 'toggleFollow'])->middleware('throttle:10,1'); // evitar spam
    Route::get('/users/{id}/follow', [FollowController::class, 'isFollowing']);
});

// 📝 Posts públicos
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// 📝 Posts protegidos
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store'])->middleware('throttle:3,1'); // 3 posts/min
    Route::put('/posts/{id}', [PostController::class, 'update'])->middleware('throttle:5,1');
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])->middleware('throttle:5,1');

    Route::post('/posts/{id}/like', [LikeController::class, 'toggle'])->middleware('throttle:30,1'); // proteger de spam masivo
});

// 💬 Comentarios
Route::get('/posts/{id}/comments', [CommentController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->middleware('throttle:6,1'); // 1 comentario / 10s
    Route::delete('/comments/{id}', [CommentController::class, 'destroy'])->middleware('throttle:5,1'); // borrar protegido
});
