import { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import ImageCropper from "./ImageCropper";

function CreatePost({ onPostCreated, user }) {
  const [rawImage, setRawImage] = useState(null); // archivo base64
  const [croppedBlob, setCroppedBlob] = useState(null); // blob recortado
  const [caption, setCaption] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setRawImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped) => {
    setCroppedBlob(cropped);
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
    formData.append("image", croppedBlob, "cropped.jpg");
    formData.append("caption", caption);
    formData.append("user_id", user.id);

    try {
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "¡Publicación creada!",
        timer: 1500,
        showConfirmButton: false,
      });

      onPostCreated(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al subir imagen",
        text: "Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">
        Crear publicación
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!rawImage ? (
          <div className="flex flex-col items-center">
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              Seleccionar imagen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        ) : (
          <>
            <ImageCropper
              image={rawImage}
              onCropComplete={handleCropComplete}
            />
            <button
              type="button"
              onClick={() => {
                setRawImage(null);
                setCroppedBlob(null);
              }}
              className="text-sm text-indigo-600 hover:underline transition-all"
            >
              Cambiar imagen
            </button>
          </>
        )}

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Escribe una descripción..."
          className="w-full p-2 border rounded resize-none h-24"
        />

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
          >
            Publicar
          </button>
          <button
            type="button"
            onClick={() => onPostCreated(null)}
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
