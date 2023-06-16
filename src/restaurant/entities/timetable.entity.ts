import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SingleDay } from "./singleDay.entity";

@Entity()
export class Timetable {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => SingleDay)
    @JoinColumn()
    monday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    tuesday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    wednesday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    thursday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    friday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    saturday: SingleDay;
    @OneToOne(() => SingleDay)
    @JoinColumn()
    sunday: SingleDay;
}
