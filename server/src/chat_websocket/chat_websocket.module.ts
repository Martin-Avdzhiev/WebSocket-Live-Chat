import { Module } from '@nestjs/common';
import { ChatWebsocketGateway } from './chat_websocket_gateway';

@Module({
    providers: [ChatWebsocketGateway]
})
export class ChatWebsocketModule { }
