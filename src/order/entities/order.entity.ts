import { IsNumber, Length } from "class-validator";
import {
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Item } from "../../item/entities/item.entity";
import { Rider } from "../../rider/entities/rider.entity";

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

    @ManyToMany(() => Item)
    items: Item[];

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({
        name: "riderEmail"
    })
    rider: Rider;
}
