import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";
import { v4 as uuidv4 } from "uuid";

import { handleMessage, handleClose } from "./messages";
import { Connections } from "../types";
import prisma from "../prismaClient";

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

        socket.on("message", (message) => handleMessage(message, user ? user.id : uuid));
        socket.on("close", () => handleClose(user ? user.id : uuid));
    });

};

export { setupWebSocketServer, connections };