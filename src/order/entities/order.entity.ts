import { IsDecimal, IsNumber, IsString, Length } from "class-validator";
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Item } from "../../item/entities/item.entity";
import { Rider } from "../../rider/entities/rider.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";

export enum OrderStatus {
    PENDING = "pending",
    PREPARATION_START = "preparationStart",
    PREPARATION_END = "preparationEnd",
    DELIVERY_START = "deliveryStart",
    DELIVERY_END = "deliveryEnd"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @Column({
        nullable: false
    })
    @IsNumber()
    address: string;

    @Column("decimal", {
        nullable: false,
        precision: 10,
        scale: 2
    })
    @IsDecimal()
    total: number;

    @Column({
        length: 15,
        nullable: false
    })
    @IsString()
    phone: string;

    @Column({
        type: "enum",
        enum: OrderStatus
    })
    status: OrderStatus;

    @Column({ type: "datetime" })
    timestamp: Date;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({
        name: "userId"
    })
    @Length(1)
    user: User;

    @ManyToMany(() => Item, { cascade: true })
    @JoinTable({
        name: "itemOrder",
        joinColumn: {
            name: "orderId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "itemId",
            referencedColumnName: "id"
        }
    })
    items: Item[];

    @ManyToOne(() => Rider, (rider) => rider.orders)
    @JoinColumn({
        name: "riderId"
    })
    rider: Rider;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
    @JoinColumn({
        name: "restaurantId"
    })
    restaurant: Restaurant;
}
