import {Message, Invitation, ChatRoomMessage} from './types'
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

export type {  MessagePayload, ChatMessagePayload, InvitePayload };