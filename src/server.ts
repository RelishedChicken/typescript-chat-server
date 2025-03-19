import {Server} from 'socket.io';

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
    readonly message: string;
    readonly date: Date;
}

const io = new Server<ClientToServerEvents,ServerToClientEvents,SocketData>(3000 , {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
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
        socket.emit("sendMessages", messages);
    });

});

