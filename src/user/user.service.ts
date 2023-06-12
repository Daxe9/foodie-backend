import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilsService } from "../utils/utils.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async insert(createUserDto: CreateUserDto) {
        return this.userRepository.insert(createUserDto);
    }

    findAll() {
        return `This action returns all user`;
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
}
