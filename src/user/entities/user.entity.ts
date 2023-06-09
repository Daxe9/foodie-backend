import { IsEmail, Length, IsInt, IsString } from "class-validator";

export class User {
    @IsEmail()
    email: string;

    @Length(8, 64)
    password: string;

    @IsInt()
    phoneNumber: number;

    @IsString()
    address: string;
}
