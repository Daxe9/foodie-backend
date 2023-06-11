import { IsString, Length } from "class-validator";

export class CreateItemDto {
    @IsString()
    @Length(1)
    name: string;

    @IsString()
    description: string;

    @IsString()
    @Length(1)
    nameRestaurant: string;
}
