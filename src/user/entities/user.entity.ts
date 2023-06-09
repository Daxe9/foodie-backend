import { Optional } from "@nestjs/common";
import { IsEmail, Length, IsInt, IsString } from "class-validator";

export class User {
    @IsEmail()
    email: string;

    @Length(8, 64)
    pw: string;

    @IsInt()
    phone: number;

    @IsString()
    address: string;

    @Optional()
    ordersId: number[];
}
