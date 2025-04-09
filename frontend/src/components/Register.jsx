import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import api from "../api";
import Swal from "sweetalert2";
import ImageCropper from "./ImageCropper";  // Importamos ImageCropper
import { Image as ImageIcon, RotateCcw } from "lucide-react";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    bio: "",
    city: "",
    avatar_url: null, // Guardamos el archivo de la imagen
    termsAccepted: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [rawImage, setRawImage] = useState(null); // La imagen sin recortar
  const [croppedBlob, setCroppedBlob] = useState(null); // La imagen recortada

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, termsAccepted: e.target.checked });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setRawImage(reader.result); // Guardamos la imagen sin recortar
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped) => {
    setCroppedBlob(cropped); // Guardamos la imagen recortada
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
    formData.append("password", form.password);
    formData.append("password_confirmation", form.password_confirmation);
    formData.append("bio", form.bio);
    formData.append("city", form.city);
    formData.append("termsAccepted", form.termsAccepted);

    // Si la imagen ha sido recortada, la agregamos al FormData
    if (croppedBlob) {
      formData.append("avatar_url", croppedBlob, "avatar.jpg");
    }

    try {
      // Paso 1: Obtener cookie CSRF
      await api.get("/sanctum/csrf-cookie");

      // Paso 2: Enviar los datos con FormData
      const response = await api.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Necesario para enviar archivos
        },
      });

      // Paso 3: Consultar al usuario autenticado
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

      {/* Avatar */}
      <div className="flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-indigo-500 transition relative">
        <label className="flex flex-col justify-center items-center w-full h-64 cursor-pointer px-4">
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            Haz clic para seleccionar una imagen
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {/* Previsualización y recorte de imagen */}
        {rawImage && (
          <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-64">
            <ImageCropper
              image={rawImage}
              onCropComplete={handleCropComplete}
            />
          </div>
        )}
      </div>

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
