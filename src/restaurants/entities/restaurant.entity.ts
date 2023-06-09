import Item from "src/items/entities/item.entity";
import { IsEmail, IsInt, IsString, IsOptional, Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Restaurant {
    @IsEmail()
    email: string;

    @Length(8, 64)
    pw: string;

    @IsInt()
    phone: number;

    @IsString()
    address: string;

    @Length(2, 50)
    name: string;

    @IsOptional()
    itemsId: number[];
}
