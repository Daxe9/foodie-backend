import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsMobilePhone, IsNumber, IsString } from "class-validator";

@Entity()
export class Rider {
    @PrimaryGeneratedColumn()
    @IsNumber()
    id: number;

    @Column({
        length: 15
    })
    @IsMobilePhone("it-IT")
    phone: string;

    @Column()
    @IsString()
    workingSite: string;
}
