import { RawData, WebSocket } from "ws";
import prisma from "../prismaClient";
import { Message } from "../types";
import { connections } from "./websocket";

const sendToUsers = (
    senderUuid: string,
    receiverUuid: string,
    data: { senderUsername: string; message: string; receiverUsername: string }
) => {
    const message = JSON.stringify(data);

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

const handleMessage = async (buffer: RawData, senderUuid: string) => {
    const data: Message = JSON.parse(buffer.toString());
    if (data) {
        try {
            const { message, receiverUsername } = data;
            if (!message || typeof message !== "string") return;

            const senderUsername = connections[senderUuid]?.user.username;
            if (!senderUsername) return;

            const sender = await prisma.user.findUnique({
                where: { username: senderUsername },
                select: { id: true },
            });
            if (!sender) return;

            const receiver = await prisma.user.findUnique({
                where: { username: receiverUsername },
                select: { id: true },
            });
            if (!receiver) return;
            console.log (sender)
            console.log (receiver)
            await prisma.message.create({
                data: {
                    content: message,
                    senderId: sender.id,
                    receiverId: receiver.id,
                    chatRoomId: null,
                },
            });

            sendToUsers(sender.id, receiver.id, {
                senderUsername,
                receiverUsername,
                message,
            });
            console.log(`Broadcasted message from ${senderUsername}: ${message}`);
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