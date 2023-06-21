import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { IsBoolean, IsEmail, IsMobilePhone, IsString } from "class-validator";
import { Order } from "../../order/entities/order.entity";
import { Person, Role } from "../../person/entities/person.entity";

export type RiderPayload = {
    id: number;
    email: string;
    phone: string;
    role: Role;
};
@Entity()
export class Rider {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Order, (order) => order.rider)
    orders: Order[];

    @Column("boolean")
    isAvailable: boolean;
}
