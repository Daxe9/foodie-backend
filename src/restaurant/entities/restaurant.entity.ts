import { Item } from "src/item/entities/item.entity";
import { IsEmail, IsString, Length, IsMobilePhone } from "class-validator";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

export type RestaurantPayload = {
    email: string;
    name: string;
    address: string;
    phone: string;
};
@Entity()
export class Restaurant {
    @PrimaryColumn()
    @IsEmail()
    email: string;

    @Column()
    @Length(8, 255)
    password: string;

    @Column({
        length: 15
    })
    @IsMobilePhone("it-IT")
    phone: string;

    @Column()
    @IsString()
    address: string;

    @Column()
    @Length(2, 255)
    name: string;

    @OneToMany(() => Item, (item) => item.restaurant)
    items: Item[];
}
