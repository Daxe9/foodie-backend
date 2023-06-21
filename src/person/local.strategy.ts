import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PersonService } from "./person.service";
import { PersonPayload } from "./entities/person.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(
    Strategy,
    "personStrategy"
) {
    constructor(private personService: PersonService) {
        super({
            usernameField: "email",
            passwordField: "password"
        });
    }

    async validate(email: string, password: string): Promise<PersonPayload> {
        email = email.toLowerCase();
        const user = await this.personService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
