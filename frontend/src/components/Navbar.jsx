import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid"; // Asegúrate de tener instalado Heroicons
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

function Navbar({ user, onLogout, onShowCreatePost }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        ConnectMe
      </h1>

      {user ? (
        <div className="flex items-center gap-4">
          {/* Botón para añadir post */}
          <button
            onClick={onShowCreatePost}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 flex items-center gap-1 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Añadir</span>
          </button>

          {/* Avatar dropdown */}
          <div className="relative">
            <img
              src={user.avatar_url || defaultAvatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  Mi perfil
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={onLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      )}
    </nav>
  );
}

export default Navbar;
