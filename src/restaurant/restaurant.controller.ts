import {
    Body,
    Controller,
    Get,
    HttpCode,
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
import { CreateItemDto } from "../item/dto/create-item.dto";
import { GetOrdersDto } from "./dto/get-orders.dto";
import { Order, OrderStatus } from "../order/entities/order.entity";
import { ChangeOrderStatusDto } from "../order/dto/change-order-status.dto";
import { Auth } from "../decorators/auth.decorator";
import { Role } from "../person/entities/person.entity";

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
            throw new HttpException(
                {
                    reason: `Restaurant with given(${createRestaurantDto.email}) email is already present`
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // password validation, should return a list of message
        const passwordValidationMessage = this.utilsService.passwordValidation(
            createRestaurantDto.password
        );

        // errors at password validation
        if (!passwordValidationMessage) {
            throw new HttpException(
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
            const restaurant = await this.restaurantService.insert({
                ...createRestaurantDto,
                password: hashedPassword
            });
            return {
                message: `Restaurant with email(${restaurant.person.email}) is created.`
            };
        } catch (e: any) {
            throw new HttpException(
                {
                    reason: e.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(AuthGuard("restaurantStrategy"))
    @HttpCode(200)
    @Post("/login")
    async login(@Request() req) {
        return this.restaurantService.login(req.user as RestaurantPayload);
    }

    @Auth(Role.RESTAURANT)
    @Get("/profile")
    async getProfile(@Request() req) {
        const restaurant: Restaurant = await this.restaurantService.findOne(
            req.user.email,
            ["person", "items"]
        );
        delete restaurant.person.password;
        return restaurant;
    }

    @Auth(Role.RESTAURANT)
    @Get("/orders")
    async getOrders(@Request() req, @Body() getOrdersDto: GetOrdersDto) {
        const restaurant: Restaurant | null =
            await this.restaurantService.findOne(req.user.email, ["orders"]);

        if (!restaurant) {
            throw new HttpException(
                "No restaurant found",
                HttpStatus.NOT_FOUND
            );
        }

        const newOrdersOfTheDay = restaurant.orders.filter((order) => {
            const dateObject = new Date(order.timestamp);
            // get the date based on iso 8601 format
            const orderDate = dateObject.toISOString().split("T")[0];

            if (
                orderDate === getOrdersDto.day &&
                order.status !== OrderStatus.DELIVERY_END &&
                order.status !== OrderStatus.DELIVERY_START
            ) {
                return order;
            }
        });
        return { day: getOrdersDto.day, orders: newOrdersOfTheDay };
    }

    @Auth(Role.RESTAURANT)
    @Patch("/updateMenu")
    async addItems(@Request() req, @Body() updateItemsDto: UpdateItemsDto) {
        const restaurant: Restaurant = await this.restaurantService.findOne(
            req.user.email,
            []
        );
        if (!restaurant) {
            throw new HttpException(
                "No restaurant found",
                HttpStatus.NOT_FOUND
            );
        }

        // check preparation time field
        let temp = updateItemsDto.items;
        temp.forEach((item: CreateItemDto) => {
            if (!Number.isInteger(item.preparationTimeMinutes))
                throw new HttpException(
                    "Preparation time field should be an integer",
                    HttpStatus.BAD_REQUEST
                );
        });

        // create entities
        const items: Item[] = this.itemService.create(temp);
        const menu = await this.restaurantService.getMenu(restaurant.name);

        // filter items that are not in the menu to avoid having duplicates
        const filteredItems: Item[] = items.filter(
            (item) => !menu.some((menuItem) => menuItem.name === item.name)
        );

        // establish relation
        filteredItems.forEach((item: Item) => {
            item.restaurant = restaurant;
        });

        let updatedItems: Item[];
        try {
            // transaction
            updatedItems = await this.restaurantService.updateMenu(
                restaurant,
                filteredItems
            );
        } catch (e) {
            console.log(e.message);
            throw new HttpException(
                "Error while updating menu",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return {
            addedItems: updatedItems
        };
    }

    @Auth(Role.RESTAURANT)
    @HttpCode(200)
    @Post("/orders/accept")
    async acceptOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        const orders: Order[] = await this.restaurantService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.email,
            OrderStatus.PREPARATION_START
        );
        return orders;
    }

    @Auth(Role.RESTAURANT)
    @HttpCode(200)
    @Post("/orders/done")
    async doneOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        const orders: Order[] = await this.restaurantService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.email,
            OrderStatus.PREPARATION_END
        );
        return orders;
    }

    @Get("/menu")
    async getMenu(@Body("restaurantName") name: string) {
        if (!name) {
            throw new HttpException(
                "Missing restaurantName field",
                HttpStatus.BAD_REQUEST
            );
        }

        const menu: Item[] | null = await this.restaurantService.getMenu(name);
        if (menu === null) {
            throw new HttpException(
                "Restaurant Not Found",
                HttpStatus.NOT_FOUND
            );
        }

        return menu;
    }

    @Get("/all")
    async findAll() {
        const restaurants: Restaurant[] =
            await this.restaurantService.findAll();
        return restaurants;
    }
}
