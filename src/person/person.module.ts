import { Module } from "@nestjs/common";
import { PersonService } from "./person.service";
import { PersonController } from "./person.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { CustomJwtModule } from "../jwt/jwt.module";
import { JwtStrategy } from "../jwt/jwt.strategy";

@Module({
    controllers: [PersonController],
    imports: [
        CustomJwtModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: {
                    expiresIn: "1h"
                }
            })
        }),
        TypeOrmModule.forFeature([Person])
    ],
    providers: [PersonService, LocalStrategy, JwtStrategy]
})
export class PersonModule {}
