import { IsNumber, IsString, Length, IsOptional } from "class-validator";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { JoinColumn } from "typeorm";
import {Order} from "../../order/entities/order.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @Column()
    @IsString()
    @Length(1)
    name: string;

    @Column()
    @IsString()
    description: string;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
    @JoinColumn({
        name: "restaurantName"
    })
    @IsString()
    @Length(1)
    restaurant: Restaurant;


    @ManyToMany(
        () => Order
    )
    @JoinTable({
        name: "itemOrder",
        joinColumn: {
            name: "item",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "order",
            referencedColumnName: "id"
        }
    })
    orders: Order[];
}
