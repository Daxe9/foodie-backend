import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { PersonModule } from "../person/person.module";
import { PersonService } from "../person/person.service";
import { Person } from "../person/entities/person.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule,
        TypeOrmModule.forFeature([User, Person]),
        PersonModule
    ],
    controllers: [UserController],
    providers: [UserService, PersonService]
})
export class UserModule {}
