import { IsDecimal, IsInt, IsString, Length, MaxLength } from "class-validator";

export class CreateItemDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    @MaxLength(255)
    description: string;

    @IsDecimal({
        decimal_digits: "10,2"
    })
    price: number;

    @IsInt()
    preparationTimeMinutes: number;
}
