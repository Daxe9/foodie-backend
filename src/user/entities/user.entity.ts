import { Optional } from "@nestjs/common";
import {
    IsEmail,
    Length,
    IsInt,
    IsString,
    IsMobilePhone
} from "class-validator";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Order } from "../../order/entities/order.entity";

@Entity()
export class User {
    @Column()
    @IsString()
    @Length(1)
    firstName: string;

    @Column()
    @IsString()
    @Length(1)
    lastName: string;

    @PrimaryColumn()
    @IsEmail()
    email: string;

    @Column()
    @Length(8, 256)
    password: string;

    // international standard support up to 15 digits
    @Column({
        length: 15
    })
    @IsMobilePhone("it-IT")
    phone: string;

    @Column()
    @IsString()
    address: string;

    @OneToMany(() => Order, (order) => order.user)
    @Optional()
    orders: Order[];
}
