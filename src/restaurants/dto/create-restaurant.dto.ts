import { Restaurant } from "../entities/restaurant.entity";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class CreateRestaurantDto extends Restaurant {
    @IsString()
    @Length(1)
    name: string;

    @IsString()
    @Length(1)
    email: string;

    @IsString()
    @Length(1)
    pw: string;

    @IsString()
    @Length(1)
    address: string;

    @IsMobilePhone("it-IT")
    phone: number;
}
