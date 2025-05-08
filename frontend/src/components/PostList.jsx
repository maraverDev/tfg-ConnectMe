import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCommentDots, FaEye, FaHeartBroken } from "react-icons/fa";

function PostList({ refresh }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/posts")
      .then((response) => {
        const postsWithLikes = response.data.map((post) => ({
          ...post,
          liked: post.is_liked || false,
          isHovered: false, // 👈 para el hover individual
        }));
        setPosts(postsWithLikes);
      })
      .catch((err) => console.error("Error al obtener posts:", err));
  }, [refresh]);

  const toggleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, liked: !post.liked } : post
        )
      );
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleHover = (postId, value) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isHovered: value } : post
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
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
                <p className="text-gray-700 text-sm mb-3">
                  {post.caption || "Sin descripción."}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    onMouseEnter={() => handleHover(post.id, true)}
                    onMouseLeave={() => handleHover(post.id, false)}
                    className={`relative w-6 h-6 flex items-center justify-center transition-colors duration-300 ${
                      post.liked
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <span
                      className={`absolute transition-opacity duration-300 ${
                        post.liked && post.isHovered
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                    >
                      <FaHeart size={18} />
                    </span>

                    <span
                      className={`absolute transition-opacity duration-300 ${
                        post.liked && post.isHovered
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <FaHeartBroken size={18} />
                    </span>
                  </button>

                  <button
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                  >
                    <FaEye size={18} />
                  </button>

                  <button
                    onClick={() => navigate(`/post/${post.id}#comentarios`)}
                    className="text-gray-500 hover:text-purple-500 transition-colors duration-200"
                  >
                    <FaCommentDots size={18} />
                  </button>
                </div>

                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${post.user.id}`)}
                >
                  <img
                    src={
                      post.user.avatar_url ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full border object-cover"
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
