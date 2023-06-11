import { IsNumber, IsString, Length, IsOptional } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
import { JoinColumn } from "typeorm";

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

    /*
    @IsOptional()
    ordersId: number[];
     */
}
