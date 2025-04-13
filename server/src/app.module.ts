import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatWebsocketModule } from './chat_websocket/chat_websocket.module';

@Module({
  imports: [UsersModule, PrismaModule, ChatWebsocketModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
