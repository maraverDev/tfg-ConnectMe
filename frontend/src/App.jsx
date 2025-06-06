import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ajusta el path según tu estructura
import ChatPrivate from "./components/ChatPrivate";

import EditProfile from "./components/EditProfile";
import AuthPanel from "./components/AuthPanel";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import NotificationsPage from "./components/NotificationsPage";

import DynamicProfile from "./components/DynamicProfile";
import Chat from "./components/Chat"; // 💬 Nuevo: Componente de Chat
import api from "./api";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [refresh, setRefresh] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false); // 💬 Nuevo: Estado para el chat
  const [privateTarget, setPrivateTarget] = useState(null);

  const navigate = useNavigate();

  // ✅ Verificar sesión solo una vez al cargar
  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const res = await api.get("/api/user");
          if (res.data) {
            setUser(res.data); // Actualiza el estado con el usuario desde la API
          }
        } catch (err) {
          console.error("No autenticado");
        }
      }
      setLoading(false); // Termina de cargar una vez verificado el estado
    };

    fetchUser();
  }, []); // El arreglo vacío hace que solo se ejecute al montarse el componente

  useEffect(() => {
    let lastCount = user?.unread_notifications || 0;

    const interval = setInterval(() => {
      api
        .get("/api/user", { withCredentials: true })
        .then((res) => {
          const newCount = res.data.unread_notifications;

          if (newCount > lastCount) {
            // 🔔 Sonido
            const audio = new Audio("public/follow.mp3");
            audio
              .play()
              .catch((err) =>
                console.warn("No se pudo reproducir el sonido:", err)
              );

            // 🍞 Toastify
            toast.info("¡Nueva notificación!", {
              icon: "🔔",
              theme: "light",
            });
          }

          lastCount = newCount;
          setUser(res.data);
        })
        .catch((err) => console.error("Error actualizando usuario:", err));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const userTarget = e.detail;
      setPrivateTarget(userTarget);
      if (userTarget?.id) {
        navigate(`/chat/${userTarget.id}`);
      }
    };

    window.addEventListener("openPrivateChat", handler);
    return () => window.removeEventListener("openPrivateChat", handler);
  }, [navigate]);

  // Guardar usuario después de login o register
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Cerrar sesión correctamente
  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      localStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser); // Actualiza el estado con los nuevos datos del usuario
  };

  const handlePostCreated = () => setRefresh((prev) => !prev);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* NAVBAR */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onShowCreatePost={() => setShowCreate(true)}
        onToggleChat={() => setShowChat((prev) => !prev)} // 💬 Control del chat
      />

      {/* MODAL CREAR POST */}
      {user && showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-xl">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
            <CreatePost
              onPostCreated={(p) => {
                handlePostCreated(p);
                setShowCreate(false);
              }}
              user={user}
            />
          </div>
        </div>
      )}

      {/* CHAT EN VIVO */}
      {showChat && <Chat user={user} onClose={() => setShowChat(false)} />}

      {/* RUTAS */}
      <div className="flex-grow p-6">
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={
              <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={
              <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
            }
          />

          {/* Home / Lista de publicaciones */}
          <Route
            path="/home"
            element={
              user ? (
                <PostList refresh={refresh} />
              ) : (
                <div className="text-center mt-10 text-gray-500">
                  Inicia sesión para ver publicaciones 🎨
                </div>
              )
            }
          />

          {/* Root redirige al home si hay user */}
          <Route
            path="/"
            element={
              user ? (
                <PostList refresh={refresh} />
              ) : (
                <div className="text-center mt-10 text-gray-500">
                  Inicia sesión para ver publicaciones 🎨
                </div>
              )
            }
          />

          {/* Perfil de otro usuario */}
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/profile/:id" element={<DynamicProfile />} />

          <Route
            path="/profile/edit"
            element={
              <EditProfile
                user={user}
                onProfileUpdated={handleProfileUpdated}
              />
            }
          />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/chat/:id"
            element={<ChatPrivate user={user} target={privateTarget} />}
          />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
