import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from "class-validator";

@ValidatorConstraint({ name: "customDate", async: false })
export class CustomDateValidator implements ValidatorConstraintInterface {
    validate(date: string, args: ValidationArguments) {
        if (!date) {
            return false;
        }

        // validate a date string with following form yyyy-mm-dd following ISO 8601
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) {
            return false;
        }
        const parts = date.split("-");
        if (Number(parts[1]) > 12) {
            return false;
        }

        if (Number(parts[2]) > 31) {
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return "Date format should be ISO 8601 convention(yyyy-mm-dd)";
    }
}
