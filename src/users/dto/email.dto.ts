import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
    @IsEmail()
    email: string;
}
