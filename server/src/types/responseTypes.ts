type MessageResponse = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string | null;
    createdAt: Date;
    chatRoomId: string | null;
}

export { MessageResponse };