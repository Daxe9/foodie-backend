import { ArrayNotEmpty, IsNumber } from "class-validator";

export class AcceptOrdersDto {
    @IsNumber()
    restaurantId: number;

    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ordersId: number[];
}
