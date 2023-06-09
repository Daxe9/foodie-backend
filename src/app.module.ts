import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";

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
                database: "FOODIE_DEV",
                username: configService.get<string>("DATABASE_USER") || "",
                password: configService.get<string>("DATABASE_PASSWORD") || "",
                entities: [User],
                synchronize: true
            })
        }),
        RestaurantsModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
