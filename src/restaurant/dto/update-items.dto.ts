import { PartialType } from "@nestjs/mapped-types";
import { CreateRestaurantDto } from "./create-restaurant.dto";
import { CreateItemDto } from "../../item/dto/create-item.dto";

export class UpdateItemsDto extends PartialType(CreateRestaurantDto) {
    items: CreateItemDto[];
}
