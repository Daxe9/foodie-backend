import { Role } from "../entities/person.entity";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class CreatePersonDto {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsString({
        length: 15
    })
    phone: string;
    @IsString()
    address: string;

    @IsEnum(Role)
    role: Role;
}

export type CreatePersonDtoType = CreatePersonDto;
