import { useEffect, useState } from "react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid"; // Importamos los iconos
import api from "../api";

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Estado para habilitar la edición
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    city: user.city || "",
  });

  useEffect(() => {
    if (user?.id) {
      // Perfil
      api
        .get(`/api/users/${user.id}`)
        .then((res) => setUserData(res.data))
        .catch((err) => console.error("Error cargando perfil:", err));

      // Posts propios
      api
        .get("/api/posts")
        .then((res) => {
          const ownPosts = res.data.filter((post) => post.user.id === user.id);
          setUserPosts(ownPosts);
        })
        .catch((err) =>
          console.error("Error cargando posts del usuario:", err)
        );
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/api/users/${user.id}`, form);
      setUserData(response.data);
      setIsEditing(false); // Deshabilitar la edición después de guardar

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios han sido guardados.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Hubo un problema al actualizar tu perfil. Inténtalo de nuevo.",
      });
    }
  };

  if (!userData)
    return <p className="text-center mt-8 text-gray-500">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      {/* Contenedor del avatar y el nombre */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                userData.avatar_url || "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover shadow-lg"
            />
            {/* Icono de editar */}
            {/* <button
              onClick={() => setIsEditing(!isEditing)}  // Cambia el modo de edición
              className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
            >
              {isEditing ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <PencilIcon className="w-5 h-5" />
              )}
            </button> */}

            {isEditing ? (
              <button
                onClick={handleSave}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)} // Activa el modo de edición
                className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Información del usuario */}
          <div>
            {/* Nombre editable */}
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded-md"
                  value={form.name}
                  onChange={handleChange}
                />
              ) : (
                userData.name
              )}
            </h2>

            {/* Ciudad editable */}
            <p className="text-gray-600">
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  className="w-full p-2 border rounded-md"
                  value={form.city}
                  onChange={handleChange}
                />
              ) : (
                userData.city || "Ciudad no especificada"
              )}
            </p>

            {/* Biografía editable */}
            <p className="text-sm text-gray-500 mt-2">
              {isEditing ? (
                <textarea
                  name="bio"
                  className="w-full p-2 border rounded-md"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                userData.bio || "Sin biografía."
              )}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      {/* Sección de publicaciones */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Mis publicaciones
      </h3>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg overflow-hidden shadow-lg border"
            >
              <img
                src={post.image_url}
                alt="Post"
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="text-sm text-gray-700">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aún no has publicado nada.</p>
      )}
    </div>
  );
}

export default Profile;
