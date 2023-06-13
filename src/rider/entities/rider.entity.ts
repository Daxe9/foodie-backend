import { Entity, Column, PrimaryColumn } from "typeorm";
import { IsEmail, IsMobilePhone, IsString } from "class-validator";

@Entity()
export class Rider {
    @PrimaryColumn()
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
