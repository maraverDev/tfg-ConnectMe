<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/users/{id}', [UserController::class, 'show']);

Route::middleware('auth')->group(function () {
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}', [UserController::class, 'update']);
});

// Listar todos los posts
Route::get('/posts', [PostController::class, 'index']); //indexposts

// Ver un post por ID
Route::get('/posts/{id}', [PostController::class, 'show']); //pag indv post

Route::middleware('auth')->group(function () {
    Route::delete('/posts/{id}', [PostController::class, 'destroy']); //borrar
    Route::post('/posts', [PostController::class, 'store']); //crear
    Route::put('/posts/{id}', [PostController::class, 'update']); //act
});
