import { WebSocket } from "ws";
type Username = {
    username: string;
};

export type User = {
    id: string;
    createdAt: Date;
    username: string;
    updatedAt: Date;
    deletedAt: Date | null;
} 

export type Message = {
    senderUsername: string;
    message: string;
    receiverUsername: string;
};
export type ChatRoomMessage = {
    senderId: string;
    chatRoomId: string;
    content: string;
};

export type Invitation = {
    inviterId: string;
    inviteeId: string;
    chatRoomId: string;
}


export type ChatRoom = {
    id: string;
    name: string | null;
    createdAt: Date;
} 

export type PopulatedUser = {
    id:string;
    username:string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    sentMessages: Message[];
    receivedMessages: Message[];
    chatRooms: PopulatedChatRoom[];
    chatRoomInvites: PopulatedChatRoomInvite[];
}

export type PopulatedChatRoom = {
    id: string;
    name: string;
    messages: Message[];
    users: PopulatedUser[];
    chatRoomInvites: PopulatedChatRoomInvite[];
    createdAt: Date;
}

export type PopulatedChatRoomInvite = {
    id: string;
    chatRoom: PopulatedChatRoom;
    chatRoomId: string;
    invitee: PopulatedUser;
    inviteeId: string;
    createdAt: Date;
}


export type Connections = {
    [uuid: string]: { socket: WebSocket; user: Username };
};