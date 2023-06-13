import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Patch,
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
import { UpdateItemsDto } from "./dto/update-items.dto";
import { ItemService } from "../item/item.service";
import { Item } from "../item/entities/item.entity";

@Controller("restaurant")
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService,
        private readonly utilsService: UtilsService,
        private readonly itemService: ItemService
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

    @UseGuards(JwtAuthGuard)
    @Patch()
    async addItems(@Request() req, @Body() updateItemsDto: UpdateItemsDto) {
        const restaurant: Restaurant = await this.restaurantService.findOne(
            req.user.email
        );
        if (!restaurant) {
            return new HttpException(
                "No restaurant found",
                HttpStatus.NOT_FOUND
            );
        }
        let temp = updateItemsDto.items
        if (!Array.isArray(temp)) {
            temp = [temp];
        }

        const items: Item[] = this.itemService.create(temp);

        // if it is one item then convert it to a list of items


        // establish relation
        items.forEach((item: Item) => {
            item.restaurant = restaurant;
            restaurant.items.push(item);
        });

        // TODO: transaction
        await this.restaurantService.save(restaurant);
        await this.itemService.save(items);
    }
}
