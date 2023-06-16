import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, UseGuards
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import {JwtAuthGuard} from "../jwt/jwt-auth.guard";

@Controller("order")
export class OrderController {
    constructor(private readonly ordersService: OrderService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    hello() {
        return "hello";
    }
}