import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

function Profile() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    city: ""
  });

  const isOwnProfile = currentUser?.id === parseInt(id);

  useEffect(() => {
    api.get("/api/user", { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("Error obteniendo usuario:", err));
  }, []);

  useEffect(() => {
    if (!id) return;

    api.get(`/api/users/${id}`)
      .then(res => {
        setUserData(res.data);
        setForm({
          name: res.data.name || "",
          bio: res.data.bio || "",
          city: res.data.city || ""
        });
      })
      .catch(err => console.error("Error cargando perfil:", err));

    api.get("/api/posts")
      .then(res => {
        const ownPosts = res.data.filter(post => post.user.id == id);
        setUserPosts(ownPosts);
      })
      .catch(err => console.error("Error cargando posts:", err));

    api.get(`/api/users/${id}/followers-count`)
      .then(res => setFollowers(res.data.followers));

    api.get(`/api/users/${id}/following-count`)
      .then(res => setFollowing(res.data.following));

    api.get(`/api/users/${id}/follow`, { withCredentials: true })
      .then(res => setIsFollowing(res.data.followed))
      .finally(() => setLoadingFollow(false));
  }, [id]);

  const toggleFollow = () => {
    api.post(`/api/users/${id}/follow`, {}, { withCredentials: true })
      .then(res => setIsFollowing(res.data.followed))
      .catch(err => console.error("Error follow:", err));
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
              src={userData.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 object-cover shadow-lg"
            />
            {isOwnProfile && (
              isEditing ? (
                <button
                  onClick={handleSave}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-all"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              )
            )}
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

        {!isOwnProfile && !loadingFollow && (
          <button
            onClick={toggleFollow}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Publicaciones</h3>

      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userPosts.map((post) => (
            <div key={post.id} className="rounded overflow-hidden shadow border">
              <img src={post.image_url} alt="Post" className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-700">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Este usuario aún no ha publicado nada.</p>
      )}
    </div>
  );
}

export default Profile;
