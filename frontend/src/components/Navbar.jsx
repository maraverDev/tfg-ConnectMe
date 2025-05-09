import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid"; // Asegúrate de tener instalado Heroicons
import { BellIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";
import api from "../api";

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

function Navbar({ user, onLogout, onShowCreatePost, setUser }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user && showNotifications) {
      api.get("/api/notifications").then((res) => {
        setNotifications(res.data);
      });
    }
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        if (showNotifications) {
          setShowNotifications(false);

          // ✅ Marcar todas como leídas al cerrar
          api
            .put("/api/notifications/read-all")
            .then(() => {
              if (setUser) {
                api
                  .get("/api/user", { withCredentials: true })
                  .then((res) => setUser(res.data));
              }
            })
            .catch((err) =>
              console.error("Error marcando notificaciones como leídas:", err)
            );
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user, showNotifications]);
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        ConnectMe
      </h1>

      {user ? (
        <div className="flex items-center gap-4 relative">
          {/* Botón para añadir post */}
          <button
            onClick={onShowCreatePost}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition duration-150 ease-in-out flex items-center gap-2 text-sm"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Añadir</span>
          </button>

          {/* Notificaciones */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-600 hover:text-indigo-600"
              title="Notificaciones"
            >
              <BellIcon className="w-6 h-6" />
              
              {user?.unread_notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {user.unread_notifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                ref={notificationRef}
                className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto"
              >
                <div className="p-3 border-b font-semibold text-gray-700">
                  Notificaciones
                </div>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 border-b ${
                        n.read ? "text-gray-500" : "text-gray-800 font-medium"
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500 text-center">
                    No tienes notificaciones.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar dropdown */}
          <div className="relative">
            <img
              src={user.avatar_url || defaultAvatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
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
