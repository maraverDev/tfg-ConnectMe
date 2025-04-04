import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useParams } from "react-router-dom";
import DynamicProfile from "./components/DynamicProfile"; // ← Importa este nuevo


import Navbar from "./components/Navbar";
import AuthPanel from "./components/AuthPanel";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import Profile from "./components/Profile";
import api from "./api";


function App() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const handlePostCreated = () => setRefresh((prev) => !prev);

  const handleLogout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* NAVBAR siempre visible */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          onShowCreatePost={() => setShowCreate(true)}
        />

        {/* Modal para Crear Post */}
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

        {/* 🔽 Renderizado dinámico */}
        <div className="p-6">
          <Routes>
            {/* Login */}
            <Route
              path="/login"
              element={
                <AuthPanel
                  initialTab="login"
                  onLogin={(userData) => {
                    setUser(userData);
                  }}
                />
              }
            />

            {/* Register */}
            <Route
              path="/register"
              element={
                <AuthPanel
                  initialTab="register"
                  onRegister={(userData) => {
                    setUser(userData);
                  }}
                />
              }
            />

            {/* Perfil */}
            <Route
              path="/profile"
              element={
                user ? <Profile user={user} /> : <div>Acceso no autorizado</div>
              }
            />

            {/* Home */}
            <Route
              path="/home"
              element={
                user ? (
                  <PostList refresh={refresh} />
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    Inicia sesión para ver publicaciones 🎨
                  </div>
                )
              }
            />

            {/* Root */}
            <Route
              path="/"
              element={
                user ? (
                  <PostList refresh={refresh} />
                ) : (
                  <div className="text-center text-gray-500 mt-10">
                    Inicia sesión para ver publicaciones 🎨
                  </div>
                )
              }
            />

            <Route path="/profile/:id" element={<DynamicProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
