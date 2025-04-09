<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

// Autenticación
// Route::post('/register', [UserController::class, 'register']);
// Route::post('/login', [UserController::class, 'login']);
// Route::post('/logout', [UserController::class, 'logout']);

// Ruta especial para Sanctum - devuelve el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Usuarios públicos (ver perfil)
Route::get('/users/{id}', [UserController::class, 'show']);

// Rutas protegidas con Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});

// Posts públicos (cualquiera puede verlos)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);
