import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type PersonalMessage = {
    senderUsername: string;
    receiverUsername: string;
    message: string;
}

@Injectable()
export class ChatMessageService {
  constructor(private prisma: PrismaService) { }

  async createPersonalMessage({ senderUsername, receiverUsername, message }: PersonalMessage) {
      const sender = await this.prisma.user.findUnique({ where: { username: senderUsername } });
      const receiver = await this.prisma.user.findUnique({ where: { username: receiverUsername } });

      if (!sender || !receiver) {
          throw new Error("User not found");
      }
      const messageData = await this.prisma.message.create({
          data: {
              senderId: sender.id,
              receiverId: receiver.id,
              content: message
          },
      })
      if(!messageData) {
          throw new InternalServerErrorException("Internal Server Error");
        }
      return messageData;
  }
}
