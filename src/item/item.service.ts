import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}
    async save(items: Item[]): Promise<Item[] | null> {
        try {
            return await this.itemRepository.save(items);
        } catch (e) {
            return null;
        }
    }

    /**
     * Create a list of item
     * @param {CreateItemDto[]} createItemDto list of item to create
     * @returns {Promise<Item[] | null>} list of item created
     */
    create(createItemDto: CreateItemDto[]): Item[] {
        return this.itemRepository.create(createItemDto);
    }

    /**
     * Get a list of item based on their id and restaurant id
     * @param {number[]} itemsId list of item id
     * @param {number} restaurantId restaurant id
     */
    async getItems(
        itemsId: number[],
        restaurantId: number
    ): Promise<Item[] | null> {
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
