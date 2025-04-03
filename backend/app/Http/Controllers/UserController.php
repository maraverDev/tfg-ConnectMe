<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'bio' => 'nullable|string',
            'avatar_url' => 'nullable|url',
            'city' => 'nullable|string|max:255',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        Auth::login($user); // Iniciar sesión automáticamente

        return response()->json(['message' => 'Registrado correctamente', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // 👈 Añade esta línea

            return response()->json([
                'message' => 'Login correcto',
                'user' => Auth::user(),
            ]);
        }

        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
