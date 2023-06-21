import { Controller, Post, UseGuards, HttpCode, Request } from "@nestjs/common";
import { PersonService } from "./person.service";
import { AuthGuard } from "@nestjs/passport";
import { PersonPayload } from "./entities/person.entity";

@Controller("person")
export class PersonController {
    constructor(private readonly personService: PersonService) {}

    @UseGuards(AuthGuard("personStrategy"))
    @HttpCode(200)
    @Post("/login")
    async login(@Request() req) {
        return this.personService.login(req.user as PersonPayload);
    }
}
