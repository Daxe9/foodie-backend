import { Item } from "../../item/entities/item.entity";
import {
    IsEmail,
    IsString,
    Length,
    IsMobilePhone,
    ValidateNested,
    IsArray
} from "class-validator";
import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import { Type } from "class-transformer";
import { Person } from "../../person/entities/person.entity";

export type RestaurantPayload = {
    email: string;
    name: string;
    address: string;
    phone: string;
};

@Entity()
export class SingleTime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    opening1: string;
    @Column()
    @IsString()
    opening2: string;

    @Column()
    @IsString()
    closing1: string;
    @Column()
    @IsString()
    closing2: string;
}

@Entity()
export class Timetable {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => SingleTime)
    @JoinColumn()
    monday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    tuesday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    wednesday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    thursday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    friday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    saturday: SingleTime;
    @OneToOne(() => SingleTime)
    @JoinColumn()
    sunday: SingleTime;
}

@Entity()
export class Restaurant {
    // @PrimaryColumn()
    // @IsEmail()
    // email: string;
    //
    // @Column()
    // @Length(8, 255)
    // password: string;
    //
    // @Column({
    //     length: 15
    // })
    // @IsMobilePhone("it-IT")
    // phone: string;
    //
    // @Column()
    // @IsString()
    // address: string;

    @PrimaryGeneratedColumn()
    id: number;

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
