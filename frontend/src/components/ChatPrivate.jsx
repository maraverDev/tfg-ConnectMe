import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import api from "../api";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:3001");

function ChatPrivate({ user }) {
  const { id } = useParams(); // ID del receptor
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    // Registro del usuario al conectar
    if (socket && user) {
      socket.emit("register", user.id);
    }
  }, [user]);

  useEffect(() => {
    // Cargar receptor y mensajes iniciales
    api.get(`/api/users/${id}`).then((res) => setReceiver(res.data));
    api.get(`/api/messages/${id}`).then((res) => setMessages(res.data));
  }, [id]);

  useEffect(() => {
    // Escuchar mensajes entrantes
    socket.on("receivePrivateMessage", (message) => {
      if (message.from_id === parseInt(id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receivePrivateMessage");
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      from_id: user.id,
      to_id: parseInt(id),
      message: newMessage,
      created_at: new Date().toISOString(),
    };

    try {
      await api.post("/api/messages", message);
      setMessages((prev) => [...prev, message]);
      socket.emit("privateMessage", { to: parseInt(id), message });
      setNewMessage("");
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">
        Chat con {receiver?.name || "..."}
      </h2>

      <div className="h-96 overflow-y-auto border p-4 rounded mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.from_id === user.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow ${
                msg.from_id === user.id
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatPrivate;
