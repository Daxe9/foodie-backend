import { IsNumber, Length } from "class-validator";
import {Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "../../user/entities/user.entity";
import {Item} from "../../item/entities/item.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({
        name: "userEmail"
    })
    @Length(1)
    user: User;

    @ManyToMany(
        () => Item
    )
    items: Item[]

    // TODO: add rider references
    // @IsNumber()
    // riderId: number;
}
