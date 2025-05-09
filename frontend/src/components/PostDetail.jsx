import { useRef } from "react";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { FaHeart, FaArrowLeft, FaHeartBroken } from "react-icons/fa";
import { motion } from "framer-motion";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hovered, setHovered] = useState(false);
  const [pop, setPop] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    api.get(`/api/posts/${id}`).then((res) => {
      setPost(res.data);
      setIsLiked(res.data.is_liked || false);
    });

    api
      .get("/api/user", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("Error obteniendo usuario:", err));

    api.get(`/api/posts/${id}/comments`).then((res) => {
      setComments(res.data);
    });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [id]);

  const toggleLike = async () => {
    try {
      await api.post(`/api/posts/${id}/like`);
      setIsLiked((prev) => !prev);
      setPost((prev) => ({
        ...prev,
        likes_count: prev.likes_count + (isLiked ? -1 : 1),
      }));

      // animación tipo "pop"
      setPop(true);
      setTimeout(() => setPop(false), 150);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/api/posts/${id}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error al comentar:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };
  if (!post)
    return <p className="text-center mt-10">Cargando publicación...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:text-black flex items-center gap-2"
      >
        <FaArrowLeft /> Volver
      </button>

      <motion.div
        className="bg-white shadow-lg rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={post.image_url}
          alt="Post"
          className="w-full h-80 object-cover"
        />
        <div className="p-4">
          <p className="text-gray-700 text-lg mb-4">{post.caption}</p>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                post.user.avatar_url || "https://www.gravatar.com/avatar/?d=mp"
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

          {/* Botón de like con transición suave */}

          <div className="flex items-center gap-2">
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={toggleLike}
              className={`relative w-6 h-6 flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
            >
              <span
                className={`absolute transition-opacity duration-200 ${
                  isLiked && hovered ? "opacity-0" : "opacity-100"
                }`}
              >
                <FaHeart size={20} />
              </span>

              <span
                className={`absolute transition-opacity duration-200 ${
                  isLiked && hovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <FaHeartBroken size={20} />
              </span>
            </div>

            <span
              className={`text-md text-gray-600 transition-transform duration-150 mb-0.5 ${
                pop ? "scale-125" : "scale-100"
              }`}
            >
              {post.likes_count}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Comentarios */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">No hay comentarios aún.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="bg-gray-100 p-3 rounded-md relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      por {comment.user?.name || "Anónimo"}
                    </p>
                  </div>

                  {/* Botón de tres puntos */}
                  <button
                    className="text-gray-500 hover:text-black"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === comment.id ? null : comment.id
                      )
                    }
                  >
                    &#8942;
                  </button>
                </div>

                {/* Menú desplegable */}
                {openMenuId === comment.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-3 top-10 bg-white border rounded shadow p-2 z-10 w-40"
                  >
                    {currentUser?.id === comment.user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="block w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
                      >
                        Eliminar
                      </button>
                    )}
                    <button
                      onClick={() => alert("Comentario reportado")}
                      className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 px-2 py-1"
                    >
                      Denunciar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulario para comentar */}
      <form onSubmit={handleCommentSubmit} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="Escribe un comentario..."
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Comentar
        </button>
      </form>
    </div>
  );
}

export default PostDetail;
