import { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';
import ImageCropper from './ImageCropper';  // Reutilizamos el ImageCropper
import { RotateCcw } from 'lucide-react';

function EditarPerfil({ user, onProfileUpdated }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    city: user.city || '',
    avatar_url: null, // Almacena la imagen seleccionada
  });

  const [rawImage, setRawImage] = useState(null); // Imagen seleccionada
  const [croppedBlob, setCroppedBlob] = useState(null); // Imagen recortada

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setRawImage(reader.result);  // Guardamos la imagen seleccionada
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped) => {
    setCroppedBlob(cropped);  // Imagen recortada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!croppedBlob) {
      return Swal.fire({
        icon: "warning",
        title: "Selecciona y recorta una imagen.",
      });
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("bio", form.bio);
    formData.append("city", form.city);

    // Si la imagen ha sido recortada, la agregamos al FormData
    if (croppedBlob) {
      formData.append("avatar_url", croppedBlob, "avatar.jpg");
    }

    try {
      // Paso 1: Actualizar perfil con FormData
      const response = await api.put(`/api/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Paso 2: Notificar éxito
      onProfileUpdated(response.data);

      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios han sido guardados.",
        confirmButtonColor: "#4CAF50",
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
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">Editar Perfil</h2>

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
          disabled
        />

        <div className="relative">
          <input
            type="text"
            name="bio"
            placeholder="Biografía"
            className="w-full p-2 border rounded"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          className="w-full p-2 border rounded"
          value={form.city}
          onChange={handleChange}
        />

        {/* Avatar */}
        <div className="flex justify-center items-center w-full h-56 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-indigo-500 transition">
          <label className="flex flex-col justify-center items-center w-full h-full cursor-pointer px-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-sm text-gray-500 text-center">Selecciona una imagen</span>
          </label>
        </div>

        {/* Imagen recortada */}
        {rawImage && (
          <div className="mt-4">
            <ImageCropper image={rawImage} onCropComplete={handleCropComplete} />
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => {
                  setRawImage(null);
                  setCroppedBlob(null);
                }}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Cambiar imagen
              </button>
            </div>
          </div>
        )}

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
