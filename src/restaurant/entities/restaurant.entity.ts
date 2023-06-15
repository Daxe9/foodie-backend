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
export class SingleDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("time", { nullable: true })
    @IsString()
    opening1: string;
    @Column("time", { nullable: true })
    @IsString()
    opening2: string;

    @Column("time", { nullable: true })
    @IsString()
    closing1: string;
    @Column("time", { nullable: true })
    @IsString()
    closing2: string;
}

@Entity()
export class Timetable {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => SingleDay)
    @JoinColumn()
    monday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    tuesday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    wednesday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    thursday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    friday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    saturday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    sunday: SingleDay;
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
