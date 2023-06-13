import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {IsEmail, IsMobilePhone, IsNumber, IsString} from "class-validator";

@Entity()
export class Rider {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column({
        length: 15
    })
    @IsMobilePhone("it-IT")
    phone: string;

    @Column()
    @IsString()
    workingSite: string;
}
