import { PartialType } from "@nestjs/mapped-types";
import { CreateRestaurantDto } from "./create-restaurant.dto";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @Length(2, 255)
    name: string;

    @IsMobilePhone("it-IT")
    phone: string;

    @IsString()
    address: string;
}
