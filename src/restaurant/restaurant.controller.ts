import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { UtilsService } from "../utils/utils.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Restaurant, RestaurantPayload } from "./entities/restaurant.entity";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("restaurant")
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService,
        private readonly utilsService: UtilsService
    ) {}

    @Post("/register")
    async register(@Body() createRestaurantDto: CreateRestaurantDto) {
        // check whether the user is present
        let isPresent = await this.restaurantService.isPresent(
            createRestaurantDto.email
        );
        if (isPresent) {
            return new HttpException(
                {
                    reason: `Restaurant with given(${createRestaurantDto.email}) email is already present`
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // convert columns in lower case except for password
        const pwTemp = createRestaurantDto.password;
        for (let property in createRestaurantDto) {
            property = property.toLowerCase();
        }
        createRestaurantDto.password = pwTemp;

        // password validation, should return a list of message
        const passwordValidationMessage = this.utilsService.passwordValidation(
            createRestaurantDto.password
        );

        // errors at password validation
        if (!passwordValidationMessage) {
            return new HttpException(
                {
                    reason: "Password too weak: 'At least 8 characters\\nAt least 1 lowercase letter\\nAt least 1 uppercase letter\\nAt least 1 digit\\nAt least one of these symbols: !@#$%^&*()-,_+.()' "
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // hash password with bcrypt
        const hashedPassword: string = await this.utilsService.hash(
            createRestaurantDto.password
        );
        try {
            await this.restaurantService.insert({
                ...createRestaurantDto,
                password: hashedPassword
            });
            return {
                message: `Restaurant with email(${createRestaurantDto.email}) is created.`
            };
        } catch (e: any) {
            return {
                message: e.message
            };
        }
    }


    @UseGuards(AuthGuard("restaurant"))
    @Post("/login")
    async login(@Request() req) {
        return this.restaurantService.login(req.user as RestaurantPayload);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getProfile(@Request() req) {
        const restaurant: Restaurant = await this.restaurantService.findOne(
            req.user.email
        );
        delete restaurant.password;
        return restaurant;
    }
}
