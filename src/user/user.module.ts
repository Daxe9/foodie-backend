import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../jwt/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { CustomJwtModule } from "../jwt/jwt.module";
import { PersonModule } from "../person/person.module";
import { PersonService } from "../person/person.service";
import { Person } from "../person/entities/person.entity";

@Module({
    imports: [
        CustomJwtModule,
        TypeOrmModule.forFeature([User, Person]),
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
        PersonModule
    ],
    controllers: [UserController],
    providers: [UserService, LocalStrategy, JwtStrategy, PersonService]
})
export class UserModule {}
