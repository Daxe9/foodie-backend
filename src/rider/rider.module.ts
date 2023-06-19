import { Module } from "@nestjs/common";
import { RiderService } from "./rider.service";
import { RiderController } from "./rider.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rider } from "./entities/rider.entity";
import { Person } from "../person/entities/person.entity";
import { PersonModule } from "../person/person.module";
import { PersonService } from "../person/person.service";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { CustomJwtModule } from "../jwt/jwt.module";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        CustomJwtModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: {
                    expiresIn: "1h"
                }
            })
        }),
        PassportModule,
        PersonModule,
        TypeOrmModule.forFeature([Rider, Person])
    ],
    controllers: [RiderController],
    providers: [RiderService, PersonService, LocalStrategy, JwtStrategy]
})
export class RiderModule {}
