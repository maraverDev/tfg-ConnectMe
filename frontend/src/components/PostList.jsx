import { useEffect, useState } from "react";
import api from "../api";

function PostList({ refresh }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/posts")
      .then((response) => setPosts(response.data))
      .catch((err) => console.error("Error al obtener posts:", err));
  }, [refresh]); // ← se actualiza al crear un nuevo post

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <img
            src={post.image_url}
            alt="Post"
            className="w-full h-56 object-cover"
          />
          <div className="p-4">
            <p className="text-gray-700 text-sm mb-2">{post.caption}</p>
            <div className="flex items-center gap-3 mt-4">
              <img
                src={post.user.avatar_url}
                alt={post.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {post.user.name}
                </p>
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
