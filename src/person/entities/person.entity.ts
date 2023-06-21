import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export type PersonPayload = {
    id: number;
    email: string;
    role: Role;
};
export enum Role {
    USER = "user",
    RIDER = "rider",
    RESTAURANT = "restaurant"
}
@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    @IsEmail()
    email: string;
    @Column()
    @Length(8, 256)
    password: string;

    @Column({
        type: "enum",
        enum: Role
    })
    role: Role;

    // international standard support up to 15 digits
    @Column({
        length: 15
    })
    @IsMobilePhone("it-IT")
    phone: string;
    @Column()
    @IsString()
    address: string;
}
