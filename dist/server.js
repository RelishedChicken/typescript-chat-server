"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const app = (0, express_1.default)();
const development = 'http://localhost';
const url = ((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : development);
const server = app.use((req, res) => res.sendFile(INDEX, { root: __dirname })).listen(PORT, () => console.log(`Listening on ${url}:${PORT}`));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
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
        console.log(messages);
        io.sockets.emit("sendMessages", messages);
        console.log("sent messages...");
    });
});
