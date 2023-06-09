import { Injectable } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Injectable()
export class RestaurantsService {
    create(createRestaurantDto: CreateRestaurantDto): CreateRestaurantDto {
        // create record in db
        console.log(createRestaurantDto);
        return createRestaurantDto;
    }

    hasRestaurant(nameRestaurant: string): boolean {
        let isPresent = false;

        // db querying to ensure the name is not present

        if (isPresent) {
            return true;
        }

        return false;
    }

    update(updateRestaurantDto: UpdateRestaurantDto) {
        return `This action updates a restaurant`;
    }

    remove(id: number) {
        return `This action removes a #${id} restaurant`;
    }
}
