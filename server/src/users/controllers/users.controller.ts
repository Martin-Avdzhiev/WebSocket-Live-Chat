import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}
    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Post()
    createUser(@Body() data: CreateUserDto) {
        return this.usersService.createUser(data);
    }
}
