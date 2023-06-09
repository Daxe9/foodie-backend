import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsMobilePhone, IsString, Length } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @Length(1)
    pw: string;

    @IsString()
    @Length(1)
    address: string;

    @IsMobilePhone()
    phone: number;

    @Optional()
    ordersId: number[];
}
