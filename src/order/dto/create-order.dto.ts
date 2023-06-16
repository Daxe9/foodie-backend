import {
    IsDecimal,
    IsMobilePhone, IsNumber,
    IsString,
    ValidateNested
} from "class-validator";

export class CreateOrderDto {
    @IsString()
    address: string;

    @IsMobilePhone("it-IT")
    phone: string;

    @IsNumber({}, {
        each: true
    })
    itemsId: number[];
}
