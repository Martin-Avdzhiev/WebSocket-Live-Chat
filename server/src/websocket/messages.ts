import { RawData, WebSocket } from "ws";

import { Message } from "../types";
import { connections } from "./websocket";

const sendToUsers = (
    senderUuid: string,
    receiverUuid: string,
    data: { username: string; message: string }
) => {
    const message = JSON.stringify(data);
    console.log(message)

    // Изпращане до изпращача
    const senderSocket = connections[senderUuid]?.socket;
    if (senderSocket && senderSocket.readyState === WebSocket.OPEN) {
        senderSocket.send(message);
    }

    // Изпращане до получателя
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
            console.log(receiverUsername)
            if (!message || typeof message !== "string") return;

            const sender = connections[senderUuid]?.user;
            console.log(sender)
            if (!sender) return;
            const receiverUuid = Object.keys(connections).find(
                (uuid) => connections[uuid].user.username === receiverUsername
              );

              if(!receiverUuid) return;
            // Изпрати съобщението само до изпращача и получателя
            sendToUsers(senderUuid, receiverUuid, {
                username: sender.username,
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