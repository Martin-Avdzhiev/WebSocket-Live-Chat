import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AllMessagesBetweenTwoUsersDto } from '../dtos/all-messages-between-two-users.dto';
import { ChatRoomDto } from '../dtos/create.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }
    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('personalMessages')
    getAllMessagesBetweenTwoUsers(@Query() data: AllMessagesBetweenTwoUsersDto) {
        try {
            return this.usersService.getAllMessagesBetweenTwoUsers({ ...data })
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Post('createChatRoom')
    async createChatRoom(@Body() data: ChatRoomDto) {
        try {
            console.log(data,"createChatRoom");
            return await this.usersService.createChatRoomService(data)
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');

        }
    }

    @Get(':userId/chatRooms')	
    async getUserAllChatRooms(@Param('userId') userId: string) {
        try {
            return await this.usersService.getUserAllChatRooms(userId);
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
}
}