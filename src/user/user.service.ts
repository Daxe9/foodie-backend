import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>) {}

    create(createUserDto: CreateUserDto) {
        
    }

    findAll() {
        return `This action returns all user`;
    }

    async findOne(email: string): Promise<any | null> {
        try {
            const result = await this.userRepository.findOneBy({ EMAIL: email });
            console.log(result)
            return result;
        } catch(e: any) {
            console.error(e.message)
            return {
                message: e.message
            }
        }



    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
