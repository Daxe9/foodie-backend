import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Person, Role } from "../person/entities/person.entity";
import { PersonService } from "../person/person.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private personService: PersonService
    ) {}

    /**
     * Insert a new user by creating a new person and then a new user
     * @param {CreateUserDto} createUserDto dto to create a user
     * @returns {Promise<User>} the user created
     */
    async insert(createUserDto: CreateUserDto) {
        // create a person
        const personDto = {
            email: createUserDto.email,
            password: createUserDto.password,
            phone: createUserDto.phone,
            address: createUserDto.address,
            role: Role.USER
        };
        const person = await this.personService.save(personDto);

        // create a user
        const user = this.userRepository.create({
            firstName: createUserDto.firstName.toLowerCase(),
            lastName: createUserDto.lastName.toLowerCase()
        });
        user.person = person;

        return this.userRepository.save(user);
    }

    /**
     * Check if the email is already used by a person
     * @param {string} email the email to check
     * @returns {Promise<boolean>} true if the email is already used
     */
    async isPresent(email: string) {
        return this.personService.isPresent(email);
    }

    /**
     * Find a user by email: find a person by email and then find a user by person
     * @param {string} email the email of the user
     * @returns {(Promise<User | null>)} the user found
     */
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
}
