import { Module } from '@nestjs/common';
import { ChatWebsocketGateway } from './chat-websocket-gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatWebsocketService } from './services/chat-websocket/chat-websocket.service';
import { ChatMessageService } from './services/chat-message/chat-message.service';

@Module({
    providers: [ChatWebsocketGateway, ChatWebsocketService, ChatMessageService],
    imports: [UsersModule],
})
export class ChatWebsocketModule { }
