import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {RestaurantService} from "./restaurant/restaurant.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) {}
}
