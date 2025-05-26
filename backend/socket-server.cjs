const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

// 🔐 Mapeo de usuarios conectados: userId => socketId
const users = new Map();

io.on('connection', (socket) => {
  console.log('🔗 Usuario conectado:', socket.id);

  // ✅ Registro del usuario para chat privado
  socket.on('register', (userId) => {
    users.set(userId, socket.id);
    console.log(`🧍 Usuario ${userId} registrado con socket ${socket.id}`);
  });

  // 💬 Chat general (público)
  socket.on('publicMessage', (message) => {
    console.log('🌐 Mensaje público:', message);
    io.emit('receivePublicMessage', message);
  });

  // 🔒 Chat privado
  socket.on('privateMessage', ({ to, message }) => {
    const targetSocket = users.get(to);
    if (targetSocket) {
      io.to(targetSocket).emit('receivePrivateMessage', message);
    } else {
      console.warn(`⚠️ Usuario ${to} no está conectado`);
    }
  });

  // ❌ Desconexión
  socket.on('disconnect', () => {
    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`👋 Usuario ${userId} desconectado`);
        break;
      }
    }
    console.log('❌ Socket desconectado:', socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor de WebSockets corriendo en http://localhost:${PORT}`);
});
