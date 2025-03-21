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
  readonly author: string;
  readonly message: string;
  readonly date: Date;
}

let port = parseInt(process.env.PORT??'') || 3000;
console.log("Hosting on "+port);
const io = new Server<ClientToServerEvents,ServerToClientEvents,SocketData>(port , {
    cors: {
        origin: "https://typescript-chat-6a7e1e67d992.herokuapp.com/",
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
        console.log(messages);
        io.sockets.emit("sendMessages", messages);
        console.log("sent messages...")
    });

});

