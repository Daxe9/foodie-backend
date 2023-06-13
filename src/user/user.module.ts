import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UtilsModule } from "../utils/utils.module";
import { UtilsService } from "../utils/utils.service";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UtilsModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: {
                    expiresIn: "1h"
                }
            })
        })
    ],
    controllers: [UserController],
    providers: [UserService, UtilsService, LocalStrategy, JwtStrategy]
})
export class UserModule {}
