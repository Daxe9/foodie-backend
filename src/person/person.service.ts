import { Injectable } from "@nestjs/common";
import { CreatePersonDto } from "./dto/create-person.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";

@Injectable()
export class PersonService {
    constructor(
        @InjectRepository(Person)
        private personRepository: Repository<Person>
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
}
