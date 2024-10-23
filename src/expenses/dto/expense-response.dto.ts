import { Type } from "class-transformer"
import { IsEmail, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator"
import { SplitType } from "../entities/expense.entity"

class ReceiverUserResponseDto {
    @IsEmail()
    email: string

    @IsString()
    name: string
}

class UserShareResponseDto {
    @IsEmail()
    email: string;

    @IsNumber()
    amount: number;
}

export class ExpenseResponseDto {
    @IsNumber()
    amount: number

    @IsString()
    description: string

    @ValidateNested({ each: true})
    @Type(() => ReceiverUserResponseDto)
    paid_to: ReceiverUserResponseDto[]

    @IsString()
    paid_by: string

    @IsEnum(SplitType)
    split_type: SplitType

    @Type(() => UserShareResponseDto)
    shares: UserShareResponseDto[]
}
