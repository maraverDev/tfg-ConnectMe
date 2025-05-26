import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import api from "../api"; // 👈 Asegúrate de tener la instancia axios

const Chat = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef();

  const mentionSound = new Audio("/follow.mp3");

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("receivePublicMessage", (message) => {
      const me = user?.name?.toLowerCase();
      if (message.text.toLowerCase().includes(`@${me}`)) {
        mentionSound.play().catch(() => {});
      }
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        user: user?.name || "Anónimo",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("publicMessage", messageData);
      setNewMessage("");
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setNewMessage(value);
    setCursorPosition(position);

    const match = value.slice(0, position).match(/@(\w{1,20})$/);
    if (match) {
      const query = match[1];
      setMentionQuery(query);

      api.get(`/api/users?search=${query}`).then((res) => {
        setSuggestions(res.data);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleMentionClick = (name) => {
    const beforeCursor = newMessage.slice(0, cursorPosition);
    const afterCursor = newMessage.slice(cursorPosition);
    const updated = beforeCursor.replace(/@\w*$/, `@${name} `) + afterCursor;
    setNewMessage(updated);
    setSuggestions([]);
    inputRef.current.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96 relative">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">Chat en Vivo</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto h-64 bg-gray-100 p-2 mb-2 rounded text-sm">
          {messages.map((msg, index) => {
            const parts = msg.text.split(/(\s+)/).map((word, i) => {
              const mention =
                word.startsWith("@") &&
                word.slice(1).toLowerCase() === user?.name?.toLowerCase();
              return (
                <span
                  key={i}
                  className={mention ? "text-indigo-600 font-bold" : ""}
                >
                  {word}
                </span>
              );
            });

            return (
              <div key={index} className="mb-1">
                <strong>{msg.user}:</strong> {parts}{" "}
                <span className="text-xs text-gray-500">({msg.timestamp})</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mb-2 relative">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-2xl"
            title="Insertar emoji"
          >
            😊
          </button>
          <input
            ref={inputRef}
            className="flex-1 p-2 border rounded"
            type="text"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Enviar
          </button>

          {/* AUTOCOMPLETE MENCIONES */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-12 left-10 w-64 bg-white border rounded shadow z-50">
              {suggestions.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleMentionClick(u.name)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={
                      u.avatar_url || "https://www.gravatar.com/avatar/?d=mp"
                    }
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showEmojiPicker && (
          <div className="max-h-60 overflow-y-auto">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setNewMessage((prev) => prev + emojiData.emoji)
              }
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
