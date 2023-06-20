import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Restaurant, RestaurantPayload } from "./entities/restaurant.entity";
import { Timetable } from "./entities/timetable.entity";
import { SingleDay } from "./entities/singleDay.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Item } from "../item/entities/item.entity";
import { Person } from "../person/entities/person.entity";
import { PersonService } from "../person/person.service";
import { CreateSingleDayDto } from "../person/dto/create-single-day.dto";
import { Order, OrderStatus } from "../order/entities/order.entity";
import { OrderService } from "../order/order.service";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private restaurantRepository: Repository<Restaurant>,
        @InjectRepository(SingleDay)
        private singleTimeRepository: Repository<SingleDay>,
        @InjectRepository(Timetable)
        private timetableRepository: Repository<Timetable>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private orderService: OrderService,
        private dataSource: DataSource,
        private personService: PersonService,
        private jwtService: JwtService
    ) {}

    async findOne(
        email: string,
        relations: string[]
    ): Promise<Restaurant | null> {
        const person: Person | null = await this.personService.findOne(email);
        if (!person) {
            return null;
        }
        const restaurant: Restaurant | null =
            await this.restaurantRepository.findOne({
                where: {
                    person: person
                },
                relations
            });
        if (!restaurant) {
            return null;
        }
        return restaurant;
    }
    async insert(createRestaurantDto: CreateRestaurantDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        const personDto = {
            email: createRestaurantDto.email,
            password: createRestaurantDto.password,
            phone: createRestaurantDto.phone,
            address: createRestaurantDto.address
        };
        // create a person
        const person = this.personService.create(personDto);

        // get timetable reference
        const timetableTemp = createRestaurantDto.timetable;

        // create dto for later timetable creation
        let timetableDto = {};

        // create single day time for each day
        const dayTimes: {
            day: string;
            singleDay: SingleDay;
        }[] = [];
        for (let day in timetableTemp) {
            const dayTime = this.singleTimeRepository.create(
                timetableTemp[day] as CreateSingleDayDto
            );
            dayTimes.push({
                day: day,
                singleDay: dayTime
            });
        }
        // create timetable
        const timetable: Timetable =
            this.timetableRepository.create(timetableDto);

        // restaurant creation transaction
        let restaurant: Restaurant = this.restaurantRepository.create({
            name: createRestaurantDto.name.toLowerCase(),
            url: createRestaurantDto.url,
            category: createRestaurantDto.category.toLowerCase()
        });
        await queryRunner.startTransaction();
        try {
            // save person
            const personDbReference = await queryRunner.manager.save(person);

            // save timetable
            const timetableDbReference = await queryRunner.manager.save(
                timetable
            );

            // save single day times
            for (let day of dayTimes) {
                const singleDayDbReference = await queryRunner.manager.save(
                    day.singleDay
                );
                timetableDbReference[day.day] = singleDayDbReference;
            }
            await queryRunner.manager.save(timetableDbReference);
            // save restaurant
            restaurant.person = personDbReference;
            restaurant.timetable = timetableDbReference;
            restaurant = await queryRunner.manager.save(restaurant);

            await queryRunner.commitTransaction();
        } catch (e) {
            throw new Error(e.message);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return restaurant;
    }

    async changeOrderStatus(
        ordersId: number[],
        restaurantId: number,
        status: OrderStatus
    ): Promise<Order[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const orders = await this.orderService.getOrders(
                ordersId,
                restaurantId
            );
            if (!orders) {
                throw new Error("Operation forbidden");
            }
            // update orders
            for (let order of orders) {
                order.status = status;
            }
            // save orders
            const ordersDbReference = await queryRunner.manager.save(orders);
            await queryRunner.commitTransaction();

            return ordersDbReference;
        } catch (e: any) {
            await queryRunner.rollbackTransaction();
            if (e.message === "Operation forbidden") {
                throw new HttpException(
                    "Operation forbidden",
                    HttpStatus.FORBIDDEN
                );
            } else {
                throw new HttpException(
                    "Internal server error",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } finally {
            await queryRunner.release();
        }
    }

    async save(restaurant: Restaurant) {
        return this.restaurantRepository.save(restaurant);
    }

    async isPresent(email: string): Promise<boolean> {
        return this.personService.isPresent(email);
    }

    async findAll(): Promise<Restaurant[]> {
        return this.restaurantRepository.find();
    }

    async updateMenu(restaurant: Restaurant, items: Item[]) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // save items and return reference
            const itemsDbReference = await queryRunner.manager.save(items);
            await queryRunner.manager.save(restaurant);
            await queryRunner.commitTransaction();

            return itemsDbReference;
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async validateUser(
        email: string,
        password: string
    ): Promise<RestaurantPayload> {
        try {
            // find the user
            const restaurant: Restaurant | null = await this.findOne(email, [
                "person"
            ]);
            if (!restaurant) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(
                password,
                restaurant.person.password
            );

            if (result) {
                // return payload of jwt
                return {
                    id: restaurant.id,
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
