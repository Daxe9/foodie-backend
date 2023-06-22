import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Timetable } from "./entities/timetable.entity";
import { SingleDay } from "./entities/singleDay.entity";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { Item } from "../item/entities/item.entity";
import { Person, Role } from "../person/entities/person.entity";
import { PersonService } from "../person/person.service";
import { CreateSingleDayDto } from "../person/dto/create-single-day.dto";
import { Order, OrderStatus } from "../order/entities/order.entity";
import { OrderService } from "../order/order.service";
import { RiderService } from "../rider/rider.service";
import { Rider } from "../rider/entities/rider.entity";

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
        private riderService: RiderService,
        private dataSource: DataSource,
        private personService: PersonService
    ) {}

    /**
     * Find a restaurant by email
     * @param {string} email restaurant email
     * @param {string} relations relations to load
     * @returns {Promise<Restaurant | null>} found restaurant or null
     */
    async findOne(
        email: string,
        relations: string[]
    ): Promise<Restaurant | null> {
        // find the person
        const person: Person | null = await this.personService.findOne(email);
        if (!person) {
            return null;
        }

        // get restaurant reference
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

    /**
     * Create a restaurant in db
     * @param {createRestaurantDto} createRestaurantDto dto to create a restaurant
     * @throws {Error} if transaction goes wrong
     * @returns {Promise<Restaurant>} created restaurant
     */
    async insert(createRestaurantDto: CreateRestaurantDto) {
        const queryRunner = this.dataSource.createQueryRunner();

        const personDto = {
            email: createRestaurantDto.email,
            password: createRestaurantDto.password,
            phone: createRestaurantDto.phone,
            address: createRestaurantDto.address,
            role: Role.RESTAURANT
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
        await queryRunner.connect();
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
                timetableDbReference[day.day] = await queryRunner.manager.save(
                    day.singleDay
                );
            }
            await queryRunner.manager.save(timetableDbReference);
            // save restaurant
            restaurant.person = personDbReference;
            restaurant.timetable = timetableDbReference;
            restaurant = await queryRunner.manager.save(restaurant);

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new Error(e.message);
        } finally {
            await queryRunner.release();
        }

        return restaurant;
    }

    /**
     * Update a list of order status of a restaurant
     * @param {number[]} ordersId list of order id
     * @param {string} restaurantEmail restaurant email
     * @param {OrderStatus} status new status
     * @throws {HttpException Conflict} if order is already in this status
     * @throws {HttpException Forbidden} if order is not assigned to this restaurant
     * @throws {HttpException InternalServerError} if transaction goes wrong
     * @returns {Promise<Order[]>} updated orders
     */
    async changeOrderStatus(
        ordersId: number[],
        restaurantEmail: string,
        status: OrderStatus
    ): Promise<Order[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const orders = await this.orderService.getOrdersRestaurant(
                ordersId,
                restaurantEmail
            );
            if (!orders) {
                throw new Error("Operation forbidden");
            }
            // update orders
            for (let order of orders) {
                if (order.status === status) {
                    throw new Error("Order already in this status");
                }
                order.status = status;
            }

            // assign random rider
            const availableRiders =
                await this.riderService.getAvailableRiders();

            const result = [];

            for (let order of orders) {
                const info = {
                    orderId: order.id,
                    address: order.address,
                    phone: order.phone,
                    total: order.total
                };

                // if order is not assigned to a rider
                if (!order.rider) {
                    // TODO: no riders available
                    const notAvailable = availableRiders.length <= 0;
                    // choose a random rider from the list if the list is not empty
                    let randomRider: Rider | null = null;
                    if (!notAvailable) {
                        randomRider =
                            availableRiders[
                                Math.floor(
                                    Math.random() * availableRiders.length
                                )
                            ];
                        randomRider.isAvailable = false;
                        // remove random rider from the list
                        availableRiders.splice(
                            availableRiders.indexOf(randomRider),
                            1
                        );
                        order.rider = randomRider;
                        await queryRunner.manager.save(randomRider);
                    }

                    if (notAvailable) {
                        info["message"] = "No riders available for now";
                    } else {
                        info["rider"] = {
                            id: randomRider!.id,
                            phone: randomRider!.person.phone
                        };
                    }
                }
                result.push(info);
            }

            // save orders
            await queryRunner.manager.save(orders);
            await queryRunner.commitTransaction();

            return result;
        } catch (e: any) {
            await queryRunner.rollbackTransaction();
            if (e.message === "Operation forbidden") {
                throw new HttpException(e.message, HttpStatus.FORBIDDEN);
            } else if (e.message === "The order is already in this status") {
                throw new HttpException(e.message, HttpStatus.CONFLICT);
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

    /**
     * Check if the email is present in the database
     * @param {string} email email to check
     * @returns {Promise<boolean>} true if the email is present, false otherwise
     */
    async isPresent(email: string): Promise<boolean> {
        return this.personService.isPresent(email);
    }

    /**
     * Find all restaurants
     * @returns {Promise<Restaurant[]>} list of restaurants
     */
    async findAll(): Promise<Restaurant[]> {
        return this.restaurantRepository.find();
    }

    /**
     * update restaurant menu
     * @param {Restaurant} restaurant restaurant to update
     * @param {Item[]} items new items to add
     * @throws {HttpException InternalServerError} if transaction goes wrong
     * @returns {Promise<Item[]>} list of items
     */
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
            throw new HttpException(
                "Internal server error",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Get all items from a specific restaurant
     * @param {string} restaurantName name of the restaurant
     * @returns {Promise<Item[] | null>} list of items or null if the restaurant is not present
     */
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
}
