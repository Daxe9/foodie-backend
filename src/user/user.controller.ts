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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessUserDto } from "./dto/access-user.dto";
import { UtilsService } from "../utils/utils.service";
import { User } from "./entities/user.entity";
import {InsertResult} from "typeorm";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly utilsService: UtilsService
    ) {}

    @Post("/register")
    async register(@Body() createUserDto: CreateUserDto) {
        /*
        - hasUser
        - all columns in lowercase
        - password check
        - hash password
        - jwt
         */

        // check whether the user is present
        let isPresent = await this.userService.isPresent(createUserDto.email);
        if (isPresent) {
            return new HttpException({ reason: `User with given(${createUserDto.email}) email is already present`}, HttpStatus.BAD_REQUEST);
        }

        // convert columns in lower case except for password
        const pwTemp = createUserDto.password;
        for (let property in createUserDto) {
            property = property.toLowerCase();
        }
        createUserDto.password = pwTemp;

        // password validation, should return a list of message
        const passwordValidationMessage = this.utilsService.passwordValidation(
            createUserDto.password
        );

        // errors at password validation
        if (!passwordValidationMessage) {
            return new HttpException(
                {
                    reason: "Password too weak: 'At least 8 characters\\nAt least 1 lowercase letter\\nAt least 1 uppercase letter\\nAt least 1 digit\\nAt least one of these symbols: !@#$%^&*()-,_+.()' "
                },
                HttpStatus.BAD_REQUEST
            );
        }

        const hashedPassword: string = await this.utilsService.hash(createUserDto.password);
        try {
            const result: InsertResult = await this.userService.insert({
                ...createUserDto,
                password: hashedPassword
            });
            return {
                message: `User with email(${createUserDto.email}) is created.`
            };
        } catch (e: any) {
            return {
                message: e.message
            }
        }
    }

    @Post("/login")
    login(@Body() accessUserDto: AccessUserDto) {}

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
