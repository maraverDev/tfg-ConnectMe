import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

function CreatePost({ onPostCreated, user }) {
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return Swal.fire({
        icon: "warning",
        title: "Falta imagen",
        text: "Selecciona una imagen antes de publicar.",
      });
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("caption", caption);
    formData.append("user_id", user.id);

    try {
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "¡Publicación creada!",
        timer: 1500,
        showConfirmButton: false,
      });

      onPostCreated(res.data);
      setImageFile(null);
      setCaption("");
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la publicación.",
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">
        Crear publicación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de imagen con preview */}
        <div className="flex flex-col items-center justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="rounded-lg w-full h-64 object-cover mb-2"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Vista previa de la imagen
            </div>
          )}
          <label className="mt-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>

        {/* Descripción */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Escribe una descripción..."
          className="w-full p-2 border rounded resize-none h-24"
        />

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
          >
            Publicar
          </button>
          <button
            type="button"
            onClick={() => onPostCreated(null)} // Cancela y cierra
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
