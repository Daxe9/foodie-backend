import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import {User} from "./src/user/entities/user.entity";
import {Item} from "./src/item/entities/item.entity";
import {Restaurant, SingleDay, Timetable} from "./src/restaurant/entities/restaurant.entity";
import {Order} from "./src/order/entities/order.entity";
import {Rider} from "./src/rider/entities/rider.entity";
import {CreateTables1686815288244} from "./migrations/1686815288244-CreateTables";
import {Person} from "./src/person/entities/person.entity";

config();

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: "localhost",
    port: 3306,
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [Person, Timetable, SingleDay, User, Item, Restaurant, Order, Rider],
    migrations: [CreateTables1686815288244]
});