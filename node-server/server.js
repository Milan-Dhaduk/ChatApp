require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for development
        methods: ['GET', 'POST']
    }
});


io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

let users = [];

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('joinRoom', (user) => {
        users.push({ id: socket.id, user });
        io.emit('updateUsers', users);
    });

    socket.on('sendMessage', (messageData) => {
        io.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
        users = users.filter((user) => user.id !== socket.id);
        io.emit('updateUsers', users);
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 6000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
