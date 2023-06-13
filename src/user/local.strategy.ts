import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserPayload } from "./entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "user") {
    constructor(private userService: UserService) {
        super({
            usernameField: "email",
            passwordField: "password"
        });
    }

    async validate(email: string, password: string): Promise<UserPayload> {
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
