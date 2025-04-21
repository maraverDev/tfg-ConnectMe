import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

function EditarPerfil({ user, onProfileUpdated }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    city: user.city || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name,
      email: form.email,
      bio: form.bio,
      city: form.city,
    };

    try {
      // Hacemos la solicitud PUT al backend con los datos del formulario
      const response = await api.put(`/api/users/${user.id}`, data);

      // Llamamos a la función para actualizar el estado en el componente principal
      onProfileUpdated(response.data); // Pasamos el usuario actualizado

      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios han sido guardados.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">
        Editar Perfil
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="bio"
          placeholder="Biografía"
          className="w-full p-2 border rounded"
          value={form.bio}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          className="w-full p-2 border rounded"
          value={form.city}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarPerfil;
