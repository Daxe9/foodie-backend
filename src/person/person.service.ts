import { Injectable } from "@nestjs/common";
import { CreatePersonDto } from "./dto/create-person.dto";
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

    create(createPersonDto: CreatePersonDto) {
        return this.personRepository.create(createPersonDto);
    }

    /**
     * Check whether a person with given email is present or not
     * @param email
     * @return Promise<boolean>
     */
    async isPresent(email: string): Promise<boolean> {
        const result = await this.personRepository.findOneBy({ email });
        return !!result;
    }

    /**
     * return the first user with given email
     * @param email
     */
    async findOne(email: string): Promise<Person | null> {
        return this.personRepository.findOneBy({ email });
    }

    async save(createPersonDto: CreatePersonDto) {
        // convert all values to lowercase except for password
        const pwTemp = createPersonDto.password;
        for (let property in createPersonDto) {
            createPersonDto[property] = createPersonDto[property].toLowerCase();
        }
        createPersonDto.password = pwTemp;

        return this.personRepository.save(createPersonDto);
    }

    async validateUser(
        email: string,
        password: string
    ): Promise<PersonPayload> {
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

    async login(person: PersonPayload): Promise<{
        accessToken: string;
    }> {
        // generate a jwt token with user info
        return {
            accessToken: this.jwtService.sign(person)
        };
    }
}
