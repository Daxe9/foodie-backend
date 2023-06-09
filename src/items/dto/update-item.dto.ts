import { PartialType } from "@nestjs/mapped-types";
import { CreateItemDto } from "./create-item.dto";
import { IsString, Length } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsString()
    @Length(1)
    name: string;

    @IsString()
    description: string;

    @IsString()
    @Length(1)
    nameRestaurant: string;

    @Optional()
    ordersId: number[];
}
