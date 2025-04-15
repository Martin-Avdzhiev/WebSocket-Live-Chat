import { Controller, Get, InternalServerErrorException, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AllMessagesBetweenTwoUsersDto } from '../dtos/all-messages-between-two-users.dto';

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
}
