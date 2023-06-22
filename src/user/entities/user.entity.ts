import {
    Entity,
    Column,
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
    firstName: string;

    @Column()
    lastName: string;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
