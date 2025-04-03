import { useState } from "react";
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

function Navbar({ user, onLogout, onShowAuth }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">ConnectMe</h1>

      {user ? (
        <div className="relative">
          <img
            src={user.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onShowAuth("profile");
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
      ) : (
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => onShowAuth("auth")}
        >
          Iniciar sesión
        </button>
      )}
    </nav>
  );
}

export default Navbar;
