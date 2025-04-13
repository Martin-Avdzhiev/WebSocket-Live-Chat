import { Module } from '@nestjs/common';
import { ChatWebsocketGateway } from './chat_websocket_gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [ChatWebsocketGateway],
    imports: [UsersModule],
})
export class ChatWebsocketModule { }
