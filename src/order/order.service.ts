import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UserService } from "../user/user.service";
import { PersonService } from "../person/person.service";
import { User } from "../user/entities/user.entity";
import { ItemService } from "../item/item.service";
import { Order, OrderStatus } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

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

    /**
     * Create an order
     * @param {CreateOrderDto} createOrderDto order data
     * @param {User} user user entity
     */
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

            return {
                preparationTime,
                totalPrice: Number(totalPrice.toFixed(2)),
                orderId: orderDbReference.id,
                restaurantId: createOrderDto.restaurantId
            };
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

    /**
     * Find a user by email
     * @param {string} email
     * @returns {Promise<User>}
     */
    async findUser(email: string) {
        return this.userService.findOne(email);
    }

    /**
     * Get orders of a restaurant using the restaurant email
     * @param {number[]} ordersId
     * @param {string} email
     * @returns {Promise<Order[] | null>} orders
     */
    async getOrdersRestaurant(ordersId: number[], email: string) {
        const orders: Order[] = [];

        for (const orderId of ordersId) {
            const order = await this.orderRepository.findOne({
                where: {
                    id: orderId,
                    restaurant: {
                        person: {
                            email
                        }
                    }
                },
                relations: ["rider"]
            });
            if (order) {
                orders.push(order);
            }
        }

        return ordersId.length === orders.length ? orders : null;
    }

    /**
     * Get orders of a restaurant using the rider email
     * @param {number[]} ordersId
     * @param {string} riderEmail
     * @returns {Promise<Order[] | null>} orders
     */
    async getOrdersRider(
        ordersId: number[],
        riderEmail: string
    ): Promise<Order[]> | null {
        const orders: Order[] = [];

        for (const orderId of ordersId) {
            const order = await this.orderRepository.findOne({
                where: {
                    id: orderId,
                    rider: {
                        person: {
                            email: riderEmail
                        }
                    }
                }
            });
            if (order) {
                orders.push(order);
            }
        }

        return ordersId.length === orders.length ? orders : null;
    }

    /**
     * Save orders
     * @param {Order[]} orders
     * @returns {Promise<Order[]>}
     */
    async saveOrders(orders: Order[]) {
        return this.orderRepository.save(orders);
    }
}
