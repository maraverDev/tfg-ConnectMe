import { useEffect, useState } from 'react';
import api from '../api';

function Profile({ user }) {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Cargar perfil del usuario
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then(res => setUserData(res.data))
        .catch(err => console.error('Error cargando perfil:', err));

      // Opcional: cargar sus publicaciones si la API lo permite
      api.get('/posts')
        .then(res => {
          const ownPosts = res.data.filter(post => post.user.id === user.id);
          setUserPosts(ownPosts);
        })
        .catch(err => console.error('Error cargando posts del usuario:', err));
    }
  }, [user]);

  if (!userData) return <p className="text-center mt-8 text-gray-500">Cargando perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <div className="flex items-center gap-4">
        <img
          src={userData.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'}
          alt="Avatar"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-600">{userData.city || 'Ciudad no especificada'}</p>
          <p className="text-sm text-gray-500 mt-2">{userData.bio || 'Sin biografía.'}</p>
          {userData.links && (
            <a
              href={userData.links}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 text-sm hover:underline mt-1 inline-block"
            >
              {userData.links}
            </a>
          )}
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Mis publicaciones</h3>

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
        <p className="text-sm text-gray-500">Aún no has publicado nada.</p>
      )}
    </div>
  );
}

export default Profile;
