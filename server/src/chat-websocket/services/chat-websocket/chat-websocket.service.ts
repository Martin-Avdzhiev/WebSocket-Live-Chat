import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Socket } from 'socket.io';

type PersonalMessage = {
    message: string,
    senderId: string,
    receiverId: string,
    connectedUsers: Map<string, { socket: Socket, username: string, connectedAt: Date }>
}

@Injectable()
export class ChatWebsocketService {
    sendPersonalMessage({ message, senderId, receiverId, connectedUsers }: PersonalMessage) {
        const receiverSocket = connectedUsers.get(receiverId)?.socket;
        const senderSocket = connectedUsers.get(senderId)?.socket;
        if (!senderSocket) {
            throw new InternalServerErrorException('Internal Server Error');
        }
        senderSocket.emit('receivedPersonalMessage', message);
        if (receiverSocket) {
            receiverSocket.emit('receivedPersonalMessage', message);
        }

    }
}