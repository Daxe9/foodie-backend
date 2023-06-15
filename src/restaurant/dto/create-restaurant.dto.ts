import {IsMobilePhone, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class SingleDay {
    @IsString()
    @IsOptional()
    opening1: string;
    @IsString()
    @IsOptional()
    opening2: string;

    @IsString()
    @IsOptional()
    closing1: string;
    @IsString()
    @IsOptional()
    closing2: string;
}

export class Timetable {
    @Type(() => SingleDay)
    monday: SingleDay;
    @Type(() => SingleDay)
    tuesday: SingleDay;
    @Type(() => SingleDay)
    wednesday: SingleDay;
    @Type(() => SingleDay)
    thursday: SingleDay;
    @Type(() => SingleDay)
    friday: SingleDay;
    @Type(() => SingleDay)
    saturday: SingleDay;
    @Type(() => SingleDay)
    sunday: SingleDay;
}
export class CreateRestaurantDto {
    @IsString()
    @Length(2, 255)
    name: string;

    @IsString()
    @Length(1)
    email: string;

    @IsString()
    @Length(1)
    password: string;

    @IsString()
    @Length(1)
    address: string;

    @IsMobilePhone("it-IT")
    phone: string;

    @Type(() => Timetable)
    timetable: Timetable;
}
