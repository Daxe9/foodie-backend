import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantPayload } from "./entities/restaurant.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "restaurant") {
    constructor(private restaurantService: RestaurantService) {
        super({
            usernameField: "email",
            passwordField: "password"
        });
    }

    async validate(
        email: string,
        password: string
    ): Promise<RestaurantPayload> {
        const restaurant = await this.restaurantService.validateUser(
            email,
            password
        );
        if (!restaurant) {
            throw new UnauthorizedException();
        }
        return restaurant;
    }
}
