import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageResponse } from 'src/types/responseTypes';

type PersonalMessage = {
    messageData: MessageResponse;
    connectedUsers: Map<string, { socket: Socket, username: string, connectedAt: Date }>
}

@Injectable()
export class ChatWebsocketService {
    sendPersonalMessage({ messageData, connectedUsers }: PersonalMessage) {
        if (!messageData.receiverId) {
            throw new InternalServerErrorException('Internal Server Error');
        }
        const receiverSocket = connectedUsers.get(messageData.receiverId)?.socket;
        const senderSocket = connectedUsers.get(messageData.senderId)?.socket;
        if (!senderSocket) {
            throw new InternalServerErrorException('Internal Server Error');
        }
        senderSocket.emit('receivedPersonalMessage', { ...messageData });
        if (receiverSocket) {
            receiverSocket.emit('receivedPersonalMessage', { ...messageData });
        }

    }
}