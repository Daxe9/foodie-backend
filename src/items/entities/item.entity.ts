import { IsNumber, IsString, Length, IsOptional } from "class-validator";

export default class Item {
    @IsNumber()
    id: number;

    @IsString()
    @Length(1)
    name: string;

    @IsString()
    description: string;

    @IsString()
    @Length(1)
    nameRestaurant: string;

    @IsOptional()
    ordersId: number[];
}
