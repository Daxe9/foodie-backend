import { ArrayNotEmpty, IsNumber } from "class-validator";

export class ChangeOrderStatusDto {
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ordersId: number[];
}
