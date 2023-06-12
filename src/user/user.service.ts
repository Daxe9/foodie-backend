import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UtilsService } from "../utils/utils.service";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
}
