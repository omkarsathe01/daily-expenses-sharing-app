import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class UserAmountResponseDto {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;
}

export class UserResponseDto {
  @IsNumber()
  user_id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  mobile: string;

  @IsNumber()
  balance: number;

  @ValidateNested({ each: true })
  @Type(() => UserAmountResponseDto)
  dues: UserAmountResponseDto[];

  @IsMongoId()
  transaction_history: string[];
}
