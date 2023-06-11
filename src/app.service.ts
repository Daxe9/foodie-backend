import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./restaurant/entities/restaurant.entity";
import { Item } from "./item/entities/item.entity";

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
            const users = [
                {
                    firstName: "Mario",
                    lastName: "Rossi",
                    email: "mariorossi@libero.it",
                    password: "mariorossi",
                    address: "via roma 1",
                    phone: "11111111"
                },
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "johndoe@example.com",
                    password: "password1",
                    address: "123 Main Street",
                    phone: "1234567890"
                },
                {
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "janesmith@example.com",
                    password: "password2",
                    address: "456 Elm Street",
                    phone: "9876543210"
                },
                {
                    firstName: "Michael",
                    lastName: "Johnson",
                    email: "michaeljohnson@example.com",
                    password: "password3",
                    address: "789 Oak Street",
                    phone: "5678901234"
                },
                {
                    firstName: "Emily",
                    lastName: "Davis",
                    email: "emilydavis@example.com",
                    password: "password4",
                    address: "321 Pine Street",
                    phone: "4321098765"
                }
            ];

            await this.userRepository.insert(users);
        }

        if ((await this.restaurantRepository.count()) === 0) {
            const restaurants = [
                {
                    name: "Restaurant A",
                    email: "restaurantA@example.com",
                    password: "passwordA",
                    address: "123 Main Street",
                    phone: "1234567890"
                },
                {
                    name: "Restaurant B",
                    email: "restaurantB@example.com",
                    password: "passwordB",
                    address: "456 Elm Street",
                    phone: "9876543210"
                },
                {
                    name: "Restaurant C",
                    email: "restaurantC@example.com",
                    password: "passwordC",
                    address: "789 Oak Street",
                    phone: "5678901234"
                },
                {
                    name: "Restaurant D",
                    email: "restaurantD@example.com",
                    password: "passwordD",
                    address: "321 Pine Street",
                    phone: "4321098765"
                },
                {
                    name: "Restaurant E",
                    email: "restaurantE@example.com",
                    password: "passwordE",
                    address: "654 Cedar Street",
                    phone: "210987654305"
                }
            ];
            await this.restaurantRepository.insert(restaurants);
        }

        if ((await this.itemRepository.count()) === 0) {
            const items = [
                {
                    name: "Item A",
                    description: "Description A"
                },
                {
                    name: "Item B",
                    description: "Description B"
                },
                {
                    name: "Item C",
                    description: "Description C"
                },
                {
                    name: "Item D",
                    description: "Description D"
                },
                {
                    name: "Item E",
                    description: "Description E"
                }
            ];
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
