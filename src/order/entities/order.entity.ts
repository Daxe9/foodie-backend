import {IsDecimal, IsNumber, IsString, Length} from "class-validator";
import {
    Column,
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

    @Column({
        nullable: false
    })
    @IsNumber()
    address: string

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
