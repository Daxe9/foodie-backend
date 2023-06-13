import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserPayload } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async insert(createUserDto: CreateUserDto) {
        return this.userRepository.insert(createUserDto);
    }

    async findOne(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    async isPresent(email: string): Promise<boolean> {
        const result = await this.userRepository.findOneBy({ email });
        return !!result;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async validateUser(email: string, password: string): Promise<UserPayload> {
        try {
            // find the user
            const user: User | null = await this.findOne(email);
            if (!user) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                // return payload of jwt
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };
            } else {
                throw new Error();
            }
        } catch (e) {
            return null;
        }
    }

    async login(user: UserPayload): Promise<{
        accessToken: string;
    }> {
        // generate a jwt token with user info
        return {
            accessToken: this.jwtService.sign(user)
        };
    }
}
