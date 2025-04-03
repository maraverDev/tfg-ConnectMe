import { useState } from "react";
import Navbar from "./components/Navbar";
import AuthPanel from "./components/AuthPanel";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import Profile from "./components/Profile"; // ← este es el importante
import api from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState("home"); // 'home', 'auth', 'profile'

  const handlePostCreated = () => setRefresh((prev) => !prev);

  const handleLogout = async () => {
    await api.post("/logout");
    setUser(null);
    setView("home");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* NAVBAR siempre visible */}
      <Navbar user={user} onLogout={handleLogout} onShowAuth={setView} />

      {/* 🔽 AQUÍ EMPIEZA el renderizado del contenido dinámico */}
      <div className="p-6">
        {/* Si está en vista auth y no logueado */}
        {view === "auth" && !user && (
          <AuthPanel
            onLogin={(userData) => {
              setUser(userData);
              setView("home");
            }}
            onRegister={(userData) => {
              setUser(userData);
              setView("home");
            }}
          />
        )}

        {/* Vista perfil */}
        {user && view === "profile" && <Profile user={user} />}

        {/* Vista principal de posts */}
        {user && view === "home" && (
          <>
            <CreatePost onPostCreated={handlePostCreated} />
            <PostList refresh={refresh} />
          </>
        )}

        {/* Si está en home sin iniciar sesión */}
        {!user && view === "home" && (
          <div className="text-center text-gray-500 mt-10">
            Inicia sesión para ver publicaciones 🎨
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
