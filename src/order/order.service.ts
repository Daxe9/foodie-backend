import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UserService } from "../user/user.service";
import { PersonService } from "../person/person.service";
import { User } from "../user/entities/user.entity";
import { ItemService } from "../item/item.service";
import { Order, OrderStatus } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Item } from "../item/entities/item.entity";
import { RiderService } from "../rider/rider.service";
import { Rider } from "../rider/entities/rider.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly userService: UserService,
        private readonly personService: PersonService,
        private readonly itemService: ItemService,
        private readonly dataSource: DataSource
    ) {}

    async create(createOrderDto: CreateOrderDto, user: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        const items = await this.itemService.getItems(
            createOrderDto.itemsId,
            createOrderDto.restaurantId
        );

        // items are not from the same restaurant
        if (!items) {
            throw new HttpException(
                "Items must belong to the same restaurant",
                HttpStatus.FORBIDDEN
            );
        }

        // get the preparation time of the item that takes time and the total price
        let preparationTime = 0;
        let totalPrice = 0;
        for (const item of items) {
            if (item.preparationTimeMinutes > preparationTime) {
                preparationTime = item.preparationTimeMinutes;
            }
            totalPrice += Number(item.price);
        }

        // start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // create order entity
            const order = this.orderRepository.create({
                address: createOrderDto.address,
                phone: createOrderDto.phone,
                timestamp: new Date(),
                total: totalPrice,
                status: OrderStatus.PENDING
            });
            // create relationships
            order.restaurant = <any>{ id: createOrderDto.restaurantId };
            order.user = user;
            order.items = [...items];

            // save order and get reference
            const orderDbReference = await queryRunner.manager.save(
                Order,
                order
            );

            await queryRunner.commitTransaction();

            const result = {
                preparationTime,
                totalPrice: Number(totalPrice.toFixed(2)),
                orderId: orderDbReference.id,
                restaurantId: createOrderDto.restaurantId
            };

            return result;
        } catch (err) {
            console.log(err.message);
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async findUser(email: string) {
        return this.userService.findOne(email);
    }

    async getOrdersRestaurant(ordersId: number[], restaurantId: number) {
        const orders: Order[] = [];

        for (const orderId of ordersId) {
            const order = await this.orderRepository.findOne({
                where: {
                    id: orderId,
                    restaurant: { id: restaurantId }
                }
            });
            if (order) {
                orders.push(order);
            }
        }

        return ordersId.length === orders.length ? orders : null;
    }

    async getOrdersRider(
        ordersId: number[],
        riderId: number
    ): Promise<Order[]> | null {
        const orders: Order[] = [];

        for (const orderId of ordersId) {
            const order = await this.orderRepository.findOne({
                where: {
                    id: orderId,
                    rider: { id: riderId }
                }
            });
            if (order) {
                orders.push(order);
            }
        }

        return ordersId.length === orders.length ? orders : null;
    }

    async saveOrders(orders: Order[]) {
        return this.orderRepository.save(orders);
    }
}
