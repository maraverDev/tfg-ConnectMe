const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    console.log('🔗 Usuario conectado:', socket.id);

    socket.on('sendMessage', (message) => {
        console.log('📩 Mensaje recibido:', message);
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('❌ Usuario desconectado:', socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor de WebSockets corriendo en http://localhost:${PORT}`);
});
