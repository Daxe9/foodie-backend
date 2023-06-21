import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rider } from "./entities/rider.entity";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { PersonService } from "../person/person.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { OrderStatus } from "../order/entities/order.entity";
import { OrderService } from "../order/order.service";

export type RiderPayload = {
    id: number;
    email: string;
    phone: string;
};

@Injectable()
export class RiderService {
    constructor(
        @InjectRepository(Rider)
        private riderRepository: Repository<Rider>,
        private personService: PersonService,
        private orderService: OrderService,
        private jwtService: JwtService
    ) {}

    async insert(createRider: CreateRiderDto) {
        const personDto = {
            email: createRider.email,
            password: createRider.password,
            phone: createRider.phone,
            address: createRider.address
        };

        const person = await this.personService.save(personDto);
        const rider = this.riderRepository.create({
            isAvailable: false
        });
        rider.person = person;

        return this.riderRepository.save(rider);
    }

    async isPresent(email: string) {
        return this.personService.isPresent(email);
    }

    async findOne(email: string): Promise<Rider | null> {
        const person = await this.personService.findOne(email);
        if (!person) {
            return null;
        }

        const rider = await this.riderRepository.findOne({
            where: {
                person: person
            },
            relations: ["person"]
        });
        if (!rider) {
            return null;
        }
        return rider;
    }

    async getAvailableRiders() {
        return this.riderRepository.find({
            where: {
                isAvailable: true
            },
            relations: ["person"]
        });
    }

    async validateUser(email: string, password: string) {
        try {
            const rider: Rider | null = await this.findOne(email);
            if (!rider) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(
                password,
                rider.person.password
            );

            if (result) {
                // return payload of jwt
                return {
                    id: rider.id,
                    email: rider.person.email,
                    phone: rider.person.phone
                };
            } else {
                throw new Error();
            }
        } catch (e) {
            return null;
        }
    }

    async changeStatus(id: number, status: boolean) {
        const rider = await this.riderRepository.findOne({
            where: {
                id
            }
        });
        if (!rider) {
            throw new HttpException("Rider not found", HttpStatus.NOT_FOUND);
        }
        rider.isAvailable = status;
        const riderDbReference = await this.riderRepository.save(rider);
        return riderDbReference;
    }

    async login(rider: RiderPayload): Promise<{
        access_token: string;
    }> {
        return {
            access_token: this.jwtService.sign(rider)
        };
    }

    async changeOrderStatus(
        ordersId: number[],
        riderId: number,
        status: OrderStatus
    ) {
        const orders = await this.orderService.getOrdersRider(
            ordersId,
            riderId
        );
        if (!orders) {
            throw new HttpException("Order not found", HttpStatus.FORBIDDEN);
        }

        for (const order of orders) {
            order.status = status;
        }
        const ordersDbReference = await this.orderService.saveOrders(orders);
        return ordersDbReference;
    }
}
