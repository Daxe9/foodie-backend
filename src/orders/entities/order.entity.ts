import { IsEmail, IsNumber, Length } from "class-validator";

export class Order {
    @IsNumber()
    id: number;

    @IsEmail()
    @Length(1)
    userEmail: string;

    @IsNumber()
    riderId: number;
}
