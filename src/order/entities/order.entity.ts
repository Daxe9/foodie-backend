import { IsNumber, Length } from "class-validator";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

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

    @IsNumber()
    riderId: number;
}
