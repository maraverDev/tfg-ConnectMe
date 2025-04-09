<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

use App\Http\Controllers\UserController;

Route::middleware(['web'])->group(function () {
    Route::post('/api/register', [UserController::class, 'register']);
});


Route::middleware(['web'])->group(function () {
    Route::post('/api/login', [UserController::class, 'login']);
});

Route::middleware(['web'])->group(function () {
    Route::post('/api/logout', [UserController::class, 'logout']);
});