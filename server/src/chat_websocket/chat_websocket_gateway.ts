import { InternalServerErrorException } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/services/users.service";

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private usersService: UsersService) { }

    private connectedUsers: Map<string, { socket: Socket, username: string }> = new Map();
    async handleConnection(client: Socket) {

        const username = client.handshake.headers['username'];
        try {
            if (!username || typeof username !== 'string') throw new Error('Invalid username');

            const user = await this.usersService.createUser({ username });
            this.connectedUsers.set(user.id, { socket: client, username });
            client.emit('user-info', user);
            this.server.emit('user-joined', `New user connected: ${client.id}`);

        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }

    }
    handleDisconnect(client: Socket) {
        console.log("New user disconnected: ", client.id);
        this.server.emit('user-left', `User disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handlerMessages(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: string,
    ) {
        console.log(`Message from ${client.id}:`, message);
        this.server.emit('eventsMessage', message);
    }
}