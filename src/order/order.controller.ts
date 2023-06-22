import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Request
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from "../user/entities/user.entity";
import { Auth } from "../decorators/auth.decorator";
import { Role } from "../person/entities/person.entity";

@Controller("order")
export class OrderController {
    constructor(private readonly ordersService: OrderService) {}

    @Auth(Role.USER)
    @Post("/create")
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const user: User | null = await this.ordersService.findUser(
            req.user.email
        );
        if (!user) {
            throw new HttpException(
                "Operation forbidden",
                HttpStatus.FORBIDDEN
            );
        }
        const result = await this.ordersService.create(createOrderDto, user);
        if (!result) {
            throw new HttpException(
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        return {
            ...result,
            email: user.person.email
        };
    }
}
