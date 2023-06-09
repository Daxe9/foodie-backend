import { Optional } from "@nestjs/common";
import { IsEmail, Length, IsInt, IsString } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @Column()
    @IsString()
    @Length(1)
    name: string;

    @Column()
    @IsString()
    @Length(1)
    surname: string;

    @PrimaryGeneratedColumn()
    @IsEmail()
    EMAIL: string;

    @Column()
    @Length(8, 64)
    pw: string;

    @Column()
    @IsInt()
    phone: number;

    @Column()
    @IsString()
    address: string;

    @Optional()
    ordersId: number[];
}
