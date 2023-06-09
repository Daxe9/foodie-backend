import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { ItemModule } from './item/item.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports: [],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: configService.get<string>("DATABASE_USER") || "",
                password: configService.get<string>("DATABASE_PASSWORD") || "",
                entities: [],
                synchronize: true
            })
        }),
        RestaurantsModule,
        UserModule,
        ItemModule,
        ItemsModule,
        OrdersModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
