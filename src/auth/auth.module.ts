import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./jwt.strategy";
import {LocalStrategy} from "./local.strategy";
import {UtilsService} from "../utils/utils.service";
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";
import {UtilsModule} from "../utils/utils.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {PassportModule} from "@nestjs/passport";

@Module({
    imports: [
        UserModule,
        PassportModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET") || "secret",
                signOptions: {
                    expiresIn: "1h"
                }
            })
        }),
        // UtilsModule,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        UserService
        // LocalStrategy, JwtStrategy, UtilsService, UserService, JwtService
    ],

})
export class AuthModule {}
