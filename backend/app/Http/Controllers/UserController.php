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
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:100'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[a-z]/',      // al menos una minúscula
                    'regex:/[A-Z]/',      // al menos una mayúscula
                    'regex:/[0-9]/',      // al menos un número
                    'regex:/[@$!%*#?&]/'  // al menos un carácter especial
                ],
                'bio' => ['nullable', 'string'],
                'city' => ['nullable', 'string', 'max:100'],
                'avatar_url' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:1000'],
            ], [
                'name.required' => 'El nombre es obligatorio.',
                'email.required' => 'El correo electrónico es obligatorio.',
                'email.email' => 'El correo electrónico no es válido.',
                'email.unique' => 'Este correo ya está en uso.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.confirmed' => 'Las contraseñas no coinciden.',
                'password.regex' => 'La contraseña debe contener una mayúscula, una minúscula, un número y un símbolo.',
                'avatar_url.image' => 'El archivo debe ser una imagen.',
                'avatar_url.mimes' => 'La imagen debe ser de tipo jpeg, png, jpg, gif o svg.',
            ]);


            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = bcrypt($validated['password']);
            $user->bio = $validated['bio'] ?? null;
            $user->city = $validated['city'] ?? null;

            if ($request->hasFile('avatar_url')) {
                $path = $request->file('avatar_url')->store('avatars', 'public');
                $user->avatar_url = asset('storage/' . $path);
            }

            $user->save();

            Auth::login($user);

            return response()->json(['user' => $user], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
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
        // Encontrar al usuario
        $user = User::findOrFail($id);

        // Validación de los datos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email', // Asegúrate de que el email es válido
            'bio' => 'nullable|string',
            'city' => 'nullable|string|max:255',
        ]);

        // Actualizar los datos del usuario
        $user->name = $validated['name'];
        $user->email = $validated['email']; // Aseguramos que el email sea válido
        $user->bio = $validated['bio'] ?? $user->bio;
        $user->city = $validated['city'] ?? $user->city;

        // Guardar los cambios
        $user->save();

        // Devolver el usuario actualizado
        return response()->json($user, 200);
    }





    public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // importante para Sanctum

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Sesión cerrada']);
    }
    public function search(Request $request)
    {
        $query = $request->input('search');

        $users = User::where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'avatar_url')
            ->limit(5)
            ->get();

        return response()->json($users);
    }
}
