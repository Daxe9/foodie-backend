import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {PersonModule} from "../person/person.module";
import {PersonService} from "../person/person.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {ItemService} from "../item/item.service";
import {ItemModule} from "../item/item.module";
import {Item} from "../item/entities/item.entity";
import {User} from "../user/entities/user.entity";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {Person} from "../person/entities/person.entity";

@Module({
    imports: [UserModule, PersonModule, ItemModule, TypeOrmModule.forFeature([Order, User, Item, Person]), JwtModule],
    controllers: [OrderController],
    providers: [OrderService, UserService, PersonService, ItemService, JwtService]
})
export class OrderModule {}
