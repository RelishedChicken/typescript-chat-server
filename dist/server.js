"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(3000, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
let messages = [];
//Handle a client connection
io.on("connection", (socket) => {
    //Handle sending the client all messages currently stored
    socket.on('getAllMessages', () => {
        console.log("Request for messages");
        socket.emit("sendMessages", messages);
    });
    //Handle recieving a message
    socket.on('message', (message) => {
        console.log("Recieved: " + message.message + "[" + message.id + "]");
        messages.push(message);
        socket.emit("sendMessages", messages);
    });
});
