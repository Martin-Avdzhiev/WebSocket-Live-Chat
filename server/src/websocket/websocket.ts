import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";
import { v4 as uuidv4 } from "uuid";
import { Connections } from "../types";
import prisma from "../prismaClient";
import { handleMessageRouter } from "./handleMessageRouter";
const connections: Connections = {};

const setupWebSocketServer = (server: Server) => {
    const wsServer = new WebSocketServer({ server });

    wsServer.on("connection", async (socket: WebSocket, request) => {
        if (!request.url) {
            socket.close();
            return;
        }

        const { query } = parse(request.url, true);
        const username = query.username;

        if (typeof username !== "string") {
            socket.close();
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true, username: true },
        });
        const uuid = uuidv4();;
        if (user) {
            connections[user.id] = { socket, user: { username } };
        }
        else {
            connections[uuid] = { socket, user: { username } };
        }

        console.log(`${username} connected`);

        socket.on("message", (message) => handleMessageRouter(message));
        socket.on("close", () => {
            const uuid = Object.keys(connections).find((key) => connections[key].socket === socket);
            if (uuid) {
                console.log(`${connections[uuid]?.user.username} disconnected`);
                delete connections[uuid];
            }
        });
});

};

export { setupWebSocketServer, connections };