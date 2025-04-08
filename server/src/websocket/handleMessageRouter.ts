// messageRouter.ts
import { RawData } from "ws";
import { handleMessage } from "./messages";
import { handleInvite } from "./invites";
import { Message, Invitation, ChatRoomMessage } from "../types";
import { handleChatRoomMessage } from "./chatRoomMessage";

type MessagePayload = {
    type: "message";
    data: Message;
};

type ChatMessagePayload = {
    type: "chatRoomMessage";
    data: ChatRoomMessage;
};

type InvitePayload = {
    type: "invite";
    data: Invitation;
};

type IncomingMessage = MessagePayload | ChatMessagePayload | InvitePayload;

const handleMessageRouter = async (buffer: RawData) => {
    try {
        const parsed: IncomingMessage = JSON.parse(buffer.toString());
        const { type, data } = parsed;

        switch (type) {
            case "message":
                await handleMessage(data);  // data = { receiverUsername, message, senderUsername }
                break;
            case "chatRoomMessage":
                await handleChatRoomMessage(data);  // data = { senderId, chatRoomId, content }
                break;
            case "invite":
                await handleInvite(data);   // data = { inviterId, inviteeId, chatRoomId }
                break;
            default:
                console.warn("Unknown message type:", type);
        }
    } catch (err) {
        console.error("Error handling incoming WebSocket message:", err);
    }
};

export { handleMessageRouter };
