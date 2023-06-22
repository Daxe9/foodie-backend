import {
    ArrayNotEmpty,
    IsInt,
    IsMobilePhone,
    IsNumber,
    IsString
} from "class-validator";

export class CreateOrderDto {
    @IsInt()
    restaurantId: number;

    @IsString()
    address: string;

    @IsMobilePhone("it-IT")
    phone: string;

    @ArrayNotEmpty()
    @IsNumber(
        {},
        {
            each: true
        }
    )
    itemsId: number[];
}
