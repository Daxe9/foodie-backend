import {
    IsDefined,
    IsMobilePhone,
    IsNotEmptyObject,
    IsObject,
    IsString,
    Length,
    Validate,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { CustomSingleDayTimeValidator } from "./CustomTimetableValidator";

export class SingleDay {
    @Validate(CustomSingleDayTimeValidator)
    opening1: string;
    @Validate(CustomSingleDayTimeValidator)
    opening2: string;

    @Validate(CustomSingleDayTimeValidator)
    closing1: string;
    @Validate(CustomSingleDayTimeValidator)
    closing2: string;
}

export class Timetable {
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    monday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    tuesday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    wednesday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    thursday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    friday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    saturday: SingleDay;
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => SingleDay)
    sunday: SingleDay;
}
export class CreateRestaurantDto {
    @IsString()
    @Length(2, 255)
    name: string;

    @IsString()
    @Length(2, 255)
    category: string;

    @IsString()
    @Length(0, 2048)
    url: string;

    @IsString()
    @Length(1)
    email: string;

    @IsString()
    @Length(1)
    password: string;

    @IsString()
    @Length(1)
    address: string;

    @IsMobilePhone(
        "it-IT",
        {},
        { message: "Phone number must be an Italian number" }
    )
    phone: string;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Timetable)
    timetable: Timetable;
}
