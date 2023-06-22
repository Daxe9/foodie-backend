import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rider } from "./entities/rider.entity";
import { CreateRiderDto } from "./dto/create-rider.dto";
import { PersonService } from "../person/person.service";
import { Order, OrderStatus } from "../order/entities/order.entity";
import { OrderService } from "../order/order.service";
import { Role } from "../person/entities/person.entity";

@Injectable()
export class RiderService {
    constructor(
        @InjectRepository(Rider)
        private riderRepository: Repository<Rider>,
        private personService: PersonService,
        private orderService: OrderService
    ) {}

    /**
     * Insert a new rider in the database
     * @param {CreateRiderDto} createRider dto to create a new rider
     */
    async insert(createRider: CreateRiderDto): Promise<Rider> {
        // create a person
        const personDto = {
            email: createRider.email,
            password: createRider.password,
            phone: createRider.phone,
            address: createRider.address,
            role: Role.RIDER
        };
        const person = await this.personService.save(personDto);

        // create a rider
        const rider = this.riderRepository.create({
            isAvailable: false
        });
        rider.person = person;

        return this.riderRepository.save(rider);
    }

    /**
     * Check if the email is already present in the database
     * @param {string} email email to check
     * @returns {Promise<boolean>} true if the email is already present
     */
    async isPresent(email: string) {
        return this.personService.isPresent(email);
    }

    /**
     * Find a rider by email: find a person by email and then find a rider by person
     * @param {string }email email of the rider
     * @returns {(Promise<Rider> | null)} rider found
     */
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

    /**
     * Find a list of available riders
     * @returns {Promise<Rider[]>} a list of available riders
     */
    async getAvailableRiders(): Promise<Rider[]> {
        return this.riderRepository.find({
            where: {
                isAvailable: true
            },
            relations: ["person"]
        });
    }

    /**
     * Change the status of the rider: available or not
     * @param {string} email email of the rider
     * @param {boolean} status new status
     * @returns {Promise<Rider>} updated rider
     */
    async changeStatus(email: string, status: boolean): Promise<Rider> {
        const rider = await this.riderRepository.findOne({
            where: {
                person: {
                    email
                }
            }
        });
        if (!rider) {
            throw new HttpException("Rider not found", HttpStatus.NOT_FOUND);
        }
        rider.isAvailable = status;
        return await this.riderRepository.save(rider);
    }

    /**
     * Change the status of a list of orders passed in
     * @param {number[]} ordersId list of orders id
     * @param {string} riderEmail email of the rider
     * @param {OrderStatus} status new status
     * @throws {HttpException Conflict} if the order is already in the status passed in
     * @throws {HttpException Forbidden} if any of these orders is not assigned to the rider
     * @returns {Promise<Order[]>} updated orders
     */
    async changeOrderStatus(
        ordersId: number[],
        riderEmail: string,
        status: OrderStatus
    ): Promise<Order[]> {
        const orders = await this.orderService.getOrdersRider(
            ordersId,
            riderEmail
        );
        if (!orders) {
            throw new HttpException("Order not found", HttpStatus.FORBIDDEN);
        }

        for (const order of orders) {
            if (order.status === status) {
                throw new HttpException(
                    "Order already in this status",
                    HttpStatus.CONFLICT
                );
            }
            order.status = status;
        }
        return await this.orderService.saveOrders(orders);
    }
}
