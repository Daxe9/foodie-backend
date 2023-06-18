import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import {UserService} from "../user/user.service";
import {PersonService} from "../person/person.service";
import {User} from "../user/entities/user.entity";
import {ItemService} from "../item/item.service";
import {Order} from "./entities/order.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {Item} from "../item/entities/item.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly userService: UserService,
        private readonly personService: PersonService,
        private readonly itemService: ItemService,
        private readonly dataSource: DataSource
    ) { }

    async create(createOrderDto: CreateOrderDto, user: User) {
        const queryRunner = this.dataSource.createQueryRunner();
        const items = await this.itemService.getItems(createOrderDto.itemsId, createOrderDto.restaurantId);

        // items are not from the same restaurant
        if (!items) {
            throw new HttpException("Items must belong to the same restaurant", HttpStatus.FORBIDDEN);
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

        // create order entity
        const order = this.orderRepository.create({
            address: createOrderDto.address,
            phone: createOrderDto.phone,
            total: totalPrice
        });

        // start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            order.user = user;
            order.items = [...items];

            const orderDbReference = await queryRunner.manager.save(Order, order);
            await queryRunner.commitTransaction();

            // TODO: rider initialization
            return {
                preparationTime,
                totalPrice,
                orderId: orderDbReference.id
            }

        } catch (err) {
            console.log(err.message)
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async findUser(email: string) {
        return this.userService.findOne(email);
    }
}
