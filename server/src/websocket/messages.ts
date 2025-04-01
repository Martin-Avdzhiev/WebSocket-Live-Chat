import { RawData, WebSocket } from "ws";

import { Message } from "../types";
import { connections } from "./websocket";
const handleMessage = (buffer: RawData, senderUuid: string) => {
    const data: Message = JSON.parse(buffer.toString());
    if (data) {
        try {
            const { message } = data;
            if (!message || typeof message !== "string") return;

            const sender = connections[senderUuid]?.user;
            console.log(sender)
            if (!sender) return;

            broadcast({ username: sender.username, message });
            console.log(`Broadcasted message from ${sender.username}: ${message}`);
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
    // console.log(message)
    Object.values(connections).forEach((x) => {
        console.log(x.socket.readyState === WebSocket.OPEN)
        if (x.socket.readyState === WebSocket.OPEN) {
            x.socket.send(message);
        }
    });
};

export { handleMessage, handleClose };