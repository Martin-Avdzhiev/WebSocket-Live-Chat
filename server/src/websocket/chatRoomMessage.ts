import { WebSocket } from "ws";
import prisma from "../prismaClient";
import { ChatRoomMessage, Message, User } from "../types";
import { connections } from "./websocket";

const sendToUsers = (
    chatRoomUsers: User[],
    data: { content: string; senderUsername: string }
) => {

    const message = JSON.stringify(data);
    const mappedSockets = chatRoomUsers.filter((user) => connections[user.id]).map((user) => {
        return {
            socket: connections[user.id]?.socket,
            user: user.username
        }
    });

    // Send message to all users in the chat room
    mappedSockets.forEach(({ socket, user }) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    });
};



const handleChatRoomMessage = async (data: ChatRoomMessage) => {
    if (data) {
        try {
            const { content, chatRoomId, senderId } = data;
            if (!content || typeof content !== "string") return;

            const sender = await prisma.user.findUnique({
                where: { id: senderId },

            });
            if (!sender) return;
            await prisma.message.create({
                data: {
                    content,
                    senderId,
                    chatRoomId: chatRoomId,
                },
            });

            const chatRoomUsers = await prisma.chatRoom.findUnique({
                where: { id: chatRoomId },
                select: { users: true },
            })
            if (!chatRoomUsers?.users || chatRoomUsers.users.length === 0) return

            sendToUsers(chatRoomUsers.users, {
                senderUsername: sender.username,
                content
            });
            console.log(`Broadcasted message from ${sender.username}: ${content}`);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
};

export { handleChatRoomMessage };