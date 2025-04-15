import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/services/users.service";
import { PersonalMessageDto } from "./dtos/personal-message.dto"
import { ChatMessageService } from "./services/chat-message/chat-message.service";
import { ChatWebsocketService } from "./services/chat-websocket/chat-websocket.service";
import { InternalServerErrorException } from "@nestjs/common";
import { StringToJsonPipe } from "./pipes/string-to-json/string-to-json.pipe";
@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private connectedUsers: Map<string, { socket: Socket, username: string, connectedAt: Date }> = new Map();
    constructor(
        private usersService: UsersService,
        private ChatMessageService: ChatMessageService,
        private ChatWebsocketService: ChatWebsocketService
    ) { }


    // @SubscribeMessage('connectionMessage')
    async handleConnection(client: Socket,) {
        const username = client.handshake.headers["username"];

        try {
            if (!username || typeof username !== 'string') throw new Error('Invalid username');

            const user = await this.usersService.createUser({ username });
            this.connectedUsers.set(user.id, { socket: client, username, connectedAt: new Date() });
            client.emit('user-info', user);
            this.server.emit('user-joined', `New user connected: ${client.id}`);

        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }


    handleDisconnect(client: Socket) {
        console.log("New user disconnected: ", client.id);
        this.connectedUsers.delete(client.id);
        this.server.emit('user-left', client.id);
    }

    @SubscribeMessage('message')
    async handlerMessages(
        @ConnectedSocket() client: Socket,
        @MessageBody(new StringToJsonPipe(PersonalMessageDto)) data: PersonalMessageDto
    ) {

        const { senderUsername, receiverUsername, message } = data;
        try {
            const { senderId, receiverId } = await this.ChatMessageService.createPersonalMessage({ senderUsername, receiverUsername, message });

            this.ChatWebsocketService.sendPersonalMessage({ message, senderId, receiverId, connectedUsers: this.connectedUsers });
        } catch (error) {
            console.error('Error saving message:', error);
            client.emit('createPersonalMessage', 'Failed to send message');
        }
        console.log(`Message from ${client.id}:`, message);
        this.server.emit('eventMessage', message);
    }
}