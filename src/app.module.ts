import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { ItemModule } from "./item/item.module";
import { OrderModule } from "./order/order.module";
import { Restaurant } from "./restaurant/entities/restaurant.entity";
import { Timetable } from "./restaurant/entities/timetable.entity";
import { SingleDay } from "./restaurant/entities/singleDay.entity";
import { Item } from "./item/entities/item.entity";
import { RiderModule } from "./rider/rider.module";
import { Order } from "./order/entities/order.entity";
import { Rider } from "./rider/entities/rider.entity";
import { UtilsModule } from "./utils/utils.module";
import { JwtModule } from "@nestjs/jwt";
import { PersonModule } from "./person/person.module";
import { Person } from "./person/entities/person.entity";

@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            // add configService in order to get env variables from .env
            useFactory: async (configService: ConfigService) => ({
                type: "mysql",
                host: "localhost",
                port: 3306,
                database: "FOODIE_DEV",
                username: configService.get<string>("DATABASE_USER") || "",
                password: configService.get<string>("DATABASE_PASSWORD") || "",
                entities: [
                    User,
                    Restaurant,
                    Item,
                    Order,
                    Rider,
                    Person,
                    Timetable,
                    SingleDay
                ]
            })
        }),
        TypeOrmModule.forFeature([User]),
        RestaurantModule,
        UserModule,
        UtilsModule,
        ItemModule,
        OrderModule,
        RiderModule,
        JwtModule,
        PersonModule
    ],
    providers: [AppService]
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
