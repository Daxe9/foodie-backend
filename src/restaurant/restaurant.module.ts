import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
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

@Module({
    imports: [
        PassportModule,
        ItemModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: {
                    expiresIn: "1h"
                }
            })
        }),
        TypeOrmModule.forFeature([
            Restaurant,
            Item,
            Person,
            Timetable,
            SingleDay
        ]),
        PersonModule
    ],
    controllers: [RestaurantController],
    providers: [RestaurantService, LocalStrategy, ItemService, PersonService]
})
export class RestaurantModule {}
