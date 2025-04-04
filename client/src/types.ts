export type LoginResponse = {
    id:string;
    username:string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type Message = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    chatRoomId: string | null;
}