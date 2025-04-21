import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
}

export class ChatRoomDto {
    @IsNotEmpty()
    @IsString()
    ownerId: string;
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsString()
    roomName: string;
}