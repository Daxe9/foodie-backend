import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Repository } from "typeorm";
import { CreateRestaurantDto } from "../restaurant/dto/create-restaurant.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "../restaurant/entities/restaurant.entity";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}
    async save(items: Item[]): Promise<Item[] | null> {
        try {
            const result: Item[] = await this.itemRepository.save(items);
            return result;
        } catch (e) {
            return null;
        }
    }

    create(createItemDto: CreateItemDto[]): Item[] {
        return this.itemRepository.create(createItemDto);
    }

    // get a list of item based in array of id in input
    async getItems(itemsId: number[], restaurantId: number): Promise<Item[] | null> {
        const items: Item[] = [];
        for (const id of itemsId) {
            const item: Item | null = await this.itemRepository.findOne({
                where: {
                    id,
                    restaurant: {
                        id: restaurantId
                    }
                },
                relations: ["restaurant"]
            });
            if (item) {
                items.push(item);
            }
        }
        return items.length === itemsId.length ? items : null;
    }
}
