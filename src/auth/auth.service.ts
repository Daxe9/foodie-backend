import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "../user/entities/user.entity";
import { JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string) {
        try {
            // find the user
            const user: User | null = await this.userService.findOne(email);
            if (!user) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                const { password: _, ...payload } = user;
                // return payload of jwt
                return payload;
            } else {
                throw new Error();
            }
        } catch (e) {

            return null;
        }

    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }}
