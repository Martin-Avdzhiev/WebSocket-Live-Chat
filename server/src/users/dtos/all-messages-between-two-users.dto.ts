import { IsNotEmpty, IsString } from 'class-validator';
export class AllMessagesBetweenTwoUsersDto {
    @IsNotEmpty()
    @IsString()
    senderId: string;

    @IsNotEmpty()
    @IsString()
    receiverId: string;
}