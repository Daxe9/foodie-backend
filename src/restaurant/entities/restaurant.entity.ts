import { Item } from "../../item/entities/item.entity";
import { Length } from "class-validator";
import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import { Person } from "../../person/entities/person.entity";
import { Timetable } from "./timetable.entity";

export type RestaurantPayload = {
    email: string;
    name: string;
    address: string;
    phone: string;
};

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 2048
    })
    url: string;

    @Column()
    @Length(2, 255)
    name: string;

    @OneToMany(() => Item, (item) => item.restaurant)
    items: Item[];

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToOne(() => Timetable)
    @JoinColumn()
    timetable: Timetable;
}
