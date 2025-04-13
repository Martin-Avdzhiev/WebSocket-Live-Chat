import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log("New user connected: ", client.id);
        this.server.emit('user-joined',`New user connected: ${client.id}`);

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