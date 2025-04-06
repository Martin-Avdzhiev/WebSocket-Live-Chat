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

export type { LoginResponse, MessageResponse };