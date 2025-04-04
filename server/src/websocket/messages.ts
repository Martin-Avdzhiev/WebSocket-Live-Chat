import { RawData, WebSocket } from "ws";

import { Message } from "../types";
import { connections } from "./websocket";

const sendToUsers = (
    senderUuid: string,
    receiverUuid: string,
    data: { senderUsername: string; message: string; receiverUsername: string }
) => {
    const message = JSON.stringify(data);
    console.log(message)

    // Send message to the sender
    const senderSocket = connections[senderUuid]?.socket;
    if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
        senderSocket.send(message);
    }

    // Send message to the receiver
    const receiverSocket = connections[receiverUuid]?.socket;
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
        receiverSocket.send(message);
    }
};

const handleMessage = (buffer: RawData, senderUuid: string) => {
    const data: Message = JSON.parse(buffer.toString());
    if (data) {
        try {
            const { message, receiverUsername } = data;
            if (!message || typeof message !== "string") return;

            const sender = connections[senderUuid]?.user;
            if (!sender) return;
            const receiverUuid = Object.keys(connections).find(
                (uuid) => connections[uuid].user.username === receiverUsername
            );
            if (!receiverUuid) return;
            sendToUsers(senderUuid, receiverUuid, {
                senderUsername: sender.username,
                receiverUsername,
                message,
            });
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

// const broadcast = (data: { username: string; message: string }) => {
//     const message = JSON.stringify(data);
//     Object.values(connections).forEach((x) => {
//         console.log(x.socket.readyState === WebSocket.OPEN)
//         if (x.socket.readyState === WebSocket.OPEN) {
//             x.socket.send(message);
//         }
//     });
// };

export { handleMessage, handleClose };