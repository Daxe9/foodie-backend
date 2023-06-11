import { PartialType } from "@nestjs/mapped-types";
import { CreateRestaurantDto } from "./create-restaurant.dto";
import { IsOptional, Length } from "class-validator";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @Length(2, 50)
    name: string;

    @IsOptional()
    itemsId: number[];
}
