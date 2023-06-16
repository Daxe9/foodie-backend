import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";

@Entity({
    name: "singleDay"
})
export class SingleDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("time", { nullable: true })
    @IsString()
    opening1: string;
    @Column("time", { nullable: true })
    @IsString()
    opening2: string;

    @Column("time", { nullable: true })
    @IsString()
    closing1: string;
    @Column("time", { nullable: true })
    @IsString()
    closing2: string;
}
