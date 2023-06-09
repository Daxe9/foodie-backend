import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import { RestaurantsService } from "./restaurants.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Controller("restaurants")
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) {}

    @Post()
    create(@Body() createRestaurantDto: CreateRestaurantDto) {
        // restaurant with given name is already present in the db
        if (this.restaurantsService.hasRestaurant(createRestaurantDto.name)) {
            throw new HttpException("Conflict", HttpStatus.CONFLICT);
        }
        return this.restaurantsService.create(createRestaurantDto);
    }

    @Patch()
    update(@Body() updateRestaurantDto: UpdateRestaurantDto) {
        if (!this.restaurantsService.hasRestaurant(updateRestaurantDto.name)) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }

        return this.restaurantsService.update(updateRestaurantDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.restaurantsService.remove(+id);
    }
}
