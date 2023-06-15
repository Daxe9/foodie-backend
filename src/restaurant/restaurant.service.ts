import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import {Restaurant, RestaurantPayload, SingleDay, Timetable} from "./entities/restaurant.entity";
import {CreateRestaurantDto, SingleDay as SingleDayDto} from "./dto/create-restaurant.dto";
import { Item } from "../item/entities/item.entity";
import {User} from "../user/entities/user.entity";
import {Person} from "../person/entities/person.entity";
import {PersonService} from "../person/person.service";


@Injectable()
export class RestaurantService {


    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(SingleDay)
        private singleTimeRepository: Repository<SingleDay>,
        @InjectRepository(Timetable)
        private timetableRepository: Repository<Timetable>,
        private personService: PersonService,
        private jwtService: JwtService
    ) {}

    /**
     * return the first user with given email
     * @param email
     */
    async findOne(email: string): Promise<Restaurant | null> {
        const person: Person | null = await this.personService.findOne(email);
        if (!person) {
            return null;
        }
        const restaurant: Restaurant | null = await this.restaurantRepository.findOne({
            where: {
                person: person
            },
            relations: ["person"]
        });
        if (!restaurant) {
            return null;
        }
        return restaurant;
    }
    async insert(createRestaurantDto: CreateRestaurantDto) {
        const personDto = {
            email: createRestaurantDto.email,
            password: createRestaurantDto.password,
            phone: createRestaurantDto.phone,
            address: createRestaurantDto.address
        };
        const person = await this.personService.save(personDto);
        const timetableTemp = createRestaurantDto.timetable;
        const dayTimes: SingleDay[] = [];
        for (let day in timetableTemp) {
            const dayTime = await this.singleTimeRepository.save(timetableTemp[day])
            dayTimes.push(dayTime);
        }
        const timetable = await this.timetableRepository.save({
            monday: dayTimes[0],
            tuesday: dayTimes[1],
            wednesday: dayTimes[2],
            thursday: dayTimes[3],
            friday: dayTimes[4],
            saturday: dayTimes[5],
            sunday: dayTimes[6]
        });

        return this.restaurantRepository.save({
            name: createRestaurantDto.name,
            timetable: timetable,
        })
    }

    async save(restaurant: Restaurant) {
        return this.restaurantRepository.save(restaurant);
    }


    async isPresent(email: string): Promise<boolean> {
        return this.personService.isPresent(email);
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
            const result = await bcrypt.compare(password, restaurant.person.password);

            if (result) {
                // return payload of jwt
                return {
                    name: restaurant.name,
                    address: restaurant.person.address,
                    phone: restaurant.person.phone,
                    email: restaurant.person.email
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

}
