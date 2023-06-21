import { Optional } from "@nestjs/common";
import { IsEmail, Length, IsString, IsMobilePhone } from "class-validator";
import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { Order } from "../../order/entities/order.entity";
import { Person, Role } from "../../person/entities/person.entity";

export type UserPayload = {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
};

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @Length(1)
    firstName: string;

    @Column()
    @IsString()
    @Length(1)
    lastName: string;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Order, (order) => order.user)
    @Optional()
    orders: Order[];
}
