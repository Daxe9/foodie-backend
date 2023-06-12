import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt"

@Injectable()
export class UtilsService {
    private readonly saltRounds = 10;


    passwordValidation(password: string): boolean {
        // TODO: Test
        // At least 8 characters
        // At least one lowercase letter
        // At least one uppercase letter
        // At least one digit
        // special characters: !@#$%^&*()\-,_+.()
        const regex: RegExp =
            /^(?=(.*[a-z])+)(?=(.*[A-Z])+)(?=(.*[0-9])+)(?=(.*[!@#$%^&*()\-,_+.])+).{8,}$/;
        return regex.test(password);
    }

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
}
