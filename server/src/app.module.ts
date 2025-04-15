import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatWebsocketModule } from './chat-websocket/chat-websocket.module';
import { ChatWebsocketService } from './chat-websocket/services/chat-websocket/chat-websocket.service';

@Module({
  imports: [UsersModule, PrismaModule, ChatWebsocketModule],
  providers: [PrismaService, ChatWebsocketService],
  exports: [PrismaService, UsersModule],
})
export class AppModule {}
