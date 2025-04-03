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
        // Validación de los datos recibidos
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6|confirmed', // Usamos "confirmed" para validar la coincidencia
                'bio' => 'nullable|string',
                'city' => 'nullable|string',
                'avatar_url' => 'nullable|url'
            ]);

            // Crear el nuevo usuario
            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = bcrypt($validated['password']); // Encriptamos la contraseña
            $user->bio = $validated['bio'] ?? null;
            $user->city = $validated['city'] ?? null;
            $user->avatar_url = $validated['avatar_url'] ?? null;
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

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if (Auth::id() !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:100',
            'bio' => 'nullable|string',
            'avatar_url' => 'nullable|url',
            'city' => 'nullable|string|max:255',
            // Puedes permitir cambiar el email si quieres
            // 'email' => 'sometimes|email|unique:users,email,' . $id,
            // Y también la contraseña (no te olvides del hash)
        ]);

        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado', 'user' => $user]);
    }
}
