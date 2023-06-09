import { IsEmail, Length, IsString } from "class-validator";

export class AccessUserDto {
    @IsEmail()
    @Length(1)
    email: string;

    @IsString()
    @Length(1)
    pw: string;
}
