import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards, HttpException, HttpStatus
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { Request } from "@nestjs/common";
import {User} from "../user/entities/user.entity";

@Controller("order")
export class OrderController {
    constructor(private readonly ordersService: OrderService) {}

    @UseGuards(JwtAuthGuard)
    @Post("/create")
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const user: User | null = await this.ordersService.findUser(req.user.email)
        if (!user) {
            throw new HttpException("Operation forbidden", HttpStatus.FORBIDDEN)
        }
        const result = await this.ordersService.create(createOrderDto, user);
        return result;
    }
}
