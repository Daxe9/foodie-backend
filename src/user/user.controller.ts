import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    HttpException,
    HttpStatus,
    UseGuards,
    Get
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UtilsService } from "../utils/utils.service";
import { User, UserPayload } from "./entities/user.entity";
import { JwtAuthGuard } from "../jwt/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly utilsService: UtilsService
    ) {}

    @Post("/register")
    async register(@Body() createUserDto: CreateUserDto) {
        // check whether the user is present
        let isPresent = await this.userService.isPresent(createUserDto.email);
        if (isPresent) {
            throw new HttpException(
                {
                    reason: `User with given(${createUserDto.email}) email is already present`
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // TODO: convert columns in lower case except for password, not working rn
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
            throw new HttpException(
                {
                    reason: "Password too weak: 'At least 8 characters\\nAt least 1 lowercase letter\\nAt least 1 uppercase letter\\nAt least 1 digit\\nAt least one of these symbols: !@#$%^&*()-,_+.()' "
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // hash password with bcrypt
        const hashedPassword: string = await this.utilsService.hash(
            createUserDto.password
        );
        try {
            await this.userService.insert({
                ...createUserDto,
                password: hashedPassword
            });
            return {
                message: `User with email(${createUserDto.email}) is created.`
            };
        } catch (e: any) {
            throw new HttpException(
                {
                    reason: e.message
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(AuthGuard("userStrategy"))
    @Post("/login")
    async login(@Request() req) {
        // return jwt token
        return this.userService.login(req.user as UserPayload);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getProfile(@Request() req) {
        // return user record from database deleting password from it
        const user: User = await this.userService.findOne(req.user.email);
        delete user.person.password;
        return user;
    }
}
