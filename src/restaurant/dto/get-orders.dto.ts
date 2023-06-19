import { IsString, Validate } from "class-validator";
import { CustomDateValidator } from "./CustomDateValidator";

export class GetOrdersDto {
    @IsString()
    @Validate(CustomDateValidator)
    day: string;
}
