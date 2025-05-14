// src/components/NotificationsPage.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/api/notifications").then((res) => setNotifications(res.data));
    api.put("/api/notifications/read-all"); // marcamos como leídas al entrar
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Tus notificaciones</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No tienes notificaciones aún.</p>
      ) : (
        <ul className="divide-y">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-center gap-3 py-3 hover:bg-gray-50 px-2 rounded"
            >
              <img
                src={
                  n.from_user?.avatar_url ||
                  "https://www.gravatar.com/avatar/?d=mp"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(parseISO(n.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
