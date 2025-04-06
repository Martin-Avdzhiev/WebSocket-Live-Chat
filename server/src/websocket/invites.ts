import { RawData, WebSocket } from "ws";
import prisma from "../prismaClient";
import { Invitation, ChatRoom, User } from "../types";
import { connections } from "./websocket";

type SendToUsersArgs = {
    inviter: User;
    invitee: User;
    chatRoom: ChatRoom;
}


const handleInvite = async (data: Invitation) => {
    if (data) {
        try {
            const { inviterId, inviteeId, chatRoomId } = data;
            if (!inviterId || !inviteeId || !chatRoomId) return;

            const inviter = await prisma.user.findUnique({
                where: { id: inviterId }
            });

            const invitee = await prisma.user.findUnique({
                where: { id: inviteeId }
            });

            const chatRoom = await prisma.chatRoom.findUnique({
                where: { id: chatRoomId }
            })
            if (!inviter || !invitee || !chatRoom) return;

            await prisma.chatRoomInvite.create({
                data: {
                    inviteeId: invitee.id,
                    chatRoomId: chatRoom.id
                }
            });
            sendToUsers({ inviter, invitee, chatRoom });
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }
}

const sendToUsers = ({ inviter, invitee, chatRoom }: SendToUsersArgs): void => {
    const socketData = {
        inviterUsername: inviter.username,
        inviteeUsername: invitee.username,
        chatRoomName: chatRoom.name
    }

    //Send invite to inviter
    const inviterSocket = connections[inviter.id]?.socket;

    if (inviterSocket && inviterSocket.readyState === WebSocket.OPEN) {
        inviterSocket.send(JSON.stringify(socketData));
    }

    //Send invite to invitee
    const inviteeSocket = connections[invitee.id]?.socket;

    if (inviteeSocket && inviteeSocket.readyState === WebSocket.OPEN) {
        inviteeSocket.send(JSON.stringify(socketData));
    }
}
export { handleInvite };