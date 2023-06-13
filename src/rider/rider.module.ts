import { Module } from "@nestjs/common";
import { RiderService } from "./rider.service";
import { RiderController } from "./rider.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rider } from "./entities/rider.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Rider])],
    controllers: [RiderController],
    providers: [RiderService]
})
export class RiderModule {}
