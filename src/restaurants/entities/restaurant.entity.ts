import Item from "src/restaurants/entities/item.entity";
import { IsEmail, IsInt, IsString, IsOptional, Length } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Restaurant {
    @IsEmail()
    email: string;

    @Length(8, 64)
    password: string;

    @IsInt()
    phoneNumber: number;

    @IsString()
    address: string;

    @Length(2, 50)
    name: string;

    @IsOptional()
    menu: Item[];
}
