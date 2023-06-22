import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Timetable } from "./entities/timetable.entity";
import { SingleDay } from "./entities/singleDay.entity";
import { ItemModule } from "../item/item.module";
import { ItemService } from "../item/item.service";
import { Item } from "../item/entities/item.entity";
import { Person } from "../person/entities/person.entity";
import { PersonModule } from "../person/person.module";
import { PersonService } from "../person/person.service";
import { OrderModule } from "../order/order.module";
import { OrderService } from "../order/order.service";
import { Order } from "../order/entities/order.entity";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { User } from "../user/entities/user.entity";
import { RiderModule } from "../rider/rider.module";
import { RiderService } from "../rider/rider.service";
import { Rider } from "../rider/entities/rider.entity";

@Module({
    imports: [
        ItemModule,
        JwtModule,
        TypeOrmModule.forFeature([
            Restaurant,
            Item,
            Person,
            Timetable,
            SingleDay,
            Order,
            User,
            Rider
        ]),
        PersonModule,
        OrderModule,
        UserModule,
        RiderModule
    ],
    controllers: [RestaurantController],
    providers: [
        RestaurantService,
        ItemService,
        PersonService,
        OrderService,
        UserService,
        RiderService
    ]
})
export class RestaurantModule {}
