import { WebSocket } from "ws";
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
        console.log(connections[senderUuid]?.user.username);
        senderSocket.send(message);
    }
    
    // Send message to the receiver
    const receiverSocket = connections[receiverUuid]?.socket;
    if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
        console.log(connections[receiverUuid]?.user.username);
        receiverSocket.send(message);
    }

};

const handleMessage = async (data: Message) => {
    console.log('hi')
    if (data) {
        console.log(data)
        try {
            const { message, receiverUsername, senderUsername } = data;
            if (!message || typeof message !== "string") return;

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
                senderUsername: senderUsername,
                receiverUsername,
                message,
            });
            console.log(`Broadcasted message from ${senderUsername}: ${message}`);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
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

export { handleMessage };