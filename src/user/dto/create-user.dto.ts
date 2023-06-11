import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(1)
    name: string;

    @IsString()
    @Length(1)
    surname: string;

    @IsEmail()
    email: string;

    @Length(8, 256)
    pw: string;

    @IsString()
    @Length(1)
    address: string;

    @IsMobilePhone("it-IT")
    phone: number;
}
