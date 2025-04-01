import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";
import { v4 as uuidv4 } from "uuid";

import { handleMessage, handleClose } from "./messages";
import { Connections } from "../types";

const connections: Connections = {};

export const setupWebSocketServer = (server: Server) => {
    const wsServer = new WebSocketServer({ server });

    wsServer.on("connection", (socket: WebSocket, request) => {
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

        const uuid = uuidv4();
        connections[uuid] = { socket, user: { username } };

        console.log(`${username} connected`);

        socket.on("message", (message) => handleMessage(message, uuid));
        socket.on("close", () => handleClose(uuid));
    });

};
