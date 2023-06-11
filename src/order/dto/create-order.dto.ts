import { IsEmail, IsString, Length } from "class-validator";

export class CreateOrderDto {
    @IsString()
    @Length(1)
    name: string;

    @IsString()
    description: string;

    @IsEmail()
    @Length(1)
    userEmail: string;

    itemsId: number[];
}
