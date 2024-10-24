import {
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  mobile: string;

  @IsNumber()
  @IsOptional()
  balance: number;
}
