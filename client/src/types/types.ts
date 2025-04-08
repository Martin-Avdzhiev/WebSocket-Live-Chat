type Message = {
    senderUsername: string;
    message: string;
    receiverUsername: string;
};

type ChatRoomMessage = {
    senderId: string;
    chatRoomId: string;
    content: string;
}

type Invitation = {
    inviterId: string;
    inviteeId: string;
    chatRoomId: string;
}

export type { Message, ChatRoomMessage, Invitation };