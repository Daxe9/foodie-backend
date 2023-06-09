import { IsNumber, Length } from "class-validator";

export default class Item {
    @IsNumber()
    id: number;

    @Length(2, 50)
    name: string;

    @Length(0, 256)
    description: string;
}
