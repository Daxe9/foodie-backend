import { Module } from "@nestjs/common";
import { ItemService } from "./item.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService],
    exports: [ItemService]
})
export class ItemModule {}
