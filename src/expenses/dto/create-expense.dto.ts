import { ArrayMinSize, IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { SplitType } from "../entities/expense.entity";
import { Type } from "class-transformer";

class ReceiverUserDto {
    @IsString()
    name: string

    @IsEmail()
    @IsOptional()
    email: string
}

export class UserShareDto {
    @IsEmail()
    email: string

    @IsNumber()
    @IsOptional()
    amount: number
    
    @IsNumber()
    @IsOptional()
    percent: number | null;
}

export class CreateExpenseDto {
    // @IsDate()
    // @IsOptional()
    // date: Date

    @IsNumber()
    amount: number

    @IsString()
    @IsOptional()
    description: string

    @ValidateNested({ each: true })
    @Type(() => ReceiverUserDto)
    @ArrayMinSize(1)
    paid_to: ReceiverUserDto[]

    @IsEmail()
    paid_by: string

    @IsEnum(SplitType)
    split_type: SplitType

    @ValidateNested({ each: true })
    @Type(() => UserShareDto)
    @ArrayMinSize(1)
    shares: UserShareDto[]
}
