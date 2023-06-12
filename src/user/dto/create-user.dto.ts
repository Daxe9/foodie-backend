import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(1)
    firstName: string;

    @IsString()
    @Length(1)
    lastName: string;

    @IsEmail()
    email: string;

    @Length(8, 256)
    password: string;

    // international standard support up to 15 digits
    @IsMobilePhone("it-IT")
    phone: string;

    @IsString()
    address: string;
}
