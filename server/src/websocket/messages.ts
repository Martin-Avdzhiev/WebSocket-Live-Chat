import { RawData } from "ws";

import { Connections } from "../types";

const connections: Connections = {};
const handleMessage = (message: RawData, senderUuid: string) => {
    if (typeof message === "string" || Buffer.isBuffer(message)) {
        try {
            const { message: text } = JSON.parse(message.toString());
            if (!text || typeof text !== "string") return;

            const sender = connections[senderUuid]?.user;
            if (!sender) return;

            broadcast({ username: sender.username, message: text });
            console.log(`Broadcasted message from ${sender.username}: ${text}`);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
};

const handleClose = (uuid: string) => {
    console.log(`${connections[uuid]?.user.username} disconnected`);
    delete connections[uuid];
};

const broadcast = (data: { username: string; message: string }) => {
    const message = JSON.stringify(data);
    Object.values(connections).forEach((x) => {
        if (x.socket.readyState === WebSocket.OPEN) {
            x.socket.send(message);
        }
    });
};

export { handleMessage, handleClose };