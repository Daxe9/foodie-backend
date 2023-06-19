import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export class CreateRiderDto {
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
