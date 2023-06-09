import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessUserDto } from "./dto/access-user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("/register")
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post("/login")
    login(@Body() accessUserDto: AccessUserDto) {}

    @Get()
    findOne(@Body("email") email: string) {
        return this.userService.findOne(email);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
