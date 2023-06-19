import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserPayload } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Person } from "../person/entities/person.entity";
import { PersonService } from "../person/person.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private personService: PersonService,
        private jwtService: JwtService
    ) {}

    /**
     * Method for fast insertion of a single user
     * @param createUserDto Data Transfer Object for user creation
     */
    async insert(createUserDto: CreateUserDto) {
        const personDto = {
            email: createUserDto.email,
            password: createUserDto.password,
            phone: createUserDto.phone,
            address: createUserDto.address
        };
        const person = await this.personService.save(personDto);
        const user = this.userRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName
        });
        user.person = person;
        return this.userRepository.save(user);
    }

    async isPresent(email: string) {
        return this.personService.isPresent(email);
    }

    async findOne(email: string): Promise<User | null> {
        const person: Person | null = await this.personService.findOne(email);
        if (!person) {
            return null;
        }
        const user: User | null = await this.userRepository.findOne({
            where: {
                person: person
            },
            relations: ["person"]
        });
        if (!user) {
            return null;
        }
        return user;
    }

    async validateUser(email: string, password: string): Promise<UserPayload> {
        try {
            const user: User | null = await this.findOne(email);
            if (!user) {
                throw new Error();
            }
            // compare password
            const result = await bcrypt.compare(password, user.person.password);

            if (result) {
                // return payload of jwt
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.person.email
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
