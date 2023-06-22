import { Module } from "@nestjs/common";
import { RiderService } from "./rider.service";
import { RiderController } from "./rider.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rider } from "./entities/rider.entity";
import { Person } from "../person/entities/person.entity";
import { PersonModule } from "../person/person.module";
import { PersonService } from "../person/person.service";
import { JwtModule } from "@nestjs/jwt";
import { Order } from "../order/entities/order.entity";
import { OrderService } from "../order/order.service";
import { OrderModule } from "../order/order.module";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { ItemModule } from "../item/item.module";
import { ItemService } from "../item/item.service";
import { User } from "../user/entities/user.entity";
import { Item } from "../item/entities/item.entity";

@Module({
    controllers: [RiderController],
    imports: [
        JwtModule,
        OrderModule,
        PersonModule,
        UserModule,
        ItemModule,
        TypeOrmModule.forFeature([Rider, Person, Order, User, Item])
    ],
    providers: [
        RiderService,
        PersonService,
        OrderService,
        UserService,
        ItemService
    ]
})
export class RiderModule {}
