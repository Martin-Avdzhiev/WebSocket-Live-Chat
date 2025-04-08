type LoginResponse = {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

type MessageResponse = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    chatRoomId: string | null;
}

type ChatRoomsResponse = {
    id: string;
    name: string;
    createdAt: Date;
}

type ChatRoomDetailsResponse = {
    name: string,
    users: { username: string }[],
    messages: {
        content: string,
        createdAt: Date,
        sender: { username: string }
    }[]
}

type ChatRoomInviteResponse = {
    id: string;
    chatRoomId: string;
    inviteeId: string;
    createdAt: Date;
}

export type { LoginResponse, MessageResponse, ChatRoomsResponse, ChatRoomDetailsResponse, ChatRoomInviteResponse };