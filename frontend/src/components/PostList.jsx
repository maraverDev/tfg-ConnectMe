import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PostList({ refresh }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/posts")
      .then((response) => setPosts(response.data))
      .catch((err) => console.error("Error al obtener posts:", err));
  }, [refresh]);

  return (
    <div className="max-w-7xl mx-auto">
      {posts.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          No hay publicaciones todavía. ¡Sé el primero en crear una! 🚀
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={post.image_url}
                alt="Post"
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-700 text-sm mb-2">
                  {post.caption || "Sin descripción."}
                </p>
                <div
                  className="flex items-center gap-3 mt-4 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.user.id}`)}
                >
                  <img
                    src={
                      post.user.avatar_url ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {post.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.user.city || "Ciudad desconocida"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
