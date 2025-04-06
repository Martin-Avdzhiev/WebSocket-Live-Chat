import {Message, Invitation} from './types'
type MessagePayload = {
    type: "message";
    data: Message;
};

type InvitePayload = {
    type: "invite";
    data: Invitation;
};

export type {  MessagePayload, InvitePayload };