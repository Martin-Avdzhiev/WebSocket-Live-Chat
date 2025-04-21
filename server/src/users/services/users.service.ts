import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomDto, CreateUserDto } from '../dtos/create.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AllMessagesBetweenTwoUsersDto } from '../dtos/all-messages-between-two-users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto): Promise<{
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }> {
    try {
      const user = await this.prisma.user.create({ data });
      if (!user) {
        throw new Error("Failed to create user");
      }
      return user;
    } catch (error: PrismaClientKnownRequestError | any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return this.getUserByUsername(data.username)
        }
        throw new Error("Failed to create user");
      }
      throw new Error("Failed to create user");
    }

  }
  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async getAllMessagesBetweenTwoUsers({ senderId, receiverId }: AllMessagesBetweenTwoUsersDto) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return messages;
  }

  async getUserAllChatRooms(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId }, include: { chatRooms: { select: { id: true, name: true, createdAt: true } } } });
  }

  async createChatRoomService(data: ChatRoomDto) {
    const newChatRoom = await this.prisma.chatRoom.create(
      {
        data: {
          name: data.roomName,
          ownerId: data.ownerId,
          users: {
            connect: [{ id: data.ownerId }],
          },
        }
      }
    );

    return newChatRoom;
  }
}
