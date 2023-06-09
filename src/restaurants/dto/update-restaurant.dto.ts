import { PartialType } from "@nestjs/mapped-types";
import { CreateRestaurantDto } from "./create-restaurant.dto";
import { IsEmail, IsInt, IsString, IsOptional, Length } from "class-validator";
import Item from "../entities/item.entity";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @Length(2, 50)
    name: string;

    @IsOptional()
    menu: Item[];
}
