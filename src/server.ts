import { Server } from 'socket.io';
import winston from 'winston';
import express, { Express, Request, Response } from "express";

interface ServerToClientEvents {
    sendMessages: (messages:ChatMessage[]) => void;
}

interface ClientToServerEvents {
    message: (message:ChatMessage) => void;
    getAllMessages: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

interface ChatMessage {
  readonly id: number;
  readonly author: string;
  readonly message: string;
  readonly date: Date;  
}

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const app: Express = express();
const url = (process.env.NODE_ENV) ? 'https://typescript-chat-server-2a4af974e68f.herokuapp.com' : 'http://localhost';
const server = app.use((req, res) => res.sendFile(INDEX, {root: __dirname})).listen(PORT, () => console.log(`Listening on ${url}:${PORT}`));


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

let messages:ChatMessage[] = []; 

//Handle a client connection
io.on("connection", (socket) => {

    //Handle sending the client all messages currently stored
    socket.on('getAllMessages', () => {
        console.log("Request for messages");
        socket.emit("sendMessages", messages);
    });

    //Handle recieving a message
    socket.on('message', (message:ChatMessage) => {
        console.log("Recieved: " + message.message + "["+message.id+"]");
        messages.push(message);
        console.log(messages);
        io.sockets.emit("sendMessages", messages);
        console.log("sent messages...")
    });

});

