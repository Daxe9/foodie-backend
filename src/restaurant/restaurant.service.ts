import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Restaurant, RestaurantPayload } from "./entities/restaurant.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Item } from "../item/entities/item.entity";

@Injectable()
export class RestaurantService {
    /*
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        private jwtService: JwtService
    ) {}

    async insert(createRestaurantDto: CreateRestaurantDto) {
        return this.restaurantRepository.insert(createRestaurantDto);
    }
    async findOne(email: string): Promise<Restaurant | null> {
        return this.restaurantRepository.findOneBy({ email });
    }
    async save(restaurant: Restaurant) {
        return this.restaurantRepository.save(restaurant);
    }

    async isPresent(email: string): Promise<boolean> {
        const result = await this.restaurantRepository.findOneBy({ email });
        return !!result;
    }
    async validateUser(
        email: string,
        password: string
    ): Promise<RestaurantPayload> {
        try {
            // find the user
            const restaurant: Restaurant | null = await this.findOne(email);
            if (!restaurant) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(password, restaurant.password);

            if (result) {
                // return payload of jwt
                return {
                    name: restaurant.name,
                    address: restaurant.address,
                    phone: restaurant.phone,
                    email: restaurant.email
                };
            } else {
                throw new Error();
            }
        } catch (e) {
            return null;
        }
    }

    async getMenu(restaurantName: string): Promise<Item[] | null> {
        const restaurant: Restaurant = await this.restaurantRepository.findOne({
            where: {
                name: restaurantName
            },
            relations: {
                items: true
            }
        });

        // check if the record is present
        if (!restaurant) {
            return null;
        }

        return restaurant.items;
    }

    async login(restaurant: RestaurantPayload): Promise<{
        accessToken: string;
    }> {
        return {
            accessToken: this.jwtService.sign(restaurant)
        };
    }

     */
}
