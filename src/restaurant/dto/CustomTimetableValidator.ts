import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ name: "customSingleDay", async: false })
export class CustomSingleDayTimeValidator
    implements ValidatorConstraintInterface
{
    validate(time: any, args: ValidationArguments) {
        // check if value is null
        if (time === null) {
            return true;
        }

        // check if value is undefined or empty or not string
        if (!time || typeof time !== "string") {
            return false;
        }

        // validate a time string with following form hh:mm
        const regex = /^\d{2}:\d{2}$/;
        if (!regex.test(time)) {
            return false;
        }
        const parts = time.split(":");
        return !(Number(parts[0]) > 23 || Number(parts[1]) > 59);
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return "Single day time format should be hh:mm";
    }
}
