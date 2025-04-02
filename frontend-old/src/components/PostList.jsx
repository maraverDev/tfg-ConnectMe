import { useEffect, useState } from 'react';
import api from '../api';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts').then(response => {
      setPosts(response.data);
    }).catch(error => {
      console.error('Error al obtener posts:', error);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map(post => (
        <div key={post.id} className="bg-white shadow-md rounded-xl p-4">
          <img src={post.image_url} alt="Post" className="rounded-md w-full h-auto" />
          <div className="mt-3">
            <p className="text-sm text-gray-600">{post.caption}</p>
            <div className="flex items-center mt-3">
              <img src={post.user.avatar_url} alt={post.user.name} className="w-8 h-8 rounded-full mr-2" />
              <div>
                <p className="text-sm font-semibold">{post.user.name}</p>
                <p className="text-xs text-gray-500">{post.user.city}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
