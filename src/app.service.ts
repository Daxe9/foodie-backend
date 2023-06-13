import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./restaurant/entities/restaurant.entity";
import { Item } from "./item/entities/item.entity";
import { users, restaurants, items} from "./seeds"

@Injectable()
export class AppService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}
    getHello(): string {
        return "Hello World!";
    }

    async onApplicationBootstrap() {
        if ((await this.userRepository.count()) === 0) {
            await this.userRepository.insert(users);
        }

        if ((await this.restaurantRepository.count()) === 0) {
            await this.restaurantRepository.insert(restaurants);
        }

        if ((await this.itemRepository.count()) === 0) {
            await this.itemRepository.insert(items);
        }

        const restaurant = await this.restaurantRepository.findOne({
            where: {
                email: "restaurantB@example.com"
            }
        });
        const item = await this.itemRepository.findOne({
            where: {
                name: "Item E"
            }
        });

        if (restaurant && item) {
            item.restaurant = restaurant;
            await this.itemRepository.save(item);
        }
    }
}
