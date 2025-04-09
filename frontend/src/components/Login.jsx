import { useState } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Todos los campos son obligatorios.'
      });
      return;
    }

    try {
      // Paso 1: Obtener cookie CSRF
      await api.get('/sanctum/csrf-cookie');

      // Paso 2: Hacer login
      await api.post('/api/login', form);

      // Paso 3: Obtener usuario autenticado desde Sanctum
      const userResponse = await api.get('/api/user');
      onLogin(userResponse.data);

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido de nuevo!',
        text: 'Has iniciado sesión correctamente.',
        background: '#f5f5f5',
        confirmButtonColor: '#4338CA'
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Correo o contraseña incorrectos.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="w-full p-2 border rounded"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
      >
        Iniciar sesión
      </button>
    </form>
  );
}

export default Login;
