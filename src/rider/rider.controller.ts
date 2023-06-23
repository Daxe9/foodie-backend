import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Request
} from "@nestjs/common";
import { RiderService } from "./rider.service";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { UtilsService } from "../utils/utils.service";
import { OrderStatus } from "../order/entities/order.entity";
import { ChangeOrderStatusDto } from "../order/dto/change-order-status.dto";
import { Auth } from "../decorators/auth.decorator";
import { Role } from "../person/entities/person.entity";

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
            const rider = await this.riderService.insert({
                ...createRiderDto,
                password: hashedPassword
            });
            return {
                id: rider.id,
                email: rider.person.email,
                phone: rider.person.phone
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

    @Auth(Role.RIDER)
    @Patch("/active")
    async active(@Request() req) {
        return this.riderService.changeStatus(req.user.email, true);
    }

    @Auth(Role.RIDER)
    @Patch("/deactive")
    async deactive(@Request() req) {
        return this.riderService.changeStatus(req.user.email, false);
    }

    @Auth(Role.RIDER)
    @HttpCode(200)
    @Post("/orders/accept")
    async acceptOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        return await this.riderService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.email,
            OrderStatus.DELIVERY_START
        );
    }

    @Auth(Role.RIDER)
    @HttpCode(200)
    @Post("/orders/done")
    async doneOrders(
        @Request() req,
        @Body() changeOrderStatusDto: ChangeOrderStatusDto
    ) {
        return await this.riderService.changeOrderStatus(
            changeOrderStatusDto.ordersId,
            req.user.email,
            OrderStatus.DELIVERY_END
        );
    }
}
