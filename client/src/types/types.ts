type Message = {
    senderUsername: string;
    message: string;
    receiverUsername: string;
};

type Invitation = {
    inviterId: string;
    inviteeId: string;
    chatRoomId: string;
}

export type { Message, Invitation };