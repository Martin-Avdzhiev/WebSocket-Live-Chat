import { Server as WebSocketServer, WebSocket, RawData } from "ws";
import { createServer, IncomingMessage } from "http";
import { parse } from "url";
import { v4 as uuidv4 } from "uuid";

const server = createServer();
const wsServer = new WebSocketServer({ server });

type User = {
    username: string;
};

type Connections = {
    [uuid: string]: { socket: WebSocket; user: User };
};

const port = 8000;
const connections: Connections = {};

// Sends a message to all clients
const broadcast = (data: object) => {
    const message = JSON.stringify(data);
    Object.values(connections).forEach(({ socket }) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    });
};

// Handles incoming messages
const handleMessage = (message: RawData, senderUuid: string) => {
    if (typeof message === "string" || Buffer.isBuffer(message)) {
        try {
            const { message: text } = JSON.parse(message.toString());

            if (!text || typeof text !== "string") return;

            const sender = connections[senderUuid]?.user;
            if (!sender) return;

            // Broadcast the message to all clients
            broadcast({ username: sender.username, message: text });

        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
};

// Handles closing of a connection
const handleClose = (uuid: string) => {
    console.log(`${connections[uuid]?.user.username} disconnected`);
    delete connections[uuid];
};

// ws://localhost:8000/?username=John
wsServer.on("connection", (socket: WebSocket, request: IncomingMessage) => {
    const { query } = parse(request.url || "", true);
    const username = query.username;

    if (typeof username !== "string") {
        socket.close();
        return;
    }

    const uuid = uuidv4();
    connections[uuid] = { socket, user: { username } };

    console.log(`${username} connected`);

    socket.on("message", (message) => handleMessage(message, uuid));
    socket.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});
