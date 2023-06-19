import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RiderPayload, RiderService } from "./rider.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "riderStrategy") {
    constructor(private riderService: RiderService) {
        super({
            usernameField: "email",
            passwordField: "password"
        });
    }

    async validate(email: string, password: string): Promise<RiderPayload> {
        const rider = await this.riderService.validateUser(email, password);
        if (!rider) {
            throw new UnauthorizedException();
        }
        return rider;
    }
}
