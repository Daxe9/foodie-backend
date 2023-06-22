import { Injectable } from "@nestjs/common";
import { CreatePersonDto } from "../restaurant/dto/create-person.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Person, PersonPayload } from "./entities/person.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>,
        private jwtService: JwtService
    ) {}

    /**
     * Create a new person
     * @param {CreatePersonDto} createPersonDto person data
     */
    create(createPersonDto: CreatePersonDto) {
        return this.personRepository.create(createPersonDto);
    }

    /**
     * Check whether a person with given email is present or not
     * @param {string} email email to check
     * @return {Promise<boolean>} true if present, false otherwise
     */
    async isPresent(email: string): Promise<boolean> {
        const result = await this.personRepository.findOneBy({ email });
        return !!result;
    }

    /**
     * Find the user with given email
     * @param {string} email email to find
     * @returns {Promise<Person | null>} person if found, null otherwise
     */
    async findOne(email: string): Promise<Person | null> {
        return this.personRepository.findOneBy({ email });
    }

    /**
     * Save the person to database
     * @param {string} createPersonDto person data
     * @returns {Promise<Person>} saved person
     */
    async save(createPersonDto: CreatePersonDto) {
        // convert all values to lowercase except for password
        const pwTemp = createPersonDto.password;
        for (let property in createPersonDto) {
            createPersonDto[property] = createPersonDto[property].toLowerCase();
        }
        createPersonDto.password = pwTemp;

        return this.personRepository.save(createPersonDto);
    }

    /**
     * Fallback method of login validation
     * @param {string} email email
     * @param {string} password password
     * @returns {(Promise<PersonPayload | null>)} payload of jwt
     */
    async validateUser(
        email: string,
        password: string
    ): Promise<PersonPayload | null> {
        try {
            const person: Person | null = await this.findOne(email);
            if (!person) {
                throw new Error();
            }
            const result = await bcrypt.compare(password, person.password);

            if (result) {
                // return payload of jwt
                return {
                    id: person.id,
                    email: person.email,
                    role: person.role
                };
            } else {
                throw new Error();
            }
        } catch (e) {
            return null;
        }
    }

    /**
     * Login the user
     * @param {PersonPayload} person
     * @returns {{access_token: string}} access token
     */
    login(person: PersonPayload): {
        accessToken: string;
    } {
        // generate a jwt token with user info
        return {
            accessToken: this.jwtService.sign(person)
        };
    }
}
