import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import api from "../api";
import Swal from "sweetalert2";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    bio: "",
    city: "",
    avatar_url: "",
    termsAccepted: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, termsAccepted: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.password_confirmation
    ) {
      return Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Todos los campos son obligatorios.",
      });
    }

    if (form.password !== form.password_confirmation) {
      return Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Las contraseñas no coinciden.",
      });
    }

    if (!form.termsAccepted) {
      return Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Debes aceptar los términos y condiciones.",
      });
    }

    if (!form.avatar_url) {
      form.avatar_url = "https://www.example.com/default-avatar.png";
    }

    try {
      // Paso 1: Obtener cookie CSRF
      // 👇 PRIMERO obtén el token CSRF
      await api.get("/sanctum/csrf-cookie");

      // 👇 AHORA envía el formulario como JSON normal
      const response = await api.post("/api/register", form);

      // 👇 Consulta el usuario autenticado
      const userResponse = await api.get("/api/user");
      onRegister(userResponse.data);

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Bienvenido a la plataforma.",
        background: "#f5f5f5",
        confirmButtonColor: "#4CAF50",
      });
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errors = err.response.data.errors;
        for (let field in errors) {
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: errors[field].join(" "),
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Hubo un problema al registrarse. Inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        className="w-full p-2 border rounded"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={handleChange}
        required
      />

      {/* Contraseña */}
      <div className="relative">
        <input
          type={passwordVisible ? "text" : "password"}
          name="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-2.5 text-gray-500"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Confirmar Contraseña */}
      <div className="relative">
        <input
          type={confirmPasswordVisible ? "text" : "password"}
          name="password_confirmation"
          placeholder="Confirmar contraseña"
          className="w-full p-2 border rounded"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-2.5 text-gray-500"
          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          {confirmPasswordVisible ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <input
        type="text"
        name="avatar_url"
        placeholder="URL del avatar (opcional)"
        className="w-full p-2 border rounded"
        value={form.avatar_url}
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="Ciudad"
        className="w-full p-2 border rounded"
        value={form.city}
        onChange={handleChange}
        required
      />
      <textarea
        name="bio"
        placeholder="Biografía"
        className="w-full p-2 border rounded"
        value={form.bio}
        onChange={handleChange}
        required
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          name="termsAccepted"
          id="termsAccepted"
          checked={form.termsAccepted}
          onChange={handleCheckboxChange}
          className="mr-2"
          required
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-600">
          Acepto los{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            términos y condiciones
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
      >
        Registrarse
      </button>
    </form>
  );
}

export default Register;
