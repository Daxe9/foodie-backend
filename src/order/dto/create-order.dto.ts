import {IsDecimal, IsMobilePhone, IsString, ValidateNested} from "class-validator";

export class CreateOrderDto {
    @IsString()
    address: string;

    @IsDecimal()
    total: number;

    @IsMobilePhone("it-IT")
    phone: string;

    @ValidateNested({
        each: true
    })
    itemsId: number[]
}
