import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

function DynamicProfile() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredFollow, setHoveredFollow] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    city: "",
    email: "", // ✅ obligatorio aunque no editable
  });

  const isOwnProfile = currentUser?.id === parseInt(id);

  useEffect(() => {
    api
      .get("/api/user", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("Error obteniendo usuario:", err));
  }, []);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/users/${id}`)
      .then((res) => {
        setUserData(res.data);
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          city: res.data.city || "",
          email: res.data.email || "", // ✅ se guarda aunque no se edite
        });
      })
      .catch((err) => console.error("Error cargando perfil:", err));

    api
      .get("/api/posts")
      .then((res) => {
        const ownPosts = res.data.data
          .filter((post) => post.user.id == id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔥 orden por fecha
        setUserPosts(ownPosts);
      })
      .catch((err) => console.error("Error cargando posts:", err));

    api
      .get(`/api/users/${id}/followers-count`)
      .then((res) => setFollowers(res.data.followers));

    api
      .get(`/api/users/${id}/following-count`)
      .then((res) => setFollowing(res.data.following));

    api
      .get(`/api/users/${id}/follow`, { withCredentials: true })
      .then((res) => setIsFollowing(res.data.followed))
      .finally(() => setLoadingFollow(false));
  }, [id]);

  const toggleFollow = () => {
    api
      .post(`/api/users/${id}/follow`, {}, { withCredentials: true })
      .then((res) => setIsFollowing(res.data.followed))
      .catch((err) => console.error("Error follow:", err));
  };
  const handleDeletePost = async (postId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar publicación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/posts/${postId}`);
        setUserPosts((prev) => prev.filter((post) => post.id !== postId));
        Swal.fire(
          "¡Eliminado!",
          "La publicación ha sido eliminada.",
          "success"
        );
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar la publicación.", "error");
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/api/users/${id}`, form);
      setUserData(res.data);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios se han guardado correctamente.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil.",
      });
    }
  };

  if (!userData || !currentUser) {
    return <p className="text-center mt-8 text-gray-500">Cargando perfil...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                userData.avatar_url || "https://www.gravatar.com/avatar/?d=mp"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover shadow-lg"
            />
            {!isOwnProfile && !loadingFollow && (
              <button
                onClick={toggleFollow}
                onMouseEnter={() => setHoveredFollow(true)}
                onMouseLeave={() => setHoveredFollow(false)}
                className={`absolute bottom-0 right-0 p-2 rounded-full shadow-md transition-all duration-200
      ${
        isFollowing
          ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
                title={isFollowing ? "Dejar de seguir" : "Seguir"}
              >
                {isFollowing ? (
                  hoveredFollow ? (
                    // Ícono X (hover para dejar de seguir)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M15 16L20 21M20 16L15 21M4 21C4 17.134 7.13401 14 11 14M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" />
                    </svg>
                  ) : (
                    // Ícono check/persona seguida
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M4 21C4 17.4735 6.60771 14.5561 10 14.0709M16.4976 16.2119C15.7978 15.4328 14.6309 15.2232 13.7541 15.9367C12.8774 16.6501 12.7539 17.843 13.4425 18.6868C13.8312 19.1632 14.7548 19.9983 15.4854 20.6353C15.8319 20.9374 16.0051 21.0885 16.2147 21.1503C16.3934 21.203 16.6018 21.203 16.7805 21.1503C16.9901 21.0885 17.1633 20.9374 17.5098 20.6353C18.2404 19.9983 19.164 19.1632 19.5527 18.6868C20.2413 17.843 20.1329 16.6426 19.2411 15.9367C18.3492 15.2307 17.1974 15.4328 16.4976 16.2119ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" />
                    </svg>
                  )
                ) : (
                  // Ícono de agregar
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M20 18L14 18M17 15V21M4 21C4 17.134 7.13401 14 11 14C11.695 14 12.3663 14.1013 13 14.2899M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" />
                  </svg>
                )}
              </button>
            )}

            {isOwnProfile &&
              (isEditing ? (
                <button
                  onClick={handleSave}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                  >
                    <path
                      d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                  >
                    <path
                      d="M4 21C4 17.134 7.13401 14 11 14C11.3395 14 11.6734 14.0242 12 14.0709M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7ZM12.5898 21L14.6148 20.595C14.7914 20.5597 14.8797 20.542 14.962 20.5097C15.0351 20.4811 15.1045 20.4439 15.1689 20.399C15.2414 20.3484 15.3051 20.2848 15.4324 20.1574L19.5898 16C20.1421 15.4477 20.1421 14.5523 19.5898 14C19.0376 13.4477 18.1421 13.4477 17.5898 14L13.4324 18.1574C13.3051 18.2848 13.2414 18.3484 13.1908 18.421C13.1459 18.4853 13.1088 18.5548 13.0801 18.6279C13.0478 18.7102 13.0302 18.7985 12.9948 18.975L12.5898 21Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isOwnProfile && isEditing ? (
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
            <p className="text-gray-600">
              {isOwnProfile && isEditing ? (
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
            <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              {isOwnProfile && isEditing ? (
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

            <div className="flex gap-4 mt-2">
              <span className="text-sm text-gray-600">
                <strong>{followers}</strong> seguidores
              </span>
              <span className="text-sm text-gray-600">
                <strong>{following}</strong> seguidos
              </span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Publicaciones
      </h3>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="relative rounded overflow-hidden shadow border"
            >
              <img
                src={post.image_url}
                alt="Post"
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="text-sm text-gray-700">{post.caption}</p>
              </div>

              {/* Botón eliminar (solo si es tu propio perfil) */}
              {isOwnProfile && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Este usuario aún no ha publicado nada.
        </p>
      )}
    </div>
  );
}

export default DynamicProfile;
