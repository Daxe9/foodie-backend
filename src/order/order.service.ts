import { Injectable } from "@nestjs/common";
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
        const items = await this.itemService.getItems(createOrderDto.itemsId);
        const totalPrice = items.reduce((acc, item) => acc + Number(item.price), 0);

        const order = this.orderRepository.create({
            address: createOrderDto.address,
            phone: createOrderDto.phone,
            total: totalPrice
        });

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            order.user = user;


            items.forEach(async (item )=> {
                item.orders = [order]
                await queryRunner.manager.save(Item, item);
            });
            // order.items = [...items];
            const result = await queryRunner.manager.insert(Order, order);


            await queryRunner.commitTransaction();
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
