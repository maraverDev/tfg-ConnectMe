<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function register(Request $request)
    {
        // Validación de los datos recibidos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6|confirmed', // Usamos "confirmed" para la validación de contraseñas
                'bio' => 'nullable|string',
                'city' => 'nullable|string',
                'avatar_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048' // Validación para imagen
            ]);

            // Crear el nuevo usuario
            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = bcrypt($validated['password']); // Encriptamos la contraseña
            $user->bio = $validated['bio'] ?? null;
            $user->city = $validated['city'] ?? null;

            // Subir la imagen de perfil
            if ($request->hasFile('avatar_url')) {
                // Guardamos la imagen en la carpeta 'avatars' en 'public'
                $path = $request->file('avatar_url')->store('avatars', 'public');
                $user->avatar_url = asset('storage/' . $path); // Guardamos la URL pública de la imagen
            }

            $user->save();

            // Iniciar sesión automáticamente después del registro
            Auth::login($user);

            return response()->json(['user' => $user], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Si hay un error de validación, devolver los mensajes al frontend
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Si ocurre cualquier otro tipo de error, devolver mensaje genérico
            return response()->json([
                'error' => 'Hubo un problema al registrar el usuario. Inténtalo de nuevo más tarde.'
            ], 500);
        }
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

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'bio' => 'nullable|string',
            'avatar_url' => 'nullable|image',
            'city' => 'nullable|string|max:255',
        ]);

        // Si hay una nueva imagen
        if ($request->hasFile('avatar_url')) {
            $imagePath = $request->file('avatar_url')->store('avatars', 'public');
            $data['avatar_url'] = asset('storage/' . $imagePath);
        }

        $user->update($data);

        return response()->json(['message' => 'Perfil actualizado', 'user' => $user]);
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // importante para Sanctum

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada']);
    }
}
