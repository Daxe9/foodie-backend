import { IsNumber, IsString, Length, IsInt, IsDecimal } from "class-validator";
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { JoinColumn } from "typeorm";
import { Order } from "../../order/entities/order.entity";

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

    @Column()
    @IsInt()
    preparationTimeMinutes: number;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
    @JoinColumn({
        name: "restaurantId"
    })
    restaurant: Restaurant;

    @Column("decimal", {
        precision: 10,
        scale: 2
    })
    @IsDecimal()
    price: number;

    @ManyToMany(() => Order)
    @JoinTable({
        name: "itemOrder",
        joinColumn: {
            name: "itemId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "orderId",
            referencedColumnName: "id"
        }
    })
    orders: Order[];
}
