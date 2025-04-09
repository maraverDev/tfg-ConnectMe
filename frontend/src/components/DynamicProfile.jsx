import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function DynamicProfile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Perfil del usuario por ID
    api.get(`/api/users/${id}`)
      .then(res => setUserData(res.data))
      .catch(err => console.error('Error cargando perfil:', err));

    // Filtrar publicaciones propias
    api.get('/api/posts')
      .then(res => {
        const ownPosts = res.data.filter(post => post.user.id == id);
        setUserPosts(ownPosts);
      })
      .catch(err => console.error('Error cargando posts del usuario:', err));
  }, [id]);

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
        </div>
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

export default DynamicProfile;
