import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Request,
    UseGuards
} from "@nestjs/common";
import { RiderService } from "./rider.service";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { UtilsService } from "../utils/utils.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { Order, OrderStatus } from "../order/entities/order.entity";
import { ChangeOrderStatusDto } from "../order/dto/change-order-status.dto";

@Controller("rider")
export class RiderController {
    constructor(
        private readonly riderService: RiderService,
        private readonly utilsService: UtilsService
    ) {}
    @Post("/register")
    async register(@Body() createRiderDto: CreateRiderDto) {
        // check whether the user is present
        let isPresent = await this.riderService.isPresent(createRiderDto.email);
        if (isPresent) {
            throw new HttpException(
                {
                    reason: `User with given(${createRiderDto.email}) email is already present`
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // password validation, should return a list of message
        const passwordValidationMessage = this.utilsService.passwordValidation(
            createRiderDto.password
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
            createRiderDto.password
        );
        try {
            await this.riderService.insert({
                ...createRiderDto,
                password: hashedPassword
            });
            return {
                message: `Rider with email(${createRiderDto.email}) is created.`
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

    @UseGuards(AuthGuard("riderStrategy"))
    @HttpCode(200)
    @Post("/login")
    async login(@Request() req) {
        return this.riderService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/active")
    async active(@Request() req) {
        return this.riderService.changeStatus(req.user.id, true);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/deactive")
    async deactive(@Request() req) {
        return this.riderService.changeStatus(req.user.id, false);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post("/orders/accept")
    async acceptOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        const orders: Order[] = await this.riderService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.id,
            OrderStatus.DELIVERY_START
        );
        return orders;
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post("/orders/done")
    async doneOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        const orders: Order[] = await this.riderService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.id,
            OrderStatus.DELIVERY_END
        );
        return orders;
    }
}
